import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, X, ChevronRight, AlertTriangle, CheckCircle, ShoppingCart } from 'lucide-react';
import {
  searchCustomers, registerNewCustomer,
  TURNAROUND_OPTIONS, POS_SERVICE_TYPES,
  updatePOSSession, genOrderId,
  addTodayOrder,
} from '../../lib/mock/posData.js';
import { cn } from '../../utils/classNames.js';
import Button from '../../components/ui/Button.jsx';
import { formatGHS } from '../../utils/formatCurrency.js';

function formatPhone(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length >= 10) return '+233' + digits.slice(1);
  if (digits.startsWith('233')) return '+' + digits;
  return raw;
}

// ── Customer panel ────────────────────────────────────────────────────────────

function CustomerPanel({ selected, onSelect }) {
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [mode,     setMode]     = useState('search'); // search | register
  const [form,     setForm]     = useState({ firstName: '', lastName: '', phone: '', address: '', city: 'Accra', email: '' });
  const [errors,   setErrors]   = useState({});
  const [creating, setCreating] = useState(false);
  const [dupWarn,  setDupWarn]  = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(() => setResults(searchCustomers(query)), 300);
    return () => clearTimeout(timer);
  }, [query]);

  function validateReg() {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.phone.trim())     e.phone     = 'Required';
    else if (!/^(\+233|0)\d{9}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Enter a valid Ghana number';
    if (!form.address.trim())   e.address   = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreate() {
    if (!validateReg()) return;
    setCreating(true);
    await new Promise(r => setTimeout(r, 600));
    const customer = registerNewCustomer(form);
    setCreating(false);
    onSelect(customer);
    setMode('search');
    setQuery(customer.name);
    setResults([]);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Customer</p>

        {selected ? (
          <div className="rounded-xl bg-primary-50 border border-primary-200 p-3.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-body font-bold text-primary-800">{selected.name}</p>
                <p className="text-small text-primary-600">{selected.phone}</p>
                <p className="text-caption text-primary-500 mt-0.5">{selected.address}</p>
                {selected.isNew && (
                  <span className="inline-flex items-center gap-1 mt-1 text-caption font-semibold text-success-text bg-success-bg px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3" /> New customer registered
                  </span>
                )}
                {!selected.isNew && (
                  <p className="text-caption text-primary-400 mt-0.5">{selected.ordersCount} previous orders</p>
                )}
              </div>
              <button onClick={() => { onSelect(null); setQuery(''); }} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-primary-100 text-primary-400">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Phone number or name…"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-neutral-200 bg-neutral-50 text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-neutral-400"
                onFocus={() => setMode('search')}
              />
            </div>

            {query.trim() && results.length === 0 && mode === 'search' && (
              <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-3 text-center">
                <p className="text-small text-neutral-500 mb-2">No customer found for "{query}"</p>
                <button
                  onClick={() => { setMode('register'); setForm(f => ({ ...f, phone: formatPhone(query) })); }}
                  className="flex items-center gap-2 mx-auto text-small font-semibold text-primary-600 hover:text-primary-700"
                >
                  <UserPlus className="h-4 w-4" /> Register new customer
                </button>
              </div>
            )}

            {results.length > 0 && mode === 'search' && (
              <div className="mt-2 rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden">
                {results.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { onSelect(c); setQuery(c.name); setResults([]); }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-neutral-50 transition-colors text-left border-b border-neutral-50 last:border-b-0"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-caption font-bold text-neutral-600">
                      {c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-small font-semibold text-neutral-800">{c.name}</p>
                      <p className="text-caption text-neutral-400">{c.phone} · {c.ordersCount} orders</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Register new form */}
      {mode === 'register' && !selected && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-small font-bold text-neutral-700">New customer</p>
            <button onClick={() => setMode('search')} className="text-caption text-neutral-400 hover:text-neutral-600">Cancel</button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'firstName', label: 'First name *', placeholder: 'e.g. Kwame' },
              { key: 'lastName',  label: 'Last name *',  placeholder: 'e.g. Mensah' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-caption font-medium text-neutral-600 mb-1">{label}</label>
                <input
                  type="text"
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={cn('w-full px-3 py-2.5 rounded-lg border text-small outline-none transition-all',
                    errors[key] ? 'border-error bg-red-50 focus:ring-2 focus:ring-red-100' : 'border-neutral-200 bg-neutral-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100')}
                />
                {errors[key] && <p className="text-caption text-error mt-0.5">{errors[key]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-caption font-medium text-neutral-600 mb-1">Phone number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+233 24 123 4567"
              className={cn('w-full px-3 py-2.5 rounded-lg border text-small outline-none transition-all',
                errors.phone ? 'border-error bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100')}
            />
            {errors.phone && <p className="text-caption text-error mt-0.5">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-caption font-medium text-neutral-600 mb-1">Residential address *</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Street, Area"
              className={cn('w-full px-3 py-2.5 rounded-lg border text-small outline-none transition-all',
                errors.address ? 'border-error bg-red-50' : 'border-neutral-200 bg-neutral-50 focus:border-primary-400 focus:ring-2 focus:ring-primary-100')}
            />
            {errors.address && <p className="text-caption text-error mt-0.5">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-caption font-medium text-neutral-600 mb-1">Email (optional)</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="customer@email.com"
              className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 bg-neutral-50 text-small outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
            />
          </div>

          <Button variant="primary" className="w-full" loading={creating} onClick={handleCreate}>
            Create Customer & Continue
          </Button>
        </div>
      )}

      {/* Recent walk-ins */}
      {mode === 'search' && !selected && (
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wider mb-2">Recent walk-ins</p>
          <div className="space-y-1">
            {[
              { id: 'CUS-2024-003456', ref: '10000003', name: 'Kofi Boateng',  phone: '+233270112233', ordersCount: 15 },
              { id: 'CUS-2024-005678', ref: '10000005', name: 'Yaw Afriyie',   phone: '+233201122334', ordersCount: 6  },
              { id: 'CUS-2024-001234', ref: '10000001', name: 'Kwame Mensah',  phone: '+233241234567', ordersCount: 8  },
              { id: 'CUS-2024-002345', ref: '10000002', name: 'Ama Asante',    phone: '+233208765432', ordersCount: 3  },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => { onSelect(c); setQuery(c.name); }}
                className="flex w-full items-center gap-3 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-left"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-caption font-bold text-neutral-500">
                  {c.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <p className="text-small font-medium text-neutral-700">{c.name}</p>
                  <p className="text-caption text-neutral-400">{c.phone}</p>
                </div>
              </button>
            ))}
          </div>
          {!query.trim() && (
            <button
              onClick={() => setMode('register')}
              className="mt-3 flex items-center gap-2 text-small font-semibold text-primary-600 hover:text-primary-700 w-full justify-center py-2 rounded-lg hover:bg-primary-50 transition-colors"
            >
              <UserPlus className="h-4 w-4" /> Register New Customer
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Order form ────────────────────────────────────────────────────────────────

function OrderPanel({ customer, onSave }) {
  const [service,  setService]  = useState('');
  const [turnaround, setTurnaround] = useState('standard');
  const [delivery, setDelivery] = useState('pickup');
  const [notes,    setNotes]    = useState('');
  const [saving,   setSaving]   = useState(false);

  const turnaroundObj = TURNAROUND_OPTIONS.find(t => t.id === turnaround);
  const canSave = !!customer && !!service;

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    const orderId = genOrderId();
    updatePOSSession({
      customer,
      orderId,
      service,
      turnaround,
      deliveryType: delivery,
      specialInstructions: notes,
      items:         [],
      subtotal:      0, surcharge: 0, deliveryFee: 0, vat: 0, total: 0,
      paymentStatus: 'unpaid',
      status:        'draft',
    });
    setSaving(false);
    onSave(orderId);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* Service type */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Service type</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {POS_SERVICE_TYPES.map(s => (
              <button
                key={s.id}
                onClick={() => setService(s.id)}
                className={cn(
                  'py-3 px-3 rounded-xl border-2 text-small font-semibold text-center transition-all',
                  service === s.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300',
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Turnaround */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Turnaround</p>
          <div className="flex gap-2">
            {TURNAROUND_OPTIONS.map(t => (
              <button
                key={t.id}
                onClick={() => setTurnaround(t.id)}
                className={cn(
                  'flex-1 flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all',
                  turnaround === t.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300',
                  t.id === 'same_day' ? 'ring-0' : '',
                )}
              >
                <span className={cn('text-small font-bold', turnaround === t.id ? 'text-primary-700' : 'text-neutral-700')}>{t.label}</span>
                <span className="text-caption text-neutral-400">{t.badge}</span>
                {t.surchargeLabel && (
                  <span className={cn('text-caption font-semibold mt-0.5', turnaround === t.id ? 'text-primary-500' : 'text-neutral-400')}>
                    {t.surchargeLabel}
                  </span>
                )}
              </button>
            ))}
          </div>
          {turnaround === 'same_day' && (
            <div className="flex items-center gap-2 mt-2 rounded-lg bg-warning-bg border border-warning/20 px-3 py-2">
              <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
              <p className="text-caption text-warning-text">Same-day cutoff: 2:00 PM. Items received after cutoff will be ready next day.</p>
            </div>
          )}
        </div>

        {/* Delivery */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-3">Collection method</p>
          <div className="flex gap-2">
            {[
              { id: 'pickup',        label: 'Counter Pickup',  sub: 'Customer collects',     fee: 'Free' },
              { id: 'home_delivery', label: 'Home Delivery',   sub: 'Delivered to address',  fee: '+GH₵ 10.00' },
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDelivery(d.id)}
                className={cn(
                  'flex-1 flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all',
                  delivery === d.id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300',
                )}
              >
                <span className={cn('text-small font-bold', delivery === d.id ? 'text-primary-700' : 'text-neutral-700')}>{d.label}</span>
                <span className="text-caption text-neutral-400">{d.sub}</span>
                <span className={cn('text-caption font-semibold mt-1', delivery === d.id ? 'text-primary-500' : 'text-neutral-400')}>{d.fee}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Special instructions */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">Special instructions</p>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Handle with care, stain on collar, etc."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-small outline-none resize-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all placeholder:text-neutral-400"
          />
          {notes && (
            <p className="text-caption text-warning-text flex items-center gap-1 mt-1">
              <AlertTriangle className="h-3 w-3" /> Will be flagged on item tags.
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="shrink-0 border-t border-neutral-100 bg-white p-4">
        {!customer && (
          <p className="text-caption text-neutral-400 text-center mb-3">Select a customer to continue</p>
        )}
        {customer && !service && (
          <p className="text-caption text-neutral-400 text-center mb-3">Select a service type to continue</p>
        )}
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!canSave}
          loading={saving}
          onClick={handleSave}
        >
          Save & Tag Items →
        </Button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function WalkInOrderPage() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col" style={{ background: '#F8F9FA' }}>
      {/* Page header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border-b border-neutral-100">
        <ShoppingCartIcon />
        <div>
          <p className="text-body font-bold text-neutral-900">New Walk-in Order</p>
          <p className="text-caption text-neutral-400">US-0033 + US-0075 · Search customer, select service, then tag items</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: customer */}
        <div className="w-80 shrink-0 bg-white border-r border-neutral-100 flex flex-col overflow-y-auto">
          <CustomerPanel selected={customer} onSelect={setCustomer} />
        </div>

        {/* Right: order form */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <OrderPanel
            customer={customer}
            onSave={orderId => navigate(`/pos/order/${orderId}/intake`)}
          />
        </div>
      </div>
    </div>
  );
}

function ShoppingCartIcon() {
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
      <ShoppingCart className="h-4 w-4 text-primary-600" />
    </div>
  );
}
