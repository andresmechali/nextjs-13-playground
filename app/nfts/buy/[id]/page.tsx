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

type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const [viewAllDescription, setViewAllDescription] = useState<boolean>(false);
  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { data: nftContractMetadata, isLoading: loadingNftContractMetadata } =
    useMetadata(nftCollection);

  const { data: nftData } = useNFT(nftCollection, id);

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
          <section className="flex flex-1 flex-col gap-4">
            <ThirdwebNftMedia metadata={nftData.metadata} width="100%" />
            <span className="mb-4 font-bold">Description:</span>
            {renderDescription(
              nftData.metadata.description,
              viewAllDescription
            )}
            {nftData.metadata.description?.length &&
              nftData.metadata.description.length > 200 && (
                <div className="flex justify-start">
                  <button
                    className="justify-items-start text-sm text-gray-500 hover:text-orange-500"
                    onClick={() => {
                      setViewAllDescription((prev) => !prev);
                    }}
                  >
                    View {viewAllDescription ? "less" : "more"}
                  </button>
                </div>
              )}
            <span className="font-bold">Traits:</span>
            {nftData.metadata.attributes &&
              nftData.metadata.attributes.map((attribute) => (
                <div
                  key={`${nftData.metadata.id}/${attribute.trait_type}`}
                  className="rounded-sm border-2 border-white p-4"
                >
                  <span className="font-light text-gray-500">
                    {removeSnakeCase(attribute.trait_type)}:{" "}
                  </span>
                  <span className="font-bold">{attribute.value}</span>
                </div>
              ))}
          </section>
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
                    <span className="font-3xl font-bold">Not for sale</span>
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
                  Buy at asking price
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

function renderDescription(
  description: string | null | undefined,
  viewAll: boolean
): React.ReactNode {
  if (!description) {
    return "";
  }
  return viewAll ? (
    <span>{description}</span>
  ) : (
    <span>
      {description.slice(0, 200)}
      {description.length > 200 ? "..." : ""}
    </span>
  );
}

function removeSnakeCase(text: string): string {
  const newText = text.split("_").join(" ");
  return newText.charAt(0).toUpperCase() + newText.slice(1);
}
