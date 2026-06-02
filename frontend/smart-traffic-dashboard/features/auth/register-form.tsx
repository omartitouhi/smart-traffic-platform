"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notify } from "@/components/ui/toast";
import type { RegisterInput } from "@/types/auth";

type FormErrors = Partial<Record<keyof RegisterInput, string>>;

function validateRegister(values: RegisterInput) {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) errors.firstName = "Le prenom est obligatoire.";
  if (!values.lastName.trim()) errors.lastName = "Le nom est obligatoire.";

  if (!values.email.trim()) {
    errors.email = "L'email est obligatoire.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "L'email doit etre valide.";
  }

  if (!values.password) {
    errors.password = "Le mot de passe est obligatoire.";
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(
      values.password,
    )
  ) {
    errors.password =
      "Le mot de passe doit contenir 8 caracteres, une majuscule, une minuscule, un chiffre et un symbole.";
  }

  return errors;
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [values, setValues] = useState<RegisterInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  function updateField(field: keyof RegisterInput, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(validateRegister(nextValues));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      await register({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      setStatus("success");
      notify.success("Compte cree avec succes.");
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      notify.error(error instanceof Error ? error.message : "Impossible de creer le compte.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Prenom"
          id="firstName"
          autoComplete="given-name"
          value={values.firstName}
          error={errors.firstName}
          onChange={(event) => updateField("firstName", event.target.value)}
        />
        <Input
          label="Nom"
          id="lastName"
          autoComplete="family-name"
          value={values.lastName}
          error={errors.lastName}
          onChange={(event) => updateField("lastName", event.target.value)}
        />
      </div>

      <Input
        label="Email"
        id="email"
        type="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => updateField("email", event.target.value)}
      />

      <Input
        label="Mot de passe"
        id="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        error={errors.password}
        hint="Minimum 8 caracteres avec majuscule, minuscule, chiffre et symbole."
        onChange={(event) => updateField("password", event.target.value)}
      />

      <Button
        type="submit"
        isLoading={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Creation..." : "Creer le compte"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Deja un compte ?{" "}
        <Link className="font-medium text-zinc-950 underline-offset-4 hover:underline" href="/login">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
