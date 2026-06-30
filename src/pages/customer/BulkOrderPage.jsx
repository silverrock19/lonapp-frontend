import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, AlertCircle, CheckCircle, Table } from 'lucide-react';
import { generateQuote } from '../../lib/pricing/engine.js';
import QuoteBreakdown from '../../components/pricing/QuoteBreakdown.jsx';

const ITEM_TYPE_TO_SERVICE_ID = {
  'Shirt / Blouse':    'shirt',
  'Trouser / Pants':   'trouser',
  'Dress / Skirt':     'dress',
  'Suit (2-piece)':    'dry-suit',
  'Jacket / Blazer':   'jacket',
  'Bed Sheet':         'bedsheet-single',
  'Duvet / Comforter': 'duvet-single',
  'Towel':             'towel',
};

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const ITEM_TYPES = ['Shirt / Blouse', 'Trouser / Pants', 'Dress / Skirt', 'Suit (2-piece)', 'Jacket / Blazer', 'Bed Sheet', 'Duvet / Comforter', 'Towel'];
const SERVICE_TYPES = ['Standard Wash', 'Express Wash', 'Dry Cleaning', 'Iron Only'];

// Demo pre-filled rows
const DEMO_ROWS = [
  { id: 1, itemType: 'Shirt / Blouse',   qty: 20, service: 'Standard Wash', dept: 'Marketing', notes: '',              unitPrice: 8,  ok: true  },
  { id: 2, itemType: 'Trouser / Pants',  qty: 15, service: 'Standard Wash', dept: 'Marketing', notes: '',              unitPrice: 10, ok: true  },
  { id: 3, itemType: 'Suit (2-piece)',   qty: 5,  service: 'Dry Cleaning',  dept: 'Executive', notes: 'Starch only',   unitPrice: 35, ok: true  },
  { id: 4, itemType: '',                 qty: 0,  service: 'Iron Only',     dept: 'Finance',   notes: '',              unitPrice: 0,  ok: false, error: 'Item type required' },
  { id: 5, itemType: 'Towel',           qty: 30, service: 'Standard Wash', dept: 'Rooms',     notes: 'Hospital grade', unitPrice: 8,  ok: true  },
];

