import { useState } from 'react';
import Button from '../../../components/ui/Button.jsx';
import { Plus, Trash2, CreditCard, Smartphone, Banknote } from 'lucide-react';

const BANKS_BY_COUNTRY = {
  Ghana:        ['GCB Bank', 'Ecobank Ghana', 'Fidelity Bank', 'Stanbic Bank', 'Absa Ghana', 'Standard Chartered', 'Agricultural Development Bank', 'Consolidated Bank Ghana'],
  Nigeria:      ['Access Bank', 'Zenith Bank', 'GTBank', 'First Bank', 'UBA', 'Polaris Bank', 'Sterling Bank', 'FCMB'],
  Kenya:        ['Kenya Commercial Bank', 'Equity Bank', 'Co-operative Bank', 'Absa Kenya', 'Standard Chartered Kenya', 'NCBA', 'DTB'],
  'South Africa': ['Standard Bank', 'ABSA', 'FNB', 'Nedbank', 'Capitec', 'Investec'],
  Rwanda:       ['Bank of Kigali', 'Equity Bank Rwanda', 'KCB Rwanda', 'Cogebanque', 'I&M Bank Rwanda'],
  Uganda:       ['Stanbic Uganda', 'DFCU Bank', 'Centenary Bank', 'Equity Bank Uganda', 'KCB Uganda'],
};
const MOMO_BY_COUNTRY = {
  Ghana:        ['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money'],
  Nigeria:      ['OPay', 'PalmPay', 'Kuda', 'MTN MoMo Nigeria'],
  Kenya:        ['M-Pesa', 'Airtel Money Kenya', 'Telkom T-Kash'],
  'South Africa': ['MTN MoMo SA', 'Standard Bank Instant Money'],
  Rwanda:       ['MTN MoMo Rwanda', 'Airtel Money Rwanda'],
  Uganda:       ['MTN MoMo Uganda', 'Airtel Money Uganda'],
};
const DEFAULT_BANKS = ['GCB Bank', 'Ecobank Ghana', 'Fidelity Bank', 'Stanbic Bank'];
const DEFAULT_MOMO  = ['MTN Mobile Money', 'Vodafone Cash', 'AirtelTigo Money'];
const ACCOUNT_TYPES = ['Current', 'Savings'];

const inputCls = (err) =>
  `w-full rounded-md border px-3 py-2.5 text-small text-neutral-900 outline-none focus:ring-2 transition-all ${
    err ? 'border-error focus:ring-error/20' : 'border-neutral-200 focus:border-primary-400 focus:ring-primary-100'
  }`;
const selectCls = `w-full rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all`;

function emptyBank() {
  return { id: Date.now(), type: 'bank', bankName: '', accountName: '', accountNumber: '', branch: '', accountType: 'Current' };
}
function emptyMomo() {
  return { id: Date.now() + 1, type: 'momo', provider: '', phone: '', accountName: '', merchantId: '' };
}

function validateBank(m) {
  const e = {};
  if (!m.bankName)           e.bankName       = 'Select a bank';
  if (!m.accountName.trim()) e.accountName    = 'Account name is required';
  if (!m.accountNumber.trim()) e.accountNumber = 'Account number is required';
  return e;
}

function validateMomo(m) {
  const e = {};
  if (!m.provider)        e.provider    = 'Select a provider';
  if (!m.phone.trim())    e.phone       = 'Phone number is required';
  if (!m.accountName.trim()) e.accountName = 'Account name is required';
  return e;
}

