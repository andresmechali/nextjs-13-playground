"use client";

import { useAddress, useContract, useOwnedNFTs } from "@thirdweb-dev/react";
import { NFT_COLLECTION_ADDRESS } from "@/constants";
import NFTGrid from "@/app/nfts/NFTGrid";

export default function NFTSellPage() {
  const {
    contract: nftContract,
    isLoading: loadingNftContract,
    error,
  } = useContract(NFT_COLLECTION_ADDRESS);
  const address = useAddress();
  const { data: ownedNfts, isLoading: loadingOwnedNfts } = useOwnedNFTs(
    nftContract,
    address
  );

  return (
    <div className="p-4">
      <h1>Owned NFTs</h1>
      <NFTGrid
        isLoading={loadingNftContract || loadingOwnedNfts}
        nfts={ownedNfts}
        emptyText="No NFTs owned yet"
      />
    </div>
  );
}
