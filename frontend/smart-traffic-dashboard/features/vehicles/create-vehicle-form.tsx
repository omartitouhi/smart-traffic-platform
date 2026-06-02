"use client";

import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CREATE_VEHICLE_MUTATION } from "@/graphql/mutations/vehicle.mutations";
import { StatusMessage } from "@/components/ui/feedback";
import type { CreateVehicleInput, Vehicle } from "@/types/vehicle";

type CreateVehicleResult = {
  createVehicle: Vehicle;
};

type FormErrors = Partial<Record<keyof CreateVehicleInput, string>>;

const initialValues: CreateVehicleInput = {
  matricule: "",
  brand: "",
  model: "",
  type: "",
  status: "",
};

function validateVehicle(values: CreateVehicleInput) {
  const errors: FormErrors = {};

  if (!values.matricule.trim()) {
    errors.matricule = "Le matricule est obligatoire.";
  } else if (values.matricule.trim().length > 50) {
    errors.matricule = "Le matricule ne doit pas depasser 50 caracteres.";
  } else if (!/^[A-Z0-9-]+$/.test(values.matricule.trim().toUpperCase())) {
    errors.matricule =
      "Le matricule doit contenir uniquement des lettres, chiffres ou tirets.";
  }

  if (!values.brand.trim()) {
    errors.brand = "La marque est obligatoire.";
  } else if (values.brand.trim().length > 100) {
    errors.brand = "La marque ne doit pas depasser 100 caracteres.";
  }

  if (!values.model.trim()) {
    errors.model = "Le modele est obligatoire.";
  } else if (values.model.trim().length > 100) {
    errors.model = "Le modele ne doit pas depasser 100 caracteres.";
  }

  if (!values.type.trim()) {
    errors.type = "Le type est obligatoire.";
  } else if (values.type.trim().length > 50) {
    errors.type = "Le type ne doit pas depasser 50 caracteres.";
  }

  if (!values.status.trim()) {
    errors.status = "Le statut est obligatoire.";
  } else if (values.status.trim().length > 50) {
    errors.status = "Le statut ne doit pas depasser 50 caracteres.";
  }

  return errors;
}

export function CreateVehicleForm() {
  const router = useRouter();
  const [values, setValues] = useState<CreateVehicleInput>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [createVehicle] = useMutation<
    CreateVehicleResult,
    { input: CreateVehicleInput }
  >(CREATE_VEHICLE_MUTATION);

  function updateField(field: keyof CreateVehicleInput, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateVehicle(values);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      await createVehicle({
        variables: {
          input: {
            matricule: values.matricule.trim().toUpperCase(),
            brand: values.brand.trim(),
            model: values.model.trim(),
            type: values.type.trim(),
            status: values.status.trim(),
          },
        },
      });
      setStatus("success");
      setMessage("Vehicule cree avec succes.");
      router.replace("/vehicles");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Impossible de creer le vehicule.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Vehicle Management
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal">
          Ajouter un vehicule
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Renseignez les informations principales du vehicule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="border border-border bg-white p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <VehicleField
            id="matricule"
            label="Matricule"
            value={values.matricule}
            error={errors.matricule}
            onChange={(value) => updateField("matricule", value)}
          />
          <VehicleField
            id="brand"
            label="Brand"
            value={values.brand}
            error={errors.brand}
            onChange={(value) => updateField("brand", value)}
          />
          <VehicleField
            id="model"
            label="Model"
            value={values.model}
            error={errors.model}
            onChange={(value) => updateField("model", value)}
          />
          <VehicleField
            id="type"
            label="Type"
            value={values.type}
            error={errors.type}
            onChange={(value) => updateField("type", value)}
          />
          <VehicleField
            id="status"
            label="Status"
            value={values.status}
            error={errors.status}
            onChange={(value) => updateField("status", value)}
          />
        </div>

        {message ? (
          <div className="mt-5">
            <StatusMessage tone={status === "success" ? "success" : "error"}>
              {message}
            </StatusMessage>
          </div>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/vehicles"
            className="inline-flex h-11 items-center justify-center border border-border px-4 text-sm font-medium text-zinc-800 transition-colors hover:bg-muted"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex h-11 items-center justify-center bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            {status === "loading" ? "Creation..." : "Creer vehicule"}
          </button>
        </div>
      </form>
    </section>
  );
}

type VehicleFieldProps = {
  id: keyof CreateVehicleInput;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

function VehicleField({ id, label, value, error, onChange }: VehicleFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-zinc-900"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
