import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export interface PdfCustomization {
  logoPath?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyName?: string | null;
  footerText?: string | null;
  showMachineCosts: boolean;
  showBreakdown: boolean;
  showOtherCosts: boolean;
  showLaborCosts: boolean;
  showElectricity: boolean;
  templateName: string;
}

export interface ProjectData {
  jobName?: string;
  printingTimeHours: number;
  printingTimeMinutes: number;
  filamentWeight: number;
  spoolWeight: number;
  spoolPrice: number;
  powerConsumptionWatts: number;
  energyCostKwh: number;
  prepTime: number;
  prepCostPerHour: number;
  postProcessingTimeInMinutes: number;
  postProcessingCostPerHour: number;
  includeMachineCosts: boolean;
  printerCost: number;
  investmentReturnYears: number;
  repairCost: number;
  otherCosts: Array<{ description: string; cost: number }>;
  profitPercentage: number;
  vatPercentage: number;
  currency: string;
  // Calculated results
  filamentCost: number;
  electricityCost: number;
  laborCost: number;
  machineCost: number;
  otherCostsTotal: number;
  subTotal: number;
  profitAmount: number;
  priceBeforeVat: number;
  vatAmount: number;
  finalPrice: number;
}

/**
 * Genera el HTML del PDF con la customización aplicada
 */
