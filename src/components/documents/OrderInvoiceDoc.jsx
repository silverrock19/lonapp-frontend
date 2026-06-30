import { turnaroundLabel } from '../../lib/mock/mockOrders.js';
import { calcTax } from '../../lib/pricing/tax.js';
import { formatGHS } from '../../utils/formatCurrency.js';

const fmtDate  = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtShort = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' });

// Shared printable tax invoice — used by OrderInvoicePage
export default function OrderInvoiceDoc({ order, business }) {
  const isPaid    = ['DELIVERED', 'COMPLETED'].includes(order.status);
  const invoiceDate = fmtDate(order.paidAt || order.completedAt || order.deliveryDate || order.placedAt);

  // Derive tax breakdown from EP-05 config so labels always match rates
  const taxBase     = (order.subtotal || 0) + (order.surcharge || 0);
  const taxResult   = calcTax(taxBase);

  return (
    <div className="bg-white text-[13px] leading-relaxed max-w-[680px] mx-auto border border-neutral-200 rounded-xl shadow-sm p-10 print:border-none print:shadow-none print:rounded-none">

      {/* Letterhead */}
      <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-neutral-200">
        <div>
          <p className="text-[20px] font-black text-neutral-900 tracking-tight">{business.legalName}</p>
          <p className="text-[12px] text-neutral-500 mt-1">{business.address}</p>
          <p className="text-[12px] text-neutral-500">Tel: {business.phone}</p>
          <p className="text-[12px] text-neutral-500">Email: {business.email}</p>
          <p className="text-[12px] text-neutral-500 mt-1">TIN: {business.tin} · VAT Reg: {business.vatReg}</p>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-black text-accent-600 tracking-widest">TAX INVOICE</p>
          <div className="mt-3 space-y-1 text-[12px]">
            <p><span className="text-neutral-500">Invoice No: </span><span className="font-mono font-bold">{order.invoiceNumber}</span></p>
            <p><span className="text-neutral-500">Invoice Date: </span><span className="font-semibold">{invoiceDate}</span></p>
            <p><span className="text-neutral-500">Order No: </span><span className="font-mono font-semibold">{order.id}</span></p>
            <p>
              <span className="text-neutral-500">Status: </span>
              <span className={`font-bold ${isPaid ? 'text-emerald-600' : order.status === 'CANCELLED' ? 'text-neutral-500' : 'text-amber-600'}`}>
                {isPaid ? 'PAID' : order.status === 'CANCELLED' ? 'CANCELLED' : 'PENDING'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Bill To + Service Details */}
      <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Bill To</p>
          <p className="font-bold text-neutral-900">{order.customer?.name ?? 'Customer'}</p>
          <p className="text-neutral-600">{order.deliveryAddress?.detail ?? ''}</p>
          <p className="text-neutral-600">{order.customer?.phone ?? ''}</p>
          <p className="text-neutral-600">{order.customer?.email ?? ''}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Service Details</p>
          <p className="text-neutral-700"><span className="text-neutral-500">Outlet: </span>{order.outlet.name}</p>
          <p className="text-neutral-700"><span className="text-neutral-500">Turnaround: </span>{turnaroundLabel(order.turnaround)}</p>
          <p className="text-neutral-700"><span className="text-neutral-500">Pickup: </span>{fmtShort(order.pickupDate)}, {order.pickupSlot?.label}</p>
          <p className="text-neutral-700"><span className="text-neutral-500">Delivery: </span>{fmtShort(order.deliveryDate)}, {order.deliverySlot?.label}</p>
        </div>
      </div>

      {/* Items table */}
      <table className="w-full text-[12px] mb-6">
        <thead>
          <tr className="border-b-2 border-neutral-300">
            <th className="text-left py-2 pr-4 text-neutral-500 font-semibold w-8">#</th>
            <th className="text-left py-2 pr-4 text-neutral-500 font-semibold">Description</th>
            <th className="text-right py-2 pr-4 text-neutral-500 font-semibold w-12">Qty</th>
            <th className="text-right py-2 pr-4 text-neutral-500 font-semibold w-24">Unit Price</th>
            <th className="text-right py-2 text-neutral-500 font-semibold w-28">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={item.id} className="border-b border-neutral-100">
              <td className="py-2 pr-4 text-neutral-400">{idx + 1}</td>
              <td className="py-2 pr-4 text-neutral-800 font-medium">{item.name}</td>
              <td className="py-2 pr-4 text-right text-neutral-700">{item.qty}</td>
              <td className="py-2 pr-4 text-right tabular-nums text-neutral-700">{formatGHS(item.unitPrice)}</td>
              <td className="py-2 text-right tabular-nums font-semibold text-neutral-800">{formatGHS(item.unitPrice * item.qty)}</td>
            </tr>
          ))}
          {/* Fees rows */}
          <tr className="border-b border-neutral-100">
            <td></td>
            <td className="py-2 pr-4 text-neutral-600">Pickup Fee</td>
            <td></td><td></td>
            <td className="py-2 text-right tabular-nums text-neutral-600">{formatGHS(order.pickupFee)}</td>
          </tr>
          <tr className="border-b border-neutral-100">
            <td></td>
            <td className="py-2 pr-4 text-neutral-600">Delivery Fee</td>
            <td></td><td></td>
            <td className="py-2 text-right tabular-nums text-neutral-600">{formatGHS(order.deliveryFee)}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals block */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-1.5 text-[12px]">
          <TotalRow label="Subtotal"           value={formatGHS(order.subtotal)} />
          {order.surcharge > 0 && (
            <TotalRow label={`${order.turnaround === 'express' ? 'Express' : 'Same-day'} surcharge`} value={formatGHS(order.surcharge)} />
          )}
          <TotalRow label="Pickup + Delivery"  value={formatGHS((order.pickupFee || 0) + (order.deliveryFee || 0))} />
          {/* Ghana tax breakdown — each levy as its own line */}
          {taxResult.breakdown.map(line => (
            <TotalRow key={line.label} label={line.label} value={formatGHS(line.amount)} />
          ))}
          <div className="flex justify-between pt-2 border-t-2 border-neutral-300 font-bold text-[14px]">
            <span className="text-neutral-900">TOTAL</span>
            <span className="tabular-nums text-neutral-900">{formatGHS(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      <div className="mb-8 pb-6 border-b border-neutral-200">
        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-3">Payment Information</p>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <p><span className="text-neutral-500">Method: </span>{order.paymentMethod?.label}</p>
          {order.paymentMethod?.sub && <p><span className="text-neutral-500">Reference: </span>{order.paymentMethod.sub}</p>}
          <p><span className="text-neutral-500">Amount: </span><span className="font-semibold">{formatGHS(order.total)}</span></p>
          {order.paidAt && <p><span className="text-neutral-500">Date: </span>{fmtDate(order.paidAt)}</p>}
          <p>
            <span className="text-neutral-500">Status: </span>
            <span className={`font-bold ${isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
              {isPaid ? 'PAID IN FULL' : 'PAYMENT PENDING'}
            </span>
          </p>
        </div>
      </div>

      {/* Signature lines */}
      <div className="grid grid-cols-2 gap-16 mb-8 text-[11px]">
        <div>
          <div className="border-b border-neutral-400 mb-2 mt-8"></div>
          <p className="font-semibold text-neutral-700">Customer Signature</p>
          <p className="text-neutral-500">{order.customer?.name ?? 'Customer'}</p>
        </div>
        <div>
          <div className="border-b border-neutral-400 mb-2 mt-8"></div>
          <p className="font-semibold text-neutral-700">Authorised Signatory</p>
          <p className="text-neutral-500">{business.legalName}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[10px] text-neutral-400 border-t border-neutral-200 pt-4">
        <p>This is a system-generated tax invoice in compliance with Ghana Revenue Authority requirements.</p>
        <p>{business.legalName} · {business.address} · {business.tin}</p>
      </div>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="flex justify-between text-neutral-600">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
