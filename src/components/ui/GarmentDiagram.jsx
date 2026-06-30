import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { STAIN_TYPES, SEVERITY_COLORS } from '../../lib/mock/mockIntake.js';

// SVG viewBox 0 0 100 120 for all garment shapes
const GARMENT_PATHS = {
  shirt_front: 'M 42,18 L 16,34 L 16,58 L 30,58 L 30,106 L 70,106 L 70,58 L 84,58 L 84,34 L 58,18 C 54,13 46,13 42,18 Z',
  shirt_back:  'M 42,18 L 16,34 L 16,58 L 30,58 L 30,106 L 70,106 L 70,58 L 84,58 L 84,34 L 58,18 L 42,18 Z',
  trouser:     'M 20,12 L 80,12 L 84,44 L 88,108 L 65,108 L 52,62 L 48,62 L 35,108 L 12,108 L 16,44 Z',
  dress_front: 'M 42,18 L 16,34 L 16,56 L 23,56 L 8,108 L 92,108 L 77,56 L 84,56 L 84,34 L 58,18 C 54,13 46,13 42,18 Z',
  dress_back:  'M 42,18 L 16,34 L 16,56 L 23,56 L 8,108 L 92,108 L 77,56 L 84,56 L 84,34 L 58,18 L 42,18 Z',
  flat:        'M 8,20 L 92,20 L 92,100 L 8,100 Z',
};

const TYPE_SHAPE_MAP = {
  shirt:     { front: 'shirt_front', back: 'shirt_back'  },
  trouser:   { front: 'trouser',     back: 'trouser'     },
  suit:      { front: 'shirt_front', back: 'shirt_back'  },
  jacket:    { front: 'shirt_front', back: 'shirt_back'  },
  dress:     { front: 'dress_front', back: 'dress_back'  },
  bedsheet:  { front: 'flat',        back: 'flat'        },
  duvet:     { front: 'flat',        back: 'flat'        },
  curtain:   { front: 'flat',        back: 'flat'        },
  towel:     { front: 'flat',        back: 'flat'        },
  iron_only: { front: 'shirt_front', back: 'shirt_back'  },
};

function getShapes(garmentType) {
  return TYPE_SHAPE_MAP[garmentType] ?? TYPE_SHAPE_MAP.shirt;
}

function StainMarker({ stain, onSelect }) {
  const typeInfo  = STAIN_TYPES.find(t => t.id === stain.type)  ?? STAIN_TYPES[7];
  const sevColors = SEVERITY_COLORS[stain.severity] ?? SEVERITY_COLORS.medium;
  const cx = stain.x * 100;
  const cy = stain.y * 120;

  return (
    <g
      transform={`translate(${cx},${cy})`}
      onClick={e => { e.stopPropagation(); onSelect(stain); }}
      style={{ cursor: 'pointer' }}
    >
      <circle r="7" fill={sevColors.bg} stroke={sevColors.border} strokeWidth="1.5" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="5"
        fontWeight="bold"
        fill={typeInfo.text}
      >
        {typeInfo.abbr}
      </text>
    </g>
  );
}

function DiagramPanel({ pathKey, stains, onClickDiagram, onSelectStain, label, readOnly }) {
  const d = GARMENT_PATHS[pathKey] ?? GARMENT_PATHS.flat;

  function handleClick(e) {
    if (readOnly) return;
    const svg = e.currentTarget;
    const pt  = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const local = pt.matrixTransform(svg.getScreenCTM().inverse());
    onClickDiagram(local.x / 100, local.y / 120);
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
      <svg
        viewBox="0 0 100 120"
        className={cn(
          'h-44 w-auto rounded-lg border bg-neutral-50',
          readOnly
            ? 'border-neutral-200'
            : 'cursor-crosshair border-neutral-300 hover:border-neutral-400 transition-colors',
        )}
        style={{ aspectRatio: '100/120' }}
        onClick={handleClick}
      >
        <path d={d} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
        {stains.map(s => (
          <StainMarker key={s.id} stain={s} onSelect={onSelectStain} />
        ))}
      </svg>
    </div>
  );
}

const DEFAULT_FORM = { type: 'food', severity: 'medium', notes: '' };

