"use client";

import { useRouter } from "next/navigation";

export default function RefreshButton() {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <button
      onClick={handleRefresh}
      className="mb-4 max-w-sm border p-2 hover:bg-gray-100 hover:text-black"
    >
      Refresh
    </button>
  );
}
