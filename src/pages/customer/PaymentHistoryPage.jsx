import { useState } from 'react';
import { ArrowLeft, Download, Search, Filter, Receipt, CheckCircle, Clock, AlertCircle, RefreshCw, Smartphone, CreditCard, Wallet, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTransactionsForCustomer, PAYMENT_STATUSES, PAYMENT_METHODS } from '../../lib/mock/mockPayments.js';
import { getInvoicesForCustomer, INVOICE_STATUSES } from '../../lib/mock/mockInvoices.js';
import { cn } from '../../utils/classNames.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const CUST_ID = 'cust-001';
const allTxns = getTransactionsForCustomer(CUST_ID);
const allInvoices = getInvoicesForCustomer(CUST_ID);

const STATUS_FILTERS = ['All', 'Paid', 'Pending', 'Overdue'];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

const METHOD_ICON = {
  momo:          <Smartphone size={16} className="text-yellow-600" />,
  card:          <CreditCard size={16} className="text-blue-600" />,
  cash:          <Banknote size={16} className="text-green-600" />,
  wallet:        <Wallet size={16} className="text-accent-600" />,
  bank_transfer: <Banknote size={16} className="text-neutral-500" />,
  pay_on_delivery: <Clock size={16} className="text-neutral-400" />,
};

const STATUS_ICON = {
  SUCCESS:  <CheckCircle size={14} />,
  PAID:     <CheckCircle size={14} />,
  PENDING:  <Clock size={14} />,
  FAILED:   <AlertCircle size={14} />,
  OVERDUE:  <AlertCircle size={14} />,
  REFUNDED: <RefreshCw size={14} />,
};

