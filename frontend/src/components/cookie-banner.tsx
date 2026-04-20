import React from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';
import { useTranslation } from 'react-i18next';

interface Props {
  onAccept: () => void;
}

export function CookieBanner({ onAccept }: Props) {
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm shadow-lg print:hidden">
      <div className="mx-auto max-w-4xl flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            {t('cookie_text')}{' '}
            <PrivacyPolicyModal
              trigger={
                <button className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
                  {t('cookie_more')}
                </button>
              }
            />
          </p>
        </div>
        <Button onClick={onAccept} size="sm" className="shrink-0 w-full sm:w-auto">
          {t('cookie_accept')}
        </Button>
      </div>
    </div>
  );
}
