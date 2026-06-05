import { IncidentDetails } from "@/features/incidents";

type IncidentDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function IncidentDetailsPage({
  params,
}: IncidentDetailsPageProps) {
  const { id } = await params;

  return <IncidentDetails incidentId={id} />;
}
