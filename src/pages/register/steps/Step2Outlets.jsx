import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import {
  Plus, Trash2, ChevronDown, ChevronUp, Store, Factory,
  AlertTriangle, Building2, GitBranch, Lock, Info, CheckCircle2,
} from 'lucide-react';
import { DAYS_FULL as DAYS } from '../../../utils/geoOptions.js';
import { NETWORK_MODELS as MODELS } from '../../../utils/businessOptions.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

const defaultHours = () => {
  return DAYS.reduce((acc, d) => ({
    ...acc,
    [d]: { open: d !== 'Sunday', from: '08:00', to: '18:00' },
  }), {});
}

const mkFactory = (type = 'owned') => {
  return {
    id: Date.now() + Math.random(), name: '', address: '', gps: '', phone: '',
    capacity: '', doublesAsOutlet: false, type,
  };
}
const mkOutlet = () => {
  return {
    id: Date.now() + Math.random(),
    name: '', abbrev: '', address: '', gps: '', phone: '',
    hours: defaultHours(), linkedFactoryId: '',
  };
}
const mkLocation = () => {
  return { name: '', address: '', gps: '', phone: '', capacity: '', hours: defaultHours() };
}

const inputCls = err =>
  `w-full rounded-md border px-3 py-2 text-small text-neutral-900 outline-none focus:ring-2 transition-all ${
    err ? 'border-error focus:ring-error/20' : 'border-neutral-200 focus:border-primary-400 focus:ring-primary-100'
  }`;

// ─── Validation ───────────────────────────────────────────────────────────────

const validateFactory = (fa) => {
  const e = {};
  if (!fa.name.trim())    e.name    = 'Name is required';
  if (!fa.address.trim()) e.address = 'Address is required';
  return e;
}

const validateOutlet = (o, requireLink) => {
  const e = {};
  if (!o.name.trim())                          e.name    = 'Name is required';
  else if (o.name.length < 2)                  e.name    = 'Min 2 characters';
  if (!o.abbrev.trim())                        e.abbrev  = 'Abbreviated name is required';
  else if (o.abbrev.length > 10)               e.abbrev  = 'Max 10 characters';
  else if (!/^[a-zA-Z0-9]+$/.test(o.abbrev))  e.abbrev  = 'Letters and numbers only';
  if (!o.address.trim())                       e.address = 'Address is required';
  if (!o.phone.trim())                         e.phone   = 'Phone is required';
  if (requireLink && !o.linkedFactoryId)       e.linkedFactoryId = 'Select a linked factory (BR-001)';
  return e;
}

const validateLocation = (l) => {
  const e = {};
  if (!l.name.trim())    e.name    = 'Name is required';
  if (!l.address.trim()) e.address = 'Address is required';
  if (!l.phone.trim())   e.phone   = 'Phone is required';
  return e;
}

// ─── HoursGrid ────────────────────────────────────────────────────────────────

