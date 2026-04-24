import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthState, logoutAuth, type AuthUser, type GuestSession } from './auth-api';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook para obtener el usuario autenticado actual
 * Se usa en el AuthContext para sincronizar con React Query
 */
export function useAuthUser() {
  return useQuery<{ user: AuthUser | null; guest: GuestSession | null }>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      try {
        return await getAuthState();
      } catch {
        return { user: null, guest: null };
      }
    },
    staleTime: Infinity, // El usuario no cambia frecuentemente
    gcTime: 30 * 60 * 1000, // Mantener en caché por 30 min
  });
}

/**
 * Hook para hacer logout
 * Invalida el caché de usuario después de logout
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await logoutAuth();
    },
    onSuccess: () => {
      // Limpiar todo el caché de autenticación
      queryClient.setQueryData(['auth', 'user'], null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      });
    },
    onError: (error) => {
      console.error('Error during logout:', error);
      toast({
        title: 'Error al cerrar sesión',
        description: 'Hubo un problema al cerrar sesión',
        variant: 'destructive',
      });
    },
  });
}
