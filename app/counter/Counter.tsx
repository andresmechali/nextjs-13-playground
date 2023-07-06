"use client";

import React, { useState } from "react";
export default function Counter() {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="flex flex-col space-y-4">
      <div>
        Count: <span>{count}</span>
      </div>
      <div className="flex flex-row space-x-4">
        <button
          className="border-2 border-orange-300 p-2 hover:bg-orange-300 hover:text-black"
          onClick={() => setCount(count + 1)}
        >
          Add 1
        </button>
        <button
          className="border-2 border-orange-300 p-2 hover:bg-orange-300 hover:text-black"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
