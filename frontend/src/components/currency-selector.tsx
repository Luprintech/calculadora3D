import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { CURRENCIES, useCurrency } from '@/context/currency-context';

// ── Currency groups ───────────────────────────────────────────────────────────

const EUROPE_CODES  = ['EUR','GBP','CHF','SEK','NOK','DKK','PLN','CZK','HUF','RON'];
const NORTH_AM_CODES = ['USD','CAD'];
const LATAM_CODES   = ['MXN','BRL','ARS','CLP','COP','PEN','UYU','BOB','PYG','DOP','GTQ','CRC','HNL','NIO','CUP'];
const OTHER_CODES   = ['JPY'];

const GROUPS = [
  { labelKey: 'currency_group_europe',   codes: EUROPE_CODES },
  { labelKey: 'currency_group_north_am', codes: NORTH_AM_CODES },
  { labelKey: 'currency_group_latam',    codes: LATAM_CODES },
  { labelKey: 'currency_group_other',    codes: OTHER_CODES },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function CurrencySelector() {
  const { currency, currencyInfo, setCurrency } = useCurrency();
  const { t } = useTranslation();

  return (
    <Select value={currency} onValueChange={setCurrency}>
      <SelectTrigger
        className="h-9 w-auto gap-1.5 px-3 text-sm font-bold"
        aria-label={t('currency_selector_label')}
      >
        <span className="tabular-nums">{currencyInfo.symbol}</span>
        <span>{currency}</span>
      </SelectTrigger>

      <SelectContent align="end" className="max-h-72">
        {GROUPS.map((group) => {
          const items = CURRENCIES.filter((c) => group.codes.includes(c.code));
          return (
            <SelectGroup key={group.labelKey}>
              <SelectLabel className="text-xs font-black uppercase tracking-wider text-muted-foreground/70 px-2 py-1">
                {t(group.labelKey)}
              </SelectLabel>
              {items.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="flex items-center gap-2">
                    <span className="w-8 text-right tabular-nums font-mono text-muted-foreground text-xs">
                      {c.symbol}
                    </span>
                    <span className="font-bold">{c.code}</span>
                    <span className="text-muted-foreground text-xs">— {c.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
