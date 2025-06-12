"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useAuthQueries } from "@/hooks/useAuthQueries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import bs58 from "bs58";

export const generateSignInMessage = (publicKey: string): string => {
  const timestamp = new Date().toISOString();
  return `Sign this message to authenticate with Cause Drop.\n\nWallet: ${publicKey}\nTimestamp: ${timestamp}`;
};

export const SignInButton = () => {
  const { publicKey, signMessage } = useWallet();
  const { setVisible } = useWalletModal();
  const { isAuthenticated, signIn, isSigningIn, logoutUser } = useAuthQueries();

  const handleSignIn = async () => {
    if (!publicKey || !signMessage) {
      setVisible(true);
      return;
    }

    try {
      const message = generateSignInMessage(publicKey.toString());
      const messageBytes = new TextEncoder().encode(message);
      const signature = await signMessage(messageBytes);

      await signIn({
        publicKey: publicKey.toString(),
        signature: bs58.encode(signature),
        message,
      });

      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
    }
  };

  const handleSignOut = () => {
    logoutUser();
    toast.success("Successfully signed out!");
  };

  if (isAuthenticated) {
    return (
      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    );
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
    >
      {isSigningIn ? "Signing In..." : "Sign In"}
    </Button>
  );
};
