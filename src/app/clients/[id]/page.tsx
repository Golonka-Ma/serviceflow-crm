import { Metadata } from "next";

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ClientDetailsPage({ params }: PageProps) {
  return <h1>Client Details: {params.id}</h1>;
}

// Define the types for generateMetadata if needed
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  return {
    title: `Client ${params.id}`,
  };
}
