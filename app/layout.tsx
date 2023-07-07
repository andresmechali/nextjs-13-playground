import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Header from "@/app/Header";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import Providers from "@/app/(store)/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-row lg:flex-col">
            <Header
              pages={[
                {
                  text: "Home",
                  link: "/home",
                },
                {
                  text: "Suspense",
                  link: "/suspense",
                },
                {
                  text: "Counter",
                  link: "/counter",
                },
                {
                  text: "Products",
                  link: "/products",
                },
                {
                  text: "NFTs",
                  link: "/nfts",
                },
              ]}
              showWallet
            />
            <div>{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
