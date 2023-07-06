"use client";

import { useAddress, useDisconnect, useMetamask } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

export default function SignInButton() {
  const [loading, setLoading] = useState<boolean>(true);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnect = useDisconnect();

  useEffect(() => {
    setLoading(false);
  }, [address]);

  return (
    <button
      className="p-4 hover:text-orange-500"
      onClick={async () => {
        await connectWithMetamask();
        // await disconnect();
        console.log("clicked");
      }}
    >
      Sign in ({loading ? "Loading..." : address})
    </button>
  );
}
