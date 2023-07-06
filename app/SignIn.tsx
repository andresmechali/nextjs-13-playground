"use client";
import { useEffect, useState } from "react";
import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";

function shortAddress(address: string): string {
  return `${address.slice(0, 7)}...${address.slice(address.length - 5)}`;
}

export default function AddressButton() {
  const [loading, setLoading] = useState<boolean>(true);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  useEffect(() => {
    setLoading(false);
  }, [address]);

  return (
    <div className="flex flex-row space-x-2">
      {address && (
        <div className="flex flex-col justify-center">
          {shortAddress(address)}
        </div>
      )}
      {loading ? (
        <div className="flex flex-col justify-center p-4">Loading...</div>
      ) : (
        <button
          className="p-4 hover:text-orange-500"
          onClick={async () => {
            if (address) {
              await disconnect();
            } else {
              await connectWithMetamask();
            }
          }}
        >
          {address ? "Disconnect" : "Connect"}
        </button>
      )}
    </div>
  );
}
