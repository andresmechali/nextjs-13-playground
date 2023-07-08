"use client";

import React from "react";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Header from "@/app/Header";
import "react-toastify/dist/ReactToastify.css";

export default function ContractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <Header
        pages={["Buy", "Sell"].map((action) => ({
          text: action,
          link: `/nfts/${action.toLowerCase()}`,
        }))}
      />
      {children}
    </ThirdwebProvider>
  );
}
