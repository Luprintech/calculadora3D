// ── FilamentOS Mock Data ───────────────────────────────────────────────────────
// Única fuente de verdad para todos los datos de ejemplo del modo demo.
// NO duplicar estas estructuras en otros componentes.

import type { Spool } from '@/features/inventory/types';
import type { StatsResponse } from '@/features/stats/types';
import type { FilamentProject } from '@/components/filament-challenge/filament-types';

// ── TRACKER: Proyectos de series ───────────────────────────────────────────────

export interface MockTrackerProject {
  id: string;
  title: string;
  description: string;
  coverImage: string | null;
  goal: number;
  totalPieces: number;
  totalSecs: number;
  totalGrams: number;
  totalCost: number;
  currency: string;
  pricePerKg: number;
}

export const mockTrackerProjects: MockTrackerProject[] = [
  {
    id: 'demo-1',
    title: '30 días de figuras frikis 🎮',
    description: 'Serie de 30 figuras impresas en PLA durante abril 2026',
    coverImage: null,
    goal: 30,
    totalPieces: 22,
    totalSecs: 496 * 60,
    totalGrams: 113,
    totalCost: 2.49,
    currency: 'EUR',
    pricePerKg: 22,
  },
  {
    id: 'demo-2',
    title: 'Llaveros PLA Variados',
    description: '',
    coverImage: null,
    goal: 30,
    totalPieces: 12,
    totalSecs: 240 * 60,
    totalGrams: 60,
    totalCost: 2.49,
    currency: 'EUR',
    pricePerKg: 22,
  },
  {
    id: 'demo-3',
    title: 'Miniaturas Dragones D&D',
    description: '',
    coverImage: null,
    goal: 20,
    totalPieces: 12,
    totalSecs: 720 * 60,
    totalGrams: 340,
    totalCost: 7.25,
    currency: 'EUR',
    pricePerKg: 22,
  },
  {
    id: 'demo-4',
    title: 'Cubos Anti-Estrés',
    description: '',
    coverImage: null,
    goal: 50,
    totalPieces: 12,
    totalSecs: 960 * 60,
    totalGrams: 1200,
    totalCost: 27.18,
    currency: 'EUR',
    pricePerKg: 22,
  },
  {
    id: 'demo-5',
    title: 'Organizadores Escritorio',
    description: '',
    coverImage: null,
    goal: 15,
    totalPieces: 12,
    totalSecs: 480 * 60,
    totalGrams: 740,
    totalCost: 16.39,
    currency: 'EUR',
    pricePerKg: 22,
  },
];

// Helper para convertir MockTrackerProject → FilamentProject (formato del tracker real)
export function toFilamentProject(p: MockTrackerProject): FilamentProject {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    coverImage: p.coverImage,
    goal: p.goal,
    totalPieces: p.totalPieces,
    totalSecs: p.totalSecs,
    totalGrams: p.totalGrams,
    totalCost: p.totalCost,
    currency: p.currency,
    pricePerKg: p.pricePerKg,
  };
}

// ── ESTADÍSTICAS ──────────────────────────────────────────────────────────────

export const mockStatsResponse: StatsResponse = {
  summary: {
    totalPieces: 60,
    totalGrams: 2280,
    totalCost: 58.91,
    totalSecs: 125.68 * 3600,
    avgCostPerPiece: 0.98,
    projectCount: 5,
  },
  timeSeries: [
    { period: '2025-11', pieces: 8, grams: 300, cost: 6.60, secs: 16 * 3600 },
    { period: '2025-12', pieces: 12, grams: 450, cost: 9.90, secs: 24 * 3600 },
    { period: '2026-01', pieces: 5, grams: 200, cost: 4.40, secs: 10 * 3600 },
    { period: '2026-02', pieces: 15, grams: 580, cost: 12.76, secs: 30 * 3600 },
    { period: '2026-03', pieces: 10, grams: 380, cost: 8.36, secs: 20 * 3600 },
    { period: '2026-04', pieces: 10, grams: 370, cost: 16.89, secs: 25.68 * 3600 },
  ],
  byProject: [
    { projectId: 'demo-4', title: 'Cubos Anti-Estrés', pieces: 12, grams: 1200, cost: 27.18, secs: 57600 },
    { projectId: 'demo-5', title: 'Organizadores Escritorio', pieces: 12, grams: 740, cost: 16.39, secs: 28800 },
    { projectId: 'demo-3', title: 'Miniaturas D&D', pieces: 12, grams: 340, cost: 7.25, secs: 43200 },
    { projectId: 'demo-r', title: 'Repuestos Impresora', pieces: 12, grams: 270, cost: 5.60, secs: 18000 },
    { projectId: 'demo-2', title: 'Llaveros PLA', pieces: 12, grams: 60, cost: 2.49, secs: 14400 },
  ],
};

// ── INVENTARIO: Bobinas ────────────────────────────────────────────────────────

export const mockSpools: Spool[] = [
  {
    id: 'demo-b1',
    brand: 'Bambu Lab',
    material: 'PLA Basic',
    color: 'Blanco',
    colorHex: '#FFFFFF',
    totalGrams: 1000,
    remainingG: 850,
    price: 24.0,
    notes: '',
    shopUrl: null,
    status: 'active',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-04-01T00:00:00Z',
  },
  {
    id: 'demo-b2',
    brand: 'Polymaker',
    material: 'PETG',
    color: 'Azul Eléctrico',
    colorHex: '#2563EB',
    totalGrams: 500,
    remainingG: 320,
    price: 28.0,
    notes: '',
    shopUrl: null,
    status: 'active',
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'demo-b3',
    brand: 'eSUN',
    material: 'PLA+',
    color: 'Rojo Carmesí',
    colorHex: '#DC2626',
    totalGrams: 1000,
    remainingG: 1000,
    price: 24.0,
    notes: '',
    shopUrl: null,
    status: 'active',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'demo-b4',
    brand: 'Fillamentum',
    material: 'ABS',
    color: 'Negro Neutro',
    colorHex: '#1F2937',
    totalGrams: 750,
    remainingG: 390,
    price: 22.0,
    notes: '',
    shopUrl: null,
    status: 'active',
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-15T00:00:00Z',
  },
  {
    id: 'demo-b5',
    brand: 'Prusament',
    material: 'PETG',
    color: 'Galaxy Black',
    colorHex: '#111827',
    totalGrams: 1000,
    remainingG: 200,
    price: 26.0,
    notes: '',
    shopUrl: null,
    status: 'active',
    createdAt: '2025-12-01T00:00:00Z',
    updatedAt: '2026-04-15T00:00:00Z',
  },
  {
    id: 'demo-b6',
    brand: 'Bambu Lab',
    material: 'PLA Matte',
    color: 'Rosa',
    colorHex: '#EC4899',
    totalGrams: 1000,
    remainingG: 680,
    price: 22.0,
    notes: '',
    shopUrl: null,
    status: 'active',
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-04-05T00:00:00Z',
  },
];

// ── CALCULADORA: Proyectos guardados ───────────────────────────────────────────

export interface MockSavedProject {
  id: string;
  name: string;
  timeMinutes: number;
  filamentGrams: number;
}

export const mockSavedProjects: MockSavedProject[] = [
  { id: 'demo-p1', name: 'Sonic 3D Print', timeMinutes: 75, filamentGrams: 12 },
  { id: 'demo-p2', name: 'Miniatura D&D Goblin', timeMinutes: 75, filamentGrams: 12 },
  { id: 'demo-p3', name: 'Clip organizador cables', timeMinutes: 25, filamentGrams: 8 },
];
