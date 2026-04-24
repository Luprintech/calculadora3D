import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { secsToString, formatCost } from './filament-storage';
import type { FilamentPiece, FilamentProject, EditingState } from './filament-types';
import { useTranslation } from 'react-i18next';

interface ChallengePieceListProps {
  project: FilamentProject;
  pieces: FilamentPiece[];
  editingState: EditingState;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void> | void;
  onReorder: (orderedIds: string[]) => Promise<void> | void;
}

export function ChallengePieceList({
  project, pieces, editingState, onEdit, onDelete, onReorder,
}: ChallengePieceListProps) {
  const { t } = useTranslation();
  const [deleteTarget, setDeleteTarget] = useState<FilamentPiece | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const sorted = [...pieces].sort((a, b) => a.orderIndex - b.orderIndex);

  function movePiece(id: string, direction: 'up' | 'down') {
    const currentIndex = sorted.findIndex((piece) => piece.id === id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;
    const next = [...sorted];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next.map((piece) => piece.id));
  }

  function reorderByIds(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const currentIndex = sorted.findIndex((piece) => piece.id === sourceId);
    const targetIndex = sorted.findIndex((piece) => piece.id === targetId);
    if (currentIndex === -1 || targetIndex === -1) return;
    const next = [...sorted];
    const [moved] = next.splice(currentIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next.map((piece) => piece.id));
  }

  function handleDragStart(id: string) {
    setDraggedId(id);
    setDragOverId(id);
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  function handleTouchStart(id: string) {
    setDraggedId(id);
    setDragOverId(id);
  }

  function handleTouchMove(event: React.TouchEvent<HTMLButtonElement>) {
    const touch = event.touches[0];
    if (!touch) return;
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = element?.closest<HTMLElement>('[data-piece-id]');
    const targetId = card?.dataset.pieceId;
    if (targetId) {
      setDragOverId(targetId);
    }
  }

  function handleTouchEnd() {
    if (draggedId && dragOverId) {
      reorderByIds(draggedId, dragOverId);
    }
    handleDragEnd();
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  }

  return (
    <section className="challenge-panel rounded-[24px] border border-white/[0.10] p-6">
      <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row">
        <div>
          <h3 className="text-lg font-extrabold text-foreground">{t('pieces_title')}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {pieces.length > 0 ? t('pieces_count', { count: pieces.length }) : t('pieces_empty_label')}
          </p>
        </div>
        <div className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-xs font-extrabold text-[hsl(var(--challenge-blue))] whitespace-nowrap">
          {pieces.length} / {project.goal}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-[22px] border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-10 text-center text-sm leading-relaxed text-muted-foreground">
          {t('pieces_empty_state').split('\n').map((line, i) => (
            <React.Fragment key={line}>
              {line}
              {i === 0 && <br />}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex max-h-[680px] flex-col gap-3 overflow-y-auto pr-1">
          {sorted.map((piece) => {
            const isBeingEdited = editingState.mode === 'edit' && editingState.id === piece.id;
            return (
              <article
                key={piece.id}
                data-piece-id={piece.id}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverId(piece.id);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  if (draggedId) reorderByIds(draggedId, piece.id);
                  handleDragEnd();
                }}
                className={`rounded-[22px] border p-4 transition-all ${
                  isBeingEdited
                    ? 'border-yellow-400/30 bg-yellow-400/5'
                    : 'border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.05]'
                } ${dragOverId === piece.id && draggedId && draggedId !== piece.id ? 'ring-2 ring-[hsl(var(--challenge-blue))]/50' : ''}`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  {piece.imageUrl && (
                    <img
                      src={piece.imageUrl}
                      alt={piece.name}
                      className="h-14 w-14 shrink-0 rounded-[12px] object-cover border border-white/[0.10]"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-extrabold text-foreground">{piece.name}</p>
                  </div>
                  <button
                    type="button"
                    draggable
                    onDragStart={() => handleDragStart(piece.id)}
                    onDragEnd={handleDragEnd}
                    onTouchStart={() => handleTouchStart(piece.id)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    className="inline-flex shrink-0 cursor-grab touch-none items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] p-2 text-muted-foreground active:cursor-grabbing"
                    aria-label={t('pieces_reorder_aria', { name: piece.name })}
                    title={t('pieces_drag_hint')}
                  >
                    <GripVertical className="h-4 w-4" />
                  </button>
                  <span className="shrink-0 rounded-[14px] bg-[hsl(var(--challenge-pink))]/15 px-3 py-1.5 text-xs font-extrabold text-[hsl(var(--challenge-pink))] whitespace-nowrap">
                    {piece.label}
                  </span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-foreground">
                    {t(`tracker.status.${piece.status === 'post_processed' ? 'postProcessed' : piece.status}` as const)}
                  </span>
                  {piece.printedAt && (
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-muted-foreground">
                      {t('tracker.printDate.title')}: {piece.printedAt}
                    </span>
                  )}
                </div>

                <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-[16px] border border-white/[0.05] bg-black/15 p-3">
                    <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">{t('pieces_time')}</p>
                    <p className="text-sm font-extrabold text-foreground">{secsToString(piece.totalSecs)}</p>
                  </div>
                  <div className="rounded-[16px] border border-white/[0.05] bg-black/15 p-3">
                    <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">{t('pieces_grams')}</p>
                    <p className="text-sm font-extrabold text-foreground">{piece.totalGrams.toFixed(1)}g</p>
                  </div>
                  <div className="rounded-[16px] border border-yellow-400/10 bg-yellow-400/5 p-3">
                    <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">{t('pieces_cost')}</p>
                    <p className="text-sm font-extrabold text-yellow-400">
                      {formatCost(piece.totalCost, project.currency)}
                    </p>
                  </div>
                </div>

                {(piece.materials ?? []).length > 0 && (
                  <div className="mb-3 rounded-[16px] border border-white/[0.05] bg-black/15 p-3">
                    <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">{t('tracker.materials.title')}</p>
                    <div className="space-y-1.5 text-sm text-foreground">
                      {(piece.materials ?? []).map((material) => (
                        <div key={material.id} className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                          <span className="font-semibold">{material.name}</span>
                          <span className="text-muted-foreground">{material.quantity} x {formatCost(material.cost, project.currency)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {piece.notes && (
                  <div className="mb-3 rounded-[16px] border border-white/[0.05] bg-black/15 p-3">
                    <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">{t('tracker.notes.title')}</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{piece.notes}</p>
                  </div>
                )}

                {piece.incident && (
                  <div className="mb-3 rounded-[16px] border border-amber-400/20 bg-amber-400/5 p-3">
                    <p className="mb-1 text-[0.72rem] font-bold uppercase tracking-wider text-muted-foreground">{t('tracker.incident.title')}</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{piece.incident}</p>
                  </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    size="sm" variant="outline"
                    className="rounded-full text-xs font-bold"
                    onClick={() => movePiece(piece.id, 'up')}
                    disabled={sorted[0]?.id === piece.id}
                  >
                    <ArrowUp className="mr-1 h-3.5 w-3.5" /> {t('pieces_move_up')}
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className="rounded-full text-xs font-bold"
                    onClick={() => movePiece(piece.id, 'down')}
                    disabled={sorted[sorted.length - 1]?.id === piece.id}
                  >
                    <ArrowDown className="mr-1 h-3.5 w-3.5" /> {t('pieces_move_down')}
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className="rounded-full text-xs font-bold"
                    onClick={() => onEdit(piece.id)}
                  >
                    {t('pieces_edit')}
                  </Button>
                  <Button
                    size="sm" variant="outline"
                    className="rounded-full border-destructive/30 bg-destructive/10 text-xs font-bold text-destructive hover:bg-destructive/20 hover:text-destructive"
                    onClick={() => setDeleteTarget(piece)}
                  >
                    {t('pieces_delete')}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('pieces_delete_title')}</DialogTitle>
            <DialogDescription>
              {t('pieces_delete_confirm', { label: deleteTarget?.label ?? '', name: deleteTarget?.name ?? '' })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full">{t('cancel')}</Button>
            </DialogClose>
            <Button variant="destructive" className="rounded-full" onClick={handleDeleteConfirm}>
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
