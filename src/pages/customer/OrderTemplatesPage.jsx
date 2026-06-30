import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, LayoutTemplate, Pencil, Trash2, Play } from 'lucide-react';
import { getAllTemplates } from '../../lib/mock/mockTemplates.js';
import { turnaroundLabel } from '../../lib/mock/mockOrders.js';

const fmtDate  = d => !d ? '—' : new Date(d).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

export default function OrderTemplatesPage() {
  const navigate  = useNavigate();
  const templates = getAllTemplates();
  const [deleted, setDeleted] = useState(new Set());

  const visible = templates.filter(t => !deleted.has(t.id));

  return (
    <div className="min-h-screen pb-28" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center justify-between bg-white border-b border-neutral-100 px-4 shadow-sm">
        <h1 className="text-h3 font-bold text-neutral-900">Order Templates</h1>
        <button
          onClick={() => navigate('/app/templates/new')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-500 text-white text-caption font-semibold hover:bg-accent-600 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" /> New
        </button>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {visible.length === 0 && (
          <div className="text-center py-20">
            <LayoutTemplate className="h-12 w-12 mx-auto mb-3 text-neutral-200" />
            <p className="text-small font-semibold text-neutral-500">No templates yet</p>
            <p className="text-caption text-neutral-400 mt-1">Create a template to reorder in one tap.</p>
            <button
              onClick={() => navigate('/app/templates/new')}
              className="mt-4 px-4 py-2 rounded-xl bg-accent-500 text-white text-small font-semibold hover:bg-accent-600"
            >
              Create Your First Template
            </button>
          </div>
        )}

        {visible.map(t => {
          const totalQty = t.items.reduce((s, i) => s + i.qty, 0);
          return (
            <div key={t.id} className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
              {/* Color stripe + header */}
              <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white font-bold text-small" style={{ background: t.color }}>
                  {t.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-small font-bold text-neutral-900 truncate">{t.name}</p>
                  <p className="text-caption text-neutral-400">{totalQty} items · {turnaroundLabel(t.turnaround)} · {t.outlet.name}</p>
                </div>
                <p className="text-small font-bold text-neutral-800 tabular-nums flex-shrink-0">{fmtPrice(t.estimatedTotal)}</p>
              </div>

              {/* Items summary */}
              <div className="px-4 pb-3 space-y-1">
                {t.items.map(i => (
                  <div key={i.id} className="flex justify-between text-caption text-neutral-500">
                    <span>{i.name} × {i.qty}</span>
                    <span className="tabular-nums">{fmtPrice(i.unitPrice * i.qty)}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
                <div className="flex items-center gap-1 text-caption text-neutral-400">
                  <Clock className="h-3 w-3" />
                  Used {t.usageCount}× · Last {fmtDate(t.lastUsedAt)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/app/templates/${t.id}/edit`)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                    aria-label="Edit template"
                  >
                    <Pencil className="h-3.5 w-3.5 text-neutral-500" />
                  </button>
                  <button
                    onClick={() => setDeleted(prev => new Set([...prev, t.id]))}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-error-bg transition-colors"
                    aria-label="Delete template"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-error" />
                  </button>
                  <button
                    onClick={() => navigate('/app/order/review')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-500 text-white text-caption font-semibold hover:bg-accent-600 transition-colors ml-1"
                  >
                    <Play className="h-3 w-3" /> Use
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-20 inset-x-0 px-4">
        <button
          onClick={() => navigate('/app/templates/new')}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-accent-200 text-accent-600 font-semibold text-small py-4 hover:bg-accent-50 transition-colors"
        >
          <Plus className="h-4 w-4" /> Create New Template
        </button>
      </div>
    </div>
  );
}
