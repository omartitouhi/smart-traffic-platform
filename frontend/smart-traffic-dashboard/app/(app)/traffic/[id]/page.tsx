import { TrafficZoneDetails } from "@/features/traffic";

type TrafficZoneDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TrafficZoneDetailsPage({
  params,
}: TrafficZoneDetailsPageProps) {
  const { id } = await params;

  return <TrafficZoneDetails zoneId={id} />;
}
