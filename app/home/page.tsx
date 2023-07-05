import Counter from "@/app/home/Counter";
import Loaded from "@/app/home/Loaded";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <h1 className="mb-8 font-bold">Home page</h1>
      <Counter />
      <Suspense fallback="Loading...">
        <Loaded />
      </Suspense>
    </div>
  );
}
