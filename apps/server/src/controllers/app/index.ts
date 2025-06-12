import type { RequestHandler } from "express";
import prisma from "prisma";
import { createCampaignSchema, getCampaignSchema } from "./validation";
import { generateSlug } from "utils/generateSlug";
import { PublicKey } from "@solana/web3.js";
import { getSignedFileUrl } from "@/services/aws";

export const createCampaign: RequestHandler = async (req, res) => {
  const validatedData = createCampaignSchema.safeParse(req.body);
  if (!validatedData.success) {
    res.status(400).json({
      success: false,
      error: "Validation error",
    });
    return;
  }
  const { title, description, recipient, imageUrl, goal } = validatedData.data;
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({
      success: false,
      error: "User not authenticated",
    });
    return;
  }
  const slug = generateSlug(title);

  try {
    new PublicKey(recipient);
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Invalid recipient address",
    });
    return;
  }
  try {
    const campaign = await prisma.campaign.create({
      data: {
        title,
        description,
        recipient,
        imageUrl,
        goal,
        slug,
        userId: user.id,
      },
    });
    res.status(201).json({
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          recipient: campaign.recipient,
          imageUrl: campaign.imageUrl,
          goal: campaign.goal,
          slug: campaign.slug,
          totalRaised: campaign.totalRaised,
          active: campaign.active,
          createdAt: campaign.createdAt,
        },
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};

export const getCampaign: RequestHandler = async (req, res) => {
  const validatedData = getCampaignSchema.safeParse(req.params);
  if (!validatedData.success) {
    res.status(400).json({
      success: false,
      error: "Validation error",
    });
    return;
  }
  const { slug } = validatedData.data;
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            address: true,
          },
        },
        donations: {
          orderBy: {
            timestamp: "desc",
          },
          take: 50,
          select: {
            id: true,
            amount: true,
            donor: true,
            timestamp: true,
            signature: true,
          },
        },
      },
    });
    if (!campaign) {
      res.status(404).json({
        success: false,
        error: "Campaign not found",
      });
      return;
    }
    const donationCount = await prisma.donation.count({
      where: { campaignId: campaign.id },
    });

    const donationStats = await prisma.donation.aggregate({
      where: { campaignId: campaign.id },
      _sum: { amount: true },
      _avg: { amount: true },
      _max: { amount: true },
    });

    const recentDonations = campaign.donations.map((donation) => ({
      ...donation,
      donorShort: `${donation.donor.slice(0, 4)}...${donation.donor.slice(-4)}`,
    }));

    res.status(200).json({
      success: true,
      data: {
        campaign: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          recipient: campaign.recipient,
          imageUrl: campaign.imageUrl,
          goal: campaign.goal,
          slug: campaign.slug,
          totalRaised: campaign.totalRaised,
          active: campaign.active,
          createdAt: campaign.createdAt,
          creator: campaign.user,
        },
        stats: {
          totalRaised: donationStats._sum.amount || 0,
          donationCount,
          averageDonation: donationStats._avg.amount || 0,
          largestDonation: donationStats._max.amount || 0,
          progressPercentage: Math.min(
            ((donationStats._sum.amount || 0) / campaign.goal) * 100,
            100
          ),
        },
        recentDonations,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};

export const getUserCampaigns: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
      return;
    }
    const campaigns = await prisma.campaign.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { donations: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const campaignsWithStats = campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      recipient: campaign.recipient,
      imageUrl: campaign.imageUrl,
      goal: campaign.goal,
      slug: campaign.slug,
      totalRaised: campaign.totalRaised,
      active: campaign.active,
      createdAt: campaign.createdAt,
      donationCount: campaign._count.donations,
      progressPercentage: Math.min(
        (campaign.totalRaised / campaign.goal) * 100,
        100
      ),
    }));

    res.status(200).json({
      success: true,
      data: {
        campaigns: campaignsWithStats,
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter((c) => c.active).length,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};

export const signedURL: RequestHandler = async (req, res) => {
  const user = (req as any).user;
  if (!user) {
    res.status(404).json({
      success: false,
      error: "User not found",
    });
    return;
  }
  const userId = user.id;
  const fileType = req.query.mime || "jpg";
  const fileName = `${userId}/${Math.random()}/${Date.now()}.${fileType}`;
  try {
    const url = await getSignedFileUrl({
      fileName,
      expiresIn: 60 * 10,
    });
    res.status(200).json({
      success: true,
      data: {
        url,
        fileName,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
    return;
  }
};
