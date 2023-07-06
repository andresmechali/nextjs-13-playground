import { Suspense } from "react";
import Loaded from "@/app/suspense/Loaded";
import { setTimeout } from "timers/promises";
import RefreshButton from "@/app/suspense/RefreshButton";

const seed = ["aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg", "hhh", "iii"];

const getData = async (): Promise<Array<string>> => {
  const randomLength = Math.floor(seed.length * Math.random());
  return await setTimeout(3000 * Math.random(), seed.slice(0, randomLength));
};

export default async function SuspensePage() {
  const data = getData();

  return (
    <div className="flex flex-col p-4">
      <RefreshButton />
      <Suspense fallback="Loading...">
        <Loaded promise={data} />
      </Suspense>
    </div>
  );
}
