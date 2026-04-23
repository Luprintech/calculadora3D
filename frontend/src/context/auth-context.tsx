import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { logoutAuth, type AuthUser } from '@/features/auth/api/auth-api';
import { useAuthUser } from '@/features/auth/api/use-auth';

export type LocalUser = AuthUser;

const DEMO_KEY = 'filamentos_demo_mode';

interface AuthContextType {
  // Estado de autenticación
  user: LocalUser | null;
  isAuthenticated: boolean;    // tiene cuenta real activa
  isDemoMode: boolean;         // está en modo demo
  isGuest: boolean;            // isAuthenticated || isDemoMode (puede usar la app)
  loading: boolean;            // alias de isLoading para compatibilidad
  isLoading: boolean;

  // Acciones
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useAuthUser();

  // Inicializar isDemoMode desde localStorage
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DEMO_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Si el usuario se autentica con una cuenta real, limpiar el modo demo
  useEffect(() => {
    if (user && isDemoMode) {
      setIsDemoMode(false);
      try { localStorage.removeItem(DEMO_KEY); } catch { /* noop */ }
    }
  }, [user, isDemoMode]);

  const loginWithGoogle = useCallback(() => {
    window.location.href = '/api/auth/google';
  }, []);

  const logout = useCallback(async () => {
    await logoutAuth();
    setIsDemoMode(false);
    try { localStorage.removeItem(DEMO_KEY); } catch { /* noop */ }
    window.location.href = '/';
  }, []);

  const enterDemoMode = useCallback(() => {
    try { localStorage.setItem(DEMO_KEY, 'true'); } catch { /* noop */ }
    setIsDemoMode(true);
  }, []);

  const exitDemoMode = useCallback(() => {
    try { localStorage.removeItem(DEMO_KEY); } catch { /* noop */ }
    setIsDemoMode(false);
  }, []);

  const resolvedUser = user ?? null;
  const isAuthenticated = !isLoading && resolvedUser !== null;
  const isGuest = isAuthenticated || isDemoMode;

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        isAuthenticated,
        isDemoMode,
        isGuest,
        loading: isLoading,
        isLoading,
        loginWithGoogle,
        logout,
        enterDemoMode,
        exitDemoMode,
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
