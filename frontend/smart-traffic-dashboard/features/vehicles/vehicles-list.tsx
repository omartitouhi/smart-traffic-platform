"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowDownUp, Car, Eye, MapPinned, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { DELETE_VEHICLE_MUTATION } from "@/graphql/mutations/vehicle.mutations";
import { VEHICLES_QUERY } from "@/graphql/queries/vehicle.queries";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Badge, vehicleStatusTone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Table, TablePagination } from "@/components/ui/table";
import { notify } from "@/components/ui/toast";
import { TableSkeleton } from "@/components/ui/loader";
import type { Vehicle } from "@/types/vehicle";

type VehiclesQueryResult = {
  vehicles: Vehicle[];
};

type DeleteVehicleResult = {
  deleteVehicle: boolean;
};

type SortKey = "createdAt" | "matricule" | "status";
const PAGE_SIZE = 8;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function VehiclesList() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const { data, loading, error, refetch } =
    useQuery<VehiclesQueryResult>(VEHICLES_QUERY);
  const [deleteVehicle, { loading: isDeleting }] = useMutation<
    DeleteVehicleResult,
    { id: string }
  >(DELETE_VEHICLE_MUTATION);

  const vehicles = useMemo(() => data?.vehicles ?? [], [data?.vehicles]);
  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return vehicles;

    return vehicles.filter((vehicle) =>
      vehicle.matricule.toLowerCase().includes(normalizedSearch),
    );
  }, [search, vehicles]);
  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      const aValue = sortKey === "createdAt" ? new Date(a.createdAt).getTime() : a[sortKey];
      const bValue = sortKey === "createdAt" ? new Date(b.createdAt).getTime() : b[sortKey];
      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredVehicles, sortDirection, sortKey]);
  const pageCount = Math.max(1, Math.ceil(sortedVehicles.length / PAGE_SIZE));
  const paginatedVehicles = sortedVehicles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(nextKey: SortKey) {
    setPage(1);
    if (nextKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === "createdAt" ? "desc" : "asc");
  }

  async function confirmDelete() {
    if (!vehicleToDelete) return;
    try {
      await deleteVehicle({ variables: { id: vehicleToDelete.id } });
      notify.success("Vehicule supprime.");
      setVehicleToDelete(null);
      await refetch();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer le vehicule.",
      );
    }
  }

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
        <ButtonLink
          href="/vehicles/create"
          icon={<Plus className="size-4" aria-hidden="true" />}
        >
          Ajouter vehicule
        </ButtonLink>
      </div>

      <div className="flex flex-col gap-3 border border-border bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-sm">
          <Input
            label="Recherche"
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par matricule"
            leftIcon={<Search className="size-4" aria-hidden="true" />}
          />
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
            <ButtonLink
              href="/vehicles/create"
              size="sm"
            >
              Ajouter vehicule
            </ButtonLink>
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

      {!loading && !error && sortedVehicles.length > 0 ? (
        <Table>
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-normal text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    <SortButton label="Matricule" onClick={() => toggleSort("matricule")} />
                  </th>
                  <th className="px-4 py-3 font-semibold">Marque</th>
                  <th className="px-4 py-3 font-semibold">Modele</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">
                    <SortButton label="Statut" onClick={() => toggleSort("status")} />
                  </th>
                  <th className="px-4 py-3 font-semibold">
                    <SortButton label="Cree le" onClick={() => toggleSort("createdAt")} />
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-t border-border transition-colors hover:bg-zinc-50">
                    <td className="px-4 py-4 font-medium text-zinc-950">
                      {vehicle.matricule}
                    </td>
                    <td className="px-4 py-4">{vehicle.brand}</td>
                    <td className="px-4 py-4">{vehicle.model}</td>
                    <td className="px-4 py-4">{vehicle.type}</td>
                    <td className="px-4 py-4">
                      <Badge tone={vehicleStatusTone(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(vehicle.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <ButtonLink
                          href={`/vehicles/${vehicle.id}`}
                          variant="secondary"
                          size="sm"
                          icon={<Eye className="size-4" aria-hidden="true" />}
                        >
                          Detail
                        </ButtonLink>
                        <ButtonLink
                          href={`/vehicles/${vehicle.id}/positions`}
                          variant="secondary"
                          size="sm"
                          icon={<MapPinned className="size-4" aria-hidden="true" />}
                        >
                          GPS
                        </ButtonLink>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          icon={<Trash2 className="size-4" aria-hidden="true" />}
                          onClick={() => setVehicleToDelete(vehicle)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination
              page={page}
              pageCount={pageCount}
              onPrevious={() => setPage((current) => Math.max(1, current - 1))}
              onNext={() => setPage((current) => Math.min(pageCount, current + 1))}
            />
        </Table>
      ) : null}

      <Modal
        open={Boolean(vehicleToDelete)}
        title="Supprimer le vehicule"
        description={`Cette action supprimera ${vehicleToDelete?.matricule ?? "ce vehicule"} et ses positions GPS.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => setVehicleToDelete(null)}
      />
    </section>
  );
}

function SortButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-zinc-950"
    >
      {label}
      <ArrowDownUp className="size-3.5" aria-hidden="true" />
    </button>
  );
}
