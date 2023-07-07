"use client";
import React, { useState } from "react";
import {
  ThirdwebNftMedia,
  useContract,
  useMetadata,
  useNFT,
  useValidDirectListings,
  Web3Button,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "@/constants";
import { removeSnakeCase, renderDescription } from "@/app/nfts/utils";
import NFTDescription from "@/app/nfts/Description";

type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { data: nftContractMetadata, isLoading: loadingNftContractMetadata } =
    useMetadata(nftCollection);

  const { data: nftData, isLoading: loadingNFTData } = useNFT(
    nftCollection,
    id
  );

  const { data: directListing, isLoading: loadingDirectListing } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: id,
    });

  async function buyListing() {
    let txResult;

    if (directListing?.[0]) {
      txResult = await marketplace?.directListings?.buyFromListing(
        directListing[0].id,
        1
      );
    } else {
      throw new Error("No listing found");
    }

    return txResult;
  }

  return (
    <div className="p-4">
      {loadingMarketplace || loadingDirectListing ? (
        <span>Loading...</span>
      ) : nftData ? (
        <div className="flex flex-row gap-4">
          <NFTDescription isLoading={loadingNFTData} nft={nftData} />
          <section className="p4 flex-1">
            {loadingNftContractMetadata ? (
              "Loading..."
            ) : nftContractMetadata ? (
              <div className="flex flex-col">
                <div className="mb-8 flex flex-row items-center space-x-4">
                  {nftContractMetadata?.image && (
                    <img
                      src={nftContractMetadata.image}
                      width={64}
                      alt={nftContractMetadata.name}
                    />
                  )}
                  <span className="text-lg font-bold">
                    {nftContractMetadata.name}
                  </span>
                </div>
                <span className="mb-2 text-3xl font-bold">
                  {nftData.metadata.name}
                </span>
                <span className="mb-8 text-sm text-gray-500">
                  {nftData.owner.slice(0, 7)}...
                  {nftData.owner.slice(nftData.owner.length - 5)}
                </span>
                <div className="mb-4 rounded-sm border-2 p-4">
                  <h2 className="mb-2 font-light text-gray-500">Price:</h2>
                  {directListing?.[0] ? (
                    <span className="font-3xl mb-4 font-bold">
                      {directListing[0].currencyValuePerToken.displayValue}{" "}
                      {directListing[0].currencyValuePerToken.symbol}
                    </span>
                  ) : (
                    <span className="font-3xl font-bold">-</span>
                  )}
                </div>
                <Web3Button
                  contractAddress={MARKETPLACE_ADDRESS}
                  action={async () => {
                    await buyListing();
                    console.log("bought successfully");
                    // TODO: show notification
                  }}
                  isDisabled={!directListing || !directListing[0]}
                >
                  {directListing?.[0] ? "Buy at asking price" : "Not for sale"}
                </Web3Button>
              </div>
            ) : (
              <span>Contract data not found</span>
            )}
          </section>
        </div>
      ) : (
        "No NFT"
      )}
    </div>
  );
}
