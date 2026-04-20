import * as z from "zod";
import i18n from '@/i18n';

export const formSchema = z.object({
  // This ID is for client-side tracking of a loaded project.
  id: z.string().optional(),

  // == Required Fields ==
  jobName: z.string().min(1, i18n.t('schema_job_name_required')),
  
  printingTimeHours: z.coerce.number().min(0),
  printingTimeMinutes: z.coerce.number().min(0),
  
  filamentWeight: z.coerce.number({ invalid_type_error: i18n.t('schema_invalid_number') }).min(0.01, i18n.t('schema_filament_weight_required')),
  filamentType: z.string().min(1, i18n.t('schema_filament_type_required')),
  spoolPrice: z.coerce.number({ invalid_type_error: i18n.t('schema_invalid_number') }).min(0.01, i18n.t('schema_spool_price_required')),
  spoolWeight: z.coerce.number({ invalid_type_error: i18n.t('schema_invalid_number') }).min(1, i18n.t('schema_spool_weight_required')),

  // == Optional Fields ==
  projectImage: z.string().optional(),
  currency: z.string().min(1, i18n.t('schema_currency_required')),
  powerConsumptionWatts: z.coerce.number().min(0),
  energyCostKwh: z.coerce.number().min(0),
  prepTime: z.coerce.number().min(0),
  prepCostPerHour: z.coerce.number().min(0),
  postProcessingTimeInMinutes: z.coerce.number().min(0),
  postProcessingCostPerHour: z.coerce.number().min(0),
  includeMachineCosts: z.boolean(),
  printerCost: z.coerce.number().min(0),
  investmentReturnYears: z.coerce.number().min(0),
  repairCost: z.coerce.number().min(0),
  otherCosts: z.array(z.object({
    name: z.string().min(1, i18n.t('schema_item_name_required')),
    price: z.coerce.number().min(0),
  })),
  profitPercentage: z.coerce.number().min(0),
  vatPercentage: z.coerce.number().min(0),
})
.refine(data => data.printingTimeHours > 0 || data.printingTimeMinutes > 0, {
  message: i18n.t('schema_print_time_required'),
  path: ["printingTimeHours"],
});

export type FormData = z.infer<typeof formSchema>;
