"use client";

import React from "react";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

export default function ContractLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThirdwebProvider activeChain={Sepolia}>{children}</ThirdwebProvider>;
}
