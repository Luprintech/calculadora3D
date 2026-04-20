import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuración por defecto para todas las queries
            staleTime: 5 * 60 * 1000, // 5 minutos - los datos son frescos por 5 min
            gcTime: 10 * 60 * 1000, // 10 minutos - caché se mantiene por 10 min
            retry: 1, // Reintentar 1 vez en caso de error
            refetchOnWindowFocus: false, // No recargar al cambiar de pestaña
            refetchOnReconnect: true, // Recargar al reconectar
          },
          mutations: {
            retry: 0, // No reintentar mutations automáticamente
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
