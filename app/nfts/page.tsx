"use client";

import { useContract } from "@thirdweb-dev/react";

export default function ContractPage() {
  const { contract, isLoading, error } = useContract(
    "0x6eaEEda4db44d73fD668b7f20a4B94AD49289c90",
    "marketplace-v3"
  );

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <button
        onClick={async () => {
          if (contract) {
            console.log({
              directListings: await contract.directListings.getAll(),
            });
            console.log({ platformFees: contract.platformFees });
          }
        }}
      >
        Get all listings
      </button>
    </div>
  );
}
