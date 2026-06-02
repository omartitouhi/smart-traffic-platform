"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowLeft, MapPinned, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SIMULATE_VEHICLE_POSITION_MUTATION } from "@/graphql/mutations/vehicle.mutations";
import { VEHICLE_QUERY } from "@/graphql/queries/vehicle.queries";
import { EmptyState, ErrorState, LoadingState, StatusMessage } from "@/components/ui/feedback";
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function VehicleDetails({ vehicleId }: VehicleDetailsProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
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

  async function handleSimulatePosition() {
    setStatus("loading");
    setMessage("");

    try {
      await simulateVehiclePosition({
        variables: {
          vehicleId,
        },
      });
      await refetch();
      setStatus("success");
      setMessage("Position GPS simulee ajoutee.");
    } catch (simulationError) {
      setStatus("error");
      setMessage(
        simulationError instanceof Error
          ? simulationError.message
          : "Impossible de simuler la position GPS.",
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
          <Link
            href={`/vehicles/${vehicle.id}/positions`}
            className="inline-flex h-11 items-center justify-center gap-2 border border-border px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-muted"
          >
            <MapPinned className="size-4" aria-hidden="true" />
            Historique GPS
          </Link>
          <button
            type="button"
            disabled={status === "loading"}
            onClick={() => void handleSimulatePosition()}
            className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            <Plus className="size-4" aria-hidden="true" />
            {status === "loading" ? "Simulation..." : "Ajouter position GPS simulee"}
          </button>
        </div>
      </div>

      {message ? (
        <StatusMessage tone={status === "success" ? "success" : "error"}>
          {message}
        </StatusMessage>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <DetailItem label="Matricule" value={vehicle.matricule} />
        <DetailItem label="Brand" value={vehicle.brand} />
        <DetailItem label="Model" value={vehicle.model} />
        <DetailItem label="Type" value={vehicle.type} />
        <DetailItem label="Status" value={vehicle.status} />
        <DetailItem label="Cree le" value={formatDate(vehicle.createdAt)} />
        <DetailItem label="Mis a jour le" value={formatDate(vehicle.updatedAt)} />
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <Link
      href="/vehicles"
      className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-medium text-zinc-800 transition-colors hover:bg-muted"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Retour
    </Link>
  );
}

type DetailItemProps = {
  label: string;
  value: string;
};

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="border border-border bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-zinc-950">{value}</p>
    </div>
  );
}
