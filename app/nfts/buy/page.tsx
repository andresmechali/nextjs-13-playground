"use client";

import { useContract, useNFTs } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "@/constants";
import NftCard from "@/app/nfts/buy/NftCard";

export default function NFTBuyPage() {
  const { contract, isLoading: loadingContract } = useContract(
    NFT_COLLECTION_ADDRESS
  );

  const { data: nfts, isLoading: loadingNFTs } = useNFTs(contract);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {loadingContract || loadingNFTs
        ? "Loading..."
        : nfts
        ? nfts.map((nft) => {
            return <NftCard key={nft.metadata.id} nft={nft} />;
          })
        : "-"}
    </div>
  );
}
