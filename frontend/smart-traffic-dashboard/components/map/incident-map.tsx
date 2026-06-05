"use client";

import dynamic from "next/dynamic";
import { MapPinned } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/ui/feedback";
import type { IncidentMapClientProps } from "@/components/map/incident-map-client";
import type { Incident } from "@/types/incident";

const IncidentMapClient = dynamic<IncidentMapClientProps>(
  () => import("@/components/map/incident-map-client"),
  {
    ssr: false,
    loading: () => <LoadingState message="Chargement de la carte..." />,
  },
);

type IncidentMapProps = {
  incidents: Incident[];
  title?: string;
  description?: string;
  className?: string;
};

export function IncidentMap({
  incidents,
  title = "Carte des incidents",
  description = "Localisation des incidents declares et de leur statut courant.",
  className,
}: IncidentMapProps) {
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
              {incidents.length} incident(s)
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {incidents.length === 0 ? (
          <EmptyState
            icon={<MapPinned className="size-5" aria-hidden="true" />}
            title="Aucun incident a afficher"
            message="Declarez un incident avec sa position pour alimenter la carte."
          />
        ) : (
          <div className="h-[420px] overflow-hidden border border-border bg-zinc-50 md:h-[520px]">
            <IncidentMapClient incidents={incidents} />
          </div>
        )}
      </div>
    </Card>
  );
}
