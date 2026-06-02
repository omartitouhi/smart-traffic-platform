"use client";

import { ApolloProvider } from "@apollo/client/react";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/auth-provider";
import { apolloClient } from "@/lib/apollo-client";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  );
}
