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
const connection = new Connection(clusterApiUrl("devnet"));

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
    const baseHref = `https://api.causedrop.ansharora.me/api/actions/donation?to=${recipient.toBase58()}`;

    const payload: ActionGetResponse = {
      type: "action",
      title: campaign.title,
      description: campaign.description,
      icon: campaign.imageUrl || "",
      label: "Transfer",
      links: {
        actions: [
          {
            label: "Send 0.1 SOL",
            href: `${baseHref}&amount=0.1`,
            type: "post",
          },
          {
            label: "Send 0.25 SOL",
            href: `${baseHref}&amount=0.25`,
            type: "post",
          },
          {
            label: "Send 0.5 SOL",
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

export const donationOption: RequestHandler = (req, res) => {
  res.set(headers).json(null);
};

export const donation: RequestHandler = async (req, res) => {
  try {
    const { amount, to } = req.query;
    const { account } = req.body;
    const toPubkey = new PublicKey(to as string);
    if (!amount) {
      throw new Error("Please enter an amount");
    }
    if (parseFloat(amount as string) <= 0) {
      throw new Error("Amount should be greater than 0");
    }
    if (!account) {
      throw new Error('Invalid "account" provided');
    }
    const fromPubkey = new PublicKey(account);
    const minimumBalance = await connection.getMinimumBalanceForRentExemption(
      0
    );

    if (parseFloat(amount as string) * LAMPORTS_PER_SOL < minimumBalance) {
      throw new Error(`Account may not be rent exempt: ${toPubkey.toBase58()}`);
    }

    const transferSolInstruction = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubkey,
      lamports: parseFloat(amount as string) * LAMPORTS_PER_SOL,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: fromPubkey,
      blockhash,
      lastValidBlockHeight,
    }).add(transferSolInstruction);

    const payload = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: `Send ${amount} SOL to ${toPubkey.toBase58()}`,
      },
    });

    res.json(payload);
    return;
  } catch (error) {
    res
      .status(400)
      // @ts-ignore
      .json({ error: error.message || "An unknown error occurred" });
  }
};
