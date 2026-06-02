"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notify } from "@/components/ui/toast";
import type { LoginInput } from "@/types/auth";

type FormErrors = Partial<Record<keyof LoginInput, string>>;

function validateLogin(values: LoginInput) {
  const errors: FormErrors = {};

  if (!values.email.trim()) {
    errors.email = "L'email est obligatoire.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "L'email doit etre valide.";
  }

  if (!values.password) {
    errors.password = "Le mot de passe est obligatoire.";
  }

  return errors;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [values, setValues] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  function updateField(field: keyof LoginInput, value: string) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    setErrors(validateLogin(nextValues));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      setStatus("success");
      notify.success("Connexion reussie.");
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      notify.error(error instanceof Error ? error.message : "Impossible de se connecter.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        autoComplete="current-password"
        value={values.password}
        error={errors.password}
        onChange={(event) => updateField("password", event.target.value)}
      />

      <Button
        type="submit"
        isLoading={status === "loading"}
        className="w-full"
      >
        {status === "loading" ? "Connexion..." : "Se connecter"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link className="font-medium text-zinc-950 underline-offset-4 hover:underline" href="/register">
          Creer un compte
        </Link>
      </p>
    </form>
  );
}
