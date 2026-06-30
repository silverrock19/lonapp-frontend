import { turnaroundLabel } from '../../lib/mock/mockOrders.js';
import { calcTax } from '../../lib/pricing/tax.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const fmtDate  = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' });

// Shared printable receipt — used by OrderReceiptPage and BulkReceiptPage
export default function OrderReceiptDoc({ order, business }) {
  const isPaid   = ['DELIVERED', 'COMPLETED'].includes(order.status);
  const totalQty = order.items.reduce((s, i) => s + i.qty, 0);
  const dateStr  = fmtDate(order.paidAt || order.completedAt || order.deliveryDate);

  // Derive tax breakdown from EP-05 config so labels always match rates
  const taxBase   = (order.subtotal || 0) + (order.surcharge || 0);
  const taxResult = calcTax(taxBase);

  return (
    <div className="bg-white font-mono text-[13px] leading-relaxed max-w-[460px] mx-auto border border-neutral-200 rounded-xl shadow-sm p-8 print:border-none print:shadow-none print:rounded-none">

      {/* Business header */}
      <div className="text-center mb-5 pb-5 border-b-2 border-dashed border-neutral-300">
        <p className="text-[17px] font-black tracking-widest uppercase text-neutral-900">{business.name}</p>
        <p className="text-[11px] text-neutral-500 mt-1">{business.address}</p>
        <p className="text-[11px] text-neutral-500">Tel: {business.phone} · {business.email}</p>
        <p className="text-[11px] text-neutral-500">TIN: {business.tin} · VAT Reg: {business.vatReg}</p>
      </div>

      <p className="text-center text-[14px] font-bold tracking-[0.25em] text-neutral-700 mb-5">PAYMENT RECEIPT</p>

      {/* Order meta */}
      <div className="space-y-1.5 mb-5 pb-5 border-b border-dashed border-neutral-200">
        <Row label="Receipt No"  value={order.receiptNumber} mono />
        <Row label="Order No"    value={order.id}            mono />
        <Row label="Date"        value={dateStr} />
        <Row label="Outlet"      value={order.outlet.name} />
        <Row label="Service"     value={turnaroundLabel(order.turnaround)} />
      </div>

      {/* Bill To */}
      <div className="mb-5 pb-5 border-b border-dashed border-neutral-200">
        <p className="font-bold text-[11px] tracking-widest uppercase mb-2">Bill To</p>
        <p className="font-semibold text-neutral-800">{order.customer?.name ?? 'Customer'}</p>
        <p className="text-neutral-500">{order.customer?.phone ?? ''}</p>
        <p className="text-neutral-500">{order.deliveryAddress?.detail ?? ''}</p>
      </div>

      {/* Items */}
      <div className="mb-5 pb-5 border-b border-dashed border-neutral-200">
        <p className="font-bold text-[11px] tracking-widest uppercase mb-2">Items ({totalQty})</p>
        <div className="space-y-1.5">
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between">
              <span className="text-neutral-700">{item.name} × {item.qty}</span>
              <span className="font-semibold text-neutral-800">{formatGHS(item.unitPrice * item.qty)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing — Ghana tax breakdown per levy */}
      <div className="mb-5 pb-5 border-b border-dashed border-neutral-200 space-y-1.5">
        <Row label="Subtotal" value={formatGHS(order.subtotal)} dim />
        {order.surcharge > 0 && (
          <Row label={`${order.turnaround === 'express' ? 'Express' : 'Same-day'} surcharge`} value={formatGHS(order.surcharge)} dim />
        )}
        <Row label="Pickup + Delivery" value={formatGHS((order.pickupFee || 0) + (order.deliveryFee || 0))} dim />
        {taxResult.breakdown.map(line => (
          <Row key={line.label} label={line.label} value={formatGHS(line.amount)} dim />
        ))}
        <div className="flex justify-between font-bold text-[15px] pt-2 border-t border-neutral-200">
          <span className="text-neutral-900">TOTAL</span>
          <span className="text-neutral-900">{formatGHS(order.total)}</span>
        </div>
      </div>

      {/* Payment */}
      <div className="mb-5 pb-5 border-b border-dashed border-neutral-200 space-y-1.5">
        <p className="font-bold text-[11px] tracking-widest uppercase mb-2">Payment</p>
        <Row label="Method" value={order.paymentMethod?.label ?? '—'} />
        {order.paymentMethod?.sub && <Row label="" value={order.paymentMethod.sub} dim />}
        {isPaid && order.paidAt && <Row label="Paid on" value={fmtDate(order.paidAt)} />}
        <Row label="Amount" value={formatGHS(order.total)} />
      </div>

      {/* Status stamp */}
      <div className={`text-center font-bold tracking-widest py-3 rounded-lg mb-5 text-[13px] ${
        isPaid
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : order.status === 'CANCELLED'
          ? 'bg-neutral-100 text-neutral-500 border border-neutral-200'
          : 'bg-amber-50 text-amber-700 border border-amber-200'
      }`}>
        {isPaid ? '✓  PAID IN FULL' : order.status === 'CANCELLED' ? 'CANCELLED' : 'PAYMENT PENDING'}
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-neutral-400 space-y-0.5">
        <p>Thank you for choosing {business.name}!</p>
        <p>This is a system-generated receipt. Not valid if altered.</p>
      </div>
    </div>
  );
}

function Row({ label, value, dim, mono }) {
  return (
    <div className="flex justify-between gap-4">
      <span className={dim ? 'text-neutral-500' : 'text-neutral-600'}>{label}</span>
      <span className={`text-right ${dim ? 'text-neutral-500' : 'font-semibold text-neutral-800'} ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
