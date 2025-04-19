export default function JobDetailsPage({ params }: { params: { id: string } }) {
  return <h1>Job Details: {params.id}</h1>;
}
