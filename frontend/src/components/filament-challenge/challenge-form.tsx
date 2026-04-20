import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { parseTimeBlock, parseGramBlock, formatCost } from './filament-storage';
import { getTrackerSuccessMessage } from './tracker-messages';
import type { EditingState, FilamentPiece, FilamentProject } from './filament-types';
import type { PieceInput } from './use-filament-storage';
import { useTranslation } from 'react-i18next';

interface FormValues {
  label: string;
  name: string;
  timeText: string;
  gramText: string;
}

// ── Compress image to base64 data URL ──────────────────────────────────────────
async function compressImage(file: File, maxPx = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxPx / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas ctx')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ChallengeFormProps {
  project: FilamentProject;
  editingState: EditingState;
  pieces: FilamentPiece[];
  onSave: (input: PieceInput) => Promise<void> | void;
  onUpdate: (id: string, input: PieceInput) => Promise<void> | void;
  onCancelEdit: () => void;
}

export function ChallengeForm({
  project,
  editingState,
  pieces,
  onSave,
  onUpdate,
  onCancelEdit,
}: ChallengeFormProps) {
  const { t } = useTranslation();
  const isEditing = editingState.mode === 'edit';

  const { register, handleSubmit, watch, reset, setValue, setError, formState: { errors } } =
    useForm<FormValues>({ defaultValues: { label: '', name: '', timeText: '', gramText: '' } });

  const [successMsg, setSuccessMsg] = useState('');
  const [milestoneUnlocked, setMilestoneUnlocked] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const timeText = watch('timeText') ?? '';
  const gramText = watch('gramText') ?? '';

  const previewTime  = parseTimeBlock(timeText);
  const previewGrams = parseGramBlock(gramText);
  const previewCost  = previewGrams.totalGrams * (project.pricePerKg / 1000);

  // Populate form when entering edit mode
  useEffect(() => {
    if (editingState.mode === 'edit') {
      const piece = pieces.find((p) => p.id === editingState.id);
      if (piece) {
        setValue('label',    piece.label);
        setValue('name',     piece.name);
        setValue('timeText', piece.timeText);
        setValue('gramText', piece.gramText);
        setImagePreview(piece.imageUrl ?? null);
        setImageError('');
        setSuccessMsg('');
        setMilestoneUnlocked(null);
      }
    }
  }, [editingState, pieces, setValue]);

  function handleCancel() {
    reset({ label: '', name: '', timeText: '', gramText: '' });
    setImagePreview(null);
    setImageError('');
    setSuccessMsg('');
    setMilestoneUnlocked(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onCancelEdit();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError(t('form_err_img_type'));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError(t('form_err_img_size'));
      return;
    }
    setImageError('');
    try {
      const dataUrl = await compressImage(file);
      setImagePreview(dataUrl);
    } catch {
      setImageError(t('form_err_img_process'));
    }
  }

  function onSubmit(values: FormValues) {
    setSuccessMsg('');

    if (!values.label.trim()) {
      setError('label', { message: t('form_err_label') });
      return;
    }
    if (!values.name.trim()) {
      setError('name', { message: t('form_err_name') });
      return;
    }

    const time  = parseTimeBlock(values.timeText);
    if (time.validLines === 0) {
      setError('timeText', { message: t('form_err_time') });
      return;
    }

    const grams = parseGramBlock(values.gramText);
    if (grams.validLines === 0) {
      setError('gramText', { message: t('form_err_grams') });
      return;
    }

    const editingId = isEditing ? (editingState as { mode: 'edit'; id: string }).id : null;

    const input: PieceInput = {
      label:    values.label.trim(),
      name:     values.name.trim(),
      timeText: values.timeText,
      gramText: values.gramText,
      imageUrl: imagePreview ?? null,
    };

    if (isEditing && editingId) {
      onUpdate(editingId, input);
      const feedback = getTrackerSuccessMessage(project, 'update', pieces.length);
      setSuccessMsg(feedback.message);
      setMilestoneUnlocked(feedback.milestone);
    } else {
      onSave(input);
      const feedback = getTrackerSuccessMessage(project, 'create', pieces.length + 1);
      setSuccessMsg(feedback.message);
      setMilestoneUnlocked(feedback.milestone);
    }

    reset({ label: '', name: '', timeText: '', gramText: '' });
    setImagePreview(null);
    setImageError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onCancelEdit();
  }

  return (
    <section className="challenge-panel rounded-[24px] border border-white/[0.10] p-6">
      <h3 className="mb-1 text-lg font-extrabold text-foreground">{t('form_title')}</h3>
      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
        {t('form_subtitle')}
      </p>

      {isEditing && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold text-yellow-300">
          {t('form_editing_badge')}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ch-label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('form_label')}
            </Label>
            <Input
              id="ch-label"
              placeholder={t('form_label_placeholder')}
              className="challenge-input"
              {...register('label')}
            />
            {errors.label && (
              <p className="text-xs font-semibold text-destructive">{errors.label.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ch-name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('form_name')}
            </Label>
            <Input
              id="ch-name"
              placeholder={t('form_name_placeholder')}
              className="challenge-input"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs font-semibold text-destructive">{errors.name.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ch-time" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('form_time')}
          </Label>
          <Input
            id="ch-time"
            placeholder={t('form_time_placeholder')}
            className="challenge-input"
            {...register('timeText')}
          />
          <p className="text-[0.8rem] text-muted-foreground">{t('form_time_hint')}</p>
          {errors.timeText && (
            <p className="text-xs font-semibold text-destructive">{errors.timeText.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ch-grams" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('form_grams')}
          </Label>
          <Input
            id="ch-grams"
            placeholder={t('form_grams_placeholder')}
            className="challenge-input"
            {...register('gramText')}
          />
          <p className="text-[0.8rem] text-muted-foreground">{t('form_grams_hint')}</p>
          {errors.gramText && (
            <p className="text-xs font-semibold text-destructive">{errors.gramText.message}</p>
          )}
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('form_image')} <span className="normal-case font-normal">{t('form_image_optional')}</span>
          </Label>
          <div className="flex items-start gap-3">
            {imagePreview ? (
              <div className="relative shrink-0">
                <img
                  src={imagePreview}
                  alt={t('cf_image_preview')}
                  className="h-20 w-20 rounded-[14px] object-cover border border-white/[0.12]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[0.65rem] font-black text-white shadow-md"
                  aria-label={t('delete')}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[14px] border border-dashed border-white/[0.18] bg-white/[0.03] text-muted-foreground">
                <span className="text-2xl">📷</span>
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-bold"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? t('form_image_change') : t('form_image_upload')}
              </Button>
              <p className="text-[0.75rem] text-muted-foreground">{t('form_image_hint')}</p>
              {imageError && (
                <p className="text-xs font-semibold text-destructive">{imageError}</p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Live preview — solo coste */}
        <div className="rounded-[18px] border border-yellow-400/20 bg-yellow-400/8 p-4">
          <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-widest text-muted-foreground">{t('form_cost_preview')}</p>
          <p className="text-lg font-black text-yellow-400">
            {formatCost(previewCost, project.currency)}
          </p>
          <p className="mt-1 text-[0.75rem] text-muted-foreground">
            {project.pricePerKg > 0 ? `${formatCost(project.pricePerKg, project.currency)}/kg` : t('form_no_price')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button type="submit" className="challenge-btn-primary rounded-full font-extrabold">
            {isEditing ? t('form_save_changes') : t('form_save')}
          </Button>
          {isEditing && (
            <Button type="button" variant="outline" onClick={handleCancel} className="rounded-full font-bold">
              {t('form_cancel')}
            </Button>
          )}
        </div>

        {successMsg && (
          <div className={cn(
            'rounded-2xl px-4 py-4 text-sm text-foreground transition-all',
            milestoneUnlocked
              ? 'tracker-milestone-banner border border-[hsl(var(--challenge-pink))]/25'
              : 'border border-[hsl(var(--challenge-blue))]/25 bg-[hsl(var(--challenge-blue))]/10'
          )}>
            {milestoneUnlocked && (
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.72rem] font-black uppercase tracking-[0.18em] text-white">
                  {t('form_milestone_badge')}
                </span>
                <span className="inline-flex items-center rounded-full bg-[hsl(var(--challenge-pink))]/20 px-3 py-1 text-xs font-extrabold text-white">
                  {milestoneUnlocked} {t('hero_pieces')}
                </span>
              </div>
            )}
            <p className={cn('font-bold', milestoneUnlocked && 'text-white text-base')}>
              {successMsg}
            </p>
            {milestoneUnlocked && (
              <p className="mt-2 text-xs font-medium text-white/85">
                {t('form_milestone_sub')}
              </p>
            )}
          </div>
        )}
      </form>

      <p className="mt-4 text-[0.82rem] leading-relaxed text-muted-foreground">
        {t('form_cloud_hint')}
      </p>
    </section>
  );
}
