import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { services } from "@/services";
import type { AuthUser, Permission, Session } from "@/types";

interface AuthContextValue {
  session: Session | null;
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    services.auth
      .currentSession()
      .then((value) => {
        if (active) setSession(value);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const next = await services.auth.signIn(email, password);
    setSession(next);
  }, []);

  const signOut = useCallback(async () => {
    await services.auth.signOut();
    setSession(null);
  }, []);

  const can = useCallback(
    (permission: Permission) => Boolean(session?.user.permissions.includes(permission)),
    [session],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, loading, signIn, signOut, can }),
    [session, loading, signIn, signOut, can],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return context;
}
