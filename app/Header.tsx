"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  pages: Array<{ text: string; link: string }>;
};

export default function Header({ pages }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen flex-col space-y-4 border-r-2 border-r-orange-500 p-4 lg:h-auto lg:flex-row lg:space-x-4 lg:space-y-0 lg:border-b-2 lg:border-r-0 lg:border-b-orange-500">
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
  );
}
