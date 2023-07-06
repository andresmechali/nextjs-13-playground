import { setTimeout } from "timers/promises";
import RefreshButton from "@/app/suspense/RefreshButton";

export default async function Loaded({
  promise,
}: {
  promise: Promise<Array<string>>;
}) {
  const data = await promise;

  return (
    <ul>
      {data.length === 0 && <span>No items found</span>}
      {data.map((element, i) => (
        <li key={element}>{element}</li>
      ))}
    </ul>
  );
}
