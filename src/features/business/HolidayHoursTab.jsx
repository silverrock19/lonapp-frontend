import { useState } from 'react';
import { Plus, Trash2, X, CalendarDays } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';

const OUTLETS_LIST = [
  { id: 0, name: 'All outlets'    },
  { id: 1, name: 'HQ — Osu'      },
  { id: 2, name: 'Spintex Outlet' },
  { id: 3, name: 'Tema Factory'   },
];

const initSpecialDates = [
  { id: 1, date: '2026-12-25', label: 'Christmas Day',      type: 'closed', from: '', to: '', outletId: 0 },
  { id: 2, date: '2027-01-01', label: "New Year's Day",     type: 'closed', from: '', to: '', outletId: 0 },
  { id: 3, date: '2026-07-01', label: 'Ghana Republic Day', type: 'closed', from: '', to: '', outletId: 0 },
  { id: 4, date: '2026-08-15', label: 'Staff training day', type: 'custom', from: '10:00', to: '14:00', outletId: 1 },
];

const inputCls = 'w-full rounded-md border border-neutral-200 px-3 py-2 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

const HolidayHoursTab = () => {
  const [dates, setDates]       = useState(initSpecialDates);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm]         = useState({ date: '', label: '', type: 'closed', from: '09:00', to: '17:00', outletId: 0 });

  const set = key => val => setForm(f => ({ ...f, [key]: val }));

  const addDate = () => {
    if (!form.date || !form.label) return;
    setDates(p => [...p, { ...form, id: Date.now() }]);
    setForm({ date: '', label: '', type: 'closed', from: '09:00', to: '17:00', outletId: 0 });
    setShowForm(false);
  };

  const sorted = [...dates].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <SectionCard
        title="Special dates & holiday hours"
        description="Override normal operating hours for specific dates — affects customer booking availability."
        action={<Button size="sm" onClick={() => setShowForm(true)}><Plus className="h-3.5 w-3.5" /> Add special date</Button>}
      >
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <CalendarDays className="mb-2 h-7 w-7 text-neutral-300" />
            <p className="text-small text-neutral-500">No special dates added yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map(sd => {
              const outlet = OUTLETS_LIST.find(o => o.id === sd.outletId);
              const d      = new Date(sd.date + 'T00:00:00');
              return (
                <div key={sd.id} className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary-50">
                      <span className="text-[10px] font-bold uppercase text-primary-400">
                        {d.toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                      <span className="text-small font-bold text-primary-700">{d.getDate()}</span>
                    </div>
                    <div>
                      <p className="text-small font-semibold text-neutral-900">{sd.label}</p>
                      <p className="text-caption text-neutral-500">
                        {d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                        {' · '}{outlet?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {sd.type === 'closed'
                      ? <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-600">Closed all day</span>
                      : <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700">{sd.from} – {sd.to}</span>
                    }
                    <button onClick={() => setDeleteId(sd.id)}
                      className="rounded p-1 text-neutral-400 hover:bg-red-50 hover:text-error transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <h3 className="text-h4 font-bold text-neutral-900">Add special date</h3>
              <button onClick={() => setShowForm(false)} className="rounded p-1 hover:bg-neutral-100">
                <X className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Date *</label>
                <input type="date" className={inputCls} value={form.date} onChange={e => set('date')(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Label / reason *</label>
                <input className={inputCls} placeholder="e.g. Public holiday, Staff training" value={form.label} onChange={e => set('label')(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Applies to</label>
                <select className={inputCls} value={form.outletId} onChange={e => set('outletId')(Number(e.target.value))}>
                  {OUTLETS_LIST.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Hours</label>
                <div className="flex gap-3">
                  {[{ label: 'Closed all day', value: 'closed' }, { label: 'Custom hours', value: 'custom' }].map(opt => (
                    <label key={opt.value}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-small font-medium transition-all ${
                        form.type === opt.value ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                      }`}>
                      <input type="radio" name="hour_type" value={opt.value} checked={form.type === opt.value}
                        onChange={() => set('type')(opt.value)} className="sr-only" />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
              {form.type === 'custom' && (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-small text-neutral-600">Opens</label>
                    <input type="time" className={inputCls} value={form.from} onChange={e => set('from')(e.target.value)} />
                  </div>
                  <span className="mb-2.5 text-neutral-400">→</span>
                  <div className="flex-1">
                    <label className="mb-1 block text-small text-neutral-600">Closes</label>
                    <input type="time" className={inputCls} value={form.to} onChange={e => set('to')(e.target.value)} />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={addDate} disabled={!form.date || !form.label}>Add date</Button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <h3 className="text-h4 font-bold text-neutral-900">Remove special date?</h3>
            <p className="mt-2 text-small text-neutral-600">This date will revert to its normal operating hours.</p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
              <Button onClick={() => { setDates(p => p.filter(d => d.id !== deleteId)); setDeleteId(null); }}
                style={{ background: '#D92D20', color: '#fff', borderColor: '#D92D20' }}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidayHoursTab;
