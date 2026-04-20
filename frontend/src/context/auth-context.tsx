import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuthUser, logoutAuth, type AuthUser } from '@/features/auth/api/auth-api';
import { useAuthUser } from '@/features/auth/api/use-auth';

export type LocalUser = AuthUser;

interface AuthContextType {
  user: LocalUser | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Usar React Query para obtener el usuario
  const { data: user, isLoading } = useAuthUser();
  const [localLoading, setLocalLoading] = useState(true);

  // Sincronizar loading state para compatibilidad con el código existente
  useEffect(() => {
    if (!isLoading) {
      setLocalLoading(false);
    }
  }, [isLoading]);

  const loginWithGoogle = () => {
    window.location.href = '/api/auth/google';
  };

  const logout = async () => {
    await logoutAuth();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user: user ?? null, loading: isLoading || localLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
