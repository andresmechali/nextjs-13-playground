import { setTimeout } from "timers/promises";

const seed = ["aaa", "bbb", "ccc", "ddd", "eee", "fff", "ggg", "hhh", "iii"];

const getData = async (): Promise<Array<string>> => {
  const randomLength = Math.floor(seed.length * Math.random());
  return await setTimeout(2000, seed.slice(0, randomLength));
};

export default async function Loaded() {
  const data = await getData();

  return (
    <ul>
      {data.map((element, i) => (
        <li key={element}>{element}</li>
      ))}
    </ul>
  );
}
