import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

const graphqlUri =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? "http://localhost:3000/graphql";

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: graphqlUri,
  }),
});
