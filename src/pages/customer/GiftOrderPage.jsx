import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, CheckCircle } from 'lucide-react';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const OCCASIONS = ['Birthday', 'Holiday / Festive', 'Thank You', 'Sympathy', 'Just Because', 'Other'];

export default function GiftOrderPage() {
  const navigate = useNavigate();

  const [senderName,   setSenderName]   = useState('');
  const [anonymous,    setAnonymous]    = useState(false);
  const [recipName,    setRecipName]    = useState('');
  const [recipPhone,   setRecipPhone]   = useState('');
  const [recipEmail,   setRecipEmail]   = useState('');
  const [message,      setMessage]      = useState('');
  const [occasion,     setOccasion]     = useState('');
  const [wrapping,     setWrapping]     = useState(false);
  const [timing,       setTiming]       = useState('immediate');
  const [schedDate,    setSchedDate]    = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [done,         setDone]         = useState(false);

  const wrappingFee = wrapping ? 20 : 0;
  const valid = recipName.trim() && recipPhone.trim().length >= 10 && occasion;

  async function handleSubmit() {
    if (!valid) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setSubmitting(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center" style={{ background: '#FAFAF8' }}>
        <Gift className="h-16 w-16 text-accent-500 mb-4" />
        <h2 className="text-h3 font-bold text-neutral-900">Gift Order Created!</h2>
        <p className="text-small text-neutral-500 mt-2 mb-6">
          {recipName} will receive an SMS notification with their gift code. They can track their order and redeem it anytime.
        </p>
        <button onClick={() => navigate('/app/orders')} className="px-6 py-3 rounded-xl bg-accent-500 text-white text-small font-semibold">View My Orders</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1">
          <p className="text-small font-bold text-neutral-900">Gift an Order</p>
          <p className="text-caption text-neutral-400">Send laundry as a gift to someone you care about</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Sender */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">From</p>
          <div>
            <label className="text-caption text-neutral-500 mb-1 block">Your name (shown to recipient)</label>
            <input
              type="text"
              value={anonymous ? 'Anonymous' : senderName}
              onChange={e => setSenderName(e.target.value)}
              disabled={anonymous}
              placeholder="Adwoa Mensah"
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 disabled:opacity-50"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} className="h-4 w-4 rounded border-neutral-300 accent-accent-500" />
            <span className="text-small text-neutral-700">Send anonymously</span>
          </label>
        </div>

        {/* Recipient */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Recipient *</p>
          <div>
            <label className="text-caption text-neutral-500 mb-1 block">Name</label>
            <input type="text" value={recipName} onChange={e => setRecipName(e.target.value)} placeholder="Kofi Boateng" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
          </div>
          <div>
            <label className="text-caption text-neutral-500 mb-1 block">Phone number *</label>
            <input type="tel" value={recipPhone} onChange={e => setRecipPhone(e.target.value)} placeholder="+233 24 000 0000" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
            <p className="text-[10px] text-neutral-400 mt-0.5">Gift code sent via SMS</p>
          </div>
          <div>
            <label className="text-caption text-neutral-500 mb-1 block">Email (optional)</label>
            <input type="email" value={recipEmail} onChange={e => setRecipEmail(e.target.value)} placeholder="kofi@example.com" className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
          </div>
        </div>

        {/* Occasion */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Occasion</p>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map(o => (
              <button key={o} onClick={() => setOccasion(o)} className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${occasion === o ? 'bg-accent-500 text-white border-accent-500' : 'border-neutral-200 text-neutral-600'}`}>
                {o}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Personal Message <span className="font-normal text-neutral-300">(Optional)</span></p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value.slice(0, 500))}
            rows={4}
            placeholder="Write a personal message for the recipient…"
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 resize-none placeholder:text-neutral-400"
          />
          <p className="text-caption text-neutral-400 mt-1 text-right">{message.length}/500</p>
        </div>

        {/* Gift wrapping */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-small font-semibold text-neutral-800">Gift wrapping</p>
              <p className="text-caption text-neutral-400">Items packaged with a ribbon and gift note · +{fmtPrice(20)}</p>
            </div>
            <div onClick={() => setWrapping(v => !v)} className={`relative w-11 h-6 rounded-full transition-colors ${wrapping ? 'bg-accent-500' : 'bg-neutral-300'}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${wrapping ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </label>
        </div>

        {/* Delivery timing */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Delivery Timing</p>
          <div className="flex gap-2">
            {[['immediate', 'Surprise — send now'], ['scheduled', 'Schedule for a date']].map(([k, label]) => (
              <button key={k} onClick={() => setTiming(k)} className={`flex-1 rounded-xl border-2 py-2.5 text-small font-semibold transition-all ${timing === k ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-neutral-200 text-neutral-600'}`}>
                {label}
              </button>
            ))}
          </div>
          {timing === 'scheduled' && (
            <input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400" />
          )}
        </div>

        {wrappingFee > 0 && (
          <div className="rounded-xl bg-accent-50 px-4 py-2 text-caption text-accent-600 font-semibold">
            Gift wrapping: +{fmtPrice(wrappingFee)} added to order total
          </div>
        )}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-4 bg-white border-t border-neutral-100">
        <button
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-accent-500 text-white font-bold text-body py-4 disabled:opacity-40 hover:bg-accent-600"
        >
          <Gift className="h-4 w-4" />
          {submitting ? 'Creating gift order…' : 'Continue to Order Details'}
        </button>
      </div>
    </div>
  );
}
