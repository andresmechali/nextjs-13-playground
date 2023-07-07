"use client";

import {
  NFT,
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "@/constants";
import Link from "next/link";

type Props = {
  nft: NFT;
};

export default function NftCard({ nft }: Props) {
  const { contract: marketplace, isLoading: loadingMarketplace } =
    useContract(MARKETPLACE_ADDRESS);

  const { data: nftData, isLoading: loadingNFT } = useValidDirectListings(
    marketplace,
    {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    }
  );

  return (
    <Link href={`/nfts/buy/${nft.metadata.id}`}>
      <div className="flex flex-col gap-4 rounded-s border-2 bg-gray-900 p-4">
        <ThirdwebNftMedia metadata={nft.metadata} height="100%" />
        <span className="text-gray-500">Token ID #{nft.metadata.id}</span>
        <span className="font-bold">{nft.metadata.name}</span>
        {loadingMarketplace || loadingNFT ? (
          <span>Loading...</span>
        ) : nftData?.[0] ? (
          `${nftData[0].currencyValuePerToken.displayValue} ${nftData[0].currencyValuePerToken.symbol}`
        ) : (
          <span>Not listed</span>
        )}
      </div>
    </Link>
  );
}
