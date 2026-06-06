"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import {
  ArrowDownUp,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Siren,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DELETE_INCIDENT_MUTATION } from "@/graphql/mutations/incident.mutations";
import { INCIDENTS_QUERY } from "@/graphql/queries/incident.queries";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, ErrorState } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { Table, TablePagination } from "@/components/ui/table";
import { notify } from "@/components/ui/toast";
import { IncidentMap } from "@/components/map/incident-map";
import {
  INCIDENT_STATUS_OPTIONS,
  incidentStatusLabel,
  incidentStatusTone,
  incidentTypeLabel,
} from "@/features/incidents/incident-display";
import type { Incident, IncidentStatus } from "@/types/incident";

type IncidentsQueryResult = {
  incidents: Incident[];
};

type DeleteIncidentResult = {
  deleteIncident: boolean;
};

type SortKey = "createdAt" | "title";

type StatusFilter = IncidentStatus | "ALL";

const PAGE_SIZE = 8;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function IncidentsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [incidentToDelete, setIncidentToDelete] = useState<Incident | null>(
    null,
  );
  const { data, loading, error, refetch } =
    useQuery<IncidentsQueryResult>(INCIDENTS_QUERY);
  const [deleteIncident, { loading: isDeleting }] = useMutation<
    DeleteIncidentResult,
    { id: string }
  >(DELETE_INCIDENT_MUTATION);

  const incidents = useMemo(
    () => data?.incidents ?? [],
    [data?.incidents],
  );
  const filteredIncidents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return incidents.filter((incident) => {
      const matchesStatus =
        statusFilter === "ALL" || incident.status === statusFilter;
      const matchesSearch =
        !normalizedSearch ||
        incident.title.toLowerCase().includes(normalizedSearch) ||
        (incident.address ?? "").toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [incidents, search, statusFilter]);
  const sortedIncidents = useMemo(() => {
    return [...filteredIncidents].sort((a, b) => {
      const aValue =
        sortKey === "createdAt"
          ? new Date(a.createdAt).getTime()
          : a.title.toLowerCase();
      const bValue =
        sortKey === "createdAt"
          ? new Date(b.createdAt).getTime()
          : b.title.toLowerCase();
      const result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredIncidents, sortDirection, sortKey]);
  const pageCount = Math.max(1, Math.ceil(sortedIncidents.length / PAGE_SIZE));
  const paginatedIncidents = sortedIncidents.slice(
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
    if (!incidentToDelete) return;

    try {
      const result = await deleteIncident({
        variables: { id: incidentToDelete.id },
        refetchQueries: [{ query: INCIDENTS_QUERY }],
        awaitRefetchQueries: true,
      });
      if (!result.data?.deleteIncident) {
        throw new Error("La suppression de l'incident a ete refusee.");
      }
      notify.success("Incident supprime.");
      setIncidentToDelete(null);
      setPage(1);
      await refetch();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossible de supprimer l'incident.",
      );
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Gestion des incidents
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal">
            Incidents
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Declarez, suivez et faites evoluer le statut des incidents routiers.
          </p>
        </div>
        <ButtonLink
          href="/incidents/declare"
          icon={<Plus className="size-4" aria-hidden="true" />}
        >
          Declarer un incident
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
            placeholder="Rechercher par titre ou adresse"
            leftIcon={<Search className="size-4" aria-hidden="true" />}
          />
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:w-52">
            <label
              className="block text-sm font-medium text-zinc-900"
              htmlFor="incident-status-filter"
            >
              Statut
            </label>
            <select
              id="incident-status-filter"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as StatusFilter);
                setPage(1);
              }}
              className="mt-2 h-11 w-full border border-border bg-white px-3 text-sm text-zinc-950 outline-none transition-all duration-200 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
            >
              <option value="ALL">Tous les statuts</option>
              {INCIDENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
      </div>

      <IncidentMap incidents={incidents} />

      {loading ? <TableSkeleton rows={6} /> : null}

      {error ? (
        <ErrorState
          title="Incidents indisponibles"
          message="Impossible de charger les incidents depuis la Gateway GraphQL."
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

      {!loading && !error && incidents.length === 0 ? (
        <EmptyState
          icon={<Siren className="size-5" aria-hidden="true" />}
          title="Aucun incident"
          message="Declarez un premier incident pour commencer le suivi."
          action={
            <ButtonLink href="/incidents/declare" size="sm">
              Declarer un incident
            </ButtonLink>
          }
        />
      ) : null}

      {!loading &&
      !error &&
      incidents.length > 0 &&
      filteredIncidents.length === 0 ? (
        <EmptyState
          icon={<Search className="size-5" aria-hidden="true" />}
          title="Aucun resultat"
          message="Aucun incident ne correspond a ces criteres."
        />
      ) : null}

      {!loading && !error && sortedIncidents.length > 0 ? (
        <Table>
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-normal text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <SortButton
                    label="Incident"
                    onClick={() => toggleSort("title")}
                  />
                </th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Statut</th>
                <th className="px-4 py-3 font-semibold">Position</th>
                <th className="px-4 py-3 font-semibold">
                  <SortButton
                    label="Declare le"
                    onClick={() => toggleSort("createdAt")}
                  />
                </th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedIncidents.map((incident) => (
                <tr
                  key={incident.id}
                  className="border-t border-border transition-colors hover:bg-zinc-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-zinc-950">
                      {incident.title}
                    </p>
                    {incident.address ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {incident.address}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <Badge>{incidentTypeLabel(incident.type)}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={incidentStatusTone(incident.status)}>
                      {incidentStatusLabel(incident.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {incident.latitude.toFixed(4)},{" "}
                    {incident.longitude.toFixed(4)}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(incident.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <ButtonLink
                        href={`/incidents/${incident.id}`}
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
                        onClick={() => setIncidentToDelete(incident)}
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
            onNext={() =>
              setPage((current) => Math.min(pageCount, current + 1))
            }
          />
        </Table>
      ) : null}

      <Modal
        open={Boolean(incidentToDelete)}
        title="Supprimer l'incident"
        description={`Cette action supprimera ${incidentToDelete?.title ?? "cet incident"} du suivi.`}
        confirmLabel="Supprimer"
        isLoading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onClose={() => setIncidentToDelete(null)}
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
