import React, { createContext, useContext, useState, ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

interface CurrencyContextType {
  currency: string;
  currencyInfo: CurrencyInfo;
  setCurrency: (code: string) => void;
}

// ── All supported currencies ──────────────────────────────────────────────────

export const CURRENCIES: CurrencyInfo[] = [
  // ── Europa ──────────────────────────────────────────────────────────────────
  { code: 'EUR', symbol: '€',   name: 'Euro' },
  { code: 'GBP', symbol: '£',   name: 'Pound Sterling' },
  { code: 'CHF', symbol: 'Fr',  name: 'Swiss Franc' },
  { code: 'SEK', symbol: 'kr',  name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr',  name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr',  name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł',  name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč',  name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft',  name: 'Hungarian Forint' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  // ── Norte América ────────────────────────────────────────────────────────────
  { code: 'USD', symbol: '$',   name: 'US Dollar' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar' },
  // ── Latinoamérica ────────────────────────────────────────────────────────────
  { code: 'MXN', symbol: '$',   name: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$',  name: 'Brazilian Real' },
  { code: 'ARS', symbol: '$',   name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$',   name: 'Chilean Peso' },
  { code: 'COP', symbol: '$',   name: 'Colombian Peso' },
  { code: 'PEN', symbol: 'S/',  name: 'Peruvian Sol' },
  { code: 'UYU', symbol: '$U',  name: 'Uruguayan Peso' },
  { code: 'BOB', symbol: 'Bs',  name: 'Bolivian Boliviano' },
  { code: 'PYG', symbol: '₲',   name: 'Paraguayan Guaraní' },
  { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso' },
  { code: 'GTQ', symbol: 'Q',   name: 'Guatemalan Quetzal' },
  { code: 'CRC', symbol: '₡',   name: 'Costa Rican Colón' },
  { code: 'HNL', symbol: 'L',   name: 'Honduran Lempira' },
  { code: 'NIO', symbol: 'C$',  name: 'Nicaraguan Córdoba' },
  { code: 'CUP', symbol: '$',   name: 'Cuban Peso' },
  // ── Otros ────────────────────────────────────────────────────────────────────
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen' },
] as const;

export const CURRENCY_MAP = new Map<string, CurrencyInfo>(
  CURRENCIES.map((c) => [c.code, c])
);

const DEFAULT_CURRENCY = 'EUR';
const STORAGE_KEY = 'filamentOS_currency';

// ── Context ───────────────────────────────────────────────────────────────────

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_CURRENCY;
    } catch {
      return DEFAULT_CURRENCY;
    }
  });

  const currencyInfo = CURRENCY_MAP.get(currency) ?? CURRENCY_MAP.get(DEFAULT_CURRENCY)!;

  function setCurrency(code: string) {
    setCurrencyState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch { /* ignore */ }
  }

  return (
    <CurrencyContext.Provider value={{ currency, currencyInfo, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
