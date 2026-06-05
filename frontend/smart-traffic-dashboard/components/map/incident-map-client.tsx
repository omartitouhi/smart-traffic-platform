"use client";

import type { LatLngExpression } from "leaflet";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Badge } from "@/components/ui/badge";
import {
  incidentStatusLabel,
  incidentStatusTone,
  incidentTypeLabel,
} from "@/features/incidents/incident-display";
import type { Incident, IncidentStatus } from "@/types/incident";

export type IncidentMapClientProps = {
  incidents: Incident[];
  center?: [number, number];
  zoom?: number;
};

const DEFAULT_CENTER: [number, number] = [36.8065, 10.1815];

const statusColor: Record<IncidentStatus, string> = {
  SIGNALE: "#dc2626",
  EN_COURS: "#d97706",
  RESOLU: "#16a34a",
};

function formatNumber(value: number, maximumFractionDigits = 3) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function resolveCenter(
  center: [number, number] | undefined,
  incidents: Incident[],
): LatLngExpression {
  if (center) return center;

  const firstIncident = incidents[0];
  if (firstIncident) return [firstIncident.latitude, firstIncident.longitude];

  return DEFAULT_CENTER;
}

export default function IncidentMapClient({
  incidents,
  center,
  zoom = 12,
}: IncidentMapClientProps) {
  const mapCenter = resolveCenter(center, incidents);

  return (
    <MapContainer
      center={mapCenter}
      zoom={zoom}
      scrollWheelZoom
      className="h-full min-h-[360px] w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {incidents.map((incident) => {
        const color = statusColor[incident.status];

        return (
          <CircleMarker
            key={incident.id}
            center={[incident.latitude, incident.longitude]}
            radius={9}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: 0.8,
              opacity: 1,
              weight: 3,
            }}
          >
            <Popup>
              <div className="min-w-48 space-y-2 text-sm">
                <p className="font-semibold text-zinc-950">{incident.title}</p>
                {incident.description ? (
                  <p className="text-xs text-zinc-600">
                    {incident.description}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Badge tone={incidentStatusTone(incident.status)}>
                    {incidentStatusLabel(incident.status)}
                  </Badge>
                  <Badge>{incidentTypeLabel(incident.type)}</Badge>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs text-zinc-700">
                  {incident.address ? (
                    <>
                      <dt>Adresse</dt>
                      <dd className="font-medium">{incident.address}</dd>
                    </>
                  ) : null}
                  <dt>Latitude</dt>
                  <dd className="font-medium">
                    {formatNumber(incident.latitude)}
                  </dd>
                  <dt>Longitude</dt>
                  <dd className="font-medium">
                    {formatNumber(incident.longitude)}
                  </dd>
                </dl>
                <p className="text-xs text-zinc-500">
                  Declare le {formatDate(incident.createdAt)}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
