"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import {
  AlertTriangle,
  Car,
  LogOut,
  MapPinned,
  RefreshCw,
  ShieldCheck,
  TrafficCone,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { ErrorState, MetricCard } from "@/components/ui/feedback";
import { Card } from "@/components/ui/card";
import { InteractiveMap } from "@/components/map/interactive-map";
import {
  VEHICLE_POSITION_COUNT_QUERY,
  VEHICLES_QUERY,
} from "@/graphql/queries/vehicle.queries";
import {
  CONGESTED_ZONES_QUERY,
  TRAFFIC_ZONES_QUERY,
} from "@/graphql/queries/traffic.queries";
import { INCIDENTS_QUERY } from "@/graphql/queries/incident.queries";
import { UNREAD_NOTIFICATION_COUNT_QUERY } from "@/graphql/queries/notification.queries";
import type { Incident } from "@/types/incident";
import type { TrafficZone } from "@/types/traffic";
import type { Vehicle } from "@/types/vehicle";

const navigationCards = [
  {
    href: "/vehicles",
    title: "Vehicle Management",
    description: "Consulter la flotte, creer des vehicules et suivre les positions GPS.",
    icon: Car,
  },
  {
    href: "/vehicles/create",
    title: "Ajouter un vehicule",
    description: "Preparer l'enregistrement d'un nouveau vehicule dans la flotte.",
    icon: ShieldCheck,
  },
  {
    href: "/vehicles",
    title: "Historique GPS",
    description: "Choisir un vehicule puis consulter son historique de positions.",
    icon: MapPinned,
  },
  {
    href: "/traffic",
    title: "Traffic Management",
    description: "Suivre les zones, la densite et les congestions detectees.",
    icon: TrafficCone,
  },
];

type VehiclesResult = {
  vehicles: Vehicle[];
};

type VehiclePositionCountResult = {
  vehiclePositionCount: number;
};

type TrafficZonesResult = {
  trafficZones: TrafficZone[];
};

type CongestedZonesResult = {
  congestedZones: TrafficZone[];
};

type IncidentsResult = {
  incidents: Incident[];
};

type UnreadNotificationCountResult = {
  unreadNotificationCount: number;
};

function formatMetric(value: number | undefined, loading: boolean) {
  if (loading) return "...";
  return String(value ?? 0);
}

