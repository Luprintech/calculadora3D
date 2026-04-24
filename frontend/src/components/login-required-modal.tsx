import React from 'react';
import { Loader2, Lock } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons';
import { useAuth } from '@/context/auth-context';

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Mensaje contextual para mostrar dentro del modal */
  message?: string;
}

/**
 * Modal que aparece cuando el usuario invitado intenta una acción que
 * requiere cuenta real (guardar, crear proyectos, gestionar bobinas…).
 */
export function LoginRequiredModal({ open, onOpenChange, message }: LoginRequiredModalProps) {
  const { loginWithGoogle, startGuest } = useAuth();
  const [guestLoading, setGuestLoading] = React.useState(false);

  async function handleGuest() {
    setGuestLoading(true);
    try {
      await startGuest();
      onOpenChange(false);
      window.location.href = '/calculadora';
    } finally {
      setGuestLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <div className="mb-3 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <DialogTitle className="text-center">Para esta acción necesitas una cuenta gratuita</DialogTitle>
          <DialogDescription className="text-center">
            {message ?? 'Inicia sesión para desbloquear todas las funciones, guardar tus datos y acceder desde cualquier lugar.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            className="w-full rounded-full font-bold"
            onClick={loginWithGoogle}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Iniciar sesión
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full font-semibold"
            onClick={handleGuest}
            disabled={guestLoading}
          >
            {guestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continuar sin cuenta
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" className="w-full rounded-full text-sm">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