export default function PaymentHistoryPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('txns');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [dlSuccess, setDlSuccess] = useState(false);

  function matchesFilter(item, statusKey) {
    if (statusFilter === 'All') return true;
    const st = (item.status ?? '').toUpperCase();
    if (statusFilter === 'Paid')    return st === 'SUCCESS' || st === 'PAID';
    if (statusFilter === 'Pending') return st === 'PENDING' || st === 'PARTIAL';
    if (statusFilter === 'Overdue') return st === 'OVERDUE';
    return true;
  }

  const filteredTxns = allTxns.filter(t => {
    const q = search.toLowerCase();
    return matchesFilter(t) && (
      !q || t.orderId?.toLowerCase().includes(q) || String(t.amount).includes(q)
    );
  });

  const filteredInvoices = allInvoices.filter(inv => {
    const q = search.toLowerCase();
    return matchesFilter(inv) && (
      !q || inv.id?.toLowerCase().includes(q) || inv.orderId?.toLowerCase().includes(q) ||
      String(inv.totalAmount).includes(q)
    );
  });

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => {
      const rows = [
        ['Date', 'Reference', 'Order', 'Method', 'Amount (GHS)', 'Status'],
        ...allTxns.map(t => [
          fmtDate(t.createdAt),
          t.providerRef ?? t.id,
          t.orderId ?? '—',
          PAYMENT_METHODS[t.method]?.label ?? t.method,
          t.amount.toFixed(2),
          PAYMENT_STATUSES[t.status]?.label ?? t.status,
        ]),
      ].map(r => r.join(',')).join('\n');

      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([rows], { type: 'text/csv' }));
      a.download = `payment-statement-${CUST_ID}.csv`;
      a.click();

      setDownloading(false);
      setDlSuccess(true);
      setTimeout(() => setDlSuccess(false), 2000);
    }, 800);
  }

  return (
    <div className="min-h-screen mx-auto max-w-[430px] pb-24" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1 text-neutral-600">
          <ArrowLeft size={20} />
        </button>
        <span className="flex-1 text-base font-semibold text-neutral-900">Payment History</span>
        <button className="p-1 text-neutral-500" aria-label="Download">
          <Download size={20} />
        </button>
      </header>

      <div className="p-4 space-y-3">
        {/* Search + filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Order ID or amount…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:border-accent-500"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm text-neutral-600">
            <Filter size={14} /> Filter
          </button>
        </div>

        {/* Status pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={cn('flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border',
                statusFilter === f
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'bg-white text-neutral-600 border-neutral-200')}>
              {f}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-neutral-100 p-1">
          {[['txns', 'Transactions'], ['invoices', 'Invoices']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn('flex-1 py-2 rounded-lg text-sm font-semibold transition-colors',
                tab === id ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500')}>
              {label}
            </button>
          ))}
        </div>

        {/* Transactions */}
        {tab === 'txns' && (
          <div className="space-y-2">
            {filteredTxns.length === 0 && (
              <p className="text-center text-sm text-neutral-400 py-8">No transactions found.</p>
            )}
            {filteredTxns.map(txn => {
              const statusMeta = PAYMENT_STATUSES[txn.status] ?? { label: txn.status, color: 'text-neutral-500', bg: 'bg-neutral-100' };
              const isExpanded = expandedId === txn.id;
              return (
                <div key={txn.id} className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
                  <button className="w-full p-4 flex items-center gap-3 text-left"
                    onClick={() => setExpandedId(isExpanded ? null : txn.id)}>
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                      {METHOD_ICON[txn.method] ?? <Receipt size={16} className="text-neutral-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">{txn.orderId}</p>
                      <p className="text-xs text-neutral-400">{fmtDate(txn.createdAt)}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold font-mono tabular-nums text-neutral-900">
                        {formatGHS(txn.amount)}
                      </p>
                      <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded-full', statusMeta.color, statusMeta.bg)}>
                        {STATUS_ICON[txn.status]} {statusMeta.label}
                      </span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-500">
                      <div className="flex justify-between"><span>Payment Ref</span><span className="font-mono text-neutral-700">{txn.providerRef ?? '—'}</span></div>
                      <div className="flex justify-between"><span>Provider</span><span className="text-neutral-700">{PAYMENT_METHODS[txn.method]?.label ?? '—'}</span></div>
                      {txn.note && <div className="flex justify-between"><span>Note</span><span className="text-neutral-700 text-right max-w-[60%]">{txn.note}</span></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Invoices */}
        {tab === 'invoices' && (
          <div className="space-y-2">
            {filteredInvoices.length === 0 && (
              <p className="text-center text-sm text-neutral-400 py-8">No invoices found.</p>
            )}
            {filteredInvoices.map(inv => {
              const statusMeta = INVOICE_STATUSES[inv.status] ?? { label: inv.status, color: 'text-neutral-500', bg: 'bg-neutral-100' };
              const amountDue = inv.balanceDue ?? inv.totalAmount;
              return (
                <div key={inv.id} className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-800">{inv.id}</p>
                      <p className="text-xs text-neutral-400">{inv.orderId} · {fmtDate(inv.invoiceDate)}</p>
                    </div>
                    <span className={cn('flex-shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full', statusMeta.color, statusMeta.bg)}>
                      {statusMeta.label}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-400">
                        {inv.status === 'PAID' ? 'Total paid' : 'Balance due'}
                      </p>
                      <p className="text-base font-bold font-mono tabular-nums text-neutral-900">
                        {formatGHS(amountDue)}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/app/orders/${inv.orderId}/invoice`)}
                      className="text-xs font-semibold text-accent-600 underline-offset-2 hover:underline">
                      View Invoice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating download button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-4 z-20">
        {dlSuccess && (
          <div className="mb-2 flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium py-2 rounded-xl">
            <CheckCircle size={15} /> Statement downloaded!
          </div>
        )}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 rounded-2xl bg-accent-500 text-white font-semibold text-sm shadow-lg disabled:opacity-60 flex items-center justify-center gap-2">
          {downloading
            ? <><RefreshCw size={15} className="animate-spin" /> Preparing…</>
            : <><Download size={15} /> Download Statement (PDF)</>}
        </button>
      </div>
    </div>
  );
}
