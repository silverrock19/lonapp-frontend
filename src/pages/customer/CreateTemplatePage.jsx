import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { calcTax } from '../../lib/pricing/tax.js';
import { formatGHS as fmtPrice, getTaxLabel } from '../../utils/formatCurrency.js';

const COLORS = ['#0E9AA7', '#7C3AED', '#B45309', '#DC2626', '#059669', '#0284C7'];

const CATALOG = [
  { id: 'c1',  name: 'Shirt / Blouse',      unitPrice: 8,  category: 'washing'      },
  { id: 'c2',  name: 'Trouser / Pants',      unitPrice: 10, category: 'washing'      },
  { id: 'c3',  name: 'Dress / Skirt',        unitPrice: 12, category: 'washing'      },
  { id: 'c4',  name: 'Suit (2-piece)',        unitPrice: 35, category: 'dry-cleaning' },
  { id: 'c5',  name: 'Jacket / Blazer',      unitPrice: 20, category: 'dry-cleaning' },
  { id: 'c6',  name: 'Shirt (Iron Only)',     unitPrice: 5,  category: 'ironing'      },
  { id: 'c7',  name: 'Bed Sheet',            unitPrice: 15, category: 'washing'      },
  { id: 'c8',  name: 'Duvet / Comforter',    unitPrice: 40, category: 'heavy'        },
  { id: 'c9',  name: 'Pillow Case',          unitPrice: 5,  category: 'washing'      },
  { id: 'c10', name: 'Towel',                unitPrice: 8,  category: 'washing'      },
];


function calcEstimate(items, turnaround) {
  const sub       = items.reduce((s, i) => s + i.unitPrice * (i.qty || 0), 0);
  const surcharge = turnaround === 'express' ? sub * 0.4 : 0;
  const { totalTax } = calcTax(sub + surcharge);
  return sub + surcharge + 30 + totalTax;
}

export default function CreateTemplatePage() {
  const navigate = useNavigate();
  const [name,       setName]       = useState('');
  const [color,      setColor]      = useState(COLORS[0]);
  const [turnaround, setTurnaround] = useState('standard');
  const [items,      setItems]      = useState({});
  const [notes,      setNotes]      = useState('');
  const [saving,     setSaving]     = useState(false);
  const [done,       setDone]       = useState(false);

  function setQty(id, delta) {
    setItems(prev => {
      const current = prev[id]?.qty ?? 0;
      const next    = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      const cat = CATALOG.find(c => c.id === id);
      return { ...prev, [id]: { ...cat, qty: next } };
    });
  }

  const pickedItems = Object.values(items);
  const estimate    = calcEstimate(pickedItems, turnaround);
  const canSave     = name.trim() && pickedItems.length > 0;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    setDone(true);
    setTimeout(() => navigate('/app/templates'), 1000);
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <h1 className="flex-1 text-small font-bold text-neutral-900">New Template</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Name + color */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Template Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Weekly Shirts"
              maxLength={40}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 transition-all placeholder:text-neutral-400"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ background: c }}
                  className="h-8 w-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                >
                  {color === c && <Check className="h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Speed */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Default Speed</p>
          <div className="flex gap-2">
            {[['standard', 'Standard (3 days)'], ['express', 'Express (1 day)']].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setTurnaround(k)}
                className={`flex-1 rounded-xl border-2 py-2 text-small font-semibold transition-all ${
                  turnaround === k ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-neutral-200 text-neutral-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Items</p>
          {CATALOG.map(cat => {
            const qty = items[cat.id]?.qty ?? 0;
            return (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3 border-t border-neutral-100">
                <div className="flex-1 min-w-0">
                  <p className="text-small font-semibold text-neutral-800">{cat.name}</p>
                  <p className="text-caption text-neutral-400">{fmtPrice(cat.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(cat.id, -1)} disabled={qty === 0} className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 transition-colors">
                    <Minus className="h-3.5 w-3.5 text-neutral-600" />
                  </button>
                  <span className="w-5 text-center text-small font-bold text-neutral-900 tabular-nums">{qty}</span>
                  <button onClick={() => setQty(cat.id, +1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-50 hover:bg-accent-100 transition-colors">
                    <Plus className="h-3.5 w-3.5 text-accent-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notes */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Default Instructions</p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Care instructions applied to every order from this template…" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 resize-none placeholder:text-neutral-400" />
        </div>

        {/* Estimate */}
        {pickedItems.length > 0 && (
          <div className="rounded-2xl bg-accent-50 border border-accent-100 p-4">
            <p className="text-caption text-accent-600 font-semibold">Estimated order total: <span className="font-bold">{fmtPrice(estimate)}</span></p>
            <p className="text-caption text-accent-400">Based on current pricing + {getTaxLabel()} + GH₵ 30 logistics</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        {done ? (
          <div className="w-full rounded-2xl bg-success-bg text-success-text font-semibold text-small text-center py-4">✓ Template saved</div>
        ) : (
          <button
            onClick={handleSave}
            disabled={!canSave || saving}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600 transition-all"
          >
            {saving ? <span className="animate-pulse">Saving…</span> : 'Save Template'}
          </button>
        )}
      </div>
    </div>
  );
}
