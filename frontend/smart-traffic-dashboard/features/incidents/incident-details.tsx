"use client";

import { useQuery } from "@apollo/client/react";
import {
  ArrowLeft,
  CalendarClock,
  MapPin,
  MapPinned,
  RefreshCw,
  Siren,
  Tag,
} from "lucide-react";
import type { ReactNode } from "react";
import { INCIDENT_QUERY } from "@/graphql/queries/incident.queries";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import { IncidentStatusControl } from "@/features/incidents/incident-status-control";
import {
  incidentStatusLabel,
  incidentStatusTone,
  incidentTypeLabel,
} from "@/features/incidents/incident-display";
import type { Incident } from "@/types/incident";

type IncidentDetailsProps = {
  incidentId: string;
};

type IncidentQueryResult = {
  incident: Incident;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 6,
  }).format(value);
}

export function IncidentDetails({ incidentId }: IncidentDetailsProps) {
  const { data, loading, error, refetch } = useQuery<IncidentQueryResult>(
    INCIDENT_QUERY,
    {
      variables: { id: incidentId },
    },
  );

  if (loading) {
    return <LoadingState message="Chargement de l'incident..." />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <BackLink />
        <ErrorState
          title="Incident indisponible"
          message="Impossible de charger le detail de l'incident depuis la Gateway GraphQL."
        />
      </div>
    );
  }

  const incident = data?.incident;

  if (!incident) {
    return (
      <div className="space-y-4">
        <BackLink />
        <EmptyState
          icon={<Siren className="size-5" aria-hidden="true" />}
          title="Incident introuvable"
          message="Cet incident n'existe pas ou n'est plus disponible."
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
            Gestion des incidents
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            {incident.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {incident.description ||
              "Detail de l'incident et indicateurs de suivi."}
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
          icon={<Tag className="size-4" />}
          label="Type"
          value={<Badge>{incidentTypeLabel(incident.type)}</Badge>}
        />
        <DetailItem
          icon={<Siren className="size-4" />}
          label="Statut"
          value={
            <Badge tone={incidentStatusTone(incident.status)}>
              {incidentStatusLabel(incident.status)}
            </Badge>
          }
        />
        <DetailItem
          icon={<MapPin className="size-4" />}
          label="Adresse"
          value={incident.address || "Non renseignee"}
        />
        <DetailItem
          icon={<MapPinned className="size-4" />}
          label="Position"
          value={`${formatNumber(incident.latitude)}, ${formatNumber(incident.longitude)}`}
        />
        <DetailItem
          icon={<CalendarClock className="size-4" />}
          label="Declare le"
          value={formatDate(incident.createdAt)}
        />
        <DetailItem
          icon={<CalendarClock className="size-4" />}
          label="Mis a jour"
          value={formatDate(incident.updatedAt)}
        />
      </div>

      <Card className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-950">
              Modifier le statut
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Faites evoluer l&apos;incident: Signale, En cours puis Resolu.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={incidentStatusTone(incident.status)}>
                {incidentStatusLabel(incident.status)}
              </Badge>
            </div>
          </div>
          <IncidentStatusControl
            incidentId={incident.id}
            currentStatus={incident.status}
            onUpdated={() => void refetch()}
          />
        </div>
      </Card>
    </section>
  );
}

function BackLink() {
  return (
    <ButtonLink
      href="/incidents"
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
