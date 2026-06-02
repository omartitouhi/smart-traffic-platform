import { PageShell } from "@/components/layout/page-shell";

type VehicleDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const { id } = await params;

  return (
    <PageShell
      title="Vehicle Details"
      description={`Vehicle detail route prepared for ${id}.`}
    />
  );
}
