import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Package } from 'lucide-react';
import { getOrdersByIds, BUSINESS_INFO } from '../../lib/mock/mockOrders.js';
import OrderReceiptDoc from '../../components/documents/OrderReceiptDoc.jsx';

export default function BulkReceiptPage() {
  const [params] = useSearchParams();
  const navigate  = useNavigate();
  const ids       = (params.get('ids') ?? '').split(',').map(s => s.trim()).filter(Boolean);
  const orders    = getOrdersByIds(ids);

  if (ids.length === 0 || orders.length === 0) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-4" style={{ background: '#FAFAF8' }}>
        <Package className="h-12 w-12 text-neutral-300" />
        <p className="text-body font-semibold text-neutral-500">No orders selected</p>
        <button onClick={() => navigate('/app/orders')} className="text-accent-600 text-small font-semibold">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .print-hide { display: none !important; }
          .page-break  { page-break-after: always; break-after: page; }
        }
      `}</style>

      <div className="min-h-screen pb-12" style={{ background: '#FAFAF8' }}>

        {/* Action bar */}
        <div className="print-hide sticky top-0 z-10 flex items-center justify-between bg-white border-b border-neutral-100 px-4 h-14 shadow-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-small font-semibold text-neutral-700">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-small font-bold text-neutral-900">{orders.length} Receipt{orders.length !== 1 ? 's' : ''}</p>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-600 text-caption font-semibold text-white hover:bg-accent-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" /> Print All
          </button>
        </div>

        {/* Info banner */}
        <div className="print-hide mx-4 mt-4 rounded-xl bg-accent-50 border border-accent-200 px-4 py-3 text-small text-accent-700">
          Printing {orders.length} receipt{orders.length !== 1 ? 's' : ''} — each will print on a separate page.
        </div>

        {/* Receipts */}
        <div className="pt-5 space-y-6">
          {orders.map((order, idx) => (
            <div key={order.id} className={idx < orders.length - 1 ? 'page-break' : ''}>
              <div className="px-4">
                <OrderReceiptDoc order={order} business={BUSINESS_INFO} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
