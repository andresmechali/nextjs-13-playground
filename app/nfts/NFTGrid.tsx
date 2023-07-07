import { NFT } from "@thirdweb-dev/react";
import NftCard from "@/app/nfts/NftCard";

type Props = {
  isLoading: boolean;
  nfts?: NFT[];
  emptyText?: string;
};

export default function NFTGrid({ isLoading, nfts, emptyText }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {isLoading
        ? "Loading"
        : nfts
        ? nfts.map((nft) => {
            return <NftCard key={nft.metadata.id} nft={nft} />;
          })
        : emptyText || "-"}
    </div>
  );
}
