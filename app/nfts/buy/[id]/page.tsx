"use client";

import { useContract, useDirectListings } from "@thirdweb-dev/react";
import { MARKETPLACE_ADDRESS } from "@/constants";

type Props = {
  params: { id: string };
};

export default function Page({ params: { id } }: Props) {
  const {
    contract: marketplace,
    isLoading: loadingMarketplace,
    error,
  } = useContract(MARKETPLACE_ADDRESS, "marketplace-v3");

  const { data: directListing, isLoading: loadingDirectListing } =
    useDirectListings(marketplace);

  return <div>buy {id}</div>;
}
