"use client";

import { useMutation } from "@apollo/client/react";
import { ArrowLeft, MapPinned } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { CREATE_TRAFFIC_ZONE_MUTATION } from "@/graphql/mutations/traffic.mutations";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/components/ui/toast";
import type { CreateTrafficZoneInput, TrafficZone } from "@/types/traffic";

type CreateTrafficZoneResult = {
  createTrafficZone: TrafficZone;
};

type FormValues = {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  radius: string;
  vehicleCount: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  description: "",
  latitude: "",
  longitude: "",
  radius: "",
  vehicleCount: "0",
};

function parseNumber(value: string) {
  return Number(value.replace(",", "."));
}

function validateTrafficZone(values: FormValues) {
  const errors: FormErrors = {};
  const latitude = parseNumber(values.latitude);
  const longitude = parseNumber(values.longitude);
  const radius = parseNumber(values.radius);
  const vehicleCount = Number(values.vehicleCount);

  if (!values.name.trim()) {
    errors.name = "Le nom de la zone est obligatoire.";
  } else if (values.name.trim().length > 100) {
    errors.name = "Le nom ne doit pas depasser 100 caracteres.";
  }

  if (values.description.trim().length > 500) {
    errors.description = "La description ne doit pas depasser 500 caracteres.";
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

  if (!values.radius.trim()) {
    errors.radius = "Le rayon est obligatoire.";
  } else if (!Number.isFinite(radius) || radius <= 0) {
    errors.radius = "Le rayon doit etre superieur a 0.";
  }

  if (!values.vehicleCount.trim()) {
    errors.vehicleCount = "Le nombre de vehicules est obligatoire.";
  } else if (
    !Number.isInteger(vehicleCount) ||
    !Number.isFinite(vehicleCount) ||
    vehicleCount < 0
  ) {
    errors.vehicleCount =
      "Le nombre de vehicules doit etre un entier positif ou nul.";
  }

  return errors;
}

function toInput(values: FormValues): CreateTrafficZoneInput {
  return {
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    latitude: parseNumber(values.latitude),
    longitude: parseNumber(values.longitude),
    radius: parseNumber(values.radius),
    vehicleCount: Number(values.vehicleCount),
  };
}

export function CreateTrafficZoneForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [createTrafficZone] = useMutation<
    CreateTrafficZoneResult,
    { input: CreateTrafficZoneInput }
  >(CREATE_TRAFFIC_ZONE_MUTATION);

  function updateField(field: keyof FormValues, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(validateTrafficZone(nextValues));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateTrafficZone(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      await createTrafficZone({
        variables: {
          input: toInput(values),
        },
      });
      setStatus("success");
      notify.success("Zone de circulation creee avec succes.");
      router.replace("/traffic");
    } catch (createError) {
      setStatus("error");
      notify.error(
        createError instanceof Error
          ? createError.message
          : "Impossible de creer la zone.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <ButtonLink
          href="/traffic"
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="size-4" aria-hidden="true" />}
        >
          Retour
        </ButtonLink>
        <p className="mt-6 text-sm font-medium text-muted-foreground">
          Traffic Management
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal">
          Ajouter une zone
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Definissez la position, le rayon et le volume initial de trafic.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              id="traffic-name"
              label="Nom"
              value={values.name}
              error={errors.name}
              onChange={(event) => updateField("name", event.target.value)}
              leftIcon={<MapPinned className="size-4" aria-hidden="true" />}
            />
            <Input
              id="traffic-description"
              label="Description"
              value={values.description}
              error={errors.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
            />
            <Input
              id="traffic-latitude"
              label="Latitude"
              type="number"
              step="any"
              value={values.latitude}
              error={errors.latitude}
              onChange={(event) => updateField("latitude", event.target.value)}
            />
            <Input
              id="traffic-longitude"
              label="Longitude"
              type="number"
              step="any"
              value={values.longitude}
              error={errors.longitude}
              onChange={(event) => updateField("longitude", event.target.value)}
            />
            <Input
              id="traffic-radius"
              label="Rayon"
              type="number"
              step="any"
              min="0"
              value={values.radius}
              error={errors.radius}
              onChange={(event) => updateField("radius", event.target.value)}
            />
            <Input
              id="traffic-vehicle-count"
              label="Nombre de vehicules"
              type="number"
              step="1"
              min="0"
              value={values.vehicleCount}
              error={errors.vehicleCount}
              onChange={(event) =>
                updateField("vehicleCount", event.target.value)
              }
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <ButtonLink href="/traffic" variant="secondary">
              Annuler
            </ButtonLink>
            <Button type="submit" isLoading={status === "loading"}>
              {status === "loading" ? "Creation..." : "Creer zone"}
            </Button>
          </div>
        </form>
      </Card>
    </section>
  );
}
