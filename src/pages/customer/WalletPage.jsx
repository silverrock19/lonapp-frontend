import { useState } from 'react';
import { ArrowLeft, Plus, ArrowDownLeft, ArrowUpRight, CreditCard, Smartphone, Building, Wallet, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDefaultWallet, getWalletTransactions, TXN_TYPE_LABELS } from '../../lib/mock/mockWallet.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const wallet = getDefaultWallet();
const txns = getWalletTransactions('cust-001');

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const METHOD_ICONS = {
  momo: <Smartphone size={16} />,
  card: <CreditCard size={16} />,
  bank: <Building size={16} />,
  wallet: <Wallet size={16} />,
};

const TXN_ICONS = {
  TOPUP:  <ArrowDownLeft size={18} className="text-green-600" />,
  DEBIT:  <ArrowUpRight size={18} className="text-neutral-500" />,
  CREDIT: <ArrowDownLeft size={18} className="text-accent-600" />,
  REFUND: <ArrowDownLeft size={18} className="text-accent-600" />,
};

export default function WalletPage() {
  const navigate = useNavigate();
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('momo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function handleTopUp() {
    if (!amount || isNaN(Number(amount))) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(Number(amount));
      setAmount('');
      setTopUpOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  }

  return (
    <div className="min-h-screen mx-auto max-w-[430px]" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-neutral-600">
          <ArrowLeft size={20} />
        </button>
        <span className="text-base font-semibold text-neutral-900">My Wallet</span>
      </header>

      <div className="p-4 space-y-4">
        {/* Success toast */}
        {success !== null && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 text-sm font-medium">
            <CheckCircle size={16} />
            {formatGHS(success)} added to your wallet
          </div>
        )}

        {/* Balance card */}
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-2xl p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-1">Available Balance</p>
          <p className="text-4xl font-bold font-mono tabular-nums">{formatGHS(wallet.balance)}</p>
          <p className="text-xs opacity-60 mt-3">Wallet ID: {wallet.id}</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Top Up', icon: <Plus size={18} />, action: () => setTopUpOpen(v => !v) },
            { label: 'Pay', icon: <ArrowUpRight size={18} />, action: () => {} },
            { label: 'Withdraw', icon: <ArrowDownLeft size={18} />, action: () => {} },
          ].map(({ label, icon, action }) => (
            <button key={label} onClick={action}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl border border-neutral-200 bg-white text-neutral-700 text-sm font-medium shadow-sm active:bg-neutral-50">
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Top-up flow */}
        {topUpOpen && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-4">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Top Up Wallet</p>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">Amount (GH₵)</label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-lg font-mono tabular-nums focus:outline-none focus:border-accent-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-2 block">Payment method</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'momo', label: 'MoMo', icon: <Smartphone size={16} /> },
                  { id: 'card', label: 'Card', icon: <CreditCard size={16} /> },
                  { id: 'bank', label: 'Bank', icon: <Building size={16} /> },
                ].map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id)}
                    className={cn('flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-medium',
                      method === m.id
                        ? 'border-accent-500 bg-accent-50 text-accent-700'
                        : 'border-neutral-200 text-neutral-600')}>
                    {m.icon}
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleTopUp}
              disabled={loading || !amount}
              className="w-full py-3 rounded-xl bg-accent-500 text-white font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><RefreshCw size={15} className="animate-spin" /> Processing…</> : 'Top Up'}
            </button>
          </div>
        )}

        {/* Auto top-up */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-neutral-800">Auto Top-Up</p>
            <p className="text-xs text-neutral-400 mt-0.5">
              {wallet.autoTopUp
                ? `Top up GH₵ ${wallet.autoTopUpAmount} when balance drops below GH₵ ${wallet.autoTopUpThreshold}`
                : 'Not configured'}
            </p>
          </div>
          <span className={cn('text-xs font-bold px-2 py-1 rounded-full',
            wallet.autoTopUp ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500')}>
            {wallet.autoTopUp ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Transaction history */}
        <div>
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Recent Transactions</p>
          {txns.length === 0 && (
            <p className="py-6 text-center text-sm text-neutral-400">No transactions yet.</p>
          )}
          <div className="space-y-2">
            {txns.map(txn => {
              const meta = TXN_TYPE_LABELS[txn.type] ?? { label: txn.type, color: 'text-neutral-700', sign: '' };
              const isPositive = meta.sign === '+';
              return (
                <div key={txn.id} className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                    {TXN_ICONS[txn.type] ?? <Wallet size={18} className="text-neutral-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-800 truncate">{txn.description}</p>
                    <p className="text-xs text-neutral-400">{fmtDate(txn.createdAt)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn('text-sm font-semibold font-mono tabular-nums', isPositive ? 'text-green-600' : 'text-neutral-700')}>
                      {meta.sign}{formatGHS(Math.abs(txn.amount))}
                    </p>
                    <p className="text-[11px] text-neutral-400">{meta.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export */}
        <button className="w-full py-3 rounded-2xl border border-neutral-200 bg-white text-neutral-700 text-sm font-medium shadow-sm">
          Download Statement
        </button>
      </div>
    </div>
  );
}
