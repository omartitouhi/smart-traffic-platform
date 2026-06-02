import type { ReactNode } from "react";
import { MainNavigation } from "@/components/navigation/main-navigation";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-dvh bg-zinc-50">
      <div className="mx-auto flex min-h-dvh w-full max-w-[1440px]">
        <aside className="hidden w-72 shrink-0 border-r border-border bg-white lg:block">
          <div className="flex h-20 flex-col justify-center border-b border-border px-6">
            <p className="text-sm font-medium text-muted-foreground">
              Smart Traffic
            </p>
            <h1 className="text-lg font-semibold">Operations Dashboard</h1>
          </div>
          <div className="p-4">
            <MainNavigation variant="sidebar" />
          </div>
        </aside>
        <div className="min-w-0 flex-1">
          <header className="border-b border-border bg-white lg:hidden">
            <div className="flex min-h-16 flex-col gap-3 px-4 py-4 sm:px-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Smart Traffic
                </p>
                <h1 className="text-lg font-semibold">Operations Dashboard</h1>
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
