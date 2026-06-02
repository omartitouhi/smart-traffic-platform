import type { ReactNode } from "react";
import { MainNavigation } from "@/components/navigation/main-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Smart Traffic
            </p>
            <h1 className="text-lg font-semibold">Operations Dashboard</h1>
          </div>
          <MainNavigation />
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
