import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? (
        children
      ) : (
        <div className="border border-dashed border-border bg-white p-8 text-sm text-muted-foreground">
          Page en attente d&apos;implementation.
        </div>
      )}
    </section>
  );
}
