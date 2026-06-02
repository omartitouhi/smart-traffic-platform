"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  REGISTER_MUTATION,
} from "@/graphql/mutations/auth.mutations";
import { ME_QUERY } from "@/graphql/queries/auth.queries";
import { apolloClient } from "@/lib/apollo-client";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth-token-storage";
import type { AuthPayload, AuthUser, LoginInput, RegisterInput } from "@/types/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (input: LoginInput) => Promise<AuthPayload>;
  register: (input: RegisterInput) => Promise<AuthPayload>;
  logout: () => Promise<void>;
};

type AuthProviderProps = {
  children: ReactNode;
};

type AuthResult = {
  login?: AuthPayload;
  register?: AuthPayload;
};

type MeResult = {
  me: AuthUser;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [runLogin] = useMutation<AuthResult, { input: LoginInput }>(LOGIN_MUTATION);
  const [runRegister] = useMutation<AuthResult, { input: RegisterInput }>(
    REGISTER_MUTATION,
  );
  const [runLogout] = useMutation<{ logout: boolean }, { input: { refreshToken: string } }>(
    LOGOUT_MUTATION,
  );

  useEffect(() => {
    let isMounted = true;

    async function initializeSession() {
      await Promise.resolve();

      const accessToken = getAccessToken();
      if (!accessToken) {
        if (isMounted) setIsHydrated(true);
        return;
      }

      if (isMounted) setHasToken(true);

      try {
        const result = await apolloClient.query<MeResult>({
          query: ME_QUERY,
          fetchPolicy: "network-only",
        });
        if (!result.data?.me) {
          throw new Error("Profil introuvable.");
        }
        if (isMounted) setUser(result.data.me);
      } catch {
        clearAuthTokens();
        if (isMounted) {
          setHasToken(false);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsHydrated(true);
      }
    }

    void initializeSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const persistAuthPayload = useCallback((payload: AuthPayload) => {
    setAuthTokens({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    });
    setUser(payload.user);
    setHasToken(true);
  }, []);

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await runLogin({ variables: { input } });
      const payload = result.data?.login;

      if (!payload) {
        throw new Error("La connexion a echoue.");
      }

      persistAuthPayload(payload);
      return payload;
    },
    [persistAuthPayload, runLogin],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      const result = await runRegister({ variables: { input } });
      const payload = result.data?.register;

      if (!payload) {
        throw new Error("La creation du compte a echoue.");
      }

      persistAuthPayload(payload);
      return payload;
    },
    [persistAuthPayload, runRegister],
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      await runLogout({
        variables: {
          input: {
            refreshToken,
          },
        },
      }).catch(() => undefined);
    }

    clearAuthTokens();
    setUser(null);
    setHasToken(false);
    router.replace("/login");
  }, [router, runLogout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user && hasToken),
      isInitializing: !isHydrated,
      login,
      register,
      logout,
    }),
    [hasToken, isHydrated, login, logout, register, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }

  return context;
}
