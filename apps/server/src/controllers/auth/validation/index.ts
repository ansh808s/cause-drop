import { z } from "zod";
import bs58 from "bs58";

export const signinSchema = z
  .object({
    publicKey: z.string().refine(
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
    signature: z.string().refine(
      (signature) => {
        try {
          return (
            Buffer.from(signature, "base64").toString("base64") === signature
          );
        } catch {
          return false;
        }
      },
      { message: "Signature must be a valid Base64 encoded string" }
    ),
    message: z.string(),
  })
  .strict();

export type SigninRequest = z.infer<typeof signinSchema>;
