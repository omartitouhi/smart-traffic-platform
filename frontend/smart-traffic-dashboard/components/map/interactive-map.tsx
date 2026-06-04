"use client";

import { useApolloClient, useQuery } from "@apollo/client/react";
import dynamic from "next/dynamic";
import { MapPinned } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { TRAFFIC_ZONES_QUERY } from "@/graphql/queries/traffic.queries";
import {
  VEHICLE_POSITIONS_QUERY,
  VEHICLES_QUERY,
  VEHICLE_QUERY,
} from "@/graphql/queries/vehicle.queries";
import type { TrafficZone } from "@/types/traffic";
import type { Vehicle, VehiclePosition } from "@/types/vehicle";
import type {
  InteractiveMapClientProps,
  VehicleMapPoint,
} from "@/components/map/interactive-map-client";

const InteractiveMapClient = dynamic<InteractiveMapClientProps>(
  () => import("@/components/map/interactive-map-client"),
  {
    ssr: false,
    loading: () => <LoadingState message="Chargement de la carte..." />,
  },
);

type InteractiveMapProps = {
  title?: string;
  description?: string;
  vehicleId?: string;
  refreshKey?: number;
  className?: string;
};

type VehiclesQueryResult = {
  vehicles: Vehicle[];
};

type VehicleQueryResult = {
  vehicle: Vehicle;
};

type TrafficZonesQueryResult = {
  trafficZones: TrafficZone[];
};

type VehiclePositionsQueryResult = {
  vehiclePositions: VehiclePosition[];
};

function latestPosition(positions: VehiclePosition[]) {
  return [...positions].sort(
    (a, b) =>
      new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime(),
  )[0];
}

export function InteractiveMap({
  title = "Carte urbaine",
  description = "Visualisation des vehicules, positions GPS et zones de circulation.",
  vehicleId,
  refreshKey = 0,
  className,
}: InteractiveMapProps) {
  const apolloClient = useApolloClient();
  const [vehiclePoints, setVehiclePoints] = useState<VehicleMapPoint[]>([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);
  const {
    data: trafficData,
    loading: trafficLoading,
    error: trafficError,
    refetch: refetchTraffic,
  } = useQuery<TrafficZonesQueryResult>(TRAFFIC_ZONES_QUERY);
  const {
    data: vehiclesData,
    loading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useQuery<VehiclesQueryResult>(VEHICLES_QUERY, {
    skip: Boolean(vehicleId),
  });
  const {
    data: vehicleData,
    loading: vehicleLoading,
    error: vehicleError,
    refetch: refetchVehicle,
  } = useQuery<VehicleQueryResult>(VEHICLE_QUERY, {
    skip: !vehicleId,
    variables: {
      id: vehicleId ?? "",
    },
  });

  const vehicles = useMemo(() => {
    if (vehicleId) return vehicleData?.vehicle ? [vehicleData.vehicle] : [];
    return vehiclesData?.vehicles ?? [];
  }, [vehicleData, vehicleId, vehiclesData]);

  const zones = trafficData?.trafficZones ?? [];
  const isLoading =
    trafficLoading || vehiclesLoading || vehicleLoading || positionsLoading;
  const queryError = trafficError ?? vehiclesError ?? vehicleError;

  useEffect(() => {
    let isMounted = true;

    async function loadLatestPositions() {
      if (vehicles.length === 0) {
        setVehiclePoints([]);
        setPositionsError(null);
        return;
      }

      setPositionsLoading(true);
      setPositionsError(null);

      try {
        const results = await Promise.all(
          vehicles.map(async (vehicle) => {
            const result = await apolloClient.query<
              VehiclePositionsQueryResult,
              { vehicleId: string }
            >({
              query: VEHICLE_POSITIONS_QUERY,
              variables: { vehicleId: vehicle.id },
              fetchPolicy: "network-only",
            });
            const position = latestPosition(result.data?.vehiclePositions ?? []);
            return position ? { vehicle, position } : null;
          }),
        );

        if (isMounted) {
          setVehiclePoints(
            results.filter((item): item is VehicleMapPoint => item !== null),
          );
        }
      } catch (error) {
        if (isMounted) {
          setVehiclePoints([]);
          setPositionsError(
            error instanceof Error
              ? error.message
              : "Impossible de charger les positions GPS.",
          );
        }
      } finally {
        if (isMounted) {
          setPositionsLoading(false);
        }
      }
    }

    void loadLatestPositions();

    return () => {
      isMounted = false;
    };
  }, [apolloClient, refreshKey, vehicles]);

  function handleRetry() {
    void refetchTraffic();
    if (vehicleId) {
      void refetchVehicle();
    } else {
      void refetchVehicles();
    }
  }

  return (
    <Card className={className}>
      <div className="border-b border-border p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="border border-border bg-zinc-50 px-2 py-1">
              {vehiclePoints.length} vehicule(s)
            </span>
            <span className="border border-border bg-zinc-50 px-2 py-1">
              {zones.length} zone(s)
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {isLoading ? <LoadingState message="Chargement des donnees carte..." /> : null}

        {!isLoading && (queryError || positionsError) ? (
          <ErrorState
            title="Carte indisponible"
            message={
              positionsError ??
              "Impossible de charger les donnees urbaines depuis la Gateway GraphQL."
            }
            action={
              <button
                type="button"
                onClick={handleRetry}
                className="h-10 border border-red-300 px-3 text-sm font-medium hover:bg-red-100"
              >
                Reessayer
              </button>
            }
          />
        ) : null}

        {!isLoading &&
        !queryError &&
        !positionsError &&
        vehiclePoints.length === 0 &&
        zones.length === 0 ? (
          <EmptyState
            icon={<MapPinned className="size-5" aria-hidden="true" />}
            title="Aucune donnee a afficher"
            message="Ajoutez des positions GPS ou des zones de circulation pour alimenter la carte."
          />
        ) : null}

        {!isLoading &&
        !queryError &&
        !positionsError &&
        (vehiclePoints.length > 0 || zones.length > 0) ? (
          <div className="h-[420px] overflow-hidden border border-border bg-zinc-50 md:h-[520px]">
            <InteractiveMapClient vehicles={vehiclePoints} zones={zones} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
