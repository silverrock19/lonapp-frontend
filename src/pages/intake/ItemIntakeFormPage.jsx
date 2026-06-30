import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Save, Plus, X, Minus, AlertTriangle } from 'lucide-react';
import {
  getItemById, updateItem, addItemEvent, ITEM_STATUS_COLOR, ITEM_STATUS_LABELS,
} from '../../lib/mock/mockItems.js';
import {
  getIntakeData, updateIntakeData,
  addStain, updateStain, removeStain,
  addPhoto, removePhoto,
  addDefect, removeDefect,
  FABRIC_TYPES, COLORS, PATTERNS, DEFECT_TYPES, CARE_FLAGS,
} from '../../lib/mock/mockIntake.js';
import GarmentDiagram from '../../components/ui/GarmentDiagram.jsx';
import ItemPhotoCapture from '../../components/ui/ItemPhotoCapture.jsx';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const TABS = [
  { id: 'attributes', label: 'Attributes'  },
  { id: 'photos',     label: 'Photos'      },
  { id: 'condition',  label: 'Condition'   },
  { id: 'care',       label: 'Care Flags'  },
];

function SectionHeader({ title, sub }) {
  return (
    <div className="mb-3">
      <p className="text-small font-semibold text-neutral-800">{title}</p>
      {sub && <p className="text-[10px] text-neutral-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-[11px] font-medium transition-all',
        active
          ? 'border-primary-400 bg-primary-50 text-primary-700 ring-2 ring-primary-100'
          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
      )}
    >
      {label}
    </button>
  );
}

