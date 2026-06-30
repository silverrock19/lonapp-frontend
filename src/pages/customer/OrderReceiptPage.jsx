import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, FileText, Package } from 'lucide-react';
import { getOrder, BUSINESS_INFO } from '../../lib/mock/mockOrders.js';
import OrderReceiptDoc from '../../components/documents/OrderReceiptDoc.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function OrderReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = getOrder(id);

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={Package} title="Order not found" description="This order doesn't exist." action={
          <button onClick={() => navigate('/app/orders')} className="text-accent-600 text-small font-medium">Back to Orders</button>
        } />
      </div>
    );
  }

  return (
    <>
      {/* Print isolation: only #receipt-doc prints */}
      <style>{`
        @media print {
          body > * { visibility: hidden !important; }
          #receipt-doc, #receipt-doc * { visibility: visible !important; }
          #receipt-doc { position: fixed; inset: 0; padding: 24px; background: white; }
        }
      `}</style>

      <div className="min-h-screen pb-12" style={{ background: '#FAFAF8' }}>

        {/* Action bar — hidden on print */}
        <div className="print:hidden sticky top-0 z-10 flex items-center justify-between bg-white border-b border-neutral-100 px-4 h-14 shadow-sm">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-small font-semibold text-neutral-700 hover:text-neutral-900">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-small font-bold text-neutral-900">Receipt</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/app/orders/${id}/invoice`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-caption font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" /> Invoice
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-600 text-caption font-semibold text-white hover:bg-accent-700 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" /> Print / Save
            </button>
          </div>
        </div>

        {/* Document */}
        <div id="receipt-doc" className="px-4 pt-5">
          <OrderReceiptDoc order={order} business={BUSINESS_INFO} />
        </div>
      </div>
    </>
  );
}
