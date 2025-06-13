import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export const verifySignature = (
  publicKey: string,
  signature: string,
  message: string
): boolean => {
  try {
    const pubKey = new PublicKey(publicKey);

    const signatureBytes = Uint8Array.from(Buffer.from(signature, "base64"));

    const messageBytes = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      pubKey.toBytes()
    );
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};
