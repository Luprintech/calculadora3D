import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import type { PdfCustomization } from '@/features/calculator/api/use-pdf-customization';

const API_BASE = '';

export interface TrackerPdfData {
  projectTitle: string;
  projectDescription: string;
  projectGoal: number;
  projectCurrency: string;
  projectPricePerKg: number;
  coverImage: string | null;
  totalPieces: number;
  totalSecs: number;
  totalGrams: number;
  totalCost: number;
  pieces: Array<{
    label: string;
    name: string;
    totalSecs: number;
    totalGrams: number;
    totalCost: number;
    imageUrl: string | null;
  }>;
}

// POST /api/tracker/pdf/preview
async function generateTrackerPreview(
  trackerData: TrackerPdfData,
  customization: PdfCustomization
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/tracker/pdf/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ trackerData, customization }),
  });

  if (!res.ok) {
    throw new Error('Error al generar la vista previa del tracker');
  }

  return res.text();
}

// POST /api/tracker/pdf/generate
async function generateTrackerPdf(
  trackerData: TrackerPdfData,
  customization: PdfCustomization
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/tracker/pdf/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ trackerData, customization }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al generar el PDF del tracker');
  }

  return res.blob();
}

export function useTrackerPdf() {
  const { toast } = useToast();

  // GENERATE preview
  const generatePreviewMutation = useMutation({
    mutationFn: ({ trackerData, customization }: { trackerData: TrackerPdfData; customization: PdfCustomization }) =>
      generateTrackerPreview(trackerData, customization),
  });

  // GENERATE PDF
  const generatePdfMutation = useMutation({
    mutationFn: ({ trackerData, customization }: { trackerData: TrackerPdfData; customization: PdfCustomization }) =>
      generateTrackerPdf(trackerData, customization),
    onSuccess: (blob, variables) => {
      // Download PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tracker-${variables.trackerData.projectTitle.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'PDF generado',
        description: 'El PDF del tracker se ha descargado correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al generar PDF',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    generatePreview: generatePreviewMutation.mutateAsync,
    isGeneratingPreview: generatePreviewMutation.isPending,
    generatePdf: generatePdfMutation.mutate,
    isGeneratingPdf: generatePdfMutation.isPending,
  };
}
