import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { logoutAuth, logoutGuestSession, startGuestSession, type AuthUser } from '@/features/auth/api/auth-api';
import { useAuthUser } from '@/features/auth/api/use-auth';

export type LocalUser = AuthUser;

const GUEST_KEY = 'filamentos_guest_session';
const GUEST_PROJECT_KEY = 'filamentos_guest_pending_project';

interface AuthContextType {
  // Estado de autenticación
  user: LocalUser | null;
  isAuthenticated: boolean;    // tiene cuenta real activa
  isGuest: boolean;            // está en modo invitado real
  guestId: string | null;
  loading: boolean;            // alias de isLoading para compatibilidad
  isLoading: boolean;

  // Acciones
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  startGuest: () => Promise<void>;
  exitGuest: () => Promise<void>;
  saveGuestProjectDraft: (project: unknown) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: authState, isLoading, refetch } = useAuthUser();
  const user = authState?.user ?? null;
  const serverGuest = authState?.guest ?? null;

  const [guestId, setGuestId] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem(GUEST_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { id?: string; expiresAt?: number };
      if (parsed.expiresAt && parsed.expiresAt <= Date.now()) {
        localStorage.removeItem(GUEST_KEY);
        return null;
      }
      return parsed.id ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (serverGuest?.id) setGuestId(serverGuest.id);
  }, [serverGuest?.id]);

  // Si el usuario se autentica con una cuenta real, limpiar guest y migrar borrador si existe
  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(GUEST_PROJECT_KEY);
      localStorage.removeItem(GUEST_KEY);
      setGuestId(null);
      if (!raw) return;
      const project = JSON.parse(raw);
      fetch('/api/projects/migrate-guest', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      }).then((res) => {
        if (res.ok) localStorage.removeItem(GUEST_PROJECT_KEY);
      }).catch(() => {});
    } catch {
      localStorage.removeItem(GUEST_PROJECT_KEY);
    }
  }, [user]);

  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  const logout = useCallback(async () => {
    await logoutAuth();
    setGuestId(null);
    try { localStorage.removeItem(GUEST_KEY); } catch { /* noop */ }
    window.location.href = '/';
  }, []);

  const startGuest = useCallback(async () => {
    const guest = await startGuestSession();
    setGuestId(guest.id);
    try { localStorage.setItem(GUEST_KEY, JSON.stringify(guest)); } catch { /* noop */ }
    await refetch();
  }, [refetch]);

  const exitGuest = useCallback(async () => {
    await logoutGuestSession().catch(() => {});
    try { localStorage.removeItem(GUEST_KEY); } catch { /* noop */ }
    setGuestId(null);
  }, []);

  const saveGuestProjectDraft = useCallback((project: unknown) => {
    try { localStorage.setItem(GUEST_PROJECT_KEY, JSON.stringify(project)); } catch { /* noop */ }
  }, []);

  const resolvedUser = user ?? null;
  const isAuthenticated = !isLoading && resolvedUser !== null;
  const isGuest = !isAuthenticated && guestId !== null;

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        isAuthenticated,
        isGuest,
        guestId,
        loading: isLoading,
        isLoading,
        loginWithGoogle,
        logout,
        startGuest,
        exitGuest,
        saveGuestProjectDraft,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
