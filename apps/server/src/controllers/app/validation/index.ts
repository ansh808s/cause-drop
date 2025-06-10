import { z } from "zod";
import bs58 from "bs58";

export const createCampaignSchema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters").trim(),
    description: z.string().trim(),
    recipient: z.string().refine(
      (address) => {
        try {
          bs58.decode(address);
          return true;
        } catch {
          return false;
        }
      },
      {
        message: "Invalid base58 encoded string",
      }
    ),
    imageUrl: z.string().url("Invalid image URL").optional(),
    goal: z
      .number()
      .positive("Goal must be a positive number")
      .min(0.001, "Goal must be at least 0.001 SOL"),
  })
  .strict();

export const getCampaignSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .max(150, "Slug too long")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      ),
  })
  .strict();
