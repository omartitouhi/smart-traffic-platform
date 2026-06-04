"use client";

import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { Badge, congestionLevelTone, vehicleStatusTone } from "@/components/ui/badge";
import type { CongestionLevel, TrafficZone } from "@/types/traffic";
import type { Vehicle, VehiclePosition } from "@/types/vehicle";

export type VehicleMapPoint = {
  vehicle: Vehicle;
  position: VehiclePosition;
};

export type InteractiveMapClientProps = {
  vehicles: VehicleMapPoint[];
  zones: TrafficZone[];
  center?: [number, number];
  zoom?: number;
};

const DEFAULT_CENTER: [number, number] = [36.8065, 10.1815];

const congestionColor: Record<CongestionLevel, string> = {
  LOW: "#16a34a",
  MEDIUM: "#d97706",
  HIGH: "#dc2626",
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
  vehicles: VehicleMapPoint[],
  zones: TrafficZone[],
): LatLngExpression {
  if (center) return center;

  const firstVehicle = vehicles[0]?.position;
  if (firstVehicle) return [firstVehicle.latitude, firstVehicle.longitude];

  const firstZone = zones[0];
  if (firstZone) return [firstZone.latitude, firstZone.longitude];

  return DEFAULT_CENTER;
}

export default function InteractiveMapClient({
  vehicles,
  zones,
  center,
  zoom = 12,
}: InteractiveMapClientProps) {
  const mapCenter = resolveCenter(center, vehicles, zones);

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

      {zones.map((zone) => {
        const color = congestionColor[zone.congestionLevel];

        return (
          <Circle
            key={zone.id}
            center={[zone.latitude, zone.longitude]}
            radius={Math.max(zone.radius * 1000, 80)}
            pathOptions={{
              color,
              fillColor: color,
              fillOpacity: zone.isCongested ? 0.22 : 0.12,
              opacity: 0.8,
              weight: zone.isCongested ? 3 : 2,
            }}
          >
            <Popup>
              <div className="min-w-48 space-y-2 text-sm">
                <p className="font-semibold text-zinc-950">{zone.name}</p>
                {zone.description ? (
                  <p className="text-xs text-zinc-600">{zone.description}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <Badge tone={congestionLevelTone(zone.congestionLevel)}>
                    {zone.congestionLevel}
                  </Badge>
                  <Badge tone={zone.isCongested ? "danger" : "success"}>
                    {zone.isCongested ? "Congestionnee" : "Fluide"}
                  </Badge>
                </div>
                <dl className="grid grid-cols-2 gap-2 text-xs text-zinc-700">
                  <dt>Vehicules</dt>
                  <dd className="font-medium">{zone.vehicleCount}</dd>
                  <dt>Densite</dt>
                  <dd className="font-medium">{formatNumber(zone.density)}</dd>
                  <dt>Rayon</dt>
                  <dd className="font-medium">{formatNumber(zone.radius, 2)}</dd>
                </dl>
              </div>
            </Popup>
          </Circle>
        );
      })}

      {vehicles.map(({ vehicle, position }) => (
        <CircleMarker
          key={`${vehicle.id}-${position.id}`}
          center={[position.latitude, position.longitude]}
          radius={8}
          pathOptions={{
            color: "#18181b",
            fillColor: "#ffffff",
            fillOpacity: 1,
            opacity: 1,
            weight: 3,
          }}
        >
          <Popup>
            <div className="min-w-48 space-y-2 text-sm">
              <p className="font-semibold text-zinc-950">{vehicle.matricule}</p>
              <div className="flex flex-wrap gap-2">
                <Badge tone={vehicleStatusTone(vehicle.status)}>
                  {vehicle.status}
                </Badge>
                <Badge>{vehicle.type}</Badge>
              </div>
              <dl className="grid grid-cols-2 gap-2 text-xs text-zinc-700">
                <dt>Marque</dt>
                <dd className="font-medium">
                  {vehicle.brand} {vehicle.model}
                </dd>
                <dt>Vitesse</dt>
                <dd className="font-medium">
                  {formatNumber(position.speed, 1)} km/h
                </dd>
                <dt>Latitude</dt>
                <dd className="font-medium">{formatNumber(position.latitude)}</dd>
                <dt>Longitude</dt>
                <dd className="font-medium">
                  {formatNumber(position.longitude)}
                </dd>
              </dl>
              <p className="text-xs text-zinc-500">
                Derniere position: {formatDate(position.recordedAt)}
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
