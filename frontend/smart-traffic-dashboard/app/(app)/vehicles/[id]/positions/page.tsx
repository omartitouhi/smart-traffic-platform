import { VehiclePositionHistory } from "@/features/vehicles/vehicle-position-history";

type VehiclePositionsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VehiclePositionsPage({
  params,
}: VehiclePositionsPageProps) {
  const { id } = await params;

  return <VehiclePositionHistory vehicleId={id} />;
}
