import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Banknote, SplitSquareVertical, Clock, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import {
  getPOSSession, updatePOSSession,
  getPOSOrderById, updateTodayOrder,
  MOMO_PROVIDERS,
} from '../../lib/mock/posData.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';
const fmtChange = (tendered, due) => {
  const diff = tendered - due;
  return { value: Math.abs(diff), isChange: diff > 0, isShort: diff < 0, exact: diff === 0 };
};

const METHODS = [
  { id: 'cash',            label: 'Cash',          icon: Banknote },
  { id: 'momo',            label: 'Mobile Money',  icon: Smartphone },
  { id: 'card',            label: 'Card',           icon: CreditCard },
  { id: 'split',           label: 'Split',          icon: SplitSquareVertical },
  { id: 'pay_on_delivery', label: 'Pay Later',      icon: Clock },
];

export default function PaymentPage() {
  const { id: orderId } = useParams();
  const navigate        = useNavigate();
  const session         = getPOSSession();

  // Resolve order: from session (if current) or from today's order store
  const order = session.orderId === orderId ? null : getPOSOrderById(orderId);
  const total = session.orderId === orderId ? session.total : (order?.total ?? 0);
  const customer = session.orderId === orderId ? session.customer : order?.customer;
  const turnaround = session.orderId === orderId ? session.turnaround : order?.turnaround;

  const [method,       setMethod]     = useState('cash');
  const [tendered,     setTendered]   = useState('');
  const [momoPhone,    setMomoPhone]  = useState('');
  const [momoProvider, setProvider]   = useState('mtn');
  const [momoState,    setMomoState]  = useState('idle'); // idle | sending | countdown | done | error
  const [countdown,    setCountdown]  = useState(30);
  const [splitAmts,    setSplitAmts]  = useState({ first: '', second: '' });
  const [splitMethods, setSplitMethods] = useState({ first: 'cash', second: 'momo' });
  const [processing,   setProcessing] = useState(false);
  const [done,         setDone]       = useState(false);
  const [paidAmount,   setPaidAmount] = useState(0);
  const timerRef = useRef(null);

  // Cash change calc
  const tenderedNum = parseFloat(tendered) || 0;
  const change      = fmtChange(tenderedNum, total);

  // Split validation
  const splitTotal  = (parseFloat(splitAmts.first) || 0) + (parseFloat(splitAmts.second) || 0);
  const splitValid  = Math.abs(splitTotal - total) < 0.01;

  // Can process
  const canProcess = (
    (method === 'cash'            && tenderedNum >= total) ||
    (method === 'momo'            && momoState === 'done') ||
    (method === 'card'            && true) ||
    (method === 'split'           && splitValid) ||
    (method === 'pay_on_delivery' && true)
  );

  function sendMomoPrompt() {
    setMomoState('sending');
    setTimeout(() => {
      setMomoState('countdown');
      setCountdown(30);
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timerRef.current);
            // Simulate approval after ~5 sec (when countdown hits 25)
            setTimeout(() => setMomoState('done'), 0);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      // Simulate approval at countdown = 25
      setTimeout(() => {
        clearInterval(timerRef.current);
        setMomoState('done');
        setCountdown(0);
      }, 4000);
    }, 1200);
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  async function handleProcess() {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1000));

    let paid = 0;
    let status = 'unpaid';
    if (method === 'cash') { paid = total; status = 'paid'; }
    if (method === 'momo') { paid = total; status = 'paid'; }
    if (method === 'card') { paid = total; status = 'paid'; }
    if (method === 'split') { paid = total; status = 'paid'; }
    if (method === 'pay_on_delivery') { paid = 0; status = 'pay_on_delivery'; }

    updatePOSSession({ paymentMethod: method, paymentStatus: status, amountPaid: paid, balanceDue: total - paid, changeGiven: change.isChange ? change.value : 0 });
    updateTodayOrder(orderId, { paymentMethod: method, paymentStatus: status, amountPaid: paid, balanceDue: total - paid });

    setPaidAmount(paid);
    setProcessing(false);
    setDone(true);
  }

  if (!customer || total <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <CreditCard className="h-12 w-12 text-neutral-300" />
        <p className="text-body font-semibold text-neutral-500">No order found for payment</p>
        <Button variant="outline" onClick={() => navigate('/pos/order/new')}>Start a new order</Button>
      </div>
    );
  }

  if (done) {
    const isPaid = method !== 'pay_on_delivery';
    return (
      <div className="flex flex-col items-center justify-center h-full gap-5 px-8 text-center">
        <div className={cn('flex h-24 w-24 items-center justify-center rounded-full', isPaid ? 'bg-success-bg' : 'bg-neutral-100')}>
          {isPaid ? <CheckCircle className="h-12 w-12 text-success" /> : <Clock className="h-12 w-12 text-neutral-400" />}
        </div>
        <div>
          <p className="text-h2 font-bold text-neutral-900">{isPaid ? 'Payment Received' : 'Pay on Delivery'}</p>
          <p className="text-body text-neutral-500 mt-1">{customer.name}</p>
          <p className="text-caption text-neutral-400 font-mono mt-0.5">{orderId}</p>
          {isPaid && method === 'cash' && change.isChange && (
            <div className="mt-3 inline-block rounded-xl bg-success-bg border border-success/20 px-4 py-2">
              <p className="text-caption text-success-text">Change given</p>
              <p className="text-h3 font-bold text-success-text tabular-nums">{formatGHS(change.value)}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/pos/order/${orderId}/receipt`)}>
            Print Receipt
          </Button>
          <Button variant="primary" onClick={() => { updatePOSSession({ orderId: null }); navigate('/pos/order/new'); }}>
            New Order →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">

      {/* Amount header */}
      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-5 text-center">
        <p className="text-caption font-semibold text-neutral-400 uppercase tracking-widest mb-1">Amount Due</p>
        <p className="text-[48px] font-black text-neutral-900 tabular-nums leading-tight">{formatGHS(total)}</p>
        <p className="text-small text-neutral-400 mt-1">{customer.name} · {orderId}</p>
      </div>

      {/* Method tabs */}
      <div className="flex gap-2">
        {METHODS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMethod(id)}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-center',
              method === id ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300',
            )}
          >
            <Icon className={cn('h-5 w-5', method === id ? 'text-primary-600' : 'text-neutral-400')} />
            <span className={cn('text-caption font-semibold', method === id ? 'text-primary-700' : 'text-neutral-500')}>{label}</span>
          </button>
        ))}
      </div>

      {/* Method-specific form */}
      <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-5 space-y-4">

        {/* CASH */}
        {method === 'cash' && (
          <>
            <div>
              <label className="block text-caption font-semibold text-neutral-600 mb-2">Amount tendered</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body font-bold text-neutral-400">GH₵</span>
                <input
                  type="number"
                  value={tendered}
                  onChange={e => setTendered(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-4 py-4 rounded-xl border border-neutral-200 text-h2 font-bold text-neutral-900 tabular-nums outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Quick amount buttons */}
            <div className="flex gap-2 flex-wrap">
              {[10, 20, 50, 100, 200].map(amt => (
                <button
                  key={amt}
                  onClick={() => setTendered(String(Math.ceil(total / amt) * amt))}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 text-small font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
                >
                  GH₵ {amt}
                </button>
              ))}
              <button
                onClick={() => setTendered(total.toFixed(2))}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 text-small font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                Exact
              </button>
            </div>

            {/* Change display */}
            {tendered && (
              <div className={cn(
                'flex items-center justify-between rounded-xl px-4 py-3',
                change.isShort ? 'bg-red-50 border border-red-200' : 'bg-success-bg border border-success/20',
              )}>
                <span className={cn('text-small font-semibold', change.isShort ? 'text-error' : 'text-success-text')}>
                  {change.isShort ? 'Short by' : change.exact ? 'Exact change' : 'Change given'}
                </span>
                <span className={cn('text-h3 font-black tabular-nums', change.isShort ? 'text-error' : 'text-success-text')}>
                  {change.exact ? '—' : formatGHS(change.value)}
                </span>
              </div>
            )}
          </>
        )}

        {/* MOMO */}
        {method === 'momo' && (
          <>
            <div>
              <label className="block text-caption font-semibold text-neutral-600 mb-2">Provider</label>
              <div className="flex gap-2">
                {MOMO_PROVIDERS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProvider(p.id)}
                    className={cn(
                      'flex-1 py-2.5 rounded-xl border-2 text-small font-bold transition-all',
                      momoProvider === p.id ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-500 hover:border-neutral-300',
                    )}
                  >
                    {p.short}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-caption font-semibold text-neutral-600 mb-2">Mobile Money number</label>
              <input
                type="tel"
                value={momoPhone}
                onChange={e => setMomoPhone(e.target.value)}
                placeholder="+233 24 000 0000"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-body outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
              />
            </div>

            {momoState === 'idle' && (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!momoPhone.trim()}
                onClick={sendMomoPrompt}
              >
                Send Payment Prompt — {formatGHS(total)}
              </Button>
            )}

            {momoState === 'sending' && (
              <div className="flex items-center justify-center gap-3 py-4">
                <Loader className="h-5 w-5 animate-spin text-primary-500" />
                <p className="text-small font-medium text-neutral-600">Sending USSD prompt…</p>
              </div>
            )}

            {momoState === 'countdown' && (
              <div className="rounded-xl bg-primary-50 border border-primary-200 p-4 text-center">
                <p className="text-small font-semibold text-primary-700">Prompt sent to {momoPhone}</p>
                <p className="text-caption text-primary-500 mt-0.5">Ask customer to approve on their phone</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Loader className="h-4 w-4 animate-spin text-primary-400" />
                  <span className="text-h3 font-black text-primary-600 tabular-nums">{countdown}s</span>
                </div>
                <button
                  onClick={() => { clearInterval(timerRef.current); setMomoState('idle'); }}
                  className="mt-3 text-caption text-primary-400 hover:text-primary-600 underline"
                >
                  Resend or change method
                </button>
              </div>
            )}

            {momoState === 'done' && (
              <div className="flex items-center gap-3 rounded-xl bg-success-bg border border-success/20 p-4">
                <CheckCircle className="h-6 w-6 text-success shrink-0" />
                <div>
                  <p className="text-small font-bold text-success-text">Payment approved!</p>
                  <p className="text-caption text-success-text/80">{formatGHS(total)} received via {MOMO_PROVIDERS.find(p => p.id === momoProvider)?.label}</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* CARD */}
        {method === 'card' && (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4 text-center">
            <CreditCard className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-small font-semibold text-neutral-700">POS Terminal Payment</p>
            <p className="text-caption text-neutral-400 mt-1">Ask customer to insert or tap their card on the POS terminal</p>
            <p className="text-caption font-bold text-primary-600 mt-2">{formatGHS(total)}</p>
          </div>
        )}

        {/* SPLIT */}
        {method === 'split' && (
          <div className="space-y-3">
            <p className="text-caption font-semibold text-neutral-500">Total: {formatGHS(total)} · Two payment methods</p>
            {(['first', 'second']).map((key) => (
              <div key={key} className="flex gap-2">
                <select
                  value={splitMethods[key]}
                  onChange={e => setSplitMethods(m => ({ ...m, [key]: e.target.value }))}
                  className="w-32 shrink-0 px-2 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-small outline-none"
                >
                  {['cash','momo','card'].filter(m => m !== splitMethods[key === 'first' ? 'second' : 'first']).map(m => (
                    <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-small font-medium text-neutral-400">GH₵</span>
                  <input
                    type="number"
                    value={splitAmts[key]}
                    onChange={e => setSplitAmts(a => ({ ...a, [key]: e.target.value }))}
                    placeholder="0.00"
                    className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-neutral-200 text-body font-bold outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all"
                  />
                </div>
              </div>
            ))}
            <div className={cn(
              'flex justify-between rounded-xl px-4 py-3 text-small font-semibold',
              splitValid ? 'bg-success-bg text-success-text' : 'bg-neutral-50 text-neutral-500',
            )}>
              <span>Remaining</span>
              <span className="tabular-nums">{formatGHS(Math.max(0, total - splitTotal))}</span>
            </div>
          </div>
        )}

        {/* PAY ON DELIVERY */}
        {method === 'pay_on_delivery' && (
          <div className="flex items-start gap-3 rounded-xl bg-warning-bg border border-warning/20 p-4">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-bold text-warning-text">Payment deferred</p>
              <p className="text-caption text-warning-text/80 mt-0.5">
                Customer will pay {formatGHS(total)} when they collect or on delivery. Receipt will show "PAYMENT DUE".
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Process button */}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!canProcess && method !== 'card' && method !== 'pay_on_delivery'}
        loading={processing}
        onClick={handleProcess}
      >
        {method === 'pay_on_delivery'
          ? 'Confirm — Pay on Delivery'
          : method === 'momo' && momoState !== 'done'
          ? 'Awaiting MoMo approval…'
          : `Process Payment — ${formatGHS(total)}`}
      </Button>
    </div>
  );
}
