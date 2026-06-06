"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowLeft, CalendarClock, Car, Gauge, MapPinned, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DELETE_VEHICLE_MUTATION,
  SIMULATE_VEHICLE_POSITION_MUTATION,
} from "@/graphql/mutations/vehicle.mutations";
import { VEHICLE_QUERY, VEHICLES_QUERY } from "@/graphql/queries/vehicle.queries";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { Badge, vehicleStatusTone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { notify } from "@/components/ui/toast";
import { InteractiveMap } from "@/components/map/interactive-map";
import type { Vehicle, VehiclePosition } from "@/types/vehicle";

type VehicleDetailsProps = {
  vehicleId: string;
};

type VehicleQueryResult = {
  vehicle: Vehicle;
};

type SimulateVehiclePositionResult = {
  simulateVehiclePosition: VehiclePosition;
};

type DeleteVehicleResult = {
  deleteVehicle: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function VehicleDetails({ vehicleId }: VehicleDetailsProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const { data, loading, error, refetch } = useQuery<VehicleQueryResult>(
    VEHICLE_QUERY,
    {
      variables: { id: vehicleId },
    },
  );
  const [simulateVehiclePosition] = useMutation<
    SimulateVehiclePositionResult,
    { vehicleId: string }
  >(SIMULATE_VEHICLE_POSITION_MUTATION);
  const [deleteVehicle, { loading: isDeleting }] = useMutation<
    DeleteVehicleResult,
    { id: string }
  >(DELETE_VEHICLE_MUTATION);

  async function handleSimulatePosition() {
    setStatus("loading");

    try {
      await simulateVehiclePosition({
        variables: {
          vehicleId,
        },
      });
      await refetch();
      setMapRefreshKey((current) => current + 1);
      setStatus("success");
      notify.success("Position GPS simulee ajoutee.");
    } catch (simulationError) {
      setStatus("error");
      notify.error(
        simulationError instanceof Error
          ? simulationError.message
          : "Impossible de simuler la position GPS.",
      );
    }
  }

  async function handleDelete() {
    try {
      const result = await deleteVehicle({
        variables: { id: vehicleId },
        refetchQueries: [{ query: VEHICLES_QUERY }],
        awaitRefetchQueries: true,
      });
      if (!result.data?.deleteVehicle) {
        throw new Error("La suppression du vehicule a ete refusee.");
      }
      notify.success("Vehicule supprime.");
      router.replace("/vehicles");
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer le vehicule.",
      );
    }
  }

  if (loading) {
    return <LoadingState message="Chargement du vehicule..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          title="Detail indisponible"
          message="Impossible de charger le detail du vehicule depuis la Gateway GraphQL."
        />
      </div>
    );
  }

  const vehicle = data?.vehicle;

  if (!vehicle) {
    return (
      <div className="space-y-4">
        <BackLink />
        <EmptyState
          icon={<MapPinned className="size-5" aria-hidden="true" />}
          title="Vehicule introuvable"
          message="Ce vehicule n'existe pas ou n'est plus disponible."
        />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <BackLink />
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            Vehicle Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            {vehicle.matricule}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Detail du vehicule et actions GPS.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={`/vehicles/${vehicle.id}/positions`}
            variant="secondary"
            icon={<MapPinned className="size-4" aria-hidden="true" />}
          >
            Historique GPS
          </ButtonLink>
          <Button
            type="button"
            isLoading={status === "loading"}
            onClick={() => void handleSimulatePosition()}
            icon={<Plus className="size-4" aria-hidden="true" />}
          >
            {status === "loading" ? "Simulation..." : "Ajouter position GPS simulee"}
          </Button>
          <Button
            type="button"
            variant="danger"
            icon={<Trash2 className="size-4" aria-hidden="true" />}
            onClick={() => setIsDeleteOpen(true)}
          >
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DetailItem icon={<Car className="size-4" />} label="Matricule" value={vehicle.matricule} />
        <DetailItem icon={<Gauge className="size-4" />} label="Statut" value={<Badge tone={vehicleStatusTone(vehicle.status)}>{vehicle.status}</Badge>} />
        <DetailItem icon={<CalendarClock className="size-4" />} label="Cree le" value={formatDate(vehicle.createdAt)} />
        <DetailItem label="Brand" value={vehicle.brand} />
        <DetailItem label="Model" value={vehicle.model} />
        <DetailItem label="Type" value={vehicle.type} />
        <DetailItem label="Mis a jour le" value={formatDate(vehicle.updatedAt)} />
      </div>

      <InteractiveMap
        title="Position du vehicule"
        description="Derniere position GPS connue du vehicule et contexte des zones de circulation."
        vehicleId={vehicle.id}
        refreshKey={mapRefreshKey}
      />

      <Modal
        open={isDeleteOpen}
        title="Supprimer le vehicule"
        description={`Cette action supprimera ${vehicle.matricule} et ses positions GPS.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onClose={() => setIsDeleteOpen(false)}
      />
    </section>
  );
}

function BackLink() {
  return (
    <ButtonLink
      href="/vehicles"
      variant="secondary"
      size="sm"
      icon={<ArrowLeft className="size-4" aria-hidden="true" />}
    >
      Retour
    </ButtonLink>
  );
}

type DetailItemProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
};

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <Card className="p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            {label}
          </p>
          <div className="mt-2 text-base font-semibold text-zinc-950">{value}</div>
        </div>
        {icon ? (
          <div className="grid size-9 place-items-center border border-border bg-zinc-50 text-zinc-700">
            {icon}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
