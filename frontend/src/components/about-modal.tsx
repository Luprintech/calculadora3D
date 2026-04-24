import { Github, Instagram, Youtube, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { TikTokIcon } from '@/components/icons';
import { BuyMeCoffeeButton } from '@/components/buy-me-coffee-button';

const APP_VERSION = '0.1.0';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutModal({ open, onOpenChange }: AboutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader className="items-center gap-1">
          <div className="mx-auto mb-3 group cursor-pointer">
            <div className="relative h-32 w-32 rounded-full overflow-hidden bg-primary/10 border-4 border-primary/20 shadow-lg transition-all duration-300 group-hover:border-primary/60 group-hover:shadow-2xl group-hover:scale-105">
              <img 
                src="/lupe.png" 
                alt="Lupe - Luprintech"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-primary">FilamentOS</DialogTitle>
          <p className="text-xs font-medium text-muted-foreground">
            El sistema operativo de tus impresiones 3D
          </p>
        </DialogHeader>

        <div className="space-y-5 py-1">
          <p className="text-sm text-muted-foreground leading-relaxed px-1">
            FilamentOS es un proyecto personal creado y mantenido por{' '}
            <span className="font-semibold text-foreground">Lupe (Luprintech)</span>.
            Desarrolladora web, maker y creadora de contenido 3D. Si te ayuda en tus
            impresiones, puedes apoyar el desarrollo.
          </p>

          {/* Buy Me a Coffee */}
          <div className="flex justify-center">
            <BuyMeCoffeeButton size="md" />
          </div>

          <Separator className="opacity-40" />

          {/* Redes sociales */}
          <div className="flex justify-center gap-5">
            <a
              href="https://www.instagram.com/luprintech/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @luprintech"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-[10px]">@luprintech</span>
            </a>
            <a
              href="https://www.tiktok.com/@luprintech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok @luprintech"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <TikTokIcon className="h-5 w-5" />
              <span className="text-[10px]">@luprintech</span>
            </a>
            <a
              href="https://www.youtube.com/@Luprintech"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube @luprintech"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-5 w-5" />
              <span className="text-[10px]">@luprintech</span>
            </a>
            <a
              href="https://github.com/Luprintech/filamentOS"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="text-[10px]">GitHub</span>
            </a>
          </div>

          <p className="text-[10px] text-muted-foreground/50 tracking-wide">
            v{APP_VERSION}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
