import type { TFunction } from 'i18next';
import type { FormData } from '@/lib/schema';
import type { CostCalculations } from '@/features/calculator/domain/cost-calculator';

interface BuildShareSummaryInput {
  t: TFunction;
  values: FormData;
  calculations: CostCalculations;
  formatCurrency: (amount: number) => string;
}

export function buildShareSummary({ t, values, calculations, formatCurrency }: BuildShareSummaryInput): string {
  let summaryText = `
    ${t('share_job_label')}: ${values.jobName || t('share_untitled')}
    ---
    ${t('share_filament_cost')}: ${formatCurrency(calculations.filamentCost)}
    ${t('share_electricity_cost')}: ${formatCurrency(calculations.electricityCost)}
    ${t('share_labor_cost')}: ${formatCurrency(calculations.laborCost)}
    `;

  if (values.includeMachineCosts) {
    summaryText += `
 ${t('share_machine_cost')}: ${formatCurrency(calculations.currentMachineCost)}`;
  }

  summaryText += `
    ${t('share_other_costs')}: ${formatCurrency(calculations.otherCostsTotal)}
    ---
    ${t('share_subtotal')}: ${formatCurrency(calculations.subTotal)}
    ${t('share_profit', { percent: values.profitPercentage })}: ${formatCurrency(calculations.profitAmount)}
    ${t('share_vat', { percent: values.vatPercentage })}: ${formatCurrency(calculations.vatAmount)}
    ---
    ${t('share_final_price')}: ${formatCurrency(calculations.finalPrice)}
    `;

  return summaryText.trim();
}
