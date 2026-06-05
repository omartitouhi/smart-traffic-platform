import type { Badge } from "@/components/ui/badge";
import type { ComponentProps } from "react";
import type { IncidentStatus, IncidentType } from "@/types/incident";

type BadgeTone = ComponentProps<typeof Badge>["tone"];

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  ACCIDENT: "Accident",
  TRAVAUX: "Travaux",
  ROUTE_FERMEE: "Route fermee",
  EMBOUTEILLAGE: "Embouteillage",
};

export const INCIDENT_STATUS_LABELS: Record<IncidentStatus, string> = {
  SIGNALE: "Signale",
  EN_COURS: "En cours",
  RESOLU: "Resolu",
};

export const INCIDENT_TYPE_OPTIONS = (
  Object.keys(INCIDENT_TYPE_LABELS) as IncidentType[]
).map((value) => ({ value, label: INCIDENT_TYPE_LABELS[value] }));

export const INCIDENT_STATUS_OPTIONS = (
  Object.keys(INCIDENT_STATUS_LABELS) as IncidentStatus[]
).map((value) => ({ value, label: INCIDENT_STATUS_LABELS[value] }));

export function incidentTypeLabel(type: IncidentType): string {
  return INCIDENT_TYPE_LABELS[type] ?? type;
}

export function incidentStatusLabel(status: IncidentStatus): string {
  return INCIDENT_STATUS_LABELS[status] ?? status;
}

export function incidentStatusTone(status: IncidentStatus): BadgeTone {
  if (status === "SIGNALE") return "danger";
  if (status === "EN_COURS") return "warning";
  if (status === "RESOLU") return "success";
  return "default";
}
