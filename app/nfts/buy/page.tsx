"use client";

import { useContract, useNFTs } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "@/constants";
import NFTGrid from "@/app/nfts/NFTGrid";

export default function NFTBuyPage() {
  const { contract, isLoading: loadingContract } = useContract(
    NFT_COLLECTION_ADDRESS
  );

  const { data: nfts, isLoading: loadingNFTs } = useNFTs(contract);

  return (
    <NFTGrid
      isLoading={loadingContract || loadingNFTs}
      nfts={nfts}
      emptyText="No NFTs found"
    />
  );
}
