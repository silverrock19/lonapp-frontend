import { useState } from 'react';
import {
  Plus, Building2, Factory, Store, MapPin, Phone, Mail,
  Pencil, Trash2, ChevronDown, AlertTriangle, X, Check, Zap,
} from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import {
  getLocations, getFactories, updateLocation, addLocation,
  removeLocation, validateLocations, defaultHours,
} from '../../lib/mock/mockOutlets.js';

// ─── Location type config ──────────────────────────────────────────────────────

const LOC_TYPE_CONFIG = {
  'dual':         { label: 'Factory + Outlet', color: 'bg-primary-50 text-primary-700',  Icon: Building2 },
  'factory-only': { label: 'Factory Only',     color: 'bg-amber-50 text-amber-700',       Icon: Factory   },
  'outlet-only':  { label: 'Outlet Only',      color: 'bg-accent-50 text-accent-700',     Icon: Store     },
};

// ─── Hours grid (shared between view and modal) ────────────────────────────────

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

function HoursGrid({ hours, onChange }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <div className="space-y-2">
      {days.map(day => {
        const h = hours[day] ?? { open: true, from: '08:00', to: '18:00' };
        return (
          <div key={day} className="flex items-center gap-3">
            <span className="w-8 text-xs font-semibold text-neutral-500">{day}</span>
            <button
              type="button"
              onClick={() => onChange({ ...hours, [day]: { ...h, open: !h.open } })}
              className={cn(
                'relative inline-flex h-4 w-8 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                h.open ? 'bg-primary-600' : 'bg-neutral-200'
              )}
            >
              <span className={cn(
                'inline-block h-3 w-3 rounded-full bg-white shadow transition-transform',
                h.open ? 'translate-x-4' : 'translate-x-0'
              )} />
            </button>
            {h.open ? (
              <>
                <select
                  value={h.from ?? '08:00'}
                  onChange={e => onChange({ ...hours, [day]: { ...h, from: e.target.value } })}
                  className="rounded-md border border-neutral-200 px-2 py-1 text-xs"
                >
                  {HOUR_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="text-xs text-neutral-400">—</span>
                <select
                  value={h.to ?? '18:00'}
                  onChange={e => onChange({ ...hours, [day]: { ...h, to: e.target.value } })}
                  className="rounded-md border border-neutral-200 px-2 py-1 text-xs"
                >
                  {HOUR_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </>
            ) : (
              <span className="text-xs text-neutral-300">Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── LocationRow ───────────────────────────────────────────────────────────────

function LocationRow({ location, expanded, onExpand, onEdit, onDelete, onToggle, factories }) {
  const cfg = LOC_TYPE_CONFIG[location.locationType] ?? LOC_TYPE_CONFIG['outlet-only'];
  const Icon = cfg.Icon;
  const linkedFactory = location.linkedFactoryId
    ? factories.find(f => f.id === location.linkedFactoryId)
    : null;

  return (
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={cn('flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold', cfg.color)}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-neutral-900 text-sm">{location.name}</span>
              <span className="font-mono text-xs text-neutral-400">{location.abbrev}</span>
              <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', cfg.color)}>{cfg.label}</span>
              {!location.enabled && (
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">Disabled</span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-neutral-500">
              {location.address && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{location.address}</span>
              )}
              {location.phone && (
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{location.phone}</span>
              )}
              {linkedFactory && (
                <span className="flex items-center gap-1 text-primary-600">→ {linkedFactory.name}</span>
              )}
            </div>
            {location.locationType !== 'outlet-only' && location.capacity && (
              <span className="mt-1 block text-xs text-neutral-400">{location.capacity} kg/day capacity</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Toggle */}
          <button
            onClick={() => onToggle(location.id)}
            className={cn(
              'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
              location.enabled ? 'bg-primary-600' : 'bg-neutral-200'
            )}
            title={location.enabled ? 'Disable' : 'Enable'}
          >
            <span className={cn(
              'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              location.enabled ? 'translate-x-4' : 'translate-x-0'
            )} />
          </button>
          <button
            onClick={() => onEdit(location)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
          >
            <Pencil className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(location.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-error hover:bg-error/5"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          <button
            onClick={() => onExpand(location.id)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50"
          >
            <ChevronDown className={cn('h-3 w-3 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      </div>

      {/* Expanded: hours grid + equipment */}
      {expanded && (
        <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50/50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Operating Hours</p>
          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {Object.entries(location.hours).map(([day, h]) => (
              <div key={day}>
                <p className="font-semibold text-neutral-400 text-[10px]">{day.slice(0, 3)}</p>
                {h.open
                  ? <><p className="text-neutral-700 mt-0.5">{h.from}</p><p className="text-neutral-400">{h.to}</p></>
                  : <p className="text-neutral-300 mt-0.5">Closed</p>
                }
              </div>
            ))}
          </div>
          {location.equipment?.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-1">Equipment</p>
              <div className="flex flex-wrap gap-1">
                {location.equipment.map(e => (
                  <span key={e} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">{e}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Label + Input helpers ─────────────────────────────────────────────────────

function FieldLabel({ children }) {
  return <label className="block text-xs font-semibold text-neutral-600 mb-1">{children}</label>;
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
    />
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function OutletsManagement({ compact = false }) {
  const [locations, setLocations] = useState(() => getLocations());
  const [expandedId, setExpandedId] = useState(null);
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState([]);

  const factories = locations.filter(l => l.locationType !== 'outlet-only');
  const outlets   = locations.filter(l => l.locationType === 'outlet-only');
  const hasMultipleFactories = factories.length > 1;

  const refresh = () => setLocations(getLocations());

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleToggle(id) {
    const loc = locations.find(l => l.id === id);
    updateLocation(id, { enabled: !loc.enabled });
    refresh();
  }

  function handleDelete(id) {
    try {
      removeLocation(id);
      refresh();
      const errs = validateLocations(getLocations());
      setErrors(errs);
    } catch (e) {
      setErrors([e.message]);
    }
  }

  function handleEdit(location) {
    setModal({ mode: 'edit', location: { ...location } });
  }

  function handleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  function handleSaveModal() {
    const loc = modal.location;
    // Derive locationType
    const isFactory = modal.mode === 'add-factory' || (modal.mode === 'edit' && loc.locationType !== 'outlet-only');
    const lt = loc.doublesAsOutlet ? 'dual' : isFactory ? 'factory-only' : 'outlet-only';
    // Normalise equipment: convert comma-string to array if needed
    const equipment = typeof loc.equipment === 'string'
      ? loc.equipment.split(',').map(s => s.trim()).filter(Boolean)
      : (loc.equipment ?? []);
    const finalLoc = { ...loc, locationType: lt, equipment };

    if (modal.mode === 'edit') {
      updateLocation(finalLoc.id, finalLoc);
    } else {
      addLocation(finalLoc);
    }
    refresh();
    const errs = validateLocations(getLocations());
    setErrors(errs);
    setModal(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function setModalField(field, value) {
    setModal(prev => ({ ...prev, location: { ...prev.location, [field]: value } }));
  }

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalCapacity = factories.reduce((sum, f) => sum + (f.capacity ?? 0), 0);
  const activeCount   = locations.filter(l => l.enabled).length;

  // ── Modal form ────────────────────────────────────────────────────────────

  const isFactory = modal && (modal.mode === 'add-factory' || (modal.mode === 'edit' && modal.location.locationType !== 'outlet-only'));
  const isOutlet  = modal && (modal.mode === 'add-outlet'  || (modal.mode === 'edit' && modal.location.locationType === 'outlet-only'));
  const showOutletFields = isFactory && modal?.location?.doublesAsOutlet;

  return (
    <div className="space-y-5">
      {/* Validation errors */}
      {errors.length > 0 && errors.map((e, i) => (
        <div key={i} className="rounded-lg bg-error/5 border border-error/20 px-4 py-3 flex items-center gap-2 text-sm text-error">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {e}
        </div>
      ))}

      {/* Stats row — hidden in compact mode */}
      {!compact && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Locations', value: locations.length },
            { label: 'Active',          value: activeCount       },
            { label: 'Processing Capacity', value: totalCapacity ? `${totalCapacity.toLocaleString()} kg/day` : '—' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-neutral-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setModal({
            mode: 'add-factory',
            location: {
              name: '', abbrev: '', address: '', gps: '', phone: '', email: '',
              capacity: '', doublesAsOutlet: false, locationType: 'factory-only',
              equipment: [], enabled: true, hours: defaultHours(),
              expressSurcharge: '', sameDaySurcharge: '', pickupFee: '', deliveryFee: '',
              sameDayAvailable: false,
            },
          })}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          <Plus className="h-3.5 w-3.5" /> Add Factory
        </button>
        <button
          onClick={() => setModal({
            mode: 'add-outlet',
            location: {
              name: '', abbrev: '', address: '', gps: '', phone: '', email: '',
              linkedFactoryId: factories[0]?.id ?? '',
              locationType: 'outlet-only', enabled: true, hours: defaultHours(),
              pickupFee: 15, deliveryFee: 15, sameDayAvailable: false,
              expressSurcharge: '', sameDaySurcharge: '',
            },
          })}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add Outlet
        </button>
      </div>

      {/* Factories section */}
      {factories.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Processing Factories</h2>
          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden divide-y divide-neutral-100">
            {factories.map(loc => (
              <LocationRow
                key={loc.id}
                location={loc}
                expanded={expandedId === loc.id}
                onExpand={handleExpand}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                factories={factories}
                hasMultipleFactories={hasMultipleFactories}
              />
            ))}
          </div>
        </div>
      )}

      {/* Outlets section */}
      {outlets.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Drop-off Outlets</h2>
          <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden divide-y divide-neutral-100">
            {outlets.map(loc => (
              <LocationRow
                key={loc.id}
                location={loc}
                expanded={expandedId === loc.id}
                onExpand={handleExpand}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={handleToggle}
                factories={factories}
                hasMultipleFactories={hasMultipleFactories}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <h2 className="font-semibold text-neutral-900">
                {modal.mode === 'add-factory'
                  ? 'Add Processing Factory'
                  : modal.mode === 'add-outlet'
                  ? 'Add Drop-off Outlet'
                  : `Edit ${modal.location.name}`}
              </h2>
              <button onClick={() => setModal(null)} className="text-neutral-400 hover:text-neutral-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
              {/* Name */}
              <div>
                <FieldLabel>Name *</FieldLabel>
                <TextInput
                  value={modal.location.name}
                  onChange={v => setModalField('name', v)}
                  placeholder={isFactory ? 'e.g. Main Processing Factory' : 'e.g. Spintex Outlet'}
                />
              </div>

              {/* Abbrev */}
              <div>
                <FieldLabel>Abbreviation (2–4 chars) *</FieldLabel>
                <TextInput
                  value={modal.location.abbrev}
                  onChange={v => setModalField('abbrev', v.toUpperCase().slice(0, 4))}
                  placeholder="e.g. OSU"
                />
              </div>

              {/* Address */}
              <div>
                <FieldLabel>Address *</FieldLabel>
                <TextInput
                  value={modal.location.address}
                  onChange={v => setModalField('address', v)}
                  placeholder="Street, City"
                />
              </div>

              {/* GPS */}
              <div>
                <FieldLabel>GPS Address</FieldLabel>
                <TextInput
                  value={modal.location.gps}
                  onChange={v => setModalField('gps', v)}
                  placeholder="e.g. GA-144-2345"
                />
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <TextInput
                    value={modal.location.phone}
                    onChange={v => setModalField('phone', v)}
                    placeholder="+233 24 …"
                  />
                </div>
                <div>
                  <FieldLabel>Email</FieldLabel>
                  <TextInput
                    type="email"
                    value={modal.location.email}
                    onChange={v => setModalField('email', v)}
                    placeholder="outlet@business.com"
                  />
                </div>
              </div>

              {/* Factory-specific fields */}
              {isFactory && (
                <>
                  <div>
                    <FieldLabel>Processing Capacity (kg/day)</FieldLabel>
                    <TextInput
                      type="number"
                      value={modal.location.capacity}
                      onChange={v => setModalField('capacity', v ? Number(v) : '')}
                      placeholder="e.g. 500"
                    />
                  </div>

                  <div>
                    <FieldLabel>Equipment (comma-separated)</FieldLabel>
                    <TextInput
                      value={Array.isArray(modal.location.equipment) ? modal.location.equipment.join(', ') : modal.location.equipment}
                      onChange={v => setModalField('equipment', v)}
                      placeholder="Washer x8, Dryer x8, …"
                    />
                  </div>

                  {/* doublesAsOutlet checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer rounded-lg border border-neutral-200 p-3 hover:bg-neutral-50">
                    <input
                      type="checkbox"
                      checked={!!modal.location.doublesAsOutlet}
                      onChange={e => setModalField('doublesAsOutlet', e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">This factory also serves as a customer drop-off outlet</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Customers can drop off and pick up orders at this location</p>
                    </div>
                  </label>
                </>
              )}

              {/* Outlet-only: link to factory */}
              {isOutlet && (
                <div>
                  <FieldLabel>
                    Link to Factory {hasMultipleFactories && <span className="text-error">*</span>}
                  </FieldLabel>
                  <select
                    value={modal.location.linkedFactoryId ?? ''}
                    onChange={e => setModalField('linkedFactoryId', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
                  >
                    {!hasMultipleFactories && <option value="">None (single factory)</option>}
                    {factories.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                  {hasMultipleFactories && (
                    <p className="mt-1 text-[11px] text-amber-600">
                      BR-001: Must be linked to a factory when multiple factories exist.
                    </p>
                  )}
                </div>
              )}

              {/* Fees & surcharges (outlet-facing locations) */}
              {(isOutlet || showOutletFields) && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Pickup Fee (GH₵)</FieldLabel>
                      <TextInput
                        type="number"
                        value={modal.location.pickupFee}
                        onChange={v => setModalField('pickupFee', v ? Number(v) : '')}
                        placeholder="15"
                      />
                    </div>
                    <div>
                      <FieldLabel>Delivery Fee (GH₵)</FieldLabel>
                      <TextInput
                        type="number"
                        value={modal.location.deliveryFee}
                        onChange={v => setModalField('deliveryFee', v ? Number(v) : '')}
                        placeholder="15"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <FieldLabel>Express Surcharge (%)</FieldLabel>
                      <TextInput
                        type="number"
                        value={modal.location.expressSurcharge}
                        onChange={v => setModalField('expressSurcharge', v ? Number(v) : '')}
                        placeholder="0.40"
                      />
                    </div>
                    <div>
                      <FieldLabel>Same-Day Surcharge (%)</FieldLabel>
                      <TextInput
                        type="number"
                        value={modal.location.sameDaySurcharge}
                        onChange={v => setModalField('sameDaySurcharge', v ? Number(v) : '')}
                        placeholder="1.75"
                      />
                    </div>
                  </div>

                  {/* Same-day available toggle */}
                  <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-medium text-neutral-800">Same-Day Available</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setModalField('sameDayAvailable', !modal.location.sameDayAvailable)}
                      className={cn(
                        'relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors',
                        modal.location.sameDayAvailable ? 'bg-primary-600' : 'bg-neutral-200'
                      )}
                    >
                      <span className={cn(
                        'inline-block h-4 w-4 rounded-full bg-white shadow transition-transform',
                        modal.location.sameDayAvailable ? 'translate-x-4' : 'translate-x-0'
                      )} />
                    </button>
                  </div>
                </>
              )}

              {/* Operating hours */}
              <div>
                <FieldLabel>Operating Hours</FieldLabel>
                <div className="rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-3">
                  <HoursGrid
                    hours={modal.location.hours ?? defaultHours()}
                    onChange={h => setModalField('hours', h)}
                  />
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-neutral-100 px-6 py-4">
              <button
                onClick={() => setModal(null)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                {modal.mode === 'edit' ? 'Save Changes' : 'Add Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-medium text-white shadow-lg z-50">
          <Check className="h-4 w-4" /> Changes saved
        </div>
      )}
    </div>
  );
}
