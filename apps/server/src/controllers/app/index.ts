import type { RequestHandler } from "express";
import prisma from "prisma";
import { createCampaignSchema } from "./validation";
import { generateSlug } from "utils/generateSlug";
import { PublicKey } from "@solana/web3.js";

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
