"use client";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

import {
  useContract,
  useCreateDirectListing,
  useMetadata,
  useNFT,
  useValidDirectListings,
  Web3Button,
} from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS, NFT_COLLECTION_ADDRESS } from "@/constants";
import React, { useState } from "react";
import NFTDescription from "@/app/nfts/Description";
import DatePicker from "react-date-picker";
import { useRouter } from "next/navigation";

type Props = {
  params: {
    id: string;
  };
};

export default function SellNFTPage({ params: { id } }: Props) {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1_000)
  );
  const [price, setPrice] = useState<string>("0");
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);

  const router = useRouter();
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

  const { mutateAsync: createDirectListing, isLoading: loadingCreateListing } =
    useCreateDirectListing(marketplace);

  async function checkAndProvideApproval() {
    const hasApproval = await nftCollection?.call("isApprovedForAll", [
      nftData?.owner,
      MARKETPLACE_ADDRESS,
    ]);

    if (!hasApproval) {
      const txResult = await nftCollection?.call("setApprovalForAll", [
        MARKETPLACE_ADDRESS,
        true,
      ]);

      if (txResult) {
        console.log("Approval provided");
      }
    }

    return true;
  }

  async function handleSubmissionDirect({
    tokenId,
    pricePerToken,
    startTimestamp,
    endTimestamp,
  }: {
    tokenId: string;
    pricePerToken: string | number;
    startTimestamp: Date;
    endTimestamp: Date;
  }) {
    await checkAndProvideApproval();
    return await createDirectListing({
      assetContractAddress: NFT_COLLECTION_ADDRESS,
      tokenId,
      pricePerToken,
      startTimestamp,
      endTimestamp,
    });
  }

  const isLoading =
    loadingMarketplace || loadingNftContractMetadata || loadingDirectListing;

  return (
    <div className="p-4">
      {isLoading ? (
        <span>Loading...</span>
      ) : nftData ? (
        <div className="flex flex-row gap-4">
          <NFTDescription isLoading={loadingNFTData} nft={nftData} />
          <section className="p4 flex flex-1 flex-col space-y-4">
            <p className="text-3xl">{nftData.metadata.name}</p>
            <div>
              <h2>Start: </h2>
              <DatePicker value={start} onChange={setStart} />
            </div>
            <div>
              <h2>End: </h2>
              <DatePicker value={end} onChange={setEnd} />
            </div>
            <div>
              <h2>Price: </h2>
              <input
                type="text"
                style={{
                  border: "thin solid gray",
                }}
                className="w-[156px]"
                value={price}
                onChange={(e) => {
                  if (!isNaN(Number(e.target.value))) {
                    setPrice(e.target.value);
                  }
                }}
              />
            </div>
            <div>
              <Web3Button
                contractAddress={MARKETPLACE_ADDRESS}
                action={async () => {
                  setLoadingSubmission(true);
                  await handleSubmissionDirect({
                    tokenId: id,
                    pricePerToken: price,
                    startTimestamp: start,
                    endTimestamp: end,
                  });
                  setLoadingSubmission(false);

                  // TODO: show notification
                  router.push("/nfts/sell");
                }}
                isDisabled={loadingSubmission}
              >
                {loadingSubmission ? "Selling..." : "Sell"}
              </Web3Button>
            </div>
          </section>
        </div>
      ) : (
        "No NFT"
      )}
    </div>
  );
}
