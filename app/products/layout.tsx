import React from "react";
import Header from "@/app/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header
        pages={[1, 2, 3, 4].map((productNumber) => ({
          text: `Product ${productNumber}`,
          link: `/products/${productNumber}`,
        }))}
      />
      {children}
    </div>
  );
}
