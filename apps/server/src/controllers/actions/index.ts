import type { RequestHandler } from "express";
import prisma from "prisma";
import {
  createPostResponse,
  createActionHeaders,
  type ActionError,
  type ActionGetResponse,
} from "@solana/actions";

import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { getCampaignSchema } from "../app/validation";

const headers = createActionHeaders();

export const getCampaignAction: RequestHandler = async (req, res) => {
  try {
    const validatedData = getCampaignSchema.safeParse({
      slug: req.params.slug,
    });
    if (!validatedData.success) {
      throw "Invalid campaign slug";
    }
    const { slug } = validatedData.data;

    const campaign = await prisma.campaign.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            address: true,
          },
        },
      },
    });
    if (!campaign) {
      throw "Campaign doesn't exist";
    }

    const recipient = new PublicKey(campaign.recipient);
    const baseHref = `http://localhost:3000/api/actions/donation?to=${recipient.toBase58()}`;

    const payload: ActionGetResponse = {
      type: "action",
      title: campaign.title,
      description: campaign.description,
      icon: campaign.imageUrl || "",
      label: "Transfer",
      links: {
        actions: [
          {
            label: "Send 1 SOL",
            href: `${baseHref}&amount=0.1`,
            type: "post",
          },
          {
            label: "Send 5 SOL",
            href: `${baseHref}&amount=0.25`,
            type: "post",
          },
          {
            label: "Send 10 SOL",
            href: `${baseHref}&amount=0.5`,
            type: "post",
          },
          {
            label: "Send SOL",
            href: `${baseHref}&amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: "Enter the amount of SOL to send",
                required: true,
              },
            ],
            type: "post",
          },
        ],
      },
    };
    res.set(headers).json(payload);
    return;
  } catch (error) {
    console.log(error);
    const actionError: ActionError = {
      message: typeof error === "string" ? error : "An unknown error occurred",
    };
    res.set(headers).status(400).json(actionError);
  }
};

export const options: RequestHandler = (req, res) => {
  res.set(headers).json(null);
};
