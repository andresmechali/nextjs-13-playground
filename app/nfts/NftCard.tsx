"use client";

import {
  NFT,
  ThirdwebNftMedia,
  useContract,
  useValidDirectListings,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  nft: NFT;
};

export default function NftCard({ nft }: Props) {
  const pathname = usePathname();

  const { contract: marketplace, isLoading: loadingMarketplace } =
    useContract(MARKETPLACE_ADDRESS);

  const { data: nftData, isLoading: loadingNFT } = useValidDirectListings(
    marketplace,
    {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: nft.metadata.id,
    }
  );

  const buyOrSell = pathname.includes("buy") ? "buy" : "sell";

  return (
    <Link href={`/nfts/${buyOrSell}/${nft.metadata.id}`}>
      <div className="flex flex-col gap-4 rounded-s border-2 bg-gray-100 p-4">
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
