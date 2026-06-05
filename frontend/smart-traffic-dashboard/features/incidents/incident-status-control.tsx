"use client";

import { useMutation } from "@apollo/client/react";
import { type FormEvent, useState } from "react";
import { UPDATE_INCIDENT_STATUS_MUTATION } from "@/graphql/mutations/incident.mutations";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/toast";
import { INCIDENT_STATUS_OPTIONS } from "@/features/incidents/incident-display";
import type {
  Incident,
  IncidentStatus,
  UpdateIncidentStatusInput,
} from "@/types/incident";

type UpdateIncidentStatusResult = {
  updateIncidentStatus: Incident;
};

type IncidentStatusControlProps = {
  incidentId: string;
  currentStatus: IncidentStatus;
  onUpdated?: () => void;
};

export function IncidentStatusControl({
  incidentId,
  currentStatus,
  onUpdated,
}: IncidentStatusControlProps) {
  const [status, setStatus] = useState<IncidentStatus>(currentStatus);
  const [requestStatus, setRequestStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [updateIncidentStatus] = useMutation<
    UpdateIncidentStatusResult,
    { input: UpdateIncidentStatusInput }
  >(UPDATE_INCIDENT_STATUS_MUTATION);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === currentStatus) {
      notify.info("Le statut selectionne est deja le statut courant.");
      return;
    }

    setRequestStatus("loading");

    try {
      await updateIncidentStatus({
        variables: {
          input: { id: incidentId, status },
        },
      });
      setRequestStatus("success");
      notify.success("Statut de l'incident mis a jour.");
      onUpdated?.();
    } catch (updateError) {
      setRequestStatus("error");
      notify.error(
        updateError instanceof Error
          ? updateError.message
          : "Impossible de mettre a jour le statut.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:max-w-md"
    >
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-zinc-900"
          htmlFor="incident-status"
        >
          Statut
        </label>
        <select
          id="incident-status"
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as IncidentStatus)
          }
          className="h-11 w-full border border-border bg-white px-3 text-sm text-zinc-950 outline-none transition-all duration-200 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
        >
          {INCIDENT_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="submit"
        className="sm:mt-7"
        isLoading={requestStatus === "loading"}
      >
        {requestStatus === "loading" ? "Mise a jour..." : "Mettre a jour"}
      </Button>
    </form>
  );
}
