"use client";

import { useMutation } from "@apollo/client/react";
import { ArrowLeft, MapPinned } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { DECLARE_INCIDENT_MUTATION } from "@/graphql/mutations/incident.mutations";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/components/ui/toast";
import { INCIDENT_TYPE_OPTIONS } from "@/features/incidents/incident-display";
import type {
  CreateIncidentInput,
  Incident,
  IncidentType,
} from "@/types/incident";

type DeclareIncidentResult = {
  declareIncident: Incident;
};

type FormValues = {
  title: string;
  description: string;
  type: IncidentType;
  latitude: string;
  longitude: string;
  address: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  title: "",
  description: "",
  type: "ACCIDENT",
  latitude: "",
  longitude: "",
  address: "",
};

function parseNumber(value: string) {
  return Number(value.replace(",", "."));
}

function validateIncident(values: FormValues) {
  const errors: FormErrors = {};
  const latitude = parseNumber(values.latitude);
  const longitude = parseNumber(values.longitude);

  if (!values.title.trim()) {
    errors.title = "Le titre est obligatoire.";
  } else if (values.title.trim().length > 200) {
    errors.title = "Le titre ne doit pas depasser 200 caracteres.";
  }

  if (values.description.trim().length > 2000) {
    errors.description = "La description ne doit pas depasser 2000 caracteres.";
  }

  if (!values.latitude.trim()) {
    errors.latitude = "La latitude est obligatoire.";
  } else if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    errors.latitude = "La latitude doit etre comprise entre -90 et 90.";
  }

  if (!values.longitude.trim()) {
    errors.longitude = "La longitude est obligatoire.";
  } else if (
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.longitude = "La longitude doit etre comprise entre -180 et 180.";
  }

  if (values.address.trim().length > 300) {
    errors.address = "L'adresse ne doit pas depasser 300 caracteres.";
  }

  return errors;
}

function toInput(values: FormValues): CreateIncidentInput {
  return {
    title: values.title.trim(),
    description: values.description.trim() || undefined,
    type: values.type,
    latitude: parseNumber(values.latitude),
    longitude: parseNumber(values.longitude),
    address: values.address.trim() || undefined,
  };
}

export function DeclareIncidentForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [declareIncident] = useMutation<
    DeclareIncidentResult,
    { input: CreateIncidentInput }
  >(DECLARE_INCIDENT_MUTATION);

  function updateField(field: keyof FormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(validateIncident(nextValues));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateIncident(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      await declareIncident({
        variables: {
          input: toInput(values),
        },
      });
      setStatus("success");
      notify.success("Incident declare avec succes.");
      router.replace("/incidents");
    } catch (declareError) {
      setStatus("error");
      notify.error(
        declareError instanceof Error
          ? declareError.message
          : "Impossible de declarer l'incident.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <ButtonLink
          href="/incidents"
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="size-4" aria-hidden="true" />}
        >
          Retour
        </ButtonLink>
        <p className="mt-6 text-sm font-medium text-muted-foreground">
          Gestion des incidents
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal">
          Declarer un incident
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Renseignez le type, la position et les details de l&apos;incident.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="incident-title"
              label="Titre"
              value={values.title}
              error={errors.title}
              onChange={(event) => updateField("title", event.target.value)}
              leftIcon={<MapPinned className="size-4" aria-hidden="true" />}
            />
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-zinc-900"
                htmlFor="incident-type"
              >
                Type
              </label>
              <select
                id="incident-type"
                value={values.type}
                onChange={(event) => updateField("type", event.target.value)}
                className="h-11 w-full border border-border bg-white px-3 text-sm text-zinc-950 outline-none transition-all duration-200 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5"
              >
                {INCIDENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              id="incident-description"
              label="Description"
              value={values.description}
              error={errors.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
            <Input
              id="incident-address"
              label="Adresse"
              value={values.address}
              error={errors.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
            <Input
              id="incident-latitude"
              label="Latitude"
              type="number"
              step="any"
              value={values.latitude}
              error={errors.latitude}
              onChange={(event) => updateField("latitude", event.target.value)}
            />
            <Input
              id="incident-longitude"
              label="Longitude"
              type="number"
              step="any"
              value={values.longitude}
              error={errors.longitude}
              onChange={(event) =>
                updateField("longitude", event.target.value)
              }
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <ButtonLink href="/incidents" variant="secondary">
              Annuler
            </ButtonLink>
            <Button type="submit" isLoading={status === "loading"}>
              {status === "loading" ? "Declaration..." : "Declarer l'incident"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
