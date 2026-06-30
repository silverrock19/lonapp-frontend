import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';
import { getAllTemplates } from '../../lib/mock/mockTemplates.js';
import { FREQ_LABELS, DAY_LABELS } from '../../lib/mock/mockSubscriptions.js';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const PAYMENT_METHODS = [
  { id: 'momo',  label: 'MTN MoMo',   sub: '0244 567 890' },
  { id: 'card',  label: 'Visa Card',   sub: '•••• 4242'   },
];

const STEPS = ['Schedule', 'Items', 'Payment', 'Review'];

export default function SetupRecurringPage() {
  const navigate  = useNavigate();
  const templates = getAllTemplates();

  const [step,        setStep]       = useState(1);
  const [name,        setName]       = useState('My Recurring Laundry');
  const [frequency,   setFrequency]  = useState('weekly');
  const [preferredDay,setPrefDay]    = useState('monday');
  const [startDate,   setStartDate]  = useState('');
  const [templateId,  setTemplateId] = useState(templates[0]?.id ?? '');
  const [payMethodId, setPayMethod]  = useState(PAYMENT_METHODS[0].id);
  const [autoRenew,   setAutoRenew]  = useState(true);
  const [skipHols,    setSkipHols]   = useState(true);
  const [saving,      setSaving]     = useState(false);
  const [done,        setDone]       = useState(false);

  const selectedTemplate = templates.find(t => t.id === templateId);
  const selectedPayment  = PAYMENT_METHODS.find(p => p.id === payMethodId);

  async function handleFinish() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setDone(true);
    setTimeout(() => navigate('/app/subscriptions'), 1200);
  }

  const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <p className="text-small font-bold text-neutral-900">Set Up Recurring Order</p>
            <p className="text-caption text-neutral-400">Step {step} of {STEPS.length} · {STEPS[step - 1]}</p>
          </div>
        </div>
        <div className="h-1 bg-neutral-100">
          <div className="h-full bg-accent-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">

        {/* Step 1: Schedule */}
        {step === 1 && (
          <>
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Subscription Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 placeholder:text-neutral-400" placeholder="e.g. Weekly Laundry" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Frequency</p>
                <div className="flex flex-col gap-2">
                  {Object.entries(FREQ_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => setFrequency(key)} className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 transition-all ${frequency === key ? 'border-accent-500 bg-accent-50' : 'border-neutral-200'}`}>
                      <span className={`text-small font-semibold ${frequency === key ? 'text-accent-700' : 'text-neutral-700'}`}>{label}</span>
                      {frequency === key && <Check className="h-4 w-4 text-accent-600" />}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Preferred Day</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(DAY_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => setPrefDay(key)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${preferredDay === key ? 'bg-accent-500 text-white border-accent-500' : 'border-neutral-200 text-neutral-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
              </div>
            </div>
          </>
        )}

        {/* Step 2: Items (template) */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-caption text-neutral-500 px-1">Choose a template or create one for your recurring items.</p>
            {templates.map(t => (
              <button key={t.id} onClick={() => setTemplateId(t.id)} className={`w-full text-left rounded-2xl border-2 bg-white p-4 transition-all ${templateId === t.id ? 'border-accent-500' : 'border-neutral-100'}`}>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-small font-bold" style={{ background: t.color }}>{t.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-bold text-neutral-900">{t.name}</p>
                    <p className="text-caption text-neutral-400">{t.items.reduce((s, i) => s + i.qty, 0)} items · est. {fmtPrice(t.estimatedTotal)}/order</p>
                  </div>
                  {templateId === t.id && <Check className="h-5 w-5 text-accent-600 flex-shrink-0" />}
                </div>
              </button>
            ))}
            <button onClick={() => navigate('/app/templates/new')} className="w-full text-center py-3 rounded-2xl border-2 border-dashed border-neutral-200 text-small text-accent-600 font-semibold hover:bg-accent-50">
              + Create New Template
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-3">
            {PAYMENT_METHODS.map(pm => (
              <button key={pm.id} onClick={() => setPayMethod(pm.id)} className={`w-full text-left rounded-2xl border-2 bg-white p-4 flex items-center gap-3 transition-all ${payMethodId === pm.id ? 'border-accent-500' : 'border-neutral-100'}`}>
                <div className="flex-1">
                  <p className="text-small font-bold text-neutral-900">{pm.label}</p>
                  <p className="text-caption text-neutral-400">{pm.sub}</p>
                </div>
                {payMethodId === pm.id && <Check className="h-5 w-5 text-accent-600" />}
              </button>
            ))}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3 mt-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-small font-semibold text-neutral-800">Auto-renew</p>
                  <p className="text-caption text-neutral-400">Continue automatically unless cancelled</p>
                </div>
                <div onClick={() => setAutoRenew(v => !v)} className={`relative w-11 h-6 rounded-full transition-colors ${autoRenew ? 'bg-accent-500' : 'bg-neutral-300'}`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoRenew ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-small font-semibold text-neutral-800">Skip public holidays</p>
                  <p className="text-caption text-neutral-400">Reschedule to next working day</p>
                </div>
                <div onClick={() => setSkipHols(v => !v)} className={`relative w-11 h-6 rounded-full transition-colors ${skipHols ? 'bg-accent-500' : 'bg-neutral-300'}`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${skipHols ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-2">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Summary</p>
              {[
                { label: 'Name',       value: name },
                { label: 'Frequency',  value: FREQ_LABELS[frequency] },
                { label: 'Day',        value: DAY_LABELS[preferredDay] },
                { label: 'Start date', value: startDate || 'Next available' },
                { label: 'Template',   value: selectedTemplate?.name },
                { label: 'Items/order', value: selectedTemplate ? `${selectedTemplate.items.reduce((s, i) => s + i.qty, 0)} items · est. ${fmtPrice(selectedTemplate.estimatedTotal)}` : '—' },
                { label: 'Payment',    value: `${selectedPayment?.label} ${selectedPayment?.sub}` },
                { label: 'Auto-renew', value: autoRenew ? 'On' : 'Off' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-small">
                  <span className="text-neutral-500">{label}</span>
                  <span className="text-neutral-800 font-medium">{value ?? '—'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        {done ? (
          <div className="w-full rounded-2xl bg-success-bg text-success-text font-semibold text-small text-center py-4">✓ Subscription created!</div>
        ) : step < STEPS.length ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={step === 2 && !templateId}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
          >
            {saving ? <span className="animate-pulse">Creating…</span> : 'Start Subscription'}
          </button>
        )}
      </div>
    </div>
  );
}