export default function BulkOrderPage() {
  const navigate  = useNavigate();
  const [tab,     setTab]     = useState('grid'); // 'grid' | 'upload'
  const [rows,    setRows]    = useState(DEMO_ROWS);
  const [validating, setValidating] = useState(false);
  const [validated,  setValidated]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);

  const validRows   = rows.filter(r => r.ok);
  const invalidRows = rows.filter(r => !r.ok);

  const cartItems = validRows.map(r => ({
    serviceId: ITEM_TYPE_TO_SERVICE_ID[r.itemType] ?? r.itemType.toLowerCase().replace(/\s/g, '-'),
    name: r.itemType,
    qty: r.qty,
    unitPrice: r.unitPrice,
    category: 'washing',
  }));

  let quote = null;
  try {
    quote = cartItems.length > 0
      ? generateQuote({ cartItems, turnaroundId: 'standard', deliveryMethod: 'home_delivery', customerTier: 'commercial' })
      : null;
  } catch {
    quote = null;
  }

  const subtotal = quote?.subtotal ?? 0;
  const discount = quote?.totalDiscount ?? 0;
  const vat      = quote?.totalTax ?? 0;
  const total    = quote?.grandTotal ?? 0;

  async function handleValidate() {
    setValidating(true);
    await new Promise(r => setTimeout(r, 1000));
    setValidating(false);
    setValidated(true);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setDone(true);
  }

  function updateRow(id, field, value) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value, ok: r.id === id ? !!(r.itemType || field === 'itemType' ? (field === 'itemType' ? value : r.itemType) : '') : r.ok, error: undefined } : r));
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center" style={{ background: '#FAFAF8' }}>
        <CheckCircle className="h-16 w-16 text-success-text mb-4" />
        <h2 className="text-h3 font-bold text-neutral-900">Bulk Order Submitted</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">{validRows.length} line items totalling {fmtPrice(total)} have been submitted. Our team will confirm logistics within 2 hours.</p>
        <button onClick={() => navigate('/app/orders')} className="px-6 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">View Orders</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <p className="text-small font-bold text-neutral-900">Bulk Order Entry</p>
            <p className="text-caption text-neutral-400">Commercial / high-volume orders</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-t border-neutral-100">
          {[['grid', 'Grid Entry'], ['upload', 'CSV Upload']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2.5 text-small font-semibold border-b-2 transition-all ${tab === k ? 'border-accent-500 text-accent-700' : 'border-transparent text-neutral-500'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {tab === 'upload' && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-6 text-center space-y-3">
            <Upload className="h-10 w-10 mx-auto text-neutral-300" />
            <p className="text-small font-bold text-neutral-700">Upload CSV or Excel file</p>
            <p className="text-caption text-neutral-400">Columns: Item Type, Quantity, Service Type, Department, Notes</p>
            <button className="px-4 py-2 rounded-xl bg-accent-50 text-accent-600 text-small font-semibold border border-accent-200 hover:bg-accent-100">
              Choose File
            </button>
            <p className="text-caption text-neutral-400">or <button onClick={() => setTab('grid')} className="text-accent-600 font-semibold">switch to grid entry</button></p>
          </div>
        )}

        {tab === 'grid' && (
          <>
            {/* Validation badges */}
            {validated && (
              <div className="flex gap-2">
                <div className="flex-1 rounded-xl bg-success-bg text-success-text text-caption font-semibold px-3 py-2 text-center">{validRows.length} valid rows</div>
                {invalidRows.length > 0 && (
                  <div className="flex-1 rounded-xl bg-error-bg text-error text-caption font-semibold px-3 py-2 text-center">{invalidRows.length} errors</div>
                )}
              </div>
            )}

            {/* Grid */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 bg-neutral-50">
                <Table className="h-4 w-4 text-neutral-400" />
                <p className="text-caption font-bold text-neutral-500">{rows.length} rows · Click any cell to edit</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-small">
                  <thead>
                    <tr className="border-b border-neutral-100">
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase">#</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase">Item</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase">Qty</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase">Service</th>
                      <th className="text-left px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase">Dept</th>
                      <th className="text-right px-3 py-2 text-[10px] font-bold text-neutral-400 uppercase">Line Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(row => (
                      <tr key={row.id} className={`border-b border-neutral-50 ${!row.ok ? 'bg-error-bg/30' : ''}`}>
                        <td className="px-3 py-2 text-neutral-400">
                          {row.ok
                            ? <CheckCircle className="h-3.5 w-3.5 text-success-text" />
                            : <AlertCircle className="h-3.5 w-3.5 text-error" />
                          }
                        </td>
                        <td className="px-3 py-2 min-w-[120px]">
                          <select value={row.itemType} onChange={e => updateRow(row.id, 'itemType', e.target.value)} className={`w-full bg-transparent text-small outline-none ${!row.itemType ? 'text-error' : 'text-neutral-800'}`}>
                            <option value="">Select…</option>
                            {ITEM_TYPES.map(it => <option key={it}>{it}</option>)}
                          </select>
                          {row.error && <p className="text-[10px] text-error">{row.error}</p>}
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" value={row.qty} onChange={e => updateRow(row.id, 'qty', parseInt(e.target.value) || 0)} min="1" className="w-12 bg-transparent text-small text-neutral-800 outline-none tabular-nums" />
                        </td>
                        <td className="px-3 py-2 min-w-[100px]">
                          <select value={row.service} onChange={e => updateRow(row.id, 'service', e.target.value)} className="w-full bg-transparent text-small text-neutral-700 outline-none">
                            {SERVICE_TYPES.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input type="text" value={row.dept} onChange={e => updateRow(row.id, 'dept', e.target.value)} className="w-16 bg-transparent text-small text-neutral-700 outline-none" placeholder="—" />
                        </td>
                        <td className="px-3 py-2 text-right font-semibold tabular-nums text-neutral-800">
                          {row.ok ? fmtPrice(row.unitPrice * row.qty) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pricing */}
            {validated && validRows.length > 0 && (
              <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Order Total</p>
                <QuoteBreakdown quote={quote} variant="customer" compact={false} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100 space-y-2">
        {!validated ? (
          <button onClick={handleValidate} disabled={validating} className="w-full rounded-2xl bg-neutral-800 text-white font-bold text-body py-4 disabled:opacity-40">
            {validating ? <span className="animate-pulse">Validating {rows.length} rows…</span> : `Validate ${rows.length} Rows`}
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={validRows.length === 0 || submitting} className="w-full rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600">
            {submitting ? 'Submitting…' : `Submit ${validRows.length} Valid Rows · ${fmtPrice(total)}`}
          </button>
        )}
      </div>
    </div>
  );
}
