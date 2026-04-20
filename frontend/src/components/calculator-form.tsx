
import React, { useRef, useState } from "react";
import { useFieldArray, type UseFormReturn } from "react-hook-form";
import { type FormData } from "@/lib/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { PdfCustomizer } from "@/components/pdf-customizer";
import { type ProjectData } from "@/features/calculator/api/use-pdf-customization";
import {
  UploadCloud,
  Loader2,
  Trash2,
  PlusCircle,
  Share2,
  FileText,
  Clock,
  Weight,
  Palette,
  DollarSign,
  Wrench,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Info,
  ImagePlus,
  Save,
  FilePlus,
  Sparkles,
} from "lucide-react";
import { TooltipProvider } from "./ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from "react-i18next";
import { calculateCostBreakdown } from "@/features/calculator/domain/cost-calculator";
import { useCalculatorActions } from "@/features/calculator/model/use-calculator-actions";

export function CalculatorForm({ form, onProjectSaved }: { form: UseFormReturn<FormData>; onProjectSaved?: () => void }) {
  const { toast } = useToast();
  const { user, loginWithGoogle } = useAuth();
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "otherCosts",
  });


  const watchedValues = form.watch();

  const calculations = calculateCostBreakdown({
    printingTimeHours: Number(watchedValues.printingTimeHours || 0),
    printingTimeMinutes: Number(watchedValues.printingTimeMinutes || 0),
    filamentWeight: Number(watchedValues.filamentWeight || 0),
    spoolWeight: Number(watchedValues.spoolWeight || 1000),
    spoolPrice: Number(watchedValues.spoolPrice || 0),
    powerConsumptionWatts: Number(watchedValues.powerConsumptionWatts || 0),
    energyCostKwh: Number(watchedValues.energyCostKwh || 0),
    prepTime: Number(watchedValues.prepTime || 0),
    prepCostPerHour: Number(watchedValues.prepCostPerHour || 0),
    postProcessingTimeInMinutes: Number(watchedValues.postProcessingTimeInMinutes || 0),
    postProcessingCostPerHour: Number(watchedValues.postProcessingCostPerHour || 0),
    includeMachineCosts: watchedValues.includeMachineCosts,
    printerCost: Number(watchedValues.printerCost || 0),
    investmentReturnYears: Number(watchedValues.investmentReturnYears || 0),
    repairCost: Number(watchedValues.repairCost || 0),
    otherCosts: watchedValues.otherCosts || [],
    profitPercentage: Number(watchedValues.profitPercentage || 0),
    vatPercentage: Number(watchedValues.vatPercentage || 0),
  });

  const {
    isAnalyzing,
    isSaving,
    analysisFeedback,
    formatCurrency,
    handleNewProject,
    handleSaveProject,
    handleGcodeAnalyze,
    handleImageUpload,
    handleShare,
  } = useCalculatorActions({
    form,
    user,
    loginWithGoogle,
    toast,
    t,
    watchedValues,
    calculations,
    onProjectSaved,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [pdfCustomizerOpen, setPdfCustomizerOpen] = useState(false);
  const totalSteps = 4;

  const wizardSteps = [
    { title: t('cf_details_title'), subtitle: t('cf_details_subtitle') },
    { title: t('wizard_step_material_energy', { defaultValue: `${t('cf_filament_title')} + ${t('cf_electricity_title')}` }), subtitle: t('cf_filament_subtitle') },
    { title: t('cf_labor_title'), subtitle: t('wizard_step_operations_subtitle', { defaultValue: t('cf_machine_section') }) },
    { title: t('cf_final_title'), subtitle: t('cf_final_subtitle') },
  ];

  const visibleAccordionItems =
    currentStep === 0
      ? ['job-details']
      : currentStep === 1
        ? ['filament-costs', 'electricity-costs']
        : currentStep === 2
          ? ['labor-costs']
          : ['final-price'];

  const goNext = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const goPrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const inputClass = "h-11";
  const sectionCardClass = "border-border/60 shadow-sm";
  const iconClass = "h-4 w-4";


  return (
    <TooltipProvider>
      <Form {...form}>
        <div className="space-y-4 print:hidden">
          <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-headline text-2xl">{wizardSteps[currentStep].title}</h2>
                  <p className="text-sm text-muted-foreground">{wizardSteps[currentStep].subtitle}</p>
                </div>
                <div className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                  {t('wizard_progress', { defaultValue: `Paso ${currentStep + 1} de ${totalSteps}` })}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
                {wizardSteps.map((step, index) => {
                  const isActive = index === currentStep;
                  const isComplete = index < currentStep;
                  return (
                    <button
                      key={step.title}
                      type="button"
                      onClick={() => setCurrentStep(index)}
                      className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                        isActive
                          ? 'border-primary bg-primary/10 text-primary'
                          : isComplete
                            ? 'border-primary/30 bg-primary/5 text-foreground'
                            : 'border-border bg-background text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="text-xs uppercase tracking-wide">{t('wizard_step_label', { defaultValue: `Paso ${index + 1}` })}</div>
                      <div className="font-medium leading-tight">{step.title}</div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <div key={currentStep} className="space-y-4 animate-in fade-in-0 slide-in-from-right-1 duration-300">
            <Accordion 
              type="multiple" 
              className="w-full space-y-4"
              value={visibleAccordionItems}
            >
              {currentStep === 0 && <Card className={sectionCardClass}>
              <AccordionItem value="job-details" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="text-left">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><FileText className={`${iconClass} text-primary`}/> {t('cf_details_title')}</CardTitle>
                    <CardDescription>{t('cf_details_subtitle')}</CardDescription>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <FormField control={form.control} name="jobName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('cf_job_name')} <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input className={inputClass} placeholder={t('cf_job_placeholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('cf_currency')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className={inputClass}>
                                  <SelectValue placeholder={t('cf_currency_select')} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="EUR">{t('currency_eur')}</SelectItem>
                                <SelectItem value="USD">{t('currency_usd')}</SelectItem>
                                <SelectItem value="GBP">{t('currency_gbp')}</SelectItem>
                                <SelectItem value="JPY">{t('currency_jpy')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormLabel>{t('cf_image')}</FormLabel>
                       <div className="flex items-center gap-4">
                          <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              ref={imageInputRef}
                              onChange={handleImageUpload}
                          />
                          <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}>
                              <ImagePlus className={`mr-2 ${iconClass}`} /> {t('cf_image_upload')}
                          </Button>
                          {watchedValues.projectImage && (
                              <div className="relative">
                                  <img
                                      src={watchedValues.projectImage}
                                      alt={t('cf_image_preview')}
                                      width={64}
                                      height={64}
                                      className="h-16 w-16 rounded-md object-cover border"
                                  />
                                  <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                                      onClick={() => form.setValue('projectImage', '')}
                                  >
                                      <Trash2 className="h-3 w-3" />
                                  </Button>
                              </div>
                          )}
                      </div>
                      <FormDescription>
                          {t('cf_image_hint')}
                      </FormDescription>
                    </div>
                    <Separator />
                    <div>
                      <FormLabel>{t('cf_gcode_title')}</FormLabel>
                      <div className="mt-2">
                        <input type="file" ref={fileInputRef} onChange={handleGcodeAnalyze} accept=".gcode,.3mf" className="hidden" />
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
                          {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                          {isAnalyzing ? t('cf_gcode_analyzing') : t('cf_gcode_upload')}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">{t('cf_gcode_hint')}</p>
                      </div>
                      {analysisFeedback.kind !== 'idle' && (
                        <div
                          className={`mt-3 rounded-lg border p-3 text-sm ${
                            analysisFeedback.kind === 'success'
                              ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-300'
                              : analysisFeedback.kind === 'partial'
                                ? 'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                                : 'border-destructive/40 bg-destructive/10 text-destructive'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {analysisFeedback.kind === 'success' ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4" />
                            ) : analysisFeedback.kind === 'partial' ? (
                              <AlertTriangle className="mt-0.5 h-4 w-4" />
                            ) : (
                              <Info className="mt-0.5 h-4 w-4" />
                            )}
                            <div className="space-y-1">
                              <p className="font-medium">
                                {analysisFeedback.kind === 'success'
                                  ? t('toast_analysis_ok')
                                  : analysisFeedback.kind === 'partial'
                                    ? t('toast_analysis_partial')
                                    : analysisFeedback.kind === 'empty'
                                      ? t('toast_analysis_none')
                                      : t('toast_server_error')}
                              </p>
                              {analysisFeedback.kind === 'success' && analysisFeedback.updated && (
                                <p>{t('toast_analysis_ok_msg', { fields: analysisFeedback.updated.join(' y ') })}</p>
                              )}
                              {analysisFeedback.kind === 'partial' && (
                                <p>
                                  {t('toast_analysis_partial_msg', {
                                    updated: analysisFeedback.updated?.join(', ') ?? '',
                                    missing: analysisFeedback.missing?.join(', ') ?? '',
                                  })}
                                </p>
                              )}
                              {analysisFeedback.kind === 'empty' && <p>{t('toast_analysis_none_msg')}</p>}
                              {analysisFeedback.kind === 'error' && analysisFeedback.error && <p>{analysisFeedback.error}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <FormLabel className="flex items-center gap-2"><Clock className={iconClass}/> {t('cf_print_time')} <span className="text-destructive">*</span></FormLabel>
                          <div className="flex items-center gap-2">
                              <FormField
                                  control={form.control}
                                  name="printingTimeHours"
                                  render={({ field }) => (
                                      <FormItem className="w-full">
                                          <FormControl>
                                              <div className="relative">
                          <Input type="number" placeholder={t('cf_hours')} className={`${inputClass} pr-8`} {...field} />
                                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm pointer-events-none">h</span>
                                              </div>
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                              <FormField
                                  control={form.control}
                                  name="printingTimeMinutes"
                                  render={({ field }) => (
                                      <FormItem className="w-full">
                                          <FormControl>
                                              <div className="relative">
                                                  <Input type="number" placeholder={t('cf_minutes')} className={`${inputClass} pr-8`} {...field} />
                                                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground text-sm pointer-events-none">m</span>
                                              </div>
                                          </FormControl>
                                          <FormMessage />
                                      </FormItem>
                                  )}
                              />
                          </div>
                      </div>
                      <FormField control={form.control} name="filamentWeight" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2"><Weight className={iconClass}/> {t('cf_weight')} <span className="text-destructive">*</span></FormLabel>
                          <FormControl><Input className={inputClass} type="number" step="0.01" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>}

              {currentStep === 1 && <Card className={sectionCardClass}>
              <AccordionItem value="filament-costs" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="text-left">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Palette className={`${iconClass} text-primary`}/> {t('cf_filament_title')}</CardTitle>
                    <CardDescription>{t('cf_filament_subtitle')}</CardDescription>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="filamentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('cf_filament_type')} <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={inputClass}>
                                <SelectValue placeholder={t('cf_filament_select')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PLA">PLA</SelectItem>
                              <SelectItem value="PETG">PETG</SelectItem>
                              <SelectItem value="ASA">ASA</SelectItem>
                              <SelectItem value="ABS">ABS</SelectItem>
                              <SelectItem value="OTROS">{t('cf_filament_other')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField control={form.control} name="spoolPrice" render={({ field }) => (
                        <FormItem><FormLabel>{t('cf_spool_price')} <span className="text-destructive">*</span></FormLabel><FormControl><Input className={inputClass} type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="spoolWeight" render={({ field }) => (
                        <FormItem><FormLabel>{t('cf_spool_weight')} <span className="text-destructive">*</span></FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>
                  <Separator className="my-6" />
                  <div className="flex justify-between font-medium text-lg">
                      <span>{t('cf_filament_total')}</span>
                      <span className="text-primary">{formatCurrency(calculations.filamentCost)}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>}

            {currentStep === 1 && <Card className={sectionCardClass}>
              <AccordionItem value="electricity-costs" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="text-left">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Zap className={`${iconClass} text-primary`}/> {t('cf_electricity_title')}</CardTitle>
                    <CardDescription>{t('cf_electricity_subtitle')}</CardDescription>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="powerConsumptionWatts" render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('cf_watts')}</FormLabel>
                          <FormControl><Input className={inputClass} type="number" placeholder={t('cf_watts_placeholder')} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="energyCostKwh" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('cf_kwh_cost')}</FormLabel>
                            <FormControl><Input className={inputClass} type="number" step="0.01" placeholder={t('cf_kwh_placeholder')} {...field} /></FormControl>
                            <FormDescription>{t('cf_kwh_hint')}</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )} />
                  </div>
                  <Separator className="my-6" />
                  <div className="flex justify-between font-medium text-lg">
                      <span>{t('cf_electricity_total')}</span>
                      <span className="text-primary">{formatCurrency(calculations.electricityCost)}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>}

            {currentStep === 2 && <Card className={sectionCardClass}>
              <AccordionItem value="labor-costs" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="text-left">
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wrench className={`${iconClass} text-primary`}/> {t('cf_labor_title')}</CardTitle>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">{t('cf_labor_section')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField control={form.control} name="prepTime" render={({ field }) => (<FormItem><FormLabel>{t('cf_prep_time')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>)} />
                          <FormField control={form.control} name="prepCostPerHour" render={({ field }) => (<FormItem><FormLabel>{t('cf_prep_cost')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>)} />
                          
                          <FormField
                              control={form.control}
                              name="postProcessingTimeInMinutes"
                              render={({ field }) => (
                                  <FormItem>
                                      <FormLabel>{t('cf_post_time')}</FormLabel>
                                      <FormControl><Input className={inputClass} type="number" {...field} /></FormControl>
                                  </FormItem>
                              )}
                          />

                           <FormField control={form.control} name="postProcessingCostPerHour" render={({ field }) => (<FormItem><FormLabel>{t('cf_post_cost')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>)} />
                      </div>
                      <Separator className="my-6" />
                      <div className="flex justify-between font-medium text-lg">
                          <span>{t('cf_labor_total')}</span>
                          <span className="text-primary">{formatCurrency(calculations.laborCost)}</span>
                      </div>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="font-semibold mb-2">{t('cf_machine_section')}</h3>
                        <FormField control={form.control} name="includeMachineCosts" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel>{t('cf_machine_toggle')}</FormLabel>
                                    <FormDescription>{t('cf_machine_toggle_hint')}</FormDescription>
                                </div>
                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            </FormItem>
                        )} />
                        {watchedValues.includeMachineCosts && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <FormField control={form.control} name="printerCost" render={({ field }) => (
                                  <FormItem><FormLabel>{t('cf_printer_cost')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>
                              )} />
                              <FormField control={form.control} name="investmentReturnYears" render={({ field }) => (
                                  <FormItem><FormLabel>{t('cf_roi_years')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>
                              )} />
                               <FormField control={form.control} name="repairCost" render={({ field }) => (
                                  <FormItem><FormLabel>{t('cf_repair_cost')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl><FormDescription>{t('cf_repair_hint')}</FormDescription></FormItem>
                              )} />
                            </div>
                        )}
                      <Separator className="my-6" />
                      <div className="flex justify-between font-medium text-lg">
                          <span>{t('cf_machine_total')}</span>
                          <span className="text-primary">{formatCurrency(calculations.currentMachineCost)}</span>
                      </div>
                    </div>
                    <Separator/>
                    <div>
                      <h3 className="font-semibold mb-2">{t('cf_other_section')}</h3>
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-end gap-2 mb-2">
                            <FormField control={form.control} name={`otherCosts.${index}.name`} render={({ field }) => (<FormItem className="flex-grow"><FormLabel className={index > 0 ? 'sr-only' : ''}>{t('cf_item_name')}</FormLabel><FormControl><Input className={inputClass} placeholder={t('cf_item_placeholder')} {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name={`otherCosts.${index}.price`} render={({ field }) => (<FormItem><FormLabel className={index > 0 ? 'sr-only' : ''}>{t('cf_item_price')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive"><Trash2 size={16} /></Button>
                            </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: 0 })} className="mt-2"><PlusCircle className="mr-2 h-4 w-4" /> {t('cf_add_cost')}</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>}
          
              {currentStep === 3 && <Card className={sectionCardClass}>
              <AccordionItem value="final-price" className="border-b-0">
                <AccordionTrigger className="p-6 hover:no-underline">
                  <div className="text-left">
                      <CardTitle className="font-headline text-2xl flex items-center gap-2"><DollarSign className={`${iconClass} text-primary`}/> {t('cf_final_title')}</CardTitle>
                      <CardDescription>{t('cf_final_subtitle')}</CardDescription>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="profitPercentage" render={({ field }) => (<FormItem><FormLabel>{t('cf_profit_pct')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>)} />
                      <FormField control={form.control} name="vatPercentage" render={({ field }) => (<FormItem><FormLabel>{t('cf_vat')}</FormLabel><FormControl><Input className={inputClass} type="number" {...field} /></FormControl></FormItem>)} />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-muted/50 p-6 rounded-b-lg">
                      <div className="w-full space-y-2">
                          <div className="flex justify-between text-sm"><span>{t('cf_subtotal')}</span><span>{formatCurrency(calculations.subTotal)}</span></div>
                          <div className="flex justify-between text-sm"><span>{t('cf_profit')}</span><span>{formatCurrency(calculations.profitAmount)}</span></div>
                          <div className="flex justify-between text-sm"><span>{t('cf_vat_label')}</span><span>{formatCurrency(calculations.vatAmount)}</span></div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-2xl font-bold text-primary">
                              <span className="font-headline">{t('cf_final_price')}</span>
                              <span>{formatCurrency(calculations.finalPrice)}</span>
                          </div>
                      </div>
                  </CardFooter>
                </AccordionContent>
              </AccordionItem>
              </Card>}
            </Accordion>
            </div>

          </div>
          
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between gap-3">
              <Button type="button" onClick={goPrev} variant="outline" disabled={currentStep === 0}>
                {t('wizard_back', { defaultValue: 'Atrás' })}
              </Button>
              {currentStep < totalSteps - 1 ? (
                <Button type="button" onClick={goNext}>
                  {t('wizard_next', { defaultValue: 'Continuar' })}
                </Button>
              ) : (
                <Button type="button" onClick={handleNewProject} variant="outline">
                  <FilePlus className="mr-2 h-4 w-4" /> {t('cf_new_project')}
                </Button>
              )}
            </div>

            {currentStep === totalSteps - 1 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-end pt-2">
                <Button onClick={handleSaveProject} disabled={isSaving} size="default" className="w-full sm:w-auto">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? t('cf_saving') : t('cf_save_project')}
                </Button>
                <Button type="button" onClick={handleShare} variant="outline" className="w-full sm:w-auto"><Share2 className="mr-2 h-4 w-4"/> {t('cf_share')}</Button>
                {user && (
                  <Button 
                    type="button" 
                    onClick={() => setPdfCustomizerOpen(true)} 
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-transform hover:scale-105"
                  >
                    <Sparkles className="mr-2 h-4 w-4"/> Customizar PDF
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* PDF Customizer Modal */}
        {user && (
          <PdfCustomizer
            open={pdfCustomizerOpen}
            onOpenChange={setPdfCustomizerOpen}
            projectData={{
              jobName: watchedValues.jobName,
              printingTimeHours: Number(watchedValues.printingTimeHours || 0),
              printingTimeMinutes: Number(watchedValues.printingTimeMinutes || 0),
              filamentWeight: Number(watchedValues.filamentWeight || 0),
              spoolWeight: Number(watchedValues.spoolWeight || 1000),
              spoolPrice: Number(watchedValues.spoolPrice || 0),
              powerConsumptionWatts: Number(watchedValues.powerConsumptionWatts || 0),
              energyCostKwh: Number(watchedValues.energyCostKwh || 0),
              prepTime: Number(watchedValues.prepTime || 0),
              prepCostPerHour: Number(watchedValues.prepCostPerHour || 0),
              postProcessingTimeInMinutes: Number(watchedValues.postProcessingTimeInMinutes || 0),
              postProcessingCostPerHour: Number(watchedValues.postProcessingCostPerHour || 0),
              includeMachineCosts: watchedValues.includeMachineCosts,
              printerCost: Number(watchedValues.printerCost || 0),
              investmentReturnYears: Number(watchedValues.investmentReturnYears || 0),
              repairCost: Number(watchedValues.repairCost || 0),
              otherCosts: (watchedValues.otherCosts || []).map(item => ({
                description: item.name || '',
                cost: Number(item.price || 0),
              })),
              profitPercentage: Number(watchedValues.profitPercentage || 0),
              vatPercentage: Number(watchedValues.vatPercentage || 0),
              currency: watchedValues.currency || 'EUR',
              filamentCost: calculations.filamentCost,
              electricityCost: calculations.electricityCost,
              laborCost: calculations.laborCost,
              machineCost: calculations.currentMachineCost,
              otherCostsTotal: calculations.otherCostsTotal,
              subTotal: calculations.subTotal,
              profitAmount: calculations.profitAmount,
              priceBeforeVat: calculations.priceBeforeVat,
              vatAmount: calculations.vatAmount,
              finalPrice: calculations.finalPrice,
            }}
          />
        )}
      </Form>
    </TooltipProvider>
  );
}

    
