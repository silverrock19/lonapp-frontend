import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, X, CheckCircle } from 'lucide-react';
import { getOrder } from '../../lib/mock/mockOrders.js';

// Shared wizard for US-0092 (Missing), US-0093 (Quality), US-0094 (Damage)

const ISSUE_CONFIGS = {
  missing: {
    title: 'Report Missing Items',
    subtitle: 'Tell us which items are missing from your delivery.',
    reasons: ['Item not received', 'Missing from bag', 'Wrong item delivered', 'Partial delivery'],
    minPhotos: 1,
    minDesc: 20,
    descPlaceholder: 'Describe what is missing and any other details…',
    resolutions: ['Find and return items', 'Full refund', 'Store credit', 'Replacement order'],
  },
  quality: {
    title: 'Report Quality Issue',
    subtitle: 'Tell us about the quality problem with your cleaned items.',
    reasons: ['Stains not removed', 'Fabric damage from cleaning', 'Colour bleeding', 'Incorrect service applied', 'Poor pressing/ironing', 'Other quality issue'],
    minPhotos: 1,
    minDesc: 20,
    descPlaceholder: 'Describe the quality issue in detail. Before/after comparisons are helpful…',
    resolutions: ['Re-clean at no charge', 'Partial refund', 'Full refund'],
  },
  damage: {
    title: 'Report Item Damage',
    subtitle: 'Tell us about damage that occurred during cleaning.',
    reasons: ['Tear or hole', 'Burn or scorch mark', 'Shrinkage', 'Colour fading/bleeding', 'Button or zipper damage', 'Permanent stain', 'Other damage'],
    minPhotos: 1,
    minDesc: 30,
    descPlaceholder: 'Describe the damage in detail. Include the item, location of damage, and estimated value…',
    resolutions: ['Compensation for damage', 'Replacement', 'Refund'],
  },
};

const MOCK_PHOTOS = ['📸', '🖼️', '📷'];

export default function ReportIssuePage() {
  const { id }          = useParams();
  const [params]        = useSearchParams();
  const navigate        = useNavigate();
  const type            = params.get('type') ?? 'missing';
  const config          = ISSUE_CONFIGS[type] ?? ISSUE_CONFIGS.missing;
  const order           = getOrder(id);

  const [step,       setStep]       = useState(1);
  const [selItems,   setSelItems]   = useState(new Set());
  const [reason,     setReason]     = useState('');
  const [desc,       setDesc]       = useState('');
  const [photos,     setPhotos]     = useState([]);
  const [resolution, setResolution] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done,       setDone]       = useState(false);

  const items = order?.items ?? [];
  const descOk = desc.trim().length >= config.minDesc;
  const photosOk = photos.length >= config.minPhotos;

  function toggleItem(name) {
    setSelItems(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }

  function addPhoto() {
    if (photos.length < 5) setPhotos(p => [...p, MOCK_PHOTOS[p.length % MOCK_PHOTOS.length]]);
  }

  async function handleSubmit() {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));
    setSubmitting(false);
    setDone(true);
  }

  const STEPS = ['Items', 'Details', 'Photos', 'Resolution'];
  const canNext1 = selItems.size > 0;
  const canNext2 = reason && descOk;
  const canNext3 = photosOk;

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center" style={{ background: '#FAFAF8' }}>
        <CheckCircle className="h-16 w-16 text-success-text mb-4" />
        <h2 className="text-h3 font-bold text-neutral-900">Claim Submitted</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">We'll investigate and update you within 24 hours. You can track the status in your dispute centre.</p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={() => navigate('/app/disputes')} className="flex-1 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">View Claim</button>
          <button onClick={() => navigate('/app/orders')} className="flex-1 py-3 rounded-xl border-2 border-neutral-200 text-small font-semibold text-neutral-700">My Orders</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <p className="text-small font-bold text-neutral-900">{config.title}</p>
            <p className="text-caption text-neutral-400">Step {step} of {STEPS.length} · {STEPS[step - 1]} · <span className="font-mono">{id}</span></p>
          </div>
        </div>
        <div className="h-1 bg-neutral-100">
          <div className="h-full bg-accent-500 transition-all" style={{ width: `${(step / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        <p className="text-caption text-neutral-500">{config.subtitle}</p>

        {/* Step 1: Select items */}
        {step === 1 && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Which items are affected?</p>
            {items.map(item => {
              const key = item.name;
              const on  = selItems.has(key);
              return (
                <button key={item.id} onClick={() => toggleItem(key)} className={`w-full flex items-center gap-3 px-4 py-3 border-t border-neutral-100 transition-colors ${on ? 'bg-accent-50' : 'hover:bg-neutral-50'}`}>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 flex-shrink-0 transition-all ${on ? 'border-accent-500 bg-accent-500' : 'border-neutral-300'}`}>
                    {on && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`text-small font-medium flex-1 text-left ${on ? 'text-accent-700 font-semibold' : 'text-neutral-700'}`}>{item.name} × {item.qty}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Reason + description */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Issue Type</p>
              <div className="space-y-2">
                {config.reasons.map(r => (
                  <button key={r} onClick={() => setReason(r)} className={`w-full text-left rounded-xl border-2 px-4 py-2.5 text-small font-medium transition-all ${reason === r ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold' : 'border-neutral-200 text-neutral-700'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Description</p>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={5}
                placeholder={config.descPlaceholder}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 resize-none placeholder:text-neutral-400"
              />
              <p className={`text-caption mt-1 ${desc.length < config.minDesc ? 'text-neutral-400' : 'text-success-text'}`}>
                {desc.trim().length}/{config.minDesc} min characters
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Photos ({photos.length}/5)</p>
            <p className="text-caption text-neutral-400">Attach at least {config.minPhotos} photo{config.minPhotos > 1 ? 's' : ''} showing the issue.</p>
            <div className="flex flex-wrap gap-2">
              {photos.map((p, i) => (
                <div key={i} className="relative h-20 w-20 rounded-xl bg-neutral-100 flex items-center justify-center text-3xl border border-neutral-200">
                  {p}
                  <button onClick={() => setPhotos(ps => ps.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-error flex items-center justify-center">
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <button onClick={addPhoto} className="h-20 w-20 rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-accent-400 hover:text-accent-500 transition-colors">
                  <Camera className="h-5 w-5" />
                  <span className="text-[10px] font-semibold">Add</span>
                </button>
              )}
            </div>
            {photos.length < config.minPhotos && (
              <p className="text-caption text-warning-text">At least {config.minPhotos} photo required.</p>
            )}
          </div>
        )}

        {/* Step 4: Preferred resolution */}
        {step === 4 && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Preferred Resolution</p>
            <div className="space-y-2">
              {config.resolutions.map(r => (
                <button key={r} onClick={() => setResolution(r)} className={`w-full text-left rounded-xl border-2 px-4 py-3 text-small font-medium transition-all ${resolution === r ? 'border-accent-500 bg-accent-50 text-accent-700 font-semibold' : 'border-neutral-200 text-neutral-700'}`}>
                  {r}
                </button>
              ))}
            </div>
            <p className="text-caption text-neutral-400 mt-3">Your preference is noted. Final resolution depends on investigation outcome.</p>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        {step < STEPS.length ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2) || (step === 3 && !canNext3)}
            className="w-full rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting || !resolution}
            className="w-full rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
          >
            {submitting ? <span className="animate-pulse">Submitting…</span> : 'Submit Claim'}
          </button>
        )}
      </div>
    </div>
  );
}
