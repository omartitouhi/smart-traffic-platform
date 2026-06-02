"use client";

import { ApolloProvider } from "@apollo/client/react";
import type { ReactNode } from "react";
import { apolloClient } from "@/lib/apollo-client";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
