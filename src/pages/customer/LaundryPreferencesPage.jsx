import { useState, useEffect } from 'react';
import { Shirt, Droplets, Wind, FileText } from 'lucide-react';
import CustomerSettingsLayout, { SettingsSection } from '../../components/layout/CustomerSettingsLayout.jsx';
import { MOCK_PREFERENCES } from '../../data/mockCustomer.js';
import { FABRIC_OPTIONS, TEMP_OPTIONS, DETERGENT_OPTIONS, DRYING_OPTIONS, HEAT_OPTIONS, STARCH_OPTIONS } from '../../utils/laundryOptions.js';
import Toggle from '../../components/ui/Toggle.jsx';


const NAV_SECTIONS = [
  { id: 'fabric',       icon: Shirt,    label: 'Fabric care'         },
  { id: 'washing',      icon: Droplets, label: 'Washing'             },
  { id: 'drying',       icon: Wind,     label: 'Drying'              },
  { id: 'instructions', icon: FileText, label: 'Special instructions'},
];

const initState = () => ({
    fabrics:       MOCK_PREFERENCES.fabricCare ?? ['Cotton', 'Denim'],
    temperature:   MOCK_PREFERENCES.waterTemperature ?? 'Cold',
    detergent:     MOCK_PREFERENCES.detergent ?? 'Unscented / Hypoallergenic',
    separateColors: MOCK_PREFERENCES.separateColors ?? true,
    starch:        MOCK_PREFERENCES.ironingLevel ? `${MOCK_PREFERENCES.ironingLevel} iron` : 'No starching',
    dryingMethod:  MOCK_PREFERENCES.dryingMethod ?? 'Air dry',
    heat:          'Low',
    instructions:  MOCK_PREFERENCES.instructions ?? '',
});

// Pill toggle
const Pill = ({ label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[36px] rounded-full border px-4 py-1.5 text-[14px] font-medium transition-all"
      style={selected
        ? { background: '#E8F9FA', color: '#0E9AA7', borderColor: '#0E9AA7' }
        : { background: '#F5F5F5', color: '#737373', borderColor: '#E5E5E5' }
      }
    >
      {label}
    </button>
  );
};

// Toggle switch row
const ToggleRow = ({ label, sub, on, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
      <div>
        <p className="text-[14px] font-medium text-neutral-800">{label}</p>
        {sub && <p className="text-[12px] text-neutral-400">{sub}</p>}
      </div>
      <Toggle size="md" checked={on} onChange={() => onChange()} />
    </div>
  );
};

const LaundryPreferencesPage = () => {
  const [form, setForm]   = useState(initState);
  const [saved, setSaved] = useState(initState);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const toggleFabric = fabric => {
    setForm(f => ({
      ...f,
      fabrics: f.fabrics.includes(fabric) ? f.fabrics.filter(x => x !== fabric) : [...f.fabrics, fabric],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 700));
      setSaved({ ...form });
      setToast('Preferences saved');
      setTimeout(() => setToast(null), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <CustomerSettingsLayout
      title="Laundry Preferences"
      sections={NAV_SECTIONS}
      dirty={dirty}
      onSave={handleSave}
      onDiscard={() => setForm({ ...saved })}
      saving={saving}
    >
      {toast && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">{toast}</div>
      )}

      {/* ── Fabric care ─────────────────────────────────────────────────────── */}
      <SettingsSection id="fabric" icon={Shirt} title="Fabric care" helper="Tell us which fabric types you own so we handle them correctly">
        <p className="mb-3 text-[13px] text-neutral-500">Select all that apply</p>
        <div className="flex flex-wrap gap-2">
          {FABRIC_OPTIONS.map(f => (
            <Pill key={f} label={f} selected={form.fabrics.includes(f)} onClick={() => toggleFabric(f)} />
          ))}
        </div>
      </SettingsSection>

      {/* ── Washing ─────────────────────────────────────────────────────────── */}
      <SettingsSection id="washing" icon={Droplets} title="Washing" helper="Your washing method preferences">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-700">Water temperature</p>
            <div className="flex gap-2">
              {TEMP_OPTIONS.map(opt => (
                <Pill key={opt} label={opt} selected={form.temperature === opt} onClick={() => set('temperature', opt)} />
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-100" />

          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-700">Detergent</p>
            <select
              value={form.detergent}
              onChange={e => set('detergent', e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[14px] text-neutral-900 outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
            >
              {DETERGENT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="border-t border-neutral-100" />

          <ToggleRow
            label="Separate colors"
            sub="Darks, lights, and whites washed separately"
            on={form.separateColors}
            onChange={() => set('separateColors', !form.separateColors)}
          />

          <div className="border-t border-neutral-100" />

          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-700">Starch / Ironing</p>
            <div className="flex flex-wrap gap-2">
              {STARCH_OPTIONS.map(opt => (
                <Pill key={opt} label={opt} selected={form.starch === opt} onClick={() => set('starch', opt)} />
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ── Drying ──────────────────────────────────────────────────────────── */}
      <SettingsSection id="drying" icon={Wind} title="Drying" helper="How you prefer your clothes to be dried">
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-700">Drying method</p>
            <div className="flex gap-2">
              {DRYING_OPTIONS.map(opt => (
                <Pill key={opt} label={opt} selected={form.dryingMethod === opt} onClick={() => set('dryingMethod', opt)} />
              ))}
            </div>
          </div>
          {form.dryingMethod === 'Tumble dry' && (
            <>
              <div className="border-t border-neutral-100" />
              <div>
                <p className="mb-2 text-[13px] font-semibold text-neutral-700">Heat level</p>
                <div className="flex gap-2">
                  {HEAT_OPTIONS.map(opt => (
                    <Pill key={opt} label={opt} selected={form.heat === opt} onClick={() => set('heat', opt)} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SettingsSection>

      {/* ── Special instructions ─────────────────────────────────────────────── */}
      <SettingsSection id="instructions" icon={FileText} title="Special instructions" helper="Anything else the laundry should know about your items">
        <textarea
          rows={5}
          value={form.instructions}
          onChange={e => { if (e.target.value.length <= 500) set('instructions', e.target.value); }}
          placeholder="e.g. Handle silk with extra care, no bleach on dark items…"
          className="w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-[15px] text-neutral-900 outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
        />
        <p className="mt-1 text-right text-[12px] text-neutral-400">{form.instructions.length}/500</p>
      </SettingsSection>
    </CustomerSettingsLayout>
  );
};

export default LaundryPreferencesPage;
