"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CREATE_VEHICLE_MUTATION } from "@/graphql/mutations/vehicle.mutations";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { notify } from "@/components/ui/toast";
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [createVehicle] = useMutation<
    CreateVehicleResult,
    { input: CreateVehicleInput }
  >(CREATE_VEHICLE_MUTATION);

  function updateField(field: keyof CreateVehicleInput, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(validateVehicle(nextValues));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateVehicle(values);
    setErrors(nextErrors);

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
      notify.success("Vehicule cree avec succes.");
      router.replace("/vehicles");
    } catch (error) {
      setStatus("error");
      notify.error(error instanceof Error ? error.message : "Impossible de creer le vehicule.");
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

      <Card>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="matricule"
            label="Matricule"
            value={values.matricule}
            error={errors.matricule}
            onChange={(event) => updateField("matricule", event.target.value)}
          />
          <Input
            id="brand"
            label="Brand"
            value={values.brand}
            error={errors.brand}
            onChange={(event) => updateField("brand", event.target.value)}
          />
          <Input
            id="model"
            label="Model"
            value={values.model}
            error={errors.model}
            onChange={(event) => updateField("model", event.target.value)}
          />
          <Input
            id="type"
            label="Type"
            value={values.type}
            error={errors.type}
            onChange={(event) => updateField("type", event.target.value)}
          />
          <Input
            id="status"
            label="Status"
            value={values.status}
            error={errors.status}
            onChange={(event) => updateField("status", event.target.value)}
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ButtonLink
            href="/vehicles"
            variant="secondary"
          >
            Annuler
          </ButtonLink>
          <Button
            type="submit"
            isLoading={status === "loading"}
          >
            {status === "loading" ? "Creation..." : "Creer vehicule"}
          </Button>
        </div>
      </form>
      </Card>
    </section>
  );
}
