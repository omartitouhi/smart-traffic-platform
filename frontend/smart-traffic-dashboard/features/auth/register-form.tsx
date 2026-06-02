"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { StatusMessage } from "@/components/ui/feedback";
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
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);
    setMessage("");

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
      setMessage("Compte cree avec succes.");
      router.replace("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Impossible de creer le compte.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="firstName">
            Prenom
          </label>
          <input
            id="firstName"
            autoComplete="given-name"
            value={values.firstName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                firstName: event.target.value,
              }))
            }
            className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-zinc-900"
          />
          {errors.firstName ? (
            <p className="text-sm text-red-600">{errors.firstName}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="lastName">
            Nom
          </label>
          <input
            id="lastName"
            autoComplete="family-name"
            value={values.lastName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                lastName: event.target.value,
              }))
            }
            className="h-11 w-full border border-border bg-white px-3 text-sm outline-none focus:border-zinc-900"
          />
          {errors.lastName ? (
            <p className="text-sm text-red-600">{errors.lastName}</p>
          ) : null}
        </div>
      </div>

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
          autoComplete="new-password"
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
        {status === "loading" ? "Creation..." : "Creer le compte"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        Deja un compte ?{" "}
        <Link className="font-medium text-zinc-950" href="/login">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
