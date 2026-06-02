import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/layout/app-shell";

type MainAppLayoutProps = {
  children: ReactNode;
};

export default function MainAppLayout({ children }: MainAppLayoutProps) {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
