export default function ClientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <h1>Client Details: {params.id}</h1>;
}
