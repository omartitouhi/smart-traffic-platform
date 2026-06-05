"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  ArrowLeft,
  CalendarClock,
  Gauge,
  MapPinned,
  RefreshCw,
  Route,
  TrafficCone,
  Users,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { MEASURE_TRAFFIC_DENSITY_MUTATION } from "@/graphql/mutations/traffic.mutations";
import { TRAFFIC_ZONE_QUERY } from "@/graphql/queries/traffic.queries";
import { Badge, congestionLevelTone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { notify } from "@/components/ui/toast";
import type { MeasureTrafficDensityInput, TrafficZone } from "@/types/traffic";

type TrafficZoneDetailsProps = {
  zoneId: string;
};

type TrafficZoneQueryResult = {
  trafficZone: TrafficZone;
};

type MeasureTrafficDensityResult = {
  measureTrafficDensity: TrafficZone;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 3,
  }).format(value);
}

function validateVehicleCount(value: string) {
  const vehicleCount = Number(value);

  if (!value.trim()) {
    return "Le nombre de vehicules est obligatoire.";
  }

  if (
    !Number.isFinite(vehicleCount) ||
    !Number.isInteger(vehicleCount) ||
    vehicleCount < 0
  ) {
    return "Le nombre de vehicules doit etre un entier positif ou nul.";
  }

  return undefined;
}

export function TrafficZoneDetails({ zoneId }: TrafficZoneDetailsProps) {
  const [vehicleCount, setVehicleCount] = useState<string>();
  const [vehicleCountError, setVehicleCountError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const { data, loading, error, refetch } = useQuery<TrafficZoneQueryResult>(
    TRAFFIC_ZONE_QUERY,
    {
      variables: { id: zoneId },
    },
  );
  const [measureTrafficDensity] = useMutation<
    MeasureTrafficDensityResult,
    { input: MeasureTrafficDensityInput }
  >(MEASURE_TRAFFIC_DENSITY_MUTATION);

  async function handleUpdateDensity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedVehicleCount =
      vehicleCount ?? String(data?.trafficZone.vehicleCount ?? "");
    const nextError = validateVehicleCount(submittedVehicleCount);
    setVehicleCountError(nextError);

    if (nextError) return;

    setStatus("loading");

    try {
      const result = await measureTrafficDensity({
        variables: {
          input: {
            zoneId,
            vehicleCount: Number(submittedVehicleCount),
          },
        },
      });
      await refetch();
      setVehicleCount(
        result.data
          ? String(result.data.measureTrafficDensity.vehicleCount)
          : undefined,
      );
      setStatus("success");
      notify.success("Densite trafic mise a jour.");
    } catch (updateError) {
      setStatus("error");
      notify.error(
        updateError instanceof Error
          ? updateError.message
          : "Impossible de mettre a jour la densite.",
      );
    }
  }

  if (loading) {
    return <LoadingState message="Chargement de la zone..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          title="Zone indisponible"
          message="Impossible de charger le detail de la zone depuis la Gateway GraphQL."
        />
      </div>
    );
  }

  const zone = data?.trafficZone;

  if (!zone) {
    return (
      <div className="space-y-4">
        <BackLink />
        <EmptyState
          icon={<TrafficCone className="size-5" aria-hidden="true" />}
          title="Zone introuvable"
          message="Cette zone n'existe pas ou n'est plus disponible."
        />
      </div>
    );
  }

  const displayedVehicleCount = vehicleCount ?? String(zone.vehicleCount);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <BackLink />
          <p className="mt-6 text-sm font-medium text-muted-foreground">
            Traffic Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            {zone.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {zone.description || "Detail de la zone et indicateurs de trafic."}
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

      <div className="grid gap-4 md:grid-cols-3">
        <DetailItem
          icon={<Gauge className="size-4" />}
          label="Densite"
          value={formatNumber(zone.density)}
        />
        <DetailItem
          icon={<TrafficCone className="size-4" />}
          label="Niveau"
          value={
            <Badge tone={congestionLevelTone(zone.congestionLevel)}>
              {zone.congestionLevel}
            </Badge>
          }
        />
        <DetailItem
          icon={<Users className="size-4" />}
          label="Vehicules"
          value={zone.vehicleCount}
        />
        <DetailItem
          icon={<Route className="size-4" />}
          label="Rayon"
          value={formatNumber(zone.radius)}
        />
        <DetailItem
          icon={<MapPinned className="size-4" />}
          label="Position"
          value={`${formatNumber(zone.latitude)}, ${formatNumber(zone.longitude)}`}
        />
        <DetailItem
          icon={<CalendarClock className="size-4" />}
          label="Mis a jour"
          value={formatDate(zone.updatedAt)}
        />
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">
              Mesure de densite
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              La densite est recalculee par la Gateway via le service trafic.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={zone.isCongested ? "danger" : "success"}>
                {zone.isCongested ? "Zone congestionnee" : "Zone fluide"}
              </Badge>
              <Badge tone={congestionLevelTone(zone.congestionLevel)}>
                {zone.congestionLevel}
              </Badge>
            </div>
          </div>
          <form
            onSubmit={handleUpdateDensity}
            className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:max-w-md"
          >
            <Input
              id="traffic-density-vehicle-count"
              label="Nombre de vehicules"
              type="number"
              min="0"
              step="1"
              value={displayedVehicleCount}
              error={vehicleCountError}
              onChange={(event) => {
                setVehicleCount(event.target.value);
                setVehicleCountError(
                  validateVehicleCount(event.target.value),
                );
              }}
            />
            <Button
              type="submit"
              className="sm:mt-7"
              isLoading={status === "loading"}
            >
              {status === "loading" ? "Mise a jour..." : "Mettre a jour"}
            </Button>
          </form>
        </div>
      </Card>
    </section>
  );
}

function BackLink() {
  return (
    <ButtonLink
      href="/traffic"
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
  value: ReactNode;
  icon?: ReactNode;
};

function DetailItem({ label, value, icon }: DetailItemProps) {
  return (
    <Card className="p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
            {label}
          </p>
          <div className="mt-2 text-base font-semibold text-zinc-950">
            {value}
          </div>
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
