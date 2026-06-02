import type { ReactNode } from "react";
import { MainNavigation } from "@/components/navigation/main-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-50 text-zinc-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-white/95 lg:block">
          <div className="flex h-24 flex-col justify-center border-b border-border px-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center border border-zinc-950 bg-zinc-950 text-sm font-semibold text-white">
                ST
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Smart Traffic
                </p>
                <h1 className="text-base font-semibold">Operations Dashboard</h1>
              </div>
            </div>
          </div>
          <div className="p-4 pt-5">
            <MainNavigation variant="sidebar" />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-border bg-white/95 backdrop-blur lg:hidden">
            <div className="flex min-h-16 flex-col gap-3 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center border border-zinc-950 bg-zinc-950 text-xs font-semibold text-white">
                  ST
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Smart Traffic
                  </p>
                  <h1 className="text-base font-semibold">Operations Dashboard</h1>
                </div>
              </div>
              <MainNavigation variant="topbar" />
            </div>
          </header>
          <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
