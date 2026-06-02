import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/layout/app-shell";
import { PrivateRoute } from "@/features/auth/private-route";

type MainAppLayoutProps = {
  children: ReactNode;
};

export default function MainAppLayout({ children }: MainAppLayoutProps) {
  return (
    <Providers>
      <PrivateRoute>
        <AppShell>{children}</AppShell>
      </PrivateRoute>
    </Providers>
  );
}
