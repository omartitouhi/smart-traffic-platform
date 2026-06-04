"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  ArrowDownUp,
  Eye,
  MapPinned,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DELETE_TRAFFIC_ZONE_MUTATION } from "@/graphql/mutations/traffic.mutations";
import { TRAFFIC_ZONES_QUERY } from "@/graphql/queries/traffic.queries";
import { Badge, congestionLevelTone } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { Table, TablePagination } from "@/components/ui/table";
import { notify } from "@/components/ui/toast";
import { InteractiveMap } from "@/components/map/interactive-map";
import type { TrafficZone } from "@/types/traffic";

type TrafficZonesQueryResult = {
  trafficZones: TrafficZone[];
};

type DeleteTrafficZoneResult = {
  deleteTrafficZone: boolean;
};

type SortKey = "createdAt" | "density" | "name";

const PAGE_SIZE = 8;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function TrafficZonesList() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [zoneToDelete, setZoneToDelete] = useState<TrafficZone | null>(null);
  const { data, loading, error, refetch } =
    useQuery<TrafficZonesQueryResult>(TRAFFIC_ZONES_QUERY);
  const [deleteTrafficZone, { loading: isDeleting }] = useMutation<
    DeleteTrafficZoneResult,
    { id: string }
  >(DELETE_TRAFFIC_ZONE_MUTATION);

  const zones = useMemo(() => data?.trafficZones ?? [], [data?.trafficZones]);
  const filteredZones = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return zones;

    return zones.filter((zone) =>
      zone.name.toLowerCase().includes(normalizedSearch),
    );
  }, [search, zones]);
  const sortedZones = useMemo(() => {
    return [...filteredZones].sort((a, b) => {
      const aValue =
        sortKey === "createdAt" ? new Date(a.createdAt).getTime() : a[sortKey];
      const bValue =
        sortKey === "createdAt" ? new Date(b.createdAt).getTime() : b[sortKey];
      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredZones, sortDirection, sortKey]);
  const pageCount = Math.max(1, Math.ceil(sortedZones.length / PAGE_SIZE));
  const paginatedZones = sortedZones.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

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
    if (!zoneToDelete) return;

    try {
      await deleteTrafficZone({ variables: { id: zoneToDelete.id } });
      notify.success("Zone de circulation supprimee.");
      setZoneToDelete(null);
      await refetch();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer la zone.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Traffic Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Zones de circulation
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Suivez la densite, le niveau de congestion et les zones critiques.
          </p>
        </div>
        <ButtonLink
          href="/traffic/create"
          icon={<Plus className="size-4" aria-hidden="true" />}
        >
          Ajouter zone
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
            placeholder="Rechercher par nom"
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

      <InteractiveMap
        title="Carte trafic"
        description="Zones de circulation, niveaux de densite et vehicules avec positions GPS recentes."
      />

      {loading ? <TableSkeleton rows={6} /> : null}

      {error ? (
        <ErrorState
          title="Zones indisponibles"
          message="Impossible de charger les zones depuis la Gateway GraphQL."
          action={
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => void refetch()}
            >
              Reessayer
            </Button>
          }
        />
      ) : null}

      {!loading && !error && zones.length === 0 ? (
        <EmptyState
          icon={<MapPinned className="size-5" aria-hidden="true" />}
          title="Aucune zone"
          message="Ajoutez une premiere zone pour commencer a mesurer la densite du trafic."
          action={
            <ButtonLink href="/traffic/create" size="sm">
              Ajouter zone
            </ButtonLink>
          }
        />
      ) : null}

      {!loading && !error && zones.length > 0 && filteredZones.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" aria-hidden="true" />}
          title="Aucun resultat"
          message="Aucune zone ne correspond a cette recherche."
        />
      ) : null}

      {!loading && !error && sortedZones.length > 0 ? (
        <Table>
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-normal text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <SortButton label="Zone" onClick={() => toggleSort("name")} />
                </th>
                <th className="px-4 py-3 font-semibold">Vehicules</th>
                <th className="px-4 py-3 font-semibold">
                  <SortButton
                    label="Densite"
                    onClick={() => toggleSort("density")}
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Niveau</th>
                <th className="px-4 py-3 font-semibold">Congestion</th>
                <th className="px-4 py-3 font-semibold">
                  <SortButton
                    label="Cree le"
                    onClick={() => toggleSort("createdAt")}
                  />
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedZones.map((zone) => (
                <tr
                  key={zone.id}
                  className="border-t border-border transition-colors hover:bg-zinc-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-zinc-950">{zone.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Rayon {formatNumber(zone.radius)}
                    </p>
                  </td>
                  <td className="px-4 py-4">{zone.vehicleCount}</td>
                  <td className="px-4 py-4 font-medium">
                    {formatNumber(zone.density)}
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={congestionLevelTone(zone.congestionLevel)}>
                      {zone.congestionLevel}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={zone.isCongested ? "danger" : "success"}>
                      {zone.isCongested ? "Congestionnee" : "Fluide"}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(zone.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <ButtonLink
                        href={`/traffic/${zone.id}`}
                        variant="secondary"
                        size="sm"
                        icon={<Eye className="size-4" aria-hidden="true" />}
                      >
                        Detail
                      </ButtonLink>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="size-4" aria-hidden="true" />}
                        onClick={() => setZoneToDelete(zone)}
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
        open={Boolean(zoneToDelete)}
        title="Supprimer la zone"
        description={`Cette action supprimera ${zoneToDelete?.name ?? "cette zone"} du suivi trafic.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => setZoneToDelete(null)}
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
