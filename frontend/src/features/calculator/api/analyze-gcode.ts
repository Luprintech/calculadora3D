import { httpRequest } from '@/shared/api/http-client';

export interface AnalyzeGcodeResult {
  data?: {
    printingTimeSeconds: number | null;
    filamentWeightGrams: number | null;
  };
  error?: string;
}

export interface GcodeAnalysisResult {
  printingTimeHours: number;
  printingTimeMinutes: number;
  filamentWeight: number;
  filamentLength: number;
  layerHeight?: number;
  infillPercentage?: number;
}

export async function analyzeGcodeFile(file: File): Promise<AnalyzeGcodeResult> {
  const formData = new FormData();
  formData.append('gcodeFile', file);

  return httpRequest<AnalyzeGcodeResult>({
    url: '/api/analyze-gcode',
    init: {
      method: 'POST',
      body: formData,
    },
  });
}

export async function analyzeGcode(file: File): Promise<GcodeAnalysisResult> {
  const result = await analyzeGcodeFile(file);

  if (result.error) throw new Error(result.error);

  const totalSeconds = result.data?.printingTimeSeconds ?? 0;
  const weightGrams = result.data?.filamentWeightGrams ?? 0;

  return {
    printingTimeHours: Math.floor(totalSeconds / 3600),
    printingTimeMinutes: Math.floor((totalSeconds % 3600) / 60),
    filamentWeight: weightGrams,
    filamentLength: 0,
  };
}
