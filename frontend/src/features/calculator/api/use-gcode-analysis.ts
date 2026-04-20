import { useMutation } from '@tanstack/react-query';
import { analyzeGcode, type GcodeAnalysisResult } from './analyze-gcode';
import { useToast } from '@/hooks/use-toast';

export type { GcodeAnalysisResult };

/**
 * Hook para analizar un archivo GCode
 * Retorna el resultado del análisis con loading y error states
 */
export function useGcodeAnalysis() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (file: File): Promise<GcodeAnalysisResult> => {
      return await analyzeGcode(file);
    },
    onSuccess: (result) => {
      toast({
        title: 'GCode analizado',
        description: `Tiempo: ${result.printingTimeHours}h ${result.printingTimeMinutes}m | Filamento: ${result.filamentWeight.toFixed(1)}g`,
      });
    },
    onError: (error) => {
      console.error('Error analyzing GCode:', error);
      toast({
        title: 'Error al analizar GCode',
        description: 'No se pudo analizar el archivo. Asegúrate de que sea un GCode válido.',
        variant: 'destructive',
      });
    },
  });
}
