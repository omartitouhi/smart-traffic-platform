import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "danger";
  className?: string;
};

const toneClass = {
  default: "border-border bg-zinc-50 text-zinc-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2.5 py-1 text-xs font-semibold",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function vehicleStatusTone(status: string): BadgeProps["tone"] {
  const normalized = status.toLowerCase();
  if (["active", "available", "online", "ok"].includes(normalized)) return "success";
  if (["maintenance", "pending"].includes(normalized)) return "warning";
  if (["inactive", "disabled", "offline"].includes(normalized)) return "danger";
  return "default";
}
