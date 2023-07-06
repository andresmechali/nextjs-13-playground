"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AddressButton from "@/app/SignIn";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThirdwebProvider } from "@thirdweb-dev/react";

type Props = {
  pages: Array<{ text: string; link: string }>;
  showWallet?: boolean;
};

export default function Header({ pages, showWallet }: Props) {
  const pathname = usePathname();

  return (
    <ThirdwebProvider activeChain={Sepolia}>
      <div className="flex flex-col justify-between border-r-2 border-r-orange-500 lg:flex-row lg:border-b-2 lg:border-r-0 lg:border-b-orange-500">
        <div className="flex h-screen flex-col space-y-4 p-4 lg:h-auto lg:flex-row lg:space-x-4 lg:space-y-0 ">
          {pages.map(({ text, link }) => (
            <Link
              key={text}
              href={link}
              className={`hover:text-orange-500${
                link === pathname ? " text-orange-500" : ""
              }`}
            >
              {text}
            </Link>
          ))}
        </div>
        {showWallet && <AddressButton />}
      </div>
    </ThirdwebProvider>
  );
}
