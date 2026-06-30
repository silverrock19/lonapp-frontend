import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2, MapPin, Plus, Pencil, Trash2, X, Check, ChevronLeft, Crosshair, Loader2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/forms/Input.jsx';
import { MOCK_ADDRESSES } from '../../data/mockCustomer.js';

const TYPE_META = {
  home:   { label: 'Home',   Icon: Home,      bgCls: 'bg-accent-50',   colorCls: 'text-accent-600'   },
  office: { label: 'Office', Icon: Building2,  bgCls: 'bg-primary-50',  colorCls: 'text-primary-600'  },
  other:  { label: 'Other',  Icon: MapPin,     bgCls: 'bg-neutral-100', colorCls: 'text-neutral-500'  },
};

const emptyForm = { label: '', type: 'home', street: '', suburb: '', city: 'Accra', gps: '' };

// ─── Address card ─────────────────────────────────────────────────────────────

const AddressCard = ({ address, onSetDefault, onEdit, onDelete }) => {
  const meta = TYPE_META[address.type] || TYPE_META.other;
  const Icon = meta.Icon;

  return (
    <div className={`relative rounded-2xl border bg-white p-4 ${address.isDefault ? 'border-accent-300' : 'border-neutral-200'}`}>
      {address.isDefault && (
        <span className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold bg-accent-50 text-accent-700">
          Default
        </span>
      )}
      <div className="flex items-start gap-3">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${meta.bgCls}`}>
          <Icon className={`h-5 w-5 ${meta.colorCls}`} />
        </div>
        <div className="flex-1 min-w-0 pr-14">
          <p className="font-semibold text-[15px] text-neutral-900">{address.label}</p>
          <p className="mt-0.5 text-[13px] text-neutral-500 leading-snug">
            {address.street}{address.suburb ? `, ${address.suburb}` : ''}{', '}{address.city}
          </p>
          {address.gps && (
            <p className="mt-1 flex items-center gap-1 text-[12px] text-neutral-400">
              <MapPin className="h-3 w-3" />{address.gps}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        {!address.isDefault && (
          <button onClick={() => onSetDefault(address.id)}
            className="flex-1 rounded-xl border border-neutral-200 py-2 text-[13px] font-medium text-neutral-600 active:bg-neutral-50">
            Set as default
          </button>
        )}
        <button onClick={() => onEdit(address)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 active:bg-neutral-50">
          <Pencil className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(address.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 text-red-400 active:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Address form sheet ───────────────────────────────────────────────────────

const AddressSheet = ({ initial, onSave, onClose }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const [errors, setErrors] = useState({});
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm(f => ({ ...f, gps: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
        setGpsLoading(false);
      },
      () => {
        setGpsError('Could not get location. Please enter your GPS code manually.');
        setGpsLoading(false);
      },
      { timeout: 8000 },
    );
  };

  const set = k => v => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.label.trim())  e.label  = 'Required';
    if (!form.street.trim()) e.street = 'Required';
    if (!form.city.trim())   e.city   = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 px-4 py-3.5">
        <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100">
          <X className="h-5 w-5 text-neutral-600" />
        </button>
        <h2 className="flex-1 text-[17px] font-semibold text-neutral-900">
          {initial?.id ? 'Edit address' : 'New address'}
        </h2>
        <Button onClick={() => { if (validate()) onSave(form); }} variant="accent" className="!rounded-xl px-4 py-2 text-[14px]">
          Save
        </Button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
        {/* Label */}
        <Input
          label="Label"
          required
          placeholder="e.g. Home, Mum's place, Work"
          value={form.label}
          onChange={e => set('label')(e.target.value)}
          error={errors.label}
        />

        {/* Type */}
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-neutral-700">Type</label>
          <div className="flex gap-2">
            {Object.entries(TYPE_META).map(([key, meta]) => {
              const TIcon = meta.Icon;
              const active = form.type === key;
              return (
                <button key={key} type="button"
                  onClick={() => set('type')(key)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl border py-3 transition-all ${
                    active ? `border-accent-400 ring-2 ring-accent-200 ${meta.bgCls}` : 'border-neutral-200'
                  }`}>
                  <TIcon className={`h-5 w-5 ${active ? meta.colorCls : 'text-neutral-400'}`} />
                  <span className={`text-[12px] font-medium ${active ? meta.colorCls : 'text-neutral-500'}`}>
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Street */}
        <Input
          label="Street address"
          required
          placeholder="e.g. 14 Liberation Road"
          value={form.street}
          onChange={e => set('street')(e.target.value)}
          error={errors.street}
        />

        {/* Suburb + City */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Suburb / Area"
            placeholder="e.g. Osu"
            value={form.suburb}
            onChange={e => set('suburb')(e.target.value)}
          />
          <Input
            label="City"
            required
            placeholder="e.g. Accra"
            value={form.city}
            onChange={e => set('city')(e.target.value)}
            error={errors.city}
          />
        </div>

        {/* GPS */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-neutral-700">
              GPS / Digital address <span className="font-normal text-neutral-400">(optional)</span>
            </span>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={gpsLoading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-neutral-600 transition-colors hover:bg-neutral-50 disabled:opacity-60"
            >
              {gpsLoading
                ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Locating…</>
                : <><Crosshair className="h-3.5 w-3.5" /> Use my location</>
              }
            </button>
          </div>
          <Input
            placeholder="e.g. GA-045-3721 or 5.6037, -0.1870"
            value={form.gps}
            onChange={e => set('gps')(e.target.value)}
            error={gpsError || undefined}
            helper={!gpsError ? 'GhanaPostGPS code or decimal coordinates (lat, lng)' : undefined}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Delete confirmation ──────────────────────────────────────────────────────

const DeleteModal = ({ address, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full rounded-t-2xl bg-white p-5 pb-8 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error-bg">
          <Trash2 className="h-5 w-5 text-error" />
        </div>
        <h3 className="text-[17px] font-bold text-neutral-900">Remove address?</h3>
        <p className="mt-1.5 text-[14px] text-neutral-500">
          <strong className="text-neutral-700">{address?.label}</strong> will be permanently removed from your saved addresses.
        </p>
        <div className="mt-5 flex gap-3">
          <button onClick={onCancel}
            className="flex-1 rounded-xl border border-neutral-200 py-3.5 text-[15px] font-semibold text-neutral-700">
            Cancel
          </button>
          <Button variant="danger" onClick={onConfirm} className="flex-1">
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const AddressesPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [sheet, setSheet]         = useState(null);   // null | { mode: 'add' | 'edit', address?: obj }
  const [deleteTarget, setDeleteTarget] = useState(null);

  const setDefault = id => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const saveAddress = form => {
    if (form.id) {
      setAddresses(prev => prev.map(a => a.id === form.id ? { ...a, ...form } : a));
    } else {
      const newAddr = { ...form, id: Date.now(), isDefault: addresses.length === 0 };
      setAddresses(prev => [...prev, newAddr]);
    }
    setSheet(null);
  };

  const deleteAddress = id => {
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      if (next.length > 0 && !next.some(a => a.isDefault)) {
        next[0].isDefault = true;
      }
      return next;
    });
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* Top header */}
      <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white px-4 py-3.5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100">
            <ChevronLeft className="h-5 w-5 text-neutral-600" />
          </button>
          <h1 className="flex-1 text-[17px] font-bold text-neutral-900">My addresses</h1>
          <span className="text-[13px] text-neutral-400">{addresses.length} saved</span>
        </div>
      </div>

      {/* Address list */}
      <div className="px-4 py-4 space-y-3">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-50">
              <MapPin className="h-8 w-8 text-accent-500" />
            </div>
            <p className="text-[16px] font-semibold text-neutral-800">No addresses yet</p>
            <p className="mt-1 text-[14px] text-neutral-500">Add a delivery address to speed up your bookings.</p>
          </div>
        ) : (
          addresses.map(a => (
            <AddressCard key={a.id} address={a}
              onSetDefault={setDefault}
              onEdit={addr => setSheet({ mode: 'edit', address: addr })}
              onDelete={id => setDeleteTarget(addresses.find(a => a.id === id))}
            />
          ))
        )}

        {/* Add address button */}
        <button onClick={() => setSheet({ mode: 'add' })}
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-dashed border-neutral-200 bg-white px-4 py-4 text-left transition-colors active:bg-neutral-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50">
            <Plus className="h-5 w-5 text-accent-500" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-neutral-800">Add new address</p>
            <p className="text-[12px] text-neutral-500">Home, office, or any delivery location</p>
          </div>
        </button>
      </div>

      {/* Add / Edit sheet */}
      {sheet && (
        <AddressSheet
          initial={sheet.mode === 'edit' ? sheet.address : null}
          onSave={saveAddress}
          onClose={() => setSheet(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteModal
          address={deleteTarget}
          onConfirm={() => deleteAddress(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

export default AddressesPage;

