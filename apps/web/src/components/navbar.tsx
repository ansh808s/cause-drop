"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { Check, Menu, X } from "lucide-react";
import Loader from "./loader";
import { toast } from "sonner";
import React, { useState } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Header() {
  const links = [{ to: "/", label: "Home" }];
  const { publicKey, signMessage } = useWallet();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const verifyWallet = async () => {
    if (!publicKey || !signMessage || token) return;

    const message = new TextEncoder().encode(
      `${
        window.location.host
      } wants you to sign in with your Solana account:\n${publicKey.toBase58()}\n\nPlease sign in.`
    );

    try {
      setLoading(true);
      const signature = await signMessage(message);
      if (signature) {
        const res = await axios.post(`${BACKEND_URL}/signin`, {
          publicKey: publicKey.toBase58(),
          signature: Buffer.from(signature).toString("base64"),
          message: Buffer.from(message).toString("utf-8"),
        });

        localStorage.setItem("token", res.data.token);
        toast.success("Wallet verified", {
          classNames: {
            toast: "toast-success",
          },
        });
      }
    } catch (error) {
      toast.error("Authentication failed", {
        description: "Please try again",
        classNames: {
          toast: "toast-error",
        },
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-3 container mx-auto">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => (
            <Link key={to} href={to}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {publicKey &&
            (!token ? (
              <Button
                className="text-[16px] leading-[48px]"
                variant="secondary"
                onClick={verifyWallet}
                disabled={loading}
              >
                {loading && <Loader />}
                Authenticate
              </Button>
            ) : (
              <div className="p-1 rounded-full bg-green-500 bg-opacity-80">
                <Check color="#fff" />
              </div>
            ))}
          {publicKey ? (
            <WalletDisconnectButton
              onClick={() => localStorage.removeItem("token")}
            />
          ) : (
            <WalletMultiButton />
          )}
        </div>

        {isMenuOpen && (
          <div className="fixed top-0 right-0 w-[60%] bg-slate-600 rounded-bl-md p-5 flex flex-col gap-4 z-50 lg:hidden">
            <Link href="/task" onClick={toggleMenu}>
              <p className="text-white font-medium">Create</p>
            </Link>
            <Link href="/user" onClick={toggleMenu}>
              <p className="text-white font-medium">View</p>
            </Link>

            {publicKey &&
              (!token ? (
                <Button
                  className="text-[16px] leading-[48px]"
                  variant="secondary"
                  onClick={() => {
                    verifyWallet();
                    toggleMenu();
                  }}
                  disabled={loading}
                >
                  {loading && <Loader />}
                  Authenticate
                </Button>
              ) : (
                <div className="p-1 rounded-full flex items-center justify-center font-medium bg-green-500 bg-opacity-80">
                  <p className="text-white">Authenticated</p>
                </div>
              ))}
            {publicKey ? (
              <WalletDisconnectButton
                onClick={() => {
                  localStorage.removeItem("token");
                  toggleMenu();
                }}
              />
            ) : (
              <WalletMultiButton />
            )}
          </div>
        )}
      </div>
      <hr />
    </div>
  );
}
