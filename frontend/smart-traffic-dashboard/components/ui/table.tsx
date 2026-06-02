import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden border border-border bg-white", className)}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function TablePagination({
  page,
  pageCount,
  onPrevious,
  onNext,
}: {
  page: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-border bg-white px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>
        Page {page} sur {pageCount}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={page <= 1}
          className="h-9 border border-border px-3 font-medium text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
        >
          Precedent
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= pageCount}
          className="h-9 border border-border px-3 font-medium text-zinc-800 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
