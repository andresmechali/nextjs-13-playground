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
import { ToastContainer, toast } from "react-toastify";

type Props = {
  params: {
    id: string;
  };
};

export default function SellNFTPage({ params: { id } }: Props) {
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1_000)
  );
  const [price, setPrice] = useState<string>("0");
  const [missingData, setMissingData] = useState<boolean>(false);
  const [loadingSubmission, setLoadingSubmission] = useState<boolean>(false);

  const router = useRouter();
  const { contract: marketplace, isLoading: loadingMarketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace-v3"
  );

  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS);

  const { data: nftContractMetadata, isLoading: loadingNftContractMetadata } =
    useMetadata(nftCollection);

  console.log(nftContractMetadata);

  const { data: nftData, isLoading: loadingNFTData } = useNFT(
    nftCollection,
    id
  );

  const { data: directListing, isLoading: loadingDirectListing } =
    useValidDirectListings(marketplace, {
      tokenContract: NFT_COLLECTION_ADDRESS,
      tokenId: id,
    });

  console.log(directListing);

  const { mutateAsync: createDirectListing, isLoading: loadingCreateListing } =
    useCreateDirectListing(marketplace);

  const isListed = directListing?.find((listing) => listing.tokenId === id);

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

  console.log(isListed);

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
    loadingMarketplace || loadingDirectListing || loadingCreateListing;

  return (
    <div className="p-4">
      {isLoading ? (
        <span>Loading...</span>
      ) : nftData ? (
        <div className="flex flex-row gap-4">
          <NFTDescription isLoading={loadingNFTData} nft={nftData} />
          <section className="p4 flex flex-1 flex-col space-y-4">
            {loadingNftContractMetadata ? (
              "Loading..."
            ) : (
              <div className="mb-8 flex flex-row items-center space-x-4">
                {nftContractMetadata?.image && (
                  <img
                    src={nftContractMetadata.image}
                    width={64}
                    alt={nftContractMetadata.name}
                  />
                )}
                <span className="text-lg font-bold">
                  {nftContractMetadata?.name}
                </span>
              </div>
            )}
            <span className="mb-2 text-3xl font-bold">
              {nftData.metadata.name}
            </span>
            <span className="mb-8 text-sm text-gray-500">
              {nftData.owner.slice(0, 7)}...
              {nftData.owner.slice(nftData.owner.length - 5)}
            </span>
            {isListed ? (
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
            ) : (
              <>
                <div>
                  <h2>Start: </h2>
                  <DatePicker
                    value={start}
                    onChange={(value) => {
                      setMissingData(false);
                      setStart(value);
                    }}
                  />
                </div>
                <div>
                  <h2>End: </h2>
                  <DatePicker
                    value={start}
                    onChange={(value) => {
                      setMissingData(false);
                      setEnd(value);
                    }}
                  />
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
                      setMissingData(false);
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
                      if (!id || !price || !start || !end) {
                        setMissingData(true);
                        return;
                      }
                      setLoadingSubmission(true);
                      await toast.promise(
                        handleSubmissionDirect({
                          tokenId: id,
                          pricePerToken: price,
                          startTimestamp: start,
                          endTimestamp: end,
                        }),
                        {
                          pending: "Listing token...",
                          success: `Token ${id} listed successfully`,
                          error:
                            "There was an error listing the token. Please try again.",
                        }
                      );
                      setLoadingSubmission(false);

                      router.push("/nfts/sell");
                    }}
                    isDisabled={loadingSubmission || !start || !end || !price}
                  >
                    {loadingSubmission ? "Selling..." : "Sell"}
                  </Web3Button>
                </div>
                {missingData && <p className="text-red-500">Missing data</p>}
              </>
            )}
          </section>
          <ToastContainer />
        </div>
      ) : (
        "No NFT"
      )}
    </div>
  );
}
