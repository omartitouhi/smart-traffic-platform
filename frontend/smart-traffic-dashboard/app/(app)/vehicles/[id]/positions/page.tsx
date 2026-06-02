import { PageShell } from "@/components/layout/page-shell";

type VehiclePositionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VehiclePositionsPage({
  params,
}: VehiclePositionsPageProps) {
  const { id } = await params;

  return (
    <PageShell
      title="Vehicle Positions"
      description={`GPS position history route prepared for ${id}.`}
    />
  );
}
