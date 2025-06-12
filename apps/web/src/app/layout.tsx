import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import Navbar from "@/components/navbar";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cause Drop",
  description: "Create donation campaign and share them as Blinks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={` ${manrope.variable} antialiased`}>
        <Providers>
          <div className="grid grid-rows-[auto_1fr] h-svh">
            <Navbar />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