export function DashboardHome() {
  const { logout, user } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Operator";
  const {
    data: vehiclesData,
    loading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles,
  } = useQuery<VehiclesResult>(VEHICLES_QUERY);
  const {
    data: positionsData,
    loading: positionsLoading,
    error: positionsError,
    refetch: refetchPositions,
  } = useQuery<VehiclePositionCountResult>(VEHICLE_POSITION_COUNT_QUERY);
  const {
    data: trafficData,
    loading: trafficLoading,
    error: trafficError,
    refetch: refetchTraffic,
  } = useQuery<TrafficZonesResult>(TRAFFIC_ZONES_QUERY);
  const {
    data: congestedData,
    loading: congestedLoading,
    error: congestedError,
    refetch: refetchCongested,
  } = useQuery<CongestedZonesResult>(CONGESTED_ZONES_QUERY);
  const {
    data: incidentsData,
    loading: incidentsLoading,
    error: incidentsError,
    refetch: refetchIncidents,
  } = useQuery<IncidentsResult>(INCIDENTS_QUERY);
  const {
    data: unreadData,
    loading: unreadLoading,
    error: unreadError,
    refetch: refetchUnread,
  } = useQuery<UnreadNotificationCountResult>(
    UNREAD_NOTIFICATION_COUNT_QUERY,
    {
      variables: {
        input: {},
      },
    },
  );
  const statsError =
    vehiclesError ??
    positionsError ??
    trafficError ??
    congestedError ??
    incidentsError ??
    unreadError;
  const activeIncidentCount =
    incidentsData?.incidents.filter((incident) => incident.status !== "RESOLU")
      .length ?? 0;

  function refetchDashboardStats() {
    void Promise.all([
      refetchVehicles(),
      refetchPositions(),
      refetchTraffic(),
      refetchCongested(),
      refetchIncidents(),
      refetchUnread(),
    ]);
  }

  return (
      <div className="space-y-8">
        <section className="flex flex-col gap-6 border border-border bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase text-muted-foreground">
              Bienvenue
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950 md:text-4xl">
              Bonjour, {displayName}
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Votre espace de pilotage est pret. Utilisez les raccourcis pour
              acceder aux modules operationnels de la plateforme.
            </p>
          </div>
          <Button
              type="button"
              onClick={() => void logout()}
              variant="secondary"
              icon={<LogOut className="size-4" aria-hidden="true" />}
          >
            Logout
          </Button>
        </section>

        <section className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-zinc-700" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Indicateurs metier</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Statistiques calculees depuis l API Gateway GraphQL.
            </p>
          </div>

          {statsError ? (
            <ErrorState
              title="Statistiques indisponibles"
              message="Impossible de charger les indicateurs metier depuis l API Gateway GraphQL."
              action={
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={refetchDashboardStats}
                  icon={<RefreshCw className="size-4" aria-hidden="true" />}
                >
                  Reessayer
                </Button>
              }
            />
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            <MetricCard
                icon={<Car className="size-5" aria-hidden="true" />}
                label="Vehicules"
                value={formatMetric(
                  vehiclesData?.vehicles.length,
                  vehiclesLoading,
                )}
                helper="Nombre total enregiste"
            />
            <MetricCard
                icon={<MapPinned className="size-5" aria-hidden="true" />}
                label="Positions GPS"
                value={formatMetric(
                  positionsData?.vehiclePositionCount,
                  positionsLoading,
                )}
                helper="Total des traces historisees"
            />
            <MetricCard
                icon={<TrafficCone className="size-5" aria-hidden="true" />}
                label="Zones"
                value={formatMetric(
                  trafficData?.trafficZones.length,
                  trafficLoading,
                )}
                helper="Zones de circulation suivies"
            />
            <MetricCard
                icon={<AlertTriangle className="size-5" aria-hidden="true" />}
                label="Incidents actifs"
                value={formatMetric(activeIncidentCount, incidentsLoading)}
                helper="Statuts SIGNALE ou EN_COURS"
            />
            <MetricCard
                icon={<TrafficCone className="size-5" aria-hidden="true" />}
                label="Congestion"
                value={formatMetric(
                  congestedData?.congestedZones.length,
                  congestedLoading,
                )}
                helper="Zones classees HIGH"
            />
            <MetricCard
                icon={<AlertTriangle className="size-5" aria-hidden="true" />}
                label="Non lues"
                value={formatMetric(
                  unreadData?.unreadNotificationCount,
                  unreadLoading,
                )}
                helper="Notifications a traiter"
            />
          </div>
        </section>

        <section>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-zinc-700" aria-hidden="true" />
              <h3 className="text-lg font-semibold">Navigation</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Acces rapide aux fonctionnalites principales.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {navigationCards.map((item) => {
              const Icon = item.icon;

              return (
                  <Link
                      key={`${item.href}-${item.title}`}
                      href={item.href}
                      className="group block transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    <Card className="h-full p-5 transition-all duration-200 group-hover:border-zinc-400 group-hover:shadow-sm">
                      <div className="mb-4 flex size-11 items-center justify-center border border-border bg-zinc-50 text-zinc-800">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <h4 className="text-base font-semibold text-zinc-950">
                        {item.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                      <span className="mt-4 inline-flex text-sm font-medium text-zinc-950 underline-offset-4 group-hover:underline">
                    Ouvrir
                  </span>
                    </Card>
                  </Link>
              );
            })}
          </div>
        </section>

        <InteractiveMap
          title="Carte interactive"
          description="Vue urbaine des vehicules localises et des zones de circulation."
        />
      </div>
  );
}