export function generatePdfHtml(
  projectData: ProjectData,
  customization: PdfCustomization,
  baseUrl: string
): string {
  const {
    logoPath,
    primaryColor,
    secondaryColor,
    accentColor,
    companyName,
    footerText,
    showMachineCosts,
    showBreakdown,
    showOtherCosts,
    showLaborCosts,
    showElectricity,
  } = customization;

  const {
    jobName,
    printingTimeHours,
    printingTimeMinutes,
    filamentWeight,
    spoolWeight,
    spoolPrice,
    powerConsumptionWatts,
    energyCostKwh,
    prepTime,
    prepCostPerHour,
    postProcessingTimeInMinutes,
    postProcessingCostPerHour,
    includeMachineCosts,
    printerCost,
    investmentReturnYears,
    repairCost,
    otherCosts,
    profitPercentage,
    vatPercentage,
    currency,
    filamentCost,
    electricityCost,
    laborCost,
    machineCost,
    otherCostsTotal,
    subTotal,
    profitAmount,
    priceBeforeVat,
    vatAmount,
    finalPrice,
  } = projectData;

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency;
  const totalTime = `${printingTimeHours}h ${printingTimeMinutes}m`;

  // Helper para formatear números con moneda
  const formatCurrency = (amount: number) => `${amount.toFixed(2)} ${currencySymbol}`;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <base href="${baseUrl}/" />
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presupuesto - ${jobName || 'Sin nombre'}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor};
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: var(--secondary);
      background: white;
      padding: 20mm;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid var(--primary);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .logo {
      max-height: 80px;
      max-width: 200px;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
    }
    
    .project-info {
      background: var(--accent);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    
    .project-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary);
      margin-bottom: 5px;
    }
    
    .project-meta {
      font-size: 11px;
      color: #666;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th {
      background: var(--primary);
      color: white;
      text-align: left;
      padding: 10px;
      font-weight: 600;
      font-size: 13px;
    }
    
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary);
      margin: 25px 0 15px;
      border-left: 4px solid var(--primary);
      padding-left: 10px;
    }
    
    .totals {
      margin-top: 30px;
      border-top: 2px solid var(--primary);
      padding-top: 15px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 13px;
    }
    
    .total-row.final {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary);
      border-top: 2px solid var(--primary);
      padding-top: 15px;
      margin-top: 10px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      background: var(--accent);
      color: var(--secondary);
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      ${logoPath ? `<img src="${logoPath}" alt="Logo" class="logo" />` : ''}
      ${!logoPath && companyName ? `<div class="company-name">${companyName}</div>` : ''}
    </div>
    <div style="text-align: right;">
      <div style="font-size: 20px; font-weight: 700; color: var(--primary);">PRESUPUESTO</div>
      <div style="font-size: 11px; color: #666;">${new Date().toLocaleDateString('es-ES')}</div>
    </div>
  </div>

  <!-- Project Info -->
  <div class="project-info">
    <div class="project-title">${jobName || 'Proyecto sin nombre'}</div>
    <div class="project-meta">
      Tiempo de impresión: <strong>${totalTime}</strong> | 
      Peso filamento: <strong>${filamentWeight}g</strong>
    </div>
  </div>

  ${showBreakdown ? `
  <!-- Cost Breakdown -->
  <div class="section-title">Desglose de Costes</div>
  <table>
    <thead>
      <tr>
        <th>Concepto</th>
        <th>Detalle</th>
        <th style="text-align: right;">Coste</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Filamento</strong></td>
        <td>${filamentWeight}g de bobina de ${spoolWeight}g (${formatCurrency(spoolPrice)})</td>
        <td style="text-align: right;">${formatCurrency(filamentCost)}</td>
      </tr>
      ${showElectricity ? `
      <tr>
        <td><strong>Electricidad</strong></td>
        <td>${totalTime} × ${powerConsumptionWatts}W × ${formatCurrency(energyCostKwh)}/kWh</td>
        <td style="text-align: right;">${formatCurrency(electricityCost)}</td>
      </tr>
      ` : ''}
      ${showLaborCosts ? `
      <tr>
        <td><strong>Mano de Obra</strong></td>
        <td>
          Preparación: ${prepTime}min (${formatCurrency(prepCostPerHour)}/h)<br>
          Post-procesado: ${postProcessingTimeInMinutes}min (${formatCurrency(postProcessingCostPerHour)}/h)
        </td>
        <td style="text-align: right;">${formatCurrency(laborCost)}</td>
      </tr>
      ` : ''}
      ${showMachineCosts && includeMachineCosts ? `
      <tr>
        <td><strong>Amortización Máquina</strong></td>
        <td>
          Coste impresora: ${formatCurrency(printerCost)}<br>
          Retorno inversión: ${investmentReturnYears} años<br>
          Reparaciones: ${formatCurrency(repairCost)}
        </td>
        <td style="text-align: right;">${formatCurrency(machineCost)}</td>
      </tr>
      ` : ''}
      ${showOtherCosts && otherCosts.length > 0 ? otherCosts.map(item => `
      <tr>
        <td><strong>Otros</strong></td>
        <td>${item.description}</td>
        <td style="text-align: right;">${formatCurrency(item.cost)}</td>
      </tr>
      `).join('') : ''}
    </tbody>
  </table>
  ` : ''}

  <!-- Totals -->
  <div class="totals">
    <div class="total-row">
      <span>Subtotal (costes directos)</span>
      <strong>${formatCurrency(subTotal)}</strong>
    </div>
    <div class="total-row">
      <span>Margen de beneficio (${profitPercentage}%)</span>
      <strong>${formatCurrency(profitAmount)}</strong>
    </div>
    <div class="total-row">
      <span>Precio antes de IVA</span>
      <strong>${formatCurrency(priceBeforeVat)}</strong>
    </div>
    <div class="total-row">
      <span>IVA (${vatPercentage}%)</span>
      <strong>${formatCurrency(vatAmount)}</strong>
    </div>
    <div class="total-row final">
      <span>TOTAL</span>
      <span>${formatCurrency(finalPrice)}</span>
    </div>
  </div>

  <!-- Footer -->
  ${footerText ? `
  <div class="footer">
    ${footerText}
  </div>
  ` : ''}
  
  <div class="footer" style="margin-top: 10px;">
    Presupuesto generado con <strong>FilamentOS</strong> — ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>
