import React from 'react';
import { useTranslation } from 'react-i18next';
import { CircleFlag } from 'react-circle-flags';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

const LANGUAGES = [
  { code: 'es', label: 'Español', country: 'es' },
  { code: 'en', label: 'English', country: 'gb' },
  { code: 'pt', label: 'Português', country: 'br' },
  { code: 'fr', label: 'Français', country: 'fr' },
  { code: 'de', label: 'Deutsch', country: 'de' },
  { code: 'it', label: 'Italiano', country: 'it' },
] as const;

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const current = LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ?? LANGUAGES[0];

  return (
    <Select value={current.code} onValueChange={(value) => i18n.changeLanguage(value)}>
      <SelectTrigger className="h-9 w-auto gap-2 px-3 text-sm font-bold" aria-label="Select language">
        <div className="flex items-center gap-2">
          <CircleFlag countryCode={current.country} height="16" width="16" />
          <span className="hidden sm:inline">{current.label}</span>
        </div>
      </SelectTrigger>
      <SelectContent align="end">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <CircleFlag countryCode={lang.country} height="16" width="16" />
              {lang.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
