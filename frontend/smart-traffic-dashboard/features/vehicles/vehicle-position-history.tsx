"use client";

import { useQuery } from "@apollo/client/react";
import { ArrowLeft, MapPinned, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { VEHICLE_POSITIONS_QUERY } from "@/graphql/queries/vehicle.queries";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/loader";
import type { VehiclePosition } from "@/types/vehicle";

type VehiclePositionHistoryProps = {
  vehicleId: string;
};

type VehiclePositionsQueryResult = {
  vehiclePositions: VehiclePosition[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatCoordinate(value: number) {
  return value.toFixed(6);
}

export function VehiclePositionHistory({
  vehicleId,
}: VehiclePositionHistoryProps) {
  const { data, loading, error, refetch } =
    useQuery<VehiclePositionsQueryResult>(VEHICLE_POSITIONS_QUERY, {
      variables: {
        vehicleId,
      },
    });

  const positions = useMemo(() => data?.vehiclePositions ?? [], [data]);
  const sortedPositions = useMemo(
    () =>
      [...positions].sort(
        (current, next) =>
          new Date(next.recordedAt).getTime() -
          new Date(current.recordedAt).getTime(),
      ),
    [positions],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <ButtonLink
            href={`/vehicles/${vehicleId}`}
            variant="secondary"
            size="sm"
            icon={<ArrowLeft className="size-4" aria-hidden="true" />}
          >
            Retour detail vehicule
          </ButtonLink>
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            Vehicle Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Historique GPS
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Positions enregistrees, triees de la plus recente a la plus
            ancienne.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void refetch()}
          icon={<RefreshCw className="size-4" aria-hidden="true" />}
        >
          Actualiser
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : null}

      {error ? (
        <ErrorState
          title="Historique indisponible"
          message="Impossible de charger l'historique GPS depuis la Gateway GraphQL."
          action={
            <button
              type="button"
              onClick={() => void refetch()}
              className="h-10 border border-red-300 px-3 text-sm font-medium hover:bg-red-100"
            >
              Reessayer
            </button>
          }
        />
      ) : null}

      {!loading && !error && sortedPositions.length === 0 ? (
        <EmptyState
          icon={<MapPinned className="size-5" aria-hidden="true" />}
          title="Aucune position GPS"
          message="Les positions simulees ou ajoutees apparaitront ici."
        />
      ) : null}

      {!loading && !error && sortedPositions.length > 0 ? (
        <Table>
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-normal text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Latitude</th>
                  <th className="px-4 py-3 font-semibold">Longitude</th>
                  <th className="px-4 py-3 font-semibold">Vitesse</th>
                </tr>
              </thead>
              <tbody>
                {sortedPositions.map((position) => (
                  <tr key={position.id} className="border-t border-border transition-colors hover:bg-zinc-50">
                    <td className="px-4 py-4 font-medium text-zinc-950">
                      {formatDate(position.recordedAt)}
                    </td>
                    <td className="px-4 py-4">
                      {formatCoordinate(position.latitude)}
                    </td>
                    <td className="px-4 py-4">
                      {formatCoordinate(position.longitude)}
                    </td>
                    <td className="px-4 py-4">{position.speed.toFixed(2)} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </Table>
      ) : null}
    </section>
  );
}
