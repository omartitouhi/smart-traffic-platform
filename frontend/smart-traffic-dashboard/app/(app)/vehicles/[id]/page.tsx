import { VehicleDetails } from "@/features/vehicles/vehicle-details";

type VehicleDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const { id } = await params;

  return <VehicleDetails vehicleId={id} />;
}
