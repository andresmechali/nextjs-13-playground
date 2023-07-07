import React, { useState } from "react";
import { NFT, ThirdwebNftMedia } from "@thirdweb-dev/react";
import { removeSnakeCase, renderDescription } from "@/app/nfts/utils";

type Props = {
  isLoading: boolean;
  nft: NFT;
};

export default function NFTDescription({ isLoading, nft }: Props) {
  const [viewAllDescription, setViewAllDescription] = useState<boolean>(false);

  return (
    <section className="flex flex-1 flex-col gap-4">
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <ThirdwebNftMedia metadata={nft.metadata} width="100%" />
          <span className="mb-4 font-bold">Description:</span>
          {renderDescription(nft.metadata.description, viewAllDescription)}
          {nft.metadata.description?.length &&
            nft.metadata.description.length > 200 && (
              <div className="flex justify-start">
                <button
                  className="justify-items-start text-sm text-gray-500 hover:text-orange-700"
                  onClick={() => {
                    setViewAllDescription((prev) => !prev);
                  }}
                >
                  View {viewAllDescription ? "less" : "more"}
                </button>
              </div>
            )}
          <span className="font-bold">Traits:</span>
          {nft.metadata.attributes &&
            nft.metadata.attributes.map((attribute) => (
              <div
                key={`${nft.metadata.id}/${attribute.trait_type}`}
                className="rounded-sm border-2 p-4"
              >
                <span className="font-light text-gray-500">
                  {removeSnakeCase(attribute.trait_type)}:{" "}
                </span>
                <span className="font-bold">{attribute.value}</span>
              </div>
            ))}
        </>
      )}
    </section>
  );
}
