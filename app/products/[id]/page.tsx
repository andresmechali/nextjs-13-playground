type Props = {
  params: {
    id: string;
  };
};

export default function ProductPage({ params: { id } }: Props) {
  return <div className="p-4">Product {id}</div>;
}