export default function GarmentDiagram({ garmentType, stains = [], onAddStain, onUpdateStain, onRemoveStain, readOnly = false }) {
  const [pendingPos,   setPendingPos]   = useState(null); // { x, y, side }
  const [editingStain, setEditingStain] = useState(null); // stain object
  const [form, setForm] = useState(DEFAULT_FORM);

  const shapes = getShapes(garmentType);

  function handleClickDiagram(x, y, side) {
    setForm(DEFAULT_FORM);
    setPendingPos({ x, y, side });
    setEditingStain(null);
  }

  function handleSelectStain(stain) {
    if (readOnly) return;
    setEditingStain(stain);
    setPendingPos(null);
    setForm({ type: stain.type, severity: stain.severity, notes: stain.notes ?? '' });
  }

  function handleAdd() {
    if (!pendingPos) return;
    onAddStain?.({ ...pendingPos, ...form });
    setPendingPos(null);
  }

  function handleSaveEdit() {
    if (!editingStain) return;
    onUpdateStain?.(editingStain.id, form);
    setEditingStain(null);
  }

  function handleDelete() {
    if (!editingStain) return;
    onRemoveStain?.(editingStain.id);
    setEditingStain(null);
  }

  function closeModal() {
    setPendingPos(null);
    setEditingStain(null);
  }

  const modalOpen = !!(pendingPos || editingStain);
  const isEdit    = !!editingStain;

  const frontStains = stains.filter(s => s.side === 'front');
  const backStains  = stains.filter(s => s.side === 'back');

  return (
    <div className="space-y-3">
      {/* Diagram panels */}
      <div className="flex gap-6 justify-center">
        <DiagramPanel
          pathKey={shapes.front}
          stains={frontStains}
          onClickDiagram={(x, y) => handleClickDiagram(x, y, 'front')}
          onSelectStain={handleSelectStain}
          label="Front"
          readOnly={readOnly}
        />
        <DiagramPanel
          pathKey={shapes.back}
          stains={backStains}
          onClickDiagram={(x, y) => handleClickDiagram(x, y, 'back')}
          onSelectStain={handleSelectStain}
          label="Back"
          readOnly={readOnly}
        />
      </div>

      {/* Instruction */}
      {!readOnly && (
        <p className="text-center text-[10px] text-neutral-400">
          Click on the garment to mark a stain location. Click a marker to edit.
        </p>
      )}

      {/* Stain legend */}
      {stains.length > 0 && (
        <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Marked stains</p>
          <div className="flex flex-wrap gap-1.5">
            {stains.map((s, i) => {
              const t   = STAIN_TYPES.find(x => x.id === s.type) ?? STAIN_TYPES[7];
              const sev = SEVERITY_COLORS[s.severity] ?? SEVERITY_COLORS.medium;
              return (
                <button
                  key={s.id}
                  onClick={() => !readOnly && handleSelectStain(s)}
                  className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors hover:shadow-sm"
                  style={{ background: sev.bg, borderColor: sev.border, color: sev.label }}
                >
                  <span className="font-bold">{t.abbr}</span>
                  <span>{t.label}</span>
                  <span className="opacity-60">· {s.side}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
              <div>
                <p className="text-small font-semibold text-neutral-900">
                  {isEdit ? 'Edit stain marker' : `Add stain — ${pendingPos?.side} view`}
                </p>
              </div>
              <button onClick={closeModal} className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Stain type */}
              <div className="space-y-2">
                <p className="text-caption font-semibold text-neutral-700">Type of stain</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {STAIN_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setForm(f => ({ ...f, type: t.id }))}
                      className={cn(
                        'rounded-lg border px-2 py-1.5 text-[10px] font-semibold transition-all',
                        form.type === t.id
                          ? 'ring-2 ring-primary-300'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-300',
                      )}
                      style={form.type === t.id
                        ? { background: t.fill, borderColor: t.stroke, color: t.text }
                        : undefined}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <p className="text-caption font-semibold text-neutral-700">Severity</p>
                <div className="flex gap-2">
                  {[['light', 'Light'], ['medium', 'Medium'], ['heavy', 'Heavy']].map(([val, label]) => {
                    const sev = SEVERITY_COLORS[val];
                    return (
                      <button
                        key={val}
                        onClick={() => setForm(f => ({ ...f, severity: val }))}
                        className={cn(
                          'flex-1 rounded-lg border py-2 text-[11px] font-semibold transition-all',
                          form.severity === val ? 'ring-2 ring-neutral-400' : 'hover:opacity-80',
                        )}
                        style={{ background: sev.bg, borderColor: sev.border, color: sev.label }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-caption font-semibold text-neutral-700">Notes <span className="font-normal text-neutral-400">(optional)</span></label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Describe the stain or its cause…"
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isEdit ? (
                  <>
                    <button
                      onClick={handleDelete}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-caption font-semibold text-error hover:bg-error/10 transition-colors"
                    >
                      Remove
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-lg border border-neutral-200 py-2 text-caption font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 rounded-lg bg-primary-500 py-2 text-caption font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-lg border border-neutral-200 py-2 text-caption font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdd}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-500 py-2 text-caption font-semibold text-white hover:bg-primary-600 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Stain
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
