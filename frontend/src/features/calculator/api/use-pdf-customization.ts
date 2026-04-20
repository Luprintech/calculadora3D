import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// IMPORTANTE: El proyecto usa VITE_API_URL (no VITE_API_BASE_URL)
// En desarrollo apunta a http://localhost:3001
// Pero en el navegador usamos URLs relativas para que pase por el proxy de Vite
const API_BASE = '';

export interface PdfCustomization {
  logoPath?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyName?: string | null;
  footerText?: string | null;
  showMachineCosts: boolean;
  showBreakdown: boolean;
  showOtherCosts: boolean;
  showLaborCosts: boolean;
  showElectricity: boolean;
  templateName: string;
}

export interface ProjectData {
  jobName?: string;
  printingTimeHours: number;
  printingTimeMinutes: number;
  filamentWeight: number;
  spoolWeight: number;
  spoolPrice: number;
  powerConsumptionWatts: number;
  energyCostKwh: number;
  prepTime: number;
  prepCostPerHour: number;
  postProcessingTimeInMinutes: number;
  postProcessingCostPerHour: number;
  includeMachineCosts: boolean;
  printerCost: number;
  investmentReturnYears: number;
  repairCost: number;
  otherCosts: Array<{ description: string; cost: number }>;
  profitPercentage: number;
  vatPercentage: number;
  currency: string;
  // Calculated results
  filamentCost: number;
  electricityCost: number;
  laborCost: number;
  machineCost: number;
  otherCostsTotal: number;
  subTotal: number;
  profitAmount: number;
  priceBeforeVat: number;
  vatAmount: number;
  finalPrice: number;
}

// GET /api/pdf/config
async function fetchPdfConfig(): Promise<PdfCustomization> {
  const res = await fetch(`${API_BASE}/api/pdf/config`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error al obtener la configuración del PDF');
  }

  return res.json();
}

// POST /api/pdf/config
async function savePdfConfig(config: PdfCustomization): Promise<void> {
  const res = await fetch(`${API_BASE}/api/pdf/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    throw new Error('Error al guardar la configuración del PDF');
  }
}

// POST /api/pdf/upload-logo
async function uploadLogo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('logo', file);

  const res = await fetch(`${API_BASE}/api/pdf/upload-logo`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al subir el logo');
  }

  const data = await res.json();
  return data.logoPath;
}

// POST /api/pdf/preview
async function generatePreview(
  projectData: ProjectData,
  customization: PdfCustomization
): Promise<string> {
  const res = await fetch(`${API_BASE}/api/pdf/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ projectData, customization }),
  });

  if (!res.ok) {
    throw new Error('Error al generar la vista previa');
  }

  return res.text();
}

// POST /api/pdf/generate
async function generatePdf(
  projectData: ProjectData,
  customization: PdfCustomization
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/api/pdf/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ projectData, customization }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al generar el PDF');
  }

  return res.blob();
}

export function usePdfCustomization() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // GET config
  const { data: config, isLoading } = useQuery({
    queryKey: ['pdf-config'],
    queryFn: fetchPdfConfig,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // SAVE config
  const saveConfigMutation = useMutation({
    mutationFn: savePdfConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdf-config'] });
      toast({
        title: 'Configuración guardada',
        description: 'Tu plantilla de PDF se ha guardado correctamente',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // UPLOAD logo
  const uploadLogoMutation = useMutation({
    mutationFn: uploadLogo,
    onSuccess: (logoPath) => {
      toast({
        title: 'Logo subido',
        description: 'El logo se ha subido correctamente',
      });
      return logoPath;
    },
    onError: (error: Error) => {
      toast({
        title: 'Error al subir logo',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // GENERATE preview
  const generatePreviewMutation = useMutation({
    mutationFn: ({ projectData, customization }: { projectData: ProjectData; customization: PdfCustomization }) =>
      generatePreview(projectData, customization),
  });

  // GENERATE PDF
  const generatePdfMutation = useMutation({
    mutationFn: ({ projectData, customization }: { projectData: ProjectData; customization: PdfCustomization }) =>
      generatePdf(projectData, customization),
    onSuccess: (blob, variables) => {
      // Download PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presupuesto-${variables.projectData.jobName?.replace(/[^a-zA-Z0-9]/g, '-') || 'sin-nombre'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'PDF generado',
        description: 'El PDF se ha descargado correctamente',
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
    config,
    isLoading,
    saveConfig: saveConfigMutation.mutate,
    isSavingConfig: saveConfigMutation.isPending,
    uploadLogo: uploadLogoMutation.mutateAsync,
    isUploadingLogo: uploadLogoMutation.isPending,
    generatePreview: generatePreviewMutation.mutateAsync,
    isGeneratingPreview: generatePreviewMutation.isPending,
    generatePdf: generatePdfMutation.mutate,
    isGeneratingPdf: generatePdfMutation.isPending,
  };
}