export default function ItemIntakeFormPage() {
  const { itemId }   = useParams();
  const navigate     = useNavigate();
  const item         = getItemById(itemId);
  const initialData  = getIntakeData(itemId);

  const [activeTab, setActiveTab] = useState('attributes');
  const [savedMsg, setSavedMsg]   = useState('');

  // ── Tab state — loaded from mockIntake
  const [attributes, setAttributes] = useState(() => initialData?.attributes ?? {
    color:  { primary: null, secondary: null, pattern: null },
    fabric: { type: null, blend: null },
    weight: { value: null, unit: 'kg' },
    brand: '', size: '', notes: '',
  });
  const [condition, setCondition] = useState(() => initialData?.condition ?? { rating: null, notes: '', defects: [] });
  const [stains, setStains]       = useState(() => initialData?.stains ?? []);
  const [careFlags, setCareFlags] = useState(() => initialData?.careFlags ?? Object.fromEntries(CARE_FLAGS.map(f => [f.id, false])));
  const [photos, setPhotos]       = useState(() => initialData?.photos ?? []);

  // Adding defect form
  const [defectForm, setDefectForm] = useState({ type: '', location: '', severity: 'minor', notes: '' });
  const [showDefectForm, setShowDefectForm] = useState(false);
  const [severeAlert, setSevereAlert] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-small font-medium text-neutral-700">Item not found: {itemId}</p>
        <Link to="/intake" className="mt-3 text-caption text-primary-600 hover:underline">Back to Intake</Link>
      </div>
    );
  }

  // ── Helpers ──────────────────────────────────────────────
  function flash(msg) {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 2500);
  }

  function persist(extra = {}) {
    updateIntakeData(itemId, { attributes, condition, stains, careFlags, photos, ...extra });
  }

  function handleSaveDraft() {
    persist({ status: 'in_progress' });
    addItemEvent(itemId, 'INTAKE_DRAFT', 'Ama Otu', 'Intake form saved as draft');
    flash('Draft saved');
  }

  function handleCompleteIntake() {
    persist({ status: 'completed', completedAt: '2026-06-29T10:30:00', completedBy: 'Ama Otu' });
    const careSummary = Object.entries(careFlags).filter(([, v]) => v).map(([k]) => k).join(', ');
    updateItem(itemId, { status: 'SORTING' });
    addItemEvent(itemId, 'INTAKE_COMPLETED', 'Ama Otu',
      `Intake complete. Condition: ${condition.rating ?? 'N/A'}. Stains: ${stains.length}. ` +
      (careSummary ? `Care: ${careSummary}.` : '')
    );
    navigate('/intake');
  }

  // ── Photo handlers ───────────────────────────────────────
  function handleCapture(photoData) {
    const created = addPhoto(itemId, photoData);
    if (created) setPhotos(prev => [...prev, created]);
  }
  function handleRemovePhoto(photoId) {
    removePhoto(itemId, photoId);
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  }

  // ── Stain handlers ───────────────────────────────────────
  function handleAddStain(stainData) {
    const created = addStain(itemId, stainData);
    if (created) setStains(prev => [...prev, created]);
  }
  function handleUpdateStain(stainId, patch) {
    updateStain(itemId, stainId, patch);
    setStains(prev => prev.map(s => s.id === stainId ? { ...s, ...patch } : s));
  }
  function handleRemoveStain(stainId) {
    removeStain(itemId, stainId);
    setStains(prev => prev.filter(s => s.id !== stainId));
  }

  // ── Defect handlers ──────────────────────────────────────
  function handleAddDefect() {
    if (!defectForm.type) return;
    const created = addDefect(itemId, { ...defectForm });
    if (created) {
      setCondition(c => ({ ...c, defects: [...c.defects, created] }));
      if (defectForm.severity === 'major' || defectForm.severity === 'severe') {
        setSevereAlert(true);
      }
      setDefectForm({ type: '', location: '', severity: 'minor', notes: '' });
      setShowDefectForm(false);
    }
  }
  function handleRemoveDefect(defectId) {
    removeDefect(itemId, defectId);
    setCondition(c => ({ ...c, defects: c.defects.filter(d => d.id !== defectId) }));
  }

  const intakeComplete = initialData?.status === 'completed';

  // ── Render helpers ────────────────────────────────────────
  function setAttr(path, value) {
    setAttributes(prev => {
      const next = { ...prev };
      const parts = path.split('.');
      if (parts.length === 1) return { ...next, [parts[0]]: value };
      return { ...next, [parts[0]]: { ...next[parts[0]], [parts[1]]: value } };
    });
  }

  // ── Tab content ───────────────────────────────────────────
  const tabContent = {

    attributes: (
      <div className="space-y-6">
        {/* Color */}
        <div>
          <SectionHeader title="Colour" sub="US-0120 · Verify primary and secondary colour" />
          <div className="space-y-3">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2">Primary colour</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setAttr('color.primary', attributes.color.primary === c.id ? null : c.id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                      attributes.color.primary === c.id
                        ? 'ring-2 ring-primary-400 border-primary-400'
                        : 'border-neutral-200 hover:border-neutral-300',
                    )}
                  >
                    {c.hex ? (
                      <span
                        className={cn('h-3 w-3 rounded-full flex-shrink-0', c.border && 'border border-neutral-300')}
                        style={{ background: c.hex }}
                      />
                    ) : (
                      <span className="h-3 w-3 rounded-full flex-shrink-0 bg-gradient-to-br from-red-400 via-green-400 to-blue-400" />
                    )}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Secondary colour */}
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2">Secondary colour (optional)</p>
              <div className="flex flex-wrap gap-2">
                {[{ id: '', label: 'None', hex: null }, ...COLORS].map(c => (
                  <button
                    key={c.id || 'none'}
                    type="button"
                    onClick={() => setAttr('color.secondary', c.id || null)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all',
                      (attributes.color.secondary ?? null) === (c.id || null)
                        ? 'ring-2 ring-primary-400 border-primary-400'
                        : 'border-neutral-200 hover:border-neutral-300',
                    )}
                  >
                    {c.hex ? (
                      <span
                        className={cn('h-3 w-3 rounded-full flex-shrink-0', c.border && 'border border-neutral-300')}
                        style={{ background: c.hex }}
                      />
                    ) : c.id ? (
                      <span className="h-3 w-3 rounded-full flex-shrink-0 bg-gradient-to-br from-red-400 via-green-400 to-blue-400" />
                    ) : null}
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern */}
            <div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-2">Pattern</p>
              <div className="flex flex-wrap gap-2">
                {PATTERNS.map(p => (
                  <Chip
                    key={p.id}
                    label={p.label}
                    active={attributes.color.pattern === p.id}
                    onClick={() => setAttr('color.pattern', attributes.color.pattern === p.id ? null : p.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Fabric */}
        <div>
          <SectionHeader title="Fabric type" sub="US-0121 · Select the primary fabric material" />
          <div className="flex flex-wrap gap-2">
            {FABRIC_TYPES.map(f => (
              <Chip
                key={f.id}
                label={f.label}
                active={attributes.fabric.type === f.id}
                onClick={() => setAttr('fabric.type', attributes.fabric.type === f.id ? null : f.id)}
              />
            ))}
          </div>
          {attributes.fabric.type === 'blend' && (
            <input
              value={attributes.fabric.blend ?? ''}
              onChange={e => setAttr('fabric.blend', e.target.value)}
              placeholder="Describe blend (e.g. 60% cotton, 40% polyester)…"
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
            />
          )}
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Weight */}
        <div>
          <SectionHeader title="Weight" sub="US-0122 · Record item weight in kilograms" />
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-neutral-200 overflow-hidden">
              <button
                onClick={() => setAttr('weight.value', Math.max(0, (attributes.weight.value ?? 0) - 0.1).toFixed(1) * 1)}
                className="h-9 w-9 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors border-r border-neutral-200"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <input
                type="number"
                min="0"
                step="0.1"
                value={attributes.weight.value ?? ''}
                onChange={e => setAttr('weight.value', e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="0.0"
                className="w-20 bg-transparent px-2 py-2 text-center text-small font-semibold text-neutral-800 outline-none"
              />
              <button
                onClick={() => setAttr('weight.value', ((attributes.weight.value ?? 0) + 0.1).toFixed(1) * 1)}
                className="h-9 w-9 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors border-l border-neutral-200"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <span className="text-small text-neutral-600">kg</span>
          </div>
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Brand / Size */}
        <div>
          <SectionHeader title="Brand &amp; size" sub="Optional additional attributes" />
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-caption font-medium text-neutral-600">Brand</label>
              <input
                value={attributes.brand ?? ''}
                onChange={e => setAttr('brand', e.target.value)}
                placeholder="e.g. Woodin, Nike, Unknown…"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
              />
            </div>
            <div className="w-28 space-y-1">
              <label className="text-caption font-medium text-neutral-600">Size</label>
              <input
                value={attributes.size ?? ''}
                onChange={e => setAttr('size', e.target.value)}
                placeholder="M, L, 32…"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>
      </div>
    ),

    photos: (
      <div className="space-y-4">
        <SectionHeader title="Item photography" sub="US-0106 · Capture intake photos (front, back, close-up, damage)" />
        <ItemPhotoCapture
          photos={photos}
          onCapture={handleCapture}
          onRemove={handleRemovePhoto}
        />
      </div>
    ),

    condition: (
      <div className="space-y-6">

        {/* Overall rating */}
        <div>
          <SectionHeader title="Overall condition" sub="US-0108 · Rate the pre-existing condition of this item" />
          <div className="flex gap-2">
            {[
              ['good', 'Good',  'bg-success/10 border-success/30 text-success'],
              ['fair', 'Fair',  'bg-amber-50 border-amber-300 text-amber-700'],
              ['poor', 'Poor',  'bg-error/10 border-error/30 text-error'],
            ].map(([val, label, selected]) => (
              <button
                key={val}
                onClick={() => setCondition(c => ({ ...c, rating: val }))}
                className={cn(
                  'flex-1 rounded-lg border py-2.5 text-small font-semibold transition-all',
                  condition.rating === val
                    ? selected + ' ring-2 ring-offset-1'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
                  condition.rating === val && val === 'good'   && 'ring-success/40',
                  condition.rating === val && val === 'fair'   && 'ring-amber-300',
                  condition.rating === val && val === 'poor'   && 'ring-error/40',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-1">
            <label className="text-caption font-medium text-neutral-600">Condition notes</label>
            <textarea
              value={condition.notes}
              onChange={e => setCondition(c => ({ ...c, notes: e.target.value }))}
              rows={2}
              placeholder="Any overall observations about this item's condition before processing…"
              className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
            />
          </div>
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Defects */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionHeader title="Pre-existing defects" sub="US-0108 · Document damage present before processing" />
            <button
              onClick={() => setShowDefectForm(v => !v)}
              className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-caption font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {/* Add defect form */}
          {showDefectForm && (
            <div className="mb-3 rounded-lg border border-primary-200 bg-primary-50/40 p-3 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Defect type</label>
                  <select
                    value={defectForm.type}
                    onChange={e => setDefectForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-small text-neutral-700 outline-none focus:border-primary-300"
                  >
                    <option value="">Select…</option>
                    {DEFECT_TYPES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider">Severity</label>
                  <select
                    value={defectForm.severity}
                    onChange={e => setDefectForm(f => ({ ...f, severity: e.target.value }))}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-small text-neutral-700 outline-none focus:border-primary-300"
                  >
                    <option value="minor">Minor</option>
                    <option value="moderate">Moderate</option>
                    <option value="major">Major</option>
                  </select>
                </div>
              </div>
              <input
                value={defectForm.location}
                onChange={e => setDefectForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Location on garment (e.g. left sleeve, collar)…"
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowDefectForm(false)} className="flex-1 rounded-lg border border-neutral-200 py-1.5 text-caption font-medium text-neutral-600 hover:bg-white transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleAddDefect}
                  disabled={!defectForm.type}
                  className="flex-1 rounded-lg bg-primary-500 py-1.5 text-caption font-semibold text-white hover:bg-primary-600 disabled:opacity-50 transition-colors"
                >
                  Add defect
                </button>
              </div>
            </div>
          )}

          {condition.defects.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-6 flex flex-col items-center text-center">
              <p className="text-caption text-neutral-400">No defects noted — item appears free of pre-existing damage</p>
            </div>
          ) : (
            <div className="space-y-2">
              {condition.defects.map(d => {
                const defType = DEFECT_TYPES.find(t => t.id === d.type);
                return (
                  <div key={d.id} className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-small font-semibold text-neutral-800">{defType?.label ?? d.type}</span>
                        <span className={cn(
                          'inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                          d.severity === 'minor'    ? 'bg-amber-50 text-amber-700'
                            : d.severity === 'major'  ? 'bg-error/10 text-error'
                            : 'bg-orange-50 text-orange-700',
                        )}>
                          {d.severity}
                        </span>
                      </div>
                      {d.location && <p className="text-[10px] text-neutral-500 mt-0.5">{d.location}</p>}
                    </div>
                    <button
                      onClick={() => handleRemoveDefect(d.id)}
                      className="flex h-6 w-6 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 hover:text-error transition-colors flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-px bg-neutral-100" />

        {/* Stain diagram */}
        <div>
          <SectionHeader title="Stain location map" sub="US-0119 · Click on the garment to pinpoint stain locations" />
          <GarmentDiagram
            garmentType={item.type}
            stains={stains}
            onAddStain={handleAddStain}
            onUpdateStain={handleUpdateStain}
            onRemoveStain={handleRemoveStain}
          />
        </div>
      </div>
    ),

    care: (
      <div className="space-y-5">
        <SectionHeader title="Special care requirements" sub="US-0123 · Flag items that require special handling during processing" />

        {/* Warning banner */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 flex items-start gap-2">
          <span className="text-amber-500 text-base flex-shrink-0">⚠</span>
          <p className="text-caption text-amber-800">
            Care flags are visible to all processing staff and affect the wash/dry/iron workflow.
            Flag correctly — errors may damage the garment.
          </p>
        </div>

        {/* Care flag grid */}
        <div className="grid grid-cols-2 gap-2">
          {CARE_FLAGS.map(flag => {
            const active = careFlags[flag.id] ?? false;
            return (
              <button
                key={flag.id}
                onClick={() => setCareFlags(prev => ({ ...prev, [flag.id]: !active }))}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all',
                  active
                    ? 'border-primary-400 bg-primary-50 ring-2 ring-primary-100'
                    : 'border-neutral-200 bg-white hover:border-neutral-300',
                )}
              >
                <div className={cn(
                  'flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 mt-0.5 transition-colors',
                  active ? 'border-primary-500 bg-primary-500' : 'border-neutral-300',
                )}>
                  {active && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                </div>
                <div>
                  <p className={cn('text-small font-semibold', active ? 'text-primary-800' : 'text-neutral-800')}>
                    {flag.label}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{flag.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Care notes */}
        <div className="space-y-1">
          <label className="text-caption font-semibold text-neutral-700">Additional care instructions</label>
          <textarea
            value={attributes.notes ?? ''}
            onChange={e => setAttr('notes', e.target.value)}
            rows={3}
            placeholder="Any additional handling notes for the processing team…"
            className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-small text-neutral-700 outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
          />
        </div>

        {/* Active flags summary */}
        {Object.values(careFlags).some(Boolean) && (
          <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-500 mb-1.5">Active flags</p>
            <div className="flex flex-wrap gap-1.5">
              {CARE_FLAGS.filter(f => careFlags[f.id]).map(f => (
                <span key={f.id} className="rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  };

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <Link
          to="/intake"
          className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors flex-shrink-0 mt-0.5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-h2 font-bold text-neutral-900 truncate">
            Intake — {item.typeName} × {item.qty}
          </h1>
          <p className="text-caption text-neutral-500">
            {item.customerName} · {item.orderId} ·{' '}
            <span className="font-mono">{item.barcode}</span>
          </p>
        </div>
        {/* Item status */}
        <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold flex-shrink-0', ITEM_STATUS_COLOR[item.status])}>
          {ITEM_STATUS_LABELS[item.status]}
        </span>
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-0.5 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 rounded-md py-2 text-small font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm min-h-64">
        {tabContent[activeTab]}
      </div>

      {/* ── Footer actions ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {savedMsg && (
          <span className="flex items-center gap-1 text-caption font-semibold text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> {savedMsg}
          </span>
        )}
        <div className="flex-1" />
        <Button variant="outline" size="default" onClick={handleSaveDraft}>
          <Save className="h-4 w-4" /> Save Draft
        </Button>
        <Button
          variant={intakeComplete ? 'neutral' : 'accent'}
          size="default"
          onClick={handleCompleteIntake}
        >
          <CheckCircle2 className="h-4 w-4" />
          {intakeComplete ? 'Update Intake' : 'Complete Intake'}
        </Button>
      </div>

      {/* ── Severe defect alert modal ────────────────────────── */}
      {severeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xs rounded-2xl bg-white p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-error/10">
                <AlertTriangle className="h-5 w-5 text-error" />
              </div>
              <p className="text-small font-bold text-neutral-900">Severe Defect Detected</p>
            </div>
            <p className="text-caption text-neutral-600">
              A major pre-existing defect has been recorded. Would you like to notify the customer before processing begins?
            </p>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSevereAlert(false)}
                className="flex-1 rounded-lg border border-neutral-200 py-2 text-small font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  setSevereAlert(false);
                  // Mock: notification sent
                  alert('Customer notification sent (mock)');
                }}
                className="flex-1 rounded-lg bg-primary-600 py-2 text-small font-semibold text-white hover:bg-primary-700"
              >
                Notify Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
