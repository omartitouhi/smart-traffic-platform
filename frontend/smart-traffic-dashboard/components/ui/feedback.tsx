import { AlertTriangle, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

type LoadingStateProps = {
  message: string;
};

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex min-h-40 items-center justify-center border border-border bg-white p-8 text-sm text-muted-foreground shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center gap-3">
        <Loader2 className="size-5 animate-spin text-zinc-700" aria-hidden="true" />
        <span>{message}</span>
      </div>
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({
  title = "Une erreur est survenue",
  message,
  action,
}: ErrorStateProps) {
  return (
    <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-800">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="leading-6">{message}</p>
          {action ? <div className="pt-2">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="border border-dashed border-border bg-white p-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center border border-border bg-muted text-zinc-700">
        {icon}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {message}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

type StatusMessageProps = {
  tone: "success" | "error";
  children: ReactNode;
};

export function StatusMessage({ tone, children }: StatusMessageProps) {
  const className =
    tone === "success"
      ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border border-red-200 bg-red-50 text-red-800";

  return <p className={`${className} p-3 text-sm font-medium`}>{children}</p>;
}

export function MetricCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <Card className="p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-normal text-zinc-950">
            {value}
          </p>
          {helper ? <p className="mt-2 text-sm text-muted-foreground">{helper}</p> : null}
        </div>
        <div className="grid size-11 place-items-center border border-border bg-zinc-50 text-zinc-800">
          {icon}
        </div>
      </div>
    </Card>
  );
}
