import { useParams, useNavigate } from 'react-router-dom';
import { Printer, RotateCcw, ShoppingCart } from 'lucide-react';
import { getPOSSession, getPOSOrderById, clearPOSSession } from '../../lib/mock/posData.js';
import { calcTax } from '../../lib/pricing/tax.js';
import { formatGHS } from '../../utils/formatCurrency.js';
import Button from '../../components/ui/Button.jsx';

const PAYMENT_STATUS_LABEL = {
  paid:            'PAID IN FULL',
  partial:         'PARTIALLY PAID',
  unpaid:          'PAYMENT DUE',
  pay_on_delivery: 'PAYMENT DUE ON DELIVERY',
};

const TURNAROUND_LABEL = {
  standard: 'Standard (3 days)',
  express:  'Express (1 day)',
  same_day: 'Same-Day',
};

function formatDate(iso) {
  return new Date(iso || Date.now()).toLocaleString('en-GH', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function readyByDate(turnaround) {
  const days = turnaround === 'express' ? 1 : turnaround === 'same_day' ? 0 : 3;
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GH', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ReceiptPage() {
  const { id: orderId } = useParams();
  const navigate        = useNavigate();

  // Prefer session (just-created order); fall back to stored order
  const session = getPOSSession();
  let order;
  if (session.orderId === orderId && session.customer) {
    order = {
      id:          orderId,
      customer:    session.customer,
      service:     session.service,
      turnaround:  session.turnaround,
      deliveryType: session.deliveryType,
      items:       session.items || [],
      subtotal:    session.subtotal,
      surcharge:   session.surcharge,
      deliveryFee: session.deliveryFee,
      vat:         session.vat,
      total:       session.total,
      paymentMethod:  session.paymentMethod || 'unpaid',
      paymentStatus:  session.paymentStatus || 'unpaid',
      amountPaid:  session.amountPaid || 0,
      balanceDue:  session.balanceDue || session.total,
      changeGiven: session.changeGiven || 0,
      receiptId:   session.receiptId || `RCP-ACC-0629-${orderId.slice(-4)}-001`,
      specialInstructions: session.specialInstructions || '',
      createdAt:   new Date().toISOString(),
    };
  } else {
    order = getPOSOrderById(orderId);
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Printer className="h-12 w-12 text-neutral-300" />
        <p className="text-body font-semibold text-neutral-500">Order not found</p>
        <Button variant="outline" onClick={() => navigate('/pos/receipt')}>Search for order</Button>
      </div>
    );
  }

  const totalQty    = order.items.reduce((s, i) => s + i.qty, 0);
  const statusLabel = PAYMENT_STATUS_LABEL[order.paymentStatus] || 'PAYMENT DUE';
  const isPaid      = order.paymentStatus === 'paid';

  function handlePrint() {
    window.print();
  }

  function handleNewOrder() {
    clearPOSSession();
    navigate('/pos/order/new');
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">

      {/* Action bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-body font-bold text-neutral-900">Receipt</p>
          <p className="text-caption text-neutral-400 font-mono">{order.receiptId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/pos/order/${orderId}/payment`)}>
            <RotateCcw className="h-4 w-4 mr-1.5" /> Take Payment
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1.5" /> Print Receipt
          </Button>
          <Button variant="outline" onClick={handleNewOrder}>
            <ShoppingCart className="h-4 w-4 mr-1.5" /> New Order
          </Button>
        </div>
      </div>

      {/* Thermal receipt */}
      <div className="rounded-2xl bg-white border-2 border-neutral-200 shadow-sm overflow-hidden print:border-0 print:shadow-none">
        <div className="p-6 font-mono text-sm leading-relaxed">

          {/* Header */}
          <div className="text-center border-b-2 border-dashed border-neutral-300 pb-4 mb-4">
            <p className="text-base font-black tracking-widest uppercase">SPARKLE LAUNDRY</p>
            <p className="text-xs text-neutral-500">42 Oxford Street, Osu, Accra</p>
            <p className="text-xs text-neutral-500">Tel: +233 20 123 4567</p>
            <p className="text-xs font-semibold text-neutral-600 mt-1">TIN: GH-12345678 · VAT Reg: VATG-001234</p>
          </div>

          {/* Order meta */}
          <div className="border-b border-dashed border-neutral-300 pb-3 mb-3 space-y-0.5">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Order</span>
              <span className="font-bold">{order.id}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Customer</span>
              <span className="font-semibold">{order.customer.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Phone</span>
              <span>{order.customer.phone}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Date</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-neutral-500">Service</span>
              <span>{order.service || '—'} · {TURNAROUND_LABEL[order.turnaround] || order.turnaround}</span>
            </div>
            {order.specialInstructions && (
              <div className="mt-1 bg-neutral-100 rounded px-2 py-1 text-xs">
                <span className="font-bold">NOTE: </span>
                {order.specialInstructions}
              </div>
            )}
          </div>

          {/* Items */}
          {order.items.length > 0 && (
            <div className="border-b border-dashed border-neutral-300 pb-3 mb-3">
              <p className="text-xs font-black uppercase tracking-wider mb-2">Items ({totalQty})</p>
              {order.items.map((item, i) => (
                <div key={item.id || i} className="flex justify-between text-xs mb-1">
                  <span className="truncate mr-2">{item.typeName} × {item.qty}{item.color ? ` (${item.color})` : ''}</span>
                  <span className="shrink-0 tabular-nums font-semibold">{formatGHS(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div className="border-b border-dashed border-neutral-300 pb-3 mb-3 space-y-0.5">
            <div className="flex justify-between text-xs">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatGHS(order.subtotal)}</span>
            </div>
            {(order.surcharge ?? 0) > 0 && (
              <div className="flex justify-between text-xs">
                <span>Surcharge ({order.turnaround === 'express' ? '40%' : 'flat'})</span>
                <span className="tabular-nums">{formatGHS(order.surcharge)}</span>
              </div>
            )}
            {(order.deliveryFee ?? 0) > 0 && (
              <div className="flex justify-between text-xs">
                <span>Home delivery</span>
                <span className="tabular-nums">{formatGHS(order.deliveryFee)}</span>
              </div>
            )}
            {calcTax((order.subtotal || 0) + (order.surcharge || 0)).breakdown.map(line => (
              <div key={line.label} className="flex justify-between text-xs">
                <span>{line.label}</span>
                <span className="tabular-nums">{formatGHS(line.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-black mt-1 pt-1 border-t border-neutral-200">
              <span>TOTAL</span>
              <span className="tabular-nums">{formatGHS(order.total)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="border-b border-dashed border-neutral-300 pb-3 mb-3 space-y-0.5">
            <p className="text-xs font-black uppercase tracking-wider mb-1.5">Payment</p>
            {order.amountPaid > 0 && (
              <div className="flex justify-between text-xs">
                <span>Paid ({order.paymentMethod?.toUpperCase()})</span>
                <span className="tabular-nums">{formatGHS(order.amountPaid)}</span>
              </div>
            )}
            {order.changeGiven > 0 && (
              <div className="flex justify-between text-xs">
                <span>Change</span>
                <span className="tabular-nums">{formatGHS(order.changeGiven)}</span>
              </div>
            )}
            {order.balanceDue > 0 && (
              <div className="flex justify-between text-xs font-bold">
                <span>Balance Due</span>
                <span className="tabular-nums">{formatGHS(order.balanceDue)}</span>
              </div>
            )}
            <div className={`mt-2 text-center text-sm font-black tracking-widest py-1 rounded ${isPaid ? 'bg-success-bg text-success-text' : 'bg-warning-bg text-warning-text'}`}>
              {statusLabel}
            </div>
          </div>

          {/* Ready info */}
          <div className="border-b border-dashed border-neutral-300 pb-3 mb-3 space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Ready by</span>
              <span className="font-semibold">{readyByDate(order.turnaround)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Collection</span>
              <span>{order.deliveryType === 'home_delivery' ? 'Home delivery' : 'Counter pickup — CleanPro Osu'}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs space-y-0.5">
            <p className="text-neutral-400">{order.receiptId}</p>
            <p className="font-semibold">Thank you! Come again.</p>
            <p className="text-neutral-400">CleanPro Osu · 42 Oxford Street</p>
          </div>
        </div>
      </div>

      {/* Bottom action */}
      <div className="flex justify-center">
        <Button variant="primary" size="lg" onClick={handleNewOrder}>
          <ShoppingCart className="h-4 w-4 mr-2" /> Start Next Customer
        </Button>
      </div>
    </div>
  );
}
