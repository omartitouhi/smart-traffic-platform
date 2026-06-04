"use client";

import Link from "next/link";
import {
  Activity,
  Car,
  LogOut,
  MapPinned,
  ShieldCheck,
  TrafficCone,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/feedback";
import { Card } from "@/components/ui/card";

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

export function DashboardHome() {
  const { logout, user } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Operator";

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

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
              icon={<Car className="size-5" aria-hidden="true" />}
              label="Flotte"
              value="Active"
              helper="Gestion centralisee des vehicules"
          />
          <MetricCard
              icon={<MapPinned className="size-5" aria-hidden="true" />}
              label="GPS"
              value="Trace"
              helper="Positions historisees par vehicule"
          />
          <MetricCard
              icon={<Activity className="size-5" aria-hidden="true" />}
              label="Gateway"
              value="GraphQL"
              helper="Point d'entree unique du frontend"
          />
          <MetricCard
              icon={<TrafficCone className="size-5" aria-hidden="true" />}
              label="Trafic"
              value="Zones"
              helper="Densite et congestion par zone"
          />
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
      </div>
  );
}
