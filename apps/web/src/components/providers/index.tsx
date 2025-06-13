"use client";

import { ThemeProvider } from "./theme-provider";
import { Toaster } from "../ui/sonner";
import { ReduxProvider } from "./redux-provider";
import { QueryProvider } from "./query-provider";
import { SolanaWalletProvider } from "./wallet-provider";
import { AuthProvider } from "./auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <QueryProvider>
        <SolanaWalletProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </AuthProvider>
        </SolanaWalletProvider>
      </QueryProvider>
    </ReduxProvider>
  );
}
