import { z } from "zod";
import bs58 from "bs58";

const imageUrlSchema = z
  .string()
  .url("Invalid image URL")
  .regex(
    /\.(jpg|jpeg|png|gif|webp)$/i,
    "Image URL must end with a valid image extension"
  );

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
    imageUrl: imageUrlSchema,
    goal: z
      .number()
      .positive("Goal must be a positive number")
      .min(0.001, "Goal must be at least 0.001 SOL"),
  })
  .strict();
