"use client";

import { Eye, EyeOff } from "lucide-react";
import {
  InputHTMLAttributes,
  ReactNode,
  useId,
  useState,
} from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
};

export function Input({
  label,
  error,
  hint,
  leftIcon,
  id,
  type,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-900" htmlFor={inputId}>
        {label}
      </label>
      <div className="relative">
        {leftIcon ? (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        ) : null}
        <input
          id={inputId}
          type={inputType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={cn(
            "h-11 w-full border bg-white px-3 text-sm text-zinc-950 outline-none transition-all duration-200 placeholder:text-zinc-400 focus:border-zinc-950 focus:ring-4 focus:ring-zinc-950/5",
            Boolean(leftIcon) && "pl-10",
            isPassword && "pr-11",
            error ? "border-red-300 focus:border-red-600 focus:ring-red-600/10" : "border-border",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center text-zinc-500 transition-colors hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"
            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-sm font-medium text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
