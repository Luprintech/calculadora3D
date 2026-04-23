import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, CameraOff, Loader2, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface FilamentData {
  brand: string | null;
  name: string | null;
  color: string | null;
  colorHex: string | null;
  material: string | null;
  diameter: number | null;
  weightGrams: number | null;
  printTempMin: number | null;
  printTempMax: number | null;
  bedTempMin: number | null;
  bedTempMax: number | null;
  price: number | null;
}

type LookupSource = 'bambu' | 'opendb' | 'manual';

interface LookupResult {
  found: boolean;
  source: LookupSource;
  data: FilamentData;
}

export interface ScannerFillData {
  brand: string;
  material: string;
  color: string;
  colorHex: string;
  totalGrams: number;
  remainingG: number;
  price: number;
  notes: string;
  // Extra for community contribution
  rawCode?: string;
  source?: LookupSource;
}

interface BarcodeScannerModalProps {
  open: boolean;
  onClose: () => void;
  onFill: (data: ScannerFillData) => void;
}

const READER_ID = 'filamentos-qr-reader';

// ── Helpers ──────────────────────────────────────────────────────────────────

function sourceBadgeVariant(source: LookupSource): 'default' | 'secondary' | 'outline' {
  if (source === 'bambu') return 'default';
  if (source === 'opendb') return 'secondary';
  return 'outline';
}

// ── Component ────────────────────────────────────────────────────────────────

export function BarcodeScannerModal({ open, onClose, onFill }: BarcodeScannerModalProps) {
  const { t } = useTranslation();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [lookupError, setLookupError] = useState('');
  const [result, setResult] = useState<(LookupResult & { rawCode: string }) | null>(null);

  // ── Stop camera utility ────────────────────────────────────────────────────
  const stopCamera = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }
    setCameraActive(false);
  }, []);

  // ── Cleanup on modal close ─────────────────────────────────────────────────
  useEffect(() => {
    if (!open) {
      void stopCamera();
      setResult(null);
      setLookupState('idle');
      setLookupError('');
      setCameraError('');
    }
  }, [open, stopCamera]);

  // ── Lookup handler (called after scan) ────────────────────────────────────
  async function handleCodeDetected(code: string) {
    await stopCamera();
    setLookupState('loading');
    setLookupError('');

    try {
      const res = await fetch('/api/lookup-filament', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });
      if (!res.ok) throw new Error(t('scan_error'));
      const data = await res.json() as LookupResult;
      setResult({ ...data, rawCode: code });
      setLookupState('done');
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : t('scan_error'));
      setLookupState('error');
    }
  }

  // ── Start camera ──────────────────────────────────────────────────────────
  async function startCamera() {
    setCameraError('');
    setResult(null);
    setLookupState('idle');

    // Give the DOM element time to render
    await new Promise((r) => setTimeout(r, 100));

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(READER_ID, { verbose: false });
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          void handleCodeDetected(decodedText);
        },
        undefined, // suppress per-frame errors
      );
      setCameraActive(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('https') || msg.toLowerCase().includes('secure')) {
        setCameraError(t('scan_ios_hint'));
      } else {
        setCameraError(t('scan_camera_error'));
      }
    }
  }

  // ── Fill form handler ─────────────────────────────────────────────────────
  function handleFill() {
    if (!result) return;
    const d = result.data;
    onFill({
      brand: d.brand ?? '',
      material: d.material ?? '',
      color: d.color ?? '',
      colorHex: d.colorHex ?? '#cccccc',
      totalGrams: d.weightGrams ?? 1000,
      remainingG: d.weightGrams ?? 1000,
      price: d.price ?? 0,
      notes: d.name ? `${d.name}` : '',
      rawCode: result.rawCode,
      source: result.source,
    });
    onClose();
  }

  const sourceLabel: Record<LookupSource, string> = {
    bambu: t('scan_source_bambu'),
    opendb: t('scan_source_opendb'),
    manual: t('scan_source_manual'),
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="w-full sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('scan_title')}</DialogTitle>
          <DialogDescription>{t('scan_subtitle')}</DialogDescription>
        </DialogHeader>

        {/* Camera viewport — always rendered so the element exists in DOM */}
        <div
          id={READER_ID}
          className={`w-full rounded-xl overflow-hidden bg-black/5 border border-border/50 ${
            cameraActive ? 'min-h-[280px]' : 'hidden'
          }`}
        />

        {/* Camera controls */}
        {!cameraActive && lookupState === 'idle' && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Camera className="h-12 w-12 text-muted-foreground/40" />
            <Button type="button" onClick={() => void startCamera()}>
              <Camera className="mr-2 h-4 w-4" />
              {t('scan_start')}
            </Button>
            {cameraError && (
              <p className="text-sm text-destructive text-center max-w-[280px]">{cameraError}</p>
            )}
          </div>
        )}

        {cameraActive && (
          <Button type="button" variant="outline" onClick={() => void stopCamera()} className="w-full">
            <CameraOff className="mr-2 h-4 w-4" />
            {t('scan_stop')}
          </Button>
        )}

        {/* Looking up */}
        {lookupState === 'loading' && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('scan_scanning')}
          </div>
        )}

        {/* Error */}
        {lookupState === 'error' && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {lookupError}
          </div>
        )}

        {/* Result */}
        {lookupState === 'done' && result && (
          <div className="space-y-3">
            {/* Source badge */}
            <div className="flex items-center gap-2">
              {result.found ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
              ) : (
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
              )}
              <Badge variant={sourceBadgeVariant(result.source)}>
                {sourceLabel[result.source]}
              </Badge>
            </div>

            {/* Data card */}
            <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2 text-sm">
              {result.data.brand && (
                <DataRow label={t('scan_brand')} value={result.data.brand} />
              )}
              {result.data.name && (
                <DataRow label={t('scan_name')} value={result.data.name} />
              )}
              {result.data.material && (
                <DataRow label={t('scan_material')} value={result.data.material} />
              )}
              {result.data.color && (
                <DataRow label={t('scan_color')} value={result.data.color} />
              )}
              {result.data.colorHex && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">{t('scan_color')}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-border/40"
                      style={{ backgroundColor: result.data.colorHex }}
                    />
                    <span className="font-mono text-xs">{result.data.colorHex}</span>
                  </div>
                </div>
              )}
              {result.data.weightGrams != null && (
                <DataRow label={t('scan_weight')} value={`${result.data.weightGrams} g`} />
              )}
              {!result.found && (
                <p className="text-xs text-muted-foreground pt-1">
                  {t('scan_source_manual')}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="button" onClick={handleFill} className="w-full">
                {t('scan_fill')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Restart camera to scan again
                  setLookupState('idle');
                  setResult(null);
                  void startCamera();
                }}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                {t('scan_start')}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
