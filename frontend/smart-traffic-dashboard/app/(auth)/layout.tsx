import type { ReactNode } from "react";
import { Providers } from "@/app/providers";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Providers>
      <main className="grid min-h-dvh place-items-center bg-zinc-50 px-6">
        {children}
      </main>
    </Providers>
  );
}
