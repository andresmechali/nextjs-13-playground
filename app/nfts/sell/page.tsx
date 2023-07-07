"use client";

import { useContract } from "@thirdweb-dev/react";

export default function NFTBuyPage() {
  const { contract, isLoading, error } = useContract(
    "0x6eaEEda4db44d73fD668b7f20a4B94AD49289c90",
    "marketplace-v3"
  );

  if (isLoading) {
    return "Loading...";
  }

  return <div className="p-4">Sell</div>;
}