function BankForm({ method, errors, onChange, banks }) {
  const e = errors || {};
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Bank name *</label>
          <select className={`${selectCls} ${e.bankName ? 'border-error' : ''}`}
            value={method.bankName} onChange={ev => onChange({ ...method, bankName: ev.target.value })}>
            <option value="">Select bank…</option>
            {banks.map(b => <option key={b}>{b}</option>)}
          </select>
          {e.bankName && <p className="mt-0.5 text-caption text-error">{e.bankName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Account type</label>
          <select className={selectCls} value={method.accountType}
            onChange={ev => onChange({ ...method, accountType: ev.target.value })}>
            {ACCOUNT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Account name *</label>
          <input className={inputCls(e.accountName)} value={method.accountName}
            placeholder="Name on account" onChange={ev => onChange({ ...method, accountName: ev.target.value })} />
          {e.accountName && <p className="mt-0.5 text-caption text-error">{e.accountName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Account number *</label>
          <input className={inputCls(e.accountNumber)} value={method.accountNumber}
            placeholder="13-digit account number" onChange={ev => onChange({ ...method, accountNumber: ev.target.value })} />
          {e.accountNumber && <p className="mt-0.5 text-caption text-error">{e.accountNumber}</p>}
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-small font-medium text-neutral-700">Branch <span className="text-neutral-400">(optional)</span></label>
          <input className={inputCls(false)} value={method.branch}
            placeholder="e.g. Accra Central" onChange={ev => onChange({ ...method, branch: ev.target.value })} />
        </div>
      </div>
    </div>
  );
}

function MomoForm({ method, errors, onChange, momoProviders }) {
  const e = errors || {};
  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Provider *</label>
          <select className={`${selectCls} ${e.provider ? 'border-error' : ''}`}
            value={method.provider} onChange={ev => onChange({ ...method, provider: ev.target.value })}>
            <option value="">Select provider…</option>
            {momoProviders.map(p => <option key={p}>{p}</option>)}
          </select>
          {e.provider && <p className="mt-0.5 text-caption text-error">{e.provider}</p>}
        </div>
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Phone number *</label>
          <input type="tel" className={inputCls(e.phone)} value={method.phone}
            placeholder="+233 24 000 0000" onChange={ev => onChange({ ...method, phone: ev.target.value })} />
          {e.phone && <p className="mt-0.5 text-caption text-error">{e.phone}</p>}
        </div>
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Account name *</label>
          <input className={inputCls(e.accountName)} value={method.accountName}
            placeholder="Name on MoMo account" onChange={ev => onChange({ ...method, accountName: ev.target.value })} />
          {e.accountName && <p className="mt-0.5 text-caption text-error">{e.accountName}</p>}
        </div>
        <div>
          <label className="mb-1 block text-small font-medium text-neutral-700">Merchant ID <span className="text-neutral-400">(optional)</span></label>
          <input className={inputCls(false)} value={method.merchantId}
            placeholder="If registered as merchant" onChange={ev => onChange({ ...method, merchantId: ev.target.value })} />
        </div>
      </div>
    </div>
  );
}

function MethodCard({ method, index, errors, onChange, onRemove, banks, momoProviders }) {
  const icon = method.type === 'bank' ? CreditCard : Smartphone;
  const Icon = icon;
  return (
    <div className="rounded-lg border border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3 bg-neutral-50">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${method.type === 'bank' ? 'text-primary-500' : 'text-green-500'}`} />
          <span className="text-small font-semibold text-neutral-800">
            {method.type === 'bank' ? 'Bank Transfer' : 'Mobile Money'} {index + 1}
          </span>
        </div>
        <button type="button" onClick={onRemove}
          className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-red-50 hover:text-error transition-colors">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="p-4">
        {method.type === 'bank'
          ? <BankForm method={method} errors={errors} onChange={onChange} banks={banks} />
          : <MomoForm method={method} errors={errors} onChange={onChange} momoProviders={momoProviders} />
        }
      </div>
    </div>
  );
}

const Step4Payment = ({ data, country, onNext, onBack, onSaveDraft }) => {
  const banks = BANKS_BY_COUNTRY[country] || DEFAULT_BANKS;
  const momoProviders = MOMO_BY_COUNTRY[country] || DEFAULT_MOMO;
  const [methods, setMethods]       = useState(data.methods   || []);
  const [cashEnabled, setCash]      = useState(data.cashEnabled || false);
  const [methodErrors, setMethodErrors] = useState([]);
  const [globalError, setGlobalError]   = useState('');

  function addBank() { setMethods(p => [...p, emptyBank()]); }
  function addMomo() { setMethods(p => [...p, emptyMomo()]); }
  function remove(i) { setMethods(p => p.filter((_, idx) => idx !== i)); }
  function update(i, val) { setMethods(p => p.map((m, idx) => idx === i ? val : m)); }

  function handleNext() {
    const errs = methods.map(m => m.type === 'bank' ? validateBank(m) : validateMomo(m));
    const hasErr = errs.some(e => Object.keys(e).length > 0);
    if (hasErr) { setMethodErrors(errs); return; }

    if (methods.length === 0 && !cashEnabled) {
      setGlobalError('Add at least one payment method to continue.');
      return;
    }

    setGlobalError('');
    onNext({ methods, cashEnabled });
  }

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Payment Method Setup</h2>
      <p className="mt-1 mb-7 text-body text-neutral-500">
        Configure how customers can pay for orders and how you receive payouts.
      </p>

      {globalError && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-error/30 bg-error/5 px-4 py-3">
          <p className="text-small text-error">{globalError}</p>
        </div>
      )}

      {/* Methods list */}
      <div className="space-y-3 mb-5">
        {methods.map((m, i) => (
          <MethodCard key={m.id} method={m} index={i} errors={methodErrors[i]}
            onChange={val => update(i, val)} onRemove={() => remove(i)}
            banks={banks} momoProviders={momoProviders} />
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 mb-6">
        <button type="button" onClick={addBank}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-small font-medium text-neutral-600 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 transition-all">
          <CreditCard className="h-4 w-4" /> Add bank account
        </button>
        <button type="button" onClick={addMomo}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-4 py-3 text-small font-medium text-neutral-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700 transition-all">
          <Smartphone className="h-4 w-4" /> Add mobile money
        </button>
      </div>

      {/* Cash toggle */}
      <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3.5 hover:bg-neutral-50 transition-colors">
        <div className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
          cashEnabled ? 'bg-primary-500' : 'bg-neutral-200'
        }`} onClick={() => setCash(p => !p)}>
          <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            cashEnabled ? 'translate-x-4' : 'translate-x-0'
          }`} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Banknote className="h-4 w-4 text-neutral-500" />
            <p className="text-small font-medium text-neutral-800">Accept cash payments</p>
          </div>
          <p className="text-caption text-neutral-500">Customers can pay with cash at your outlets</p>
        </div>
      </label>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <div className="flex gap-3">
          <Button variant="ghost" type="button" onClick={() => onSaveDraft({ methods, cashEnabled })}>Save draft</Button>
          <Button type="button" onClick={handleNext}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}

export default Step4Payment;


