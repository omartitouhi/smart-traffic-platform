"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { StatusMessage } from "@/components/ui/feedback";
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
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");

    try {
      await login({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      setStatus("success");
      setMessage("Connexion reussie.");
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Impossible de se connecter.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-zinc-900"
        />
        {errors.email ? (
          <p className="text-sm text-red-600">{errors.email}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
          className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-zinc-900"
        />
        {errors.password ? (
          <p className="text-sm text-red-600">{errors.password}</p>
        ) : null}
      </div>

      {message ? (
        <StatusMessage tone={status === "success" ? "success" : "error"}>
          {message}
        </StatusMessage>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 w-full bg-zinc-950 px-4 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
      >
        {status === "loading" ? "Connexion..." : "Se connecter"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link className="font-medium text-zinc-950" href="/register">
          Creer un compte
        </Link>
      </p>
    </form>
  );
}
