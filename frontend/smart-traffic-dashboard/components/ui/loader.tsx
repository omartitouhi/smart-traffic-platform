import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} aria-hidden="true" />;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-zinc-100", className)} />;
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-border bg-white">
      <div className="space-y-3 p-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-12 gap-3">
            <Skeleton className="col-span-3 h-5" />
            <Skeleton className="col-span-2 h-5" />
            <Skeleton className="col-span-2 h-5" />
            <Skeleton className="col-span-2 h-5" />
            <Skeleton className="col-span-3 h-5" />
          </div>
        ))}
      </div>
    </div>
  );
}
