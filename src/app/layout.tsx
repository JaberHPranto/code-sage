import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "~/styles/globals.css";

import { type Metadata } from "next";
import { Lato } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Code Sage",

  description: "A tool of Github repo and PR analysis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${lato.className}`}>
        <body>
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
