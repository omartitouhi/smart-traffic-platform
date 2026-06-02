"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { LoadingState } from "@/components/ui/feedback";

type PrivateRouteProps = {
  children: ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing) {
    return (
      <div className="grid min-h-dvh place-items-center bg-zinc-50 p-6">
        <div className="w-full max-w-md">
          <LoadingState message="Verification de votre session..." />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
}
