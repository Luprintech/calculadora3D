import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Share, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'ios-install-banner-dismissed';

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform ?? ''))
  );
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
}

function isSafari(): boolean {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

export function IosInstallBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo mostrar en iOS Safari, fuera de modo standalone, y si no se ha descartado
    const alreadyDismissed = localStorage.getItem(STORAGE_KEY) === 'true';
    if (isIOS() && isSafari() && !isInStandaloneMode() && !alreadyDismissed) {
      // Pequeño delay para no aparecer justo al cargar
      const timer = setTimeout(() => setVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss(permanent: boolean) {
    setVisible(false);
    if (permanent) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-3 mb-4 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-2xl backdrop-blur-md dark:bg-card/90">
        {/* Cabecera */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/icon-192x192.png"
              alt="FilamentOS"
              className="h-12 w-12 rounded-2xl border border-border/40 shadow-sm"
            />
            <div>
              <p className="font-bold text-foreground">FilamentOS</p>
              <p className="text-xs text-muted-foreground">
                {t('ios_install_subtitle', 'Instala la app en tu iPhone')}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 rounded-full"
            onClick={() => dismiss(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Pasos */}
        <ol className="space-y-2.5 text-sm">
          <li className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              1
            </div>
            <span className="text-foreground/80">
              {t('ios_install_step1', 'Pulsa el botón')}{' '}
              <span className="inline-flex items-center gap-0.5 rounded-md border border-border/50 bg-muted px-1.5 py-0.5 text-xs font-semibold">
                <Share className="h-3 w-3" />
                {t('ios_install_share', 'Compartir')}
              </span>{' '}
              {t('ios_install_step1b', 'en la barra de Safari')}
            </span>
          </li>
          <li className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              2
            </div>
            <span className="text-foreground/80">
              {t('ios_install_step2', 'Selecciona')}{' '}
              <span className="inline-flex items-center gap-0.5 rounded-md border border-border/50 bg-muted px-1.5 py-0.5 text-xs font-semibold">
                <Plus className="h-3 w-3" />
                {t('ios_install_add', 'Añadir a pantalla de inicio')}
              </span>
            </span>
          </li>
          <li className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              3
            </div>
            <span className="text-foreground/80">
              {t('ios_install_step3', 'Pulsa "Añadir" arriba a la derecha')}
            </span>
          </li>
        </ol>

        {/* Triángulo apuntando hacia abajo (indica la barra de Safari) */}
        <div className="mt-3 flex justify-center">
          <div className="h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-border/40" />
        </div>

        {/* Botón no volver a mostrar */}
        <button
          onClick={() => dismiss(true)}
          className="mt-2 w-full text-center text-xs text-muted-foreground/60 underline-offset-2 hover:underline"
        >
          {t('ios_install_dismiss', 'No volver a mostrar')}
        </button>
      </div>
    </div>
  );
}
