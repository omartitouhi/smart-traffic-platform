import {
  ApolloClient,
  CombinedGraphQLErrors,
  InMemoryCache,
} from "@apollo/client";
import { ApolloLink } from "@apollo/client/link";
import { ErrorLink } from "@apollo/client/link/error";
import { HttpLink } from "@apollo/client/link/http";
import { SetContextLink } from "@apollo/client/link/context";
import { Observable } from "rxjs";
import { GRAPHQL_GATEWAY_URL } from "@/lib/config";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth-token-storage";

type RefreshTokenResponse = {
  data?: {
    refreshToken?: {
      accessToken: string;
      refreshToken: string;
    };
  };
};

const refreshTokenMutation = `
  mutation RefreshToken($input: RefreshTokenInput!) {
    refreshToken(input: $input) {
      accessToken
      refreshToken
    }
  }
`;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken || !GRAPHQL_GATEWAY_URL) return null;

  const response = await fetch(GRAPHQL_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: refreshTokenMutation,
      variables: {
        input: {
          refreshToken,
        },
      },
    }),
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as RefreshTokenResponse;
  const tokens = payload.data?.refreshToken;
  if (!tokens) return null;

  setAuthTokens(tokens);
  return tokens.accessToken;
}

const authLink = new SetContextLink((prevContext) => {
  const accessToken = getAccessToken();

  return {
    headers: {
      ...prevContext.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  };
});

const refreshLink = new ErrorLink(({ error, operation, forward }) => {
  if (!CombinedGraphQLErrors.is(error)) return;

  const isUnauthenticated = error.errors.some(
    (graphQLError) => graphQLError.extensions?.code === "UNAUTHENTICATED",
  );

  if (!isUnauthenticated) return;

  return new Observable((observer) => {
    refreshAccessToken()
      .then((accessToken) => {
        if (!accessToken) {
          clearAuthTokens();
          observer.error(error);
          return;
        }

        operation.setContext(({ headers = {} }) => ({
          headers: {
            ...headers,
            Authorization: `Bearer ${accessToken}`,
          },
        }));

        forward(operation).subscribe(observer);
      })
      .catch((refreshError: unknown) => {
        clearAuthTokens();
        observer.error(refreshError);
      });
  });
});

const httpLink = new HttpLink({
  uri: GRAPHQL_GATEWAY_URL,
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([refreshLink, authLink, httpLink]),
});
