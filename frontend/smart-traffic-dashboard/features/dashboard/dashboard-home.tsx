"use client";

import Link from "next/link";
import { Car, LogOut, MapPinned, ShieldCheck } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";

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
];

export function DashboardHome() {
  const { logout, user } = useAuth();
  const displayName = user ? `${user.firstName} ${user.lastName}` : "Operator";

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 border border-border bg-white p-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-muted-foreground">
            Bienvenue
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950">
            Bonjour, {displayName}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Votre espace de pilotage est pret. Utilisez les raccourcis pour
            acceder aux modules operationnels de la plateforme.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void logout()}
          className="inline-flex h-11 items-center justify-center gap-2 border border-border px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-muted"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Logout
        </button>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Navigation</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Acces rapide aux fonctionnalites principales.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {navigationCards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group border border-border bg-white p-5 transition-colors hover:border-zinc-950"
              >
                <div className="mb-4 flex size-11 items-center justify-center border border-border bg-muted text-zinc-800">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h4 className="text-base font-semibold text-zinc-950">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
                <span className="mt-4 inline-flex text-sm font-medium text-zinc-950 group-hover:underline">
                  Ouvrir
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
