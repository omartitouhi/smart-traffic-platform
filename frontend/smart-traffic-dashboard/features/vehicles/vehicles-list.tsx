"use client";

import { useQuery } from "@apollo/client/react";
import { Car, Eye, MapPinned, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { VEHICLES_QUERY } from "@/graphql/queries/vehicle.queries";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/feedback";
import type { Vehicle } from "@/types/vehicle";

type VehiclesQueryResult = {
  vehicles: Vehicle[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function VehiclesList() {
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } =
    useQuery<VehiclesQueryResult>(VEHICLES_QUERY);

  const vehicles = useMemo(() => data?.vehicles ?? [], [data?.vehicles]);
  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return vehicles;

    return vehicles.filter((vehicle) =>
      vehicle.matricule.toLowerCase().includes(normalizedSearch),
    );
  }, [search, vehicles]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Vehicle Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Vehicules
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Consultez la flotte et accedez rapidement aux details ou a
            l&apos;historique GPS.
          </p>
        </div>
        <Link
          href="/vehicles/create"
          className="inline-flex h-11 items-center justify-center gap-2 bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          <Plus className="size-4" aria-hidden="true" />
          Ajouter vehicule
        </Link>
      </div>

      <div className="flex flex-col gap-3 border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par matricule"
            className="h-11 w-full border border-border bg-white pl-10 pr-3 text-sm outline-none focus:border-zinc-900"
          />
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="h-11 border border-border px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-muted"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <LoadingState message="Chargement des vehicules..." />
      ) : null}

      {error ? (
        <ErrorState
          title="Liste indisponible"
          message="Impossible de charger la liste des vehicules depuis la Gateway GraphQL."
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

      {!loading && !error && vehicles.length === 0 ? (
        <EmptyState
          icon={<Car className="size-5" aria-hidden="true" />}
          title="Aucun vehicule"
          message="Ajoutez un premier vehicule pour commencer a gerer la flotte."
          action={
            <Link
              href="/vehicles/create"
              className="inline-flex h-10 items-center justify-center bg-zinc-950 px-4 text-sm font-medium text-white"
            >
              Ajouter vehicule
            </Link>
          }
        />
      ) : null}

      {!loading && !error && vehicles.length > 0 && filteredVehicles.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" aria-hidden="true" />}
          title="Aucun resultat"
          message="Aucun vehicule ne correspond a ce matricule."
        />
      ) : null}

      {!loading && !error && filteredVehicles.length > 0 ? (
        <div className="overflow-hidden border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-normal text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Matricule</th>
                  <th className="px-4 py-3 font-semibold">Marque</th>
                  <th className="px-4 py-3 font-semibold">Modele</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Statut</th>
                  <th className="px-4 py-3 font-semibold">Cree le</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-border">
                    <td className="px-4 py-4 font-medium text-zinc-950">
                      {vehicle.matricule}
                    </td>
                    <td className="px-4 py-4">{vehicle.brand}</td>
                    <td className="px-4 py-4">{vehicle.model}</td>
                    <td className="px-4 py-4">{vehicle.type}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex border border-border bg-muted px-2 py-1 text-xs font-medium">
                        {vehicle.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(vehicle.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/vehicles/${vehicle.id}`}
                          className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium hover:bg-muted"
                        >
                          <Eye className="size-4" aria-hidden="true" />
                          Detail
                        </Link>
                        <Link
                          href={`/vehicles/${vehicle.id}/positions`}
                          className="inline-flex h-9 items-center gap-2 border border-border px-3 text-xs font-medium hover:bg-muted"
                        >
                          <MapPinned className="size-4" aria-hidden="true" />
                          GPS
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