</body>
</html>
  `.trim();
}

/**
 * Datos del proyecto del tracker
 */
export interface TrackerPdfData {
  projectTitle: string;
  projectDescription: string;
  projectGoal: number;
  projectCurrency: string;
  projectPricePerKg: number;
  coverImage: string | null;
  totalPieces: number;
  totalSecs: number;
  totalGrams: number;
  totalCost: number;
  pieces: Array<{
    label: string;
    name: string;
    totalSecs: number;
    totalGrams: number;
    totalCost: number;
    imageUrl: string | null;
  }>;
}

/**
 * Genera el HTML del PDF del tracker con la customización aplicada
 */
export function generateTrackerPdfHtml(
  trackerData: TrackerPdfData,
  customization: PdfCustomization,
  baseUrl: string
): string {
  const {
    logoPath,
    primaryColor,
    secondaryColor,
    accentColor,
    companyName,
    footerText,
  } = customization;

  const {
    projectTitle,
    projectDescription,
    projectGoal,
    projectCurrency,
    totalPieces,
    totalSecs,
    totalGrams,
    totalCost,
    pieces,
  } = trackerData;

  const currencySymbol = projectCurrency === 'EUR' ? '€' : projectCurrency === 'USD' ? '$' : projectCurrency;

  // Helper para formatear tiempo
  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  // Helper para formatear números con moneda
  const formatCurrency = (amount: number) => `${amount.toFixed(2)} ${currencySymbol}`;

  const progressPct = Math.min(100, Math.round((totalPieces / projectGoal) * 100));

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <base href="${baseUrl}/" />
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tracker - ${projectTitle}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor};
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.6;
      color: var(--secondary);
      background: white;
      padding: 20mm;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid var(--primary);
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .logo {
      max-height: 80px;
      max-width: 200px;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary);
    }
    
    .project-info {
      background: var(--accent);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    
    .project-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 5px;
    }
    
    .project-meta {
      font-size: 11px;
      color: #666;
      margin-top: 5px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }
    
    .stat-card {
      background: var(--accent);
      padding: 12px;
      border-radius: 8px;
      text-align: center;
    }
    
    .stat-label {
      font-size: 10px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
      margin-top: 5px;
    }
    
    .progress-bar {
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 25px;
    }
    
    .progress-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 4px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    th {
      background: var(--primary);
      color: white;
      text-align: left;
      padding: 10px;
      font-weight: 600;
      font-size: 11px;
    }
    
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e0e0e0;
      font-size: 11px;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary);
      margin: 25px 0 15px;
      border-left: 4px solid var(--primary);
      padding-left: 10px;
    }
    
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      text-align: center;
      font-size: 10px;
      color: #666;
    }
    
    .piece-image {
      max-width: 60px;
      max-height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      ${logoPath ? `<img src="${logoPath}" alt="Logo" class="logo" />` : ''}
      ${!logoPath && companyName ? `<div class="company-name">${companyName}</div>` : ''}
    </div>
    <div style="text-align: right;">
      <div style="font-size: 20px; font-weight: 700; color: var(--primary);">TRACKER DE SERIES</div>
      <div style="font-size: 11px; color: #666;">${new Date().toLocaleDateString('es-ES')}</div>
    </div>
  </div>

  <!-- Project Info -->
  <div class="project-info">
    <div class="project-title">${projectTitle}</div>
    ${projectDescription ? `<div class="project-meta">${projectDescription}</div>` : ''}
    <div class="project-meta">Meta: <strong>${totalPieces} / ${projectGoal} piezas</strong> (${progressPct}%)</div>
  </div>

  <!-- Progress Bar -->
  <div class="progress-bar">
    <div class="progress-fill" style="width: ${progressPct}%"></div>
  </div>

  <!-- Stats -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Piezas</div>
      <div class="stat-value">${totalPieces} / ${projectGoal}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Tiempo Total</div>
      <div class="stat-value">${formatTime(totalSecs)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Filamento</div>
      <div class="stat-value">${totalGrams.toFixed(1)}g</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Coste Total</div>
      <div class="stat-value">${formatCurrency(totalCost)}</div>
    </div>
  </div>

  <!-- Pieces List -->
  <div class="section-title">Listado de Piezas</div>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Etiqueta</th>
        <th>Nombre</th>
        <th>Tiempo</th>
        <th>Gramos</th>
        <th>Coste</th>
      </tr>
    </thead>
    <tbody>
      ${pieces.map((piece, index) => `
      <tr>
        <td><strong>${index + 1}</strong></td>
        <td>${piece.label}</td>
        <td><strong>${piece.name}</strong></td>
        <td>${formatTime(piece.totalSecs)}</td>
        <td>${piece.totalGrams.toFixed(1)}g</td>
        <td>${formatCurrency(piece.totalCost)}</td>
      </tr>
      `).join('')}
    </tbody>
  </table>

  <!-- Footer -->
  ${footerText ? `
  <div class="footer">
    ${footerText}
  </div>
  ` : ''}
  
  <div class="footer" style="margin-top: 10px;">
    Tracker generado con <strong>FilamentOS</strong> — ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
  </div>
</body>
</html>
  `.trim();
}

/**
 * Genera un PDF usando Puppeteer
 */
export async function generatePdf(
  projectData: ProjectData,
  customization: PdfCustomization,
  baseUrl: string
): Promise<Buffer> {
  const html = generatePdfHtml(projectData, customization, baseUrl);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

/**
 * Genera un PDF del tracker usando Puppeteer
 */
export async function generateTrackerPdf(
  trackerData: TrackerPdfData,
  customization: PdfCustomization,
  baseUrl: string
): Promise<Buffer> {
  const html = generateTrackerPdfHtml(trackerData, customization, baseUrl);

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