const HoursGrid = ({ hours, onChange }) => {
  const toggleDay = (day) => { onChange({ ...hours, [day]: { ...hours[day], open: !hours[day].open } }); }
  const setTime = (day, field, val) => { onChange({ ...hours, [day]: { ...hours[day], [field]: val } }); }

  return (
    <div className="mt-2 overflow-hidden border border-neutral-200" style={{ borderRadius: 4 }}>
      <div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50 px-3 py-2">
        <span className="text-caption font-semibold uppercase tracking-wider text-neutral-400">Working hours</span>
        <div className="flex gap-1.5">
          {[{ label: 'Weekdays', days: DAYS.slice(0, 5) }, { label: 'All', days: DAYS }].map(({ label, days }) => (
            <button key={label} type="button"
              onClick={() => { const n = { ...hours }; days.forEach(d => { n[d] = { ...n[d], open: true }; }); onChange(n); }}
              className="px-2 py-0.5 text-caption font-medium text-primary-600 hover:bg-primary-50 transition-colors" style={{ borderRadius: 8 }}>
              {label}
            </button>
          ))}
          <button type="button"
            onClick={() => { const n = { ...hours }; DAYS.forEach(d => { n[d] = { ...n[d], open: false }; }); onChange(n); }}
            className="px-2 py-0.5 text-caption font-medium text-neutral-400 hover:bg-neutral-100 transition-colors" style={{ borderRadius: 8 }}>
            Clear
          </button>
        </div>
      </div>
      {DAYS.map((day, i) => {
        const h = hours[day];
        return (
          <div key={day}
            className={`flex items-center gap-3 px-3 py-2 transition-colors ${i < DAYS.length - 1 ? 'border-b border-neutral-100' : ''} ${h.open ? 'bg-white' : 'bg-neutral-50/60'}`}>
            <button type="button" onClick={() => toggleDay(day)}
              className={`flex w-[68px] flex-shrink-0 items-center justify-center py-1 text-caption font-semibold transition-all ${h.open ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'}`}
              style={{ borderRadius: 8 }}>
              {day.slice(0, 3).toUpperCase()}
            </button>
            {h.open ? (
              <div className="flex flex-1 items-center gap-2">
                <select className="flex-1 border border-neutral-200 bg-white px-2 py-1.5 text-small text-neutral-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" style={{ borderRadius: 8 }}
                  value={h.from} onChange={e => setTime(day, 'from', e.target.value)}>
                  {HOURS.map(t => <option key={t}>{t}</option>)}
                </select>
                <span className="text-caption font-medium text-neutral-300">→</span>
                <select className="flex-1 border border-neutral-200 bg-white px-2 py-1.5 text-small text-neutral-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all" style={{ borderRadius: 8 }}
                  value={h.to} onChange={e => setTime(day, 'to', e.target.value)}>
                  {HOURS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            ) : (
              <span className="flex-1 text-caption italic text-neutral-400">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── DualOutletToggle ─────────────────────────────────────────────────────────

const DualOutletToggle = ({ checked, onChange }) => {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`flex cursor-pointer items-center gap-3.5 rounded-lg border px-4 py-3.5 transition-all select-none ${
        checked ? 'border-primary-200 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
      }`}
    >
      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${checked ? 'bg-primary-100' : 'bg-neutral-100'}`}>
        <Store className={`h-4.5 w-4.5 ${checked ? 'text-primary-600' : 'text-neutral-400'}`} style={{ width: 18, height: 18 }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-small font-semibold leading-tight ${checked ? 'text-primary-800' : 'text-neutral-700'}`}>
          This factory also accepts customer drop-offs
        </p>
        <p className={`mt-0.5 text-caption ${checked ? 'text-primary-600' : 'text-neutral-400'}`}>
          Acts as a retail outlet — customers can visit, drop off, and collect here.
        </p>
      </div>
      <div className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-primary-500' : 'bg-neutral-200'}`}>
        <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}

// ─── FactoryCard ──────────────────────────────────────────────────────────────

const FactoryCard = ({ factory, index, errors, onChange, onRemove, isPartner }) => {
  const [expanded, setExpanded] = useState(true);
  const e = errors || {};
  const label = isPartner ? 'Partner factory' : 'Factory';
  const iconColor = isPartner ? '#1F9D57' : '#C77700';

  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 cursor-pointer" onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center gap-2">
          <Factory className="h-4 w-4 flex-shrink-0" style={{ color: iconColor }} />
          <span className="text-small font-semibold text-neutral-800">{factory.name || `${label} ${index + 1}`}</span>
          {isPartner && (
            <span className="rounded-full bg-success-bg px-2 py-0.5 text-caption font-semibold text-success-text" style={{ background: '#E6F6EE', color: '#13753F' }}>
              Partner
            </span>
          )}
          {!isPartner && factory.doublesAsOutlet && (
            <span className="rounded-full px-2 py-0.5 text-caption font-semibold" style={{ background: '#EAF2FC', color: '#0C5FC5' }}>
              + Outlet
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={ev => { ev.stopPropagation(); onRemove(); }}
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-red-50 hover:text-error transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">{label} name *</label>
              <input className={inputCls(e.name)} value={factory.name}
                placeholder={isPartner ? 'e.g. CleanPro Processing Ltd' : 'e.g. Tema Processing Centre'}
                onChange={ev => onChange({ ...factory, name: ev.target.value })} />
              {e.name && <p className="mt-0.5 text-caption text-error">{e.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Address *</label>
              <input className={inputCls(e.address)} value={factory.address} placeholder="Street address"
                onChange={ev => onChange({ ...factory, address: ev.target.value })} />
              {e.address && <p className="mt-0.5 text-caption text-error">{e.address}</p>}
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Phone <span className="text-neutral-400">(optional)</span></label>
              <input type="tel" className={inputCls(false)} value={factory.phone ?? ''} placeholder="+233 24 000 0000"
                onChange={ev => onChange({ ...factory, phone: ev.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">
                Processing capacity <span className="text-neutral-400">(kg/day, optional)</span>
              </label>
              <input type="number" min="0" className={inputCls(false)} value={factory.capacity ?? ''} placeholder="e.g. 500"
                onChange={ev => onChange({ ...factory, capacity: ev.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-small font-medium text-neutral-700">GPS / Location code <span className="text-neutral-400">(optional)</span></label>
              <input className={inputCls(false)} value={factory.gps ?? ''} placeholder="e.g. GA-123-4567"
                onChange={ev => onChange({ ...factory, gps: ev.target.value })} />
            </div>
          </div>

          {!isPartner && (
            <DualOutletToggle checked={factory.doublesAsOutlet} onChange={val => onChange({ ...factory, doublesAsOutlet: val })} />
          )}
        </div>
      )}
    </div>
  );
}

// ─── OutletCard ───────────────────────────────────────────────────────────────

const OutletCard = ({ outlet, index, errors, onChange, onRemove, factories, requireLink }) => {
  const [expanded, setExpanded] = useState(true);
  const e = errors || {};

  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 cursor-pointer" onClick={() => setExpanded(p => !p)}>
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <span className="text-small font-semibold text-neutral-800">{outlet.name || `Outlet ${index + 1}`}</span>
          {outlet.linkedFactoryId && (
            <span className="rounded-full px-2 py-0.5 text-caption text-neutral-500" style={{ background: '#F3F4F6' }}>
              → {factories.find(f => f.id === outlet.linkedFactoryId)?.name || 'Factory'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={ev => { ev.stopPropagation(); onRemove(); }}
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-red-50 hover:text-error transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          {expanded ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Outlet name *</label>
              <input className={inputCls(e.name)} value={outlet.name} placeholder="e.g. Osu HQ"
                onChange={ev => onChange({ ...outlet, name: ev.target.value })} />
              {e.name && <p className="mt-0.5 text-caption text-error">{e.name}</p>}
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Abbreviated name *</label>
              <input className={inputCls(e.abbrev)} value={outlet.abbrev} placeholder="e.g. OSU1 (max 10)"
                maxLength={10}
                onChange={ev => onChange({ ...outlet, abbrev: ev.target.value.replace(/\s/g, '') })} />
              {e.abbrev && <p className="mt-0.5 text-caption text-error">{e.abbrev}</p>}
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Address *</label>
              <input className={inputCls(e.address)} value={outlet.address} placeholder="Street address"
                onChange={ev => onChange({ ...outlet, address: ev.target.value })} />
              {e.address && <p className="mt-0.5 text-caption text-error">{e.address}</p>}
            </div>
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">Phone *</label>
              <input type="tel" className={inputCls(e.phone)} value={outlet.phone} placeholder="+233 24 000 0000"
                onChange={ev => onChange({ ...outlet, phone: ev.target.value })} />
              {e.phone && <p className="mt-0.5 text-caption text-error">{e.phone}</p>}
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-small font-medium text-neutral-700">GPS / Location code <span className="text-neutral-400">(optional)</span></label>
              <input className={inputCls(false)} value={outlet.gps} placeholder="e.g. GA-123-4567"
                onChange={ev => onChange({ ...outlet, gps: ev.target.value })} />
            </div>
          </div>

          {/* Factory link — shown when factories exist */}
          {factories.length > 0 && (
            <div>
              <label className="mb-1 block text-small font-medium text-neutral-700">
                Linked factory {requireLink ? <span className="text-error">*</span> : <span className="text-neutral-400">(optional)</span>}
              </label>
              <select
                className={`h-10 w-full rounded-md border px-3 text-small text-neutral-900 outline-none focus:ring-2 transition-all ${
                  e.linkedFactoryId ? 'border-error focus:ring-error/20' : 'border-neutral-200 focus:border-primary-400 focus:ring-primary-100'
                }`}
                value={outlet.linkedFactoryId}
                onChange={ev => onChange({ ...outlet, linkedFactoryId: ev.target.value })}
              >
                <option value="">— select factory —</option>
                {factories.map(f => (
                  <option key={f.id} value={f.id}>{f.name || '(unnamed factory)'}</option>
                ))}
              </select>
              {e.linkedFactoryId && <p className="mt-0.5 text-caption text-error">{e.linkedFactoryId}</p>}
              {requireLink && !e.linkedFactoryId && (
                <p className="mt-1 text-caption text-neutral-400">
                  Each outlet routes orders to its linked factory (BR-001).
                </p>
              )}
            </div>
          )}

          {/* Working hours */}
          <div>
            <p className="text-small font-medium text-neutral-700">Working hours</p>
            <HoursGrid hours={outlet.hours} onChange={h => onChange({ ...outlet, hours: h })} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LocationCard (Standalone only) ──────────────────────────────────────────

const LocationCard = ({ location, errors, onChange }) => {
  const e = errors || {};
  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-neutral-50">
        <Building2 className="h-4 w-4 text-primary-500" />
        <span className="text-small font-semibold text-neutral-800">{location.name || 'Your location'}</span>
        <span className="rounded-full px-2 py-0.5 text-caption font-semibold" style={{ background: '#EAF2FC', color: '#0C5FC5' }}>
          Drop-off + Processing
        </span>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-small font-medium text-neutral-700">Location name *</label>
            <input className={inputCls(e.name)} value={location.name} placeholder="e.g. Sparkle Laundry — Osu"
              onChange={ev => onChange({ ...location, name: ev.target.value })} />
            {e.name && <p className="mt-0.5 text-caption text-error">{e.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Address *</label>
            <input className={inputCls(e.address)} value={location.address} placeholder="Street address"
              onChange={ev => onChange({ ...location, address: ev.target.value })} />
            {e.address && <p className="mt-0.5 text-caption text-error">{e.address}</p>}
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Phone *</label>
            <input type="tel" className={inputCls(e.phone)} value={location.phone} placeholder="+233 24 000 0000"
              onChange={ev => onChange({ ...location, phone: ev.target.value })} />
            {e.phone && <p className="mt-0.5 text-caption text-error">{e.phone}</p>}
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">Processing capacity <span className="text-neutral-400">(kg/day, optional)</span></label>
            <input type="number" min="0" className={inputCls(false)} value={location.capacity} placeholder="e.g. 100"
              onChange={ev => onChange({ ...location, capacity: ev.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-small font-medium text-neutral-700">GPS / Location code <span className="text-neutral-400">(optional)</span></label>
            <input className={inputCls(false)} value={location.gps} placeholder="e.g. GA-123-4567"
              onChange={ev => onChange({ ...location, gps: ev.target.value })} />
          </div>
        </div>
        <div>
          <p className="text-small font-medium text-neutral-700">Working hours</p>
          <HoursGrid hours={location.hours} onChange={h => onChange({ ...location, hours: h })} />
        </div>
      </div>
    </div>
  );
}

// ─── ModelCard ────────────────────────────────────────────────────────────────

const ModelCard = ({ model, selected, onSelect }) => {
  const Icon = model.icon;
  return (
    <div
      onClick={() => onSelect(model.tag)}
      className="cursor-pointer rounded-lg border p-4 transition-all select-none"
      style={selected
        ? { borderColor: model.color, background: model.bg, boxShadow: `0 0 0 2px ${model.color}` }
        : { borderColor: '#E5E7EB', background: 'white' }
      }
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
          style={{ background: selected ? `${model.color}22` : '#F3F4F6' }}>
          <Icon style={{ width: 18, height: 18, color: selected ? model.color : '#6B7280' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-small font-semibold text-neutral-900 leading-snug">{model.name}</p>
          <p className="mt-0.5 text-caption text-neutral-500">{model.desc}</p>
        </div>
        {selected && <CheckCircle2 style={{ width: 18, height: 18, flexShrink: 0, color: model.color }} />}
      </div>
      <div className="mt-3 space-y-1">
        {model.rules.map(r => (
          <p key={r} className="flex items-center gap-1.5 text-caption" style={{ color: selected ? model.color : '#9CA3AF' }}>
            <span className="h-1 w-1 flex-shrink-0 rounded-full" style={{ background: selected ? model.color : '#9CA3AF' }} />
            {r}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

const SectionHeader = ({ icon: Icon, iconColor, title, count, desc, onAdd, addLabel, locked, lockReason }) => {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg" style={{ background: `${iconColor}18` }}>
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
        <div>
          <h3 className="text-small font-semibold text-neutral-800">
            {title} <span className="text-neutral-400">({count})</span>
          </h3>
          <p className="text-caption text-neutral-500">{desc}</p>
        </div>
      </div>
      {locked ? (
        <div className="flex items-center gap-1.5 text-caption text-neutral-400">
          <Lock className="h-3 w-3" /> {lockReason}
        </div>
      ) : (
        <Button variant="outline" size="sm" type="button" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </Button>
      )}
    </div>
  );
}

const EmptySlot = ({ icon: Icon, text, muted }) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border border-dashed py-6 text-center ${muted ? 'border-neutral-100 bg-neutral-50' : 'border-neutral-200'}`}>
      <Icon className={`mb-2 h-6 w-6 ${muted ? 'text-neutral-200' : 'text-neutral-300'}`} />
      <p className={`text-small ${muted ? 'text-neutral-300' : 'text-neutral-500'}`}>{text}</p>
    </div>
  );
}

const StepBadge = ({ n, active }) => {
  return (
    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-caption font-bold text-white ${active ? 'bg-primary-500' : 'bg-neutral-300'}`}>{n}</span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const Step2Outlets = ({ data, onNext, onBack, onSaveDraft }) => {
  const [model, setModel]         = useState(data.model    || '');
  const [outlets, setOutlets]     = useState(data.outlets  || []);
  const [factories, setFactories] = useState(data.factories || []);
  const [location, setLocation]   = useState(data.location || null);

  const [outletErrors, setOutletErrors]   = useState([]);
  const [factoryErrors, setFactoryErrors] = useState([]);
  const [locationErrors, setLocationErrors] = useState({});
  const [globalError, setGlobalError]     = useState('');

  const [pendingModel, setPendingModel]   = useState('');
  const [showWarning, setShowWarning]     = useState(false);

  // ── Model change ──────────────────────────────────────────────────────────

  const requestModelChange = (tag) => {
    if (tag === model) return;
    const hasData = outlets.length > 0 || factories.length > 0 || !!location;
    if (hasData) { setPendingModel(tag); setShowWarning(true); }
    else applyModel(tag);
  }

  const applyModel = (tag) => {
    setModel(tag); setOutlets([]); setFactories([]); setLocation(null);
    setGlobalError(''); setOutletErrors([]); setFactoryErrors([]); setLocationErrors({});
    setShowWarning(false); setPendingModel('');
  }

  // ── Derived flags ────────────────────────────────────────────────────────

  const isStandalone   = model === 'STANDALONE_UNIT';
  const isAssetLight   = model === 'ASSET_LIGHT_NETWORK';
  const isCentralized  = model === 'CENTRALIZED_NETWORK';
  const isHybrid       = model === 'HYBRID_NETWORK';
  const needsFactFirst = isCentralized || isHybrid;
  const hasFactories   = factories.length > 0;
  // BR-001: >1 factory → outlet factory link is mandatory
  const requireLink    = isHybrid || factories.length > 1;

  // ── Mutations ────────────────────────────────────────────────────────────

  const addFactory = (type = 'owned') => { setFactories(p => [...p, mkFactory(type)]); }
  const addOutlet = ()                => { setOutlets(p  => [...p, mkOutlet()]); }
  const removeFactory = (i) => { setFactories(p => p.filter((_, idx) => idx !== i)); }
  const removeOutlet = (i)  => { setOutlets(p  => p.filter((_, idx) => idx !== i)); }
  const updateFactory = (i, val) => { setFactories(p => p.map((f, idx) => idx === i ? val : f)); }
  const updateOutlet = (i, val)  => { setOutlets(p  => p.map((o, idx) => idx === i ? val : o)); }

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (!model) { setGlobalError('Select an operating model to continue.'); return; }
    setGlobalError('');

    if (isStandalone) {
      if (!location) { setGlobalError('Add your business location to continue.'); return; }
      const le = validateLocation(location);
      if (Object.keys(le).length > 0) { setLocationErrors(le); return; }
      setLocationErrors({});
    } else {
      const fErrs = factories.map(validateFactory);
      const oErrs = outlets.map(o => validateOutlet(o, requireLink));
      const hasFErr = fErrs.some(e => Object.keys(e).length);
      const hasOErr = oErrs.some(e => Object.keys(e).length);
      if (hasFErr || hasOErr) { setFactoryErrors(fErrs); setOutletErrors(oErrs); return; }

      // BR-003: at least one outlet or factory
      if (outlets.length + factories.length === 0) {
        setGlobalError('Add at least one outlet or factory to continue (BR-003).');
        return;
      }
      // Model-specific minimums
      if (needsFactFirst && factories.length === 0) {
        setGlobalError(`A ${isCentralized ? 'centralized' : 'hybrid'} network requires at least one processing factory.`);
        return;
      }
      if (isAssetLight && outlets.length === 0) {
        setGlobalError('Add at least one outlet to continue.');
        return;
      }
    }

    onNext({ model, outlets, factories, location });
  }

  const dualCount = factories.filter(f => f.doublesAsOutlet).length;

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Outlets &amp; Factories</h2>
      <p className="mt-1 mb-7 text-body text-neutral-500">
        Choose your operating model first — it determines how your locations are configured.
      </p>

      {/* Global error */}
      {globalError && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-error/30 bg-error/5 px-4 py-3">
          <AlertTriangle className="h-4 w-4 text-error flex-shrink-0" />
          <p className="text-small text-error">{globalError}</p>
        </div>
      )}

      {/* Model-switch warning */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-h4 font-bold text-neutral-900">Change operating model?</h3>
            <p className="mt-2 text-small text-neutral-600">
              Switching to a different model will clear all outlets and factories you've added. This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowWarning(false); setPendingModel(''); }}>Keep current</Button>
              <Button variant="danger" onClick={() => applyModel(pendingModel)}>Switch model</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── 1. Model selector ── */}
      <div className="mb-8">
        <p className="mb-3 text-small font-semibold text-neutral-700">
          Operating model <span className="text-error">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          {MODELS.map(m => (
            <ModelCard key={m.tag} model={m} selected={model === m.tag} onSelect={requestModelChange} />
          ))}
        </div>
      </div>

      {/* ── 2. Model-specific location config ── */}

      {/* STANDALONE */}
      {isStandalone && (
        <div className="space-y-4">
          <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-small" style={{ background: '#EAF2FC' }}>
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
            <p className="text-primary-800">
              A standalone unit has a single location that handles both customer intake and in-house processing. No separate outlet or factory needed.
            </p>
          </div>
          {location
            ? <LocationCard location={location} errors={locationErrors} onChange={setLocation} />
            : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-8 text-center">
                <Building2 className="mb-2 h-6 w-6 text-neutral-300" />
                <p className="mb-3 text-small text-neutral-500">No location added yet</p>
                <Button variant="outline" size="sm" type="button" onClick={() => setLocation(mkLocation())}>
                  <Plus className="h-3.5 w-3.5" /> Add location
                </Button>
              </div>
            )
          }
        </div>
      )}

      {/* ASSET-LIGHT */}
      {isAssetLight && (
        <div className="space-y-8">
          <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-small" style={{ background: '#E6F6EE' }}>
            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#1F9D57' }} />
            <p style={{ color: '#13753F' }}>
              Register your customer-facing outlets, then add the partner factories that will handle processing on your behalf.
            </p>
          </div>

          {/* Outlets */}
          <div>
            <SectionHeader icon={Store} iconColor="#0C5FC5" title="Outlets" count={outlets.length}
              desc="Your customer-facing drop-off and pick-up points"
              onAdd={addOutlet} addLabel="Add outlet" />
            <div className="space-y-3">
              {outlets.map((o, i) => (
                <OutletCard key={o.id} outlet={o} index={i} errors={outletErrors[i]}
                  onChange={val => updateOutlet(i, val)} onRemove={() => removeOutlet(i)}
                  factories={[]} requireLink={false} />
              ))}
              {outlets.length === 0 && <EmptySlot icon={Store} text="No outlets added yet" />}
            </div>
          </div>

          {/* Partner factories */}
          <div>
            <SectionHeader icon={Factory} iconColor="#1F9D57" title="Partner factories" count={factories.length}
              desc="Third-party processing facilities you outsource to"
              onAdd={() => addFactory('partner')} addLabel="Add partner factory" />
            <div className="space-y-3">
              {factories.map((fa, i) => (
                <FactoryCard key={fa.id} factory={fa} index={i} errors={factoryErrors[i]}
                  onChange={val => updateFactory(i, val)} onRemove={() => removeFactory(i)} isPartner />
              ))}
              {factories.length === 0 && <EmptySlot icon={Factory} text="No partner factories added yet (optional but recommended)" />}
            </div>
          </div>
        </div>
      )}

      {/* CENTRALIZED or HYBRID — factory first */}
      {needsFactFirst && (
        <div className="space-y-8">
          {isHybrid && (
            <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-small" style={{ background: '#F3F0FF' }}>
              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: '#7C3AED' }} />
              <p style={{ color: '#5B21B6' }}>
                Add at least two factories. Each outlet must be explicitly linked to one factory — this drives order routing (BR-001).
              </p>
            </div>
          )}

          {/* Step 1: Factories */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <StepBadge n={1} active />
              <p className="text-small font-semibold text-neutral-800">Set up your factories first</p>
            </div>
            <SectionHeader icon={Factory} iconColor="#C77700"
              title={isHybrid ? 'Processing factories (min. 2)' : 'Processing factory'} count={factories.length}
              desc={isCentralized ? 'Your central processing hub' : 'Each factory manages its own cluster of outlets'}
              onAdd={() => addFactory('owned')} addLabel="Add factory" />
            <div className="space-y-3">
              {factories.map((fa, i) => (
                <FactoryCard key={fa.id} factory={fa} index={i} errors={factoryErrors[i]}
                  onChange={val => updateFactory(i, val)} onRemove={() => removeFactory(i)} isPartner={false} />
              ))}
              {factories.length === 0 && <EmptySlot icon={Factory} text="Add a factory to unlock the outlets section" />}
            </div>
          </div>

          {/* Step 2: Outlets */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <StepBadge n={2} active={hasFactories} />
              <p className={`text-small font-semibold ${hasFactories ? 'text-neutral-800' : 'text-neutral-400'}`}>
                Add outlets
              </p>
            </div>
            <SectionHeader icon={Store} iconColor={hasFactories ? '#0C5FC5' : '#9CA3AF'}
              title="Outlets" count={outlets.length}
              desc={requireLink ? 'Each outlet is linked to one factory for order routing (BR-001)' : 'Customer-facing drop-off and pick-up points'}
              onAdd={addOutlet} addLabel="Add outlet"
              locked={!hasFactories} lockReason="Add a factory first" />
            <div className="space-y-3">
              {hasFactories
                ? (
                  <>
                    {outlets.map((o, i) => (
                      <OutletCard key={o.id} outlet={o} index={i} errors={outletErrors[i]}
                        onChange={val => updateOutlet(i, val)} onRemove={() => removeOutlet(i)}
                        factories={factories} requireLink={requireLink} />
                    ))}
                    {outlets.length === 0 && <EmptySlot icon={Store} text="No outlets added yet — you can also add more after setup" />}
                  </>
                )
                : <EmptySlot icon={Store} text="Outlets are unlocked once a factory is added" muted />
              }
            </div>
          </div>

          {/* Dual-role summary */}
          {dualCount > 0 && (
            <div className="flex items-start gap-2.5 rounded-lg border border-primary-100 px-4 py-3 text-small" style={{ background: '#EAF2FC' }}>
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-500" />
              <p className="text-primary-800">
                {dualCount} factory location{dualCount > 1 ? 's' : ''} will also serve as customer outlets
                — tagged as <strong>dual-purpose</strong> (location_type: dual).
              </p>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <div className="flex gap-3">
          <Button variant="ghost" type="button" onClick={() => onSaveDraft({ model, outlets, factories, location })}>
            Save draft
          </Button>
          <Button type="button" onClick={handleNext} disabled={!model}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Step2Outlets;


