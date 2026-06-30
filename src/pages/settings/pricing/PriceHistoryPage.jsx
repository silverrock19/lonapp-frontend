import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, Search, TrendingUp, TrendingDown, ArrowRight,
} from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPriceHistory, ENTITY_TYPE_LABELS } from '../../../lib/mock/mockPriceHistory.js';

const ENTITY_TYPE_COLORS = {
  item_price:        'bg-primary-50 text-primary-700',
  tax_rate:          'bg-rose-50 text-rose-700',
  turnaround:        'bg-amber-50 text-amber-700',
  bulk_tier:         'bg-success/10 text-success',
  loyalty_tier:      'bg-yellow-50 text-yellow-700',
  promo:             'bg-orange-50 text-orange-700',
  customer_contract: 'bg-purple-50 text-purple-700',
  weight_tier:       'bg-accent-50 text-accent-700',
};

function ChangeDirectionBadge({ oldVal, newVal }) {
  const oldNum = parseFloat(oldVal);
  const newNum = parseFloat(newVal);
  const increased = !isNaN(oldNum) && !isNaN(newNum) && newNum > oldNum;
  const decreased = !isNaN(oldNum) && !isNaN(newNum) && newNum < oldNum;
  if (increased)
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-semibold text-error">
        <TrendingUp className="h-2.5 w-2.5" />+
      </span>
    );
  if (decreased)
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
        <TrendingDown className="h-2.5 w-2.5" />-
      </span>
    );
  return (
    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">~</span>
  );
}

const PAGE_SIZE = 10;

export default function PriceHistoryPage() {
  const [history] = useState(() => getPriceHistory());
  const [search, setSearch] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [changedByFilter, setChangedByFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const uniqueChangedBy = [...new Set(history.map(h => h.changedBy))];

  const filtered = useMemo(() => {
    const now = Date.now();
    return history.filter(h => {
      if (entityTypeFilter !== 'all' && h.entityType !== entityTypeFilter) return false;
      if (changedByFilter !== 'all' && h.changedBy !== changedByFilter) return false;
      if (dateFilter !== 'all') {
        const days = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : 90;
        if (now - new Date(h.changedAt).getTime() > days * 86400000) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !h.entityLabel.toLowerCase().includes(q) &&
          !h.field.toLowerCase().includes(q) &&
          !h.changedBy.toLowerCase().includes(q) &&
          !(h.reason?.toLowerCase().includes(q))
        ) return false;
      }
      return true;
    });
  }, [history, search, entityTypeFilter, dateFilter, changedByFilter]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function formatDateShort(iso) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Price Change History</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Price Change History</h1>
        <p className="mt-1 text-small text-neutral-500">
          Filterable audit log of all pricing rule changes with before and after values.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Total Changes</p>
          <p className="text-2xl font-bold text-neutral-900">{history.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">This Month</p>
          <p className="text-2xl font-bold text-neutral-900">
            {history.filter(h => new Date(h.changedAt).getMonth() === new Date().getMonth()).length}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-xs text-neutral-500">Unique Items Changed</p>
          <p className="text-2xl font-bold text-neutral-900">{new Set(history.map(h => h.entityId)).size}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search entity, field, user, reason…"
            className="w-full rounded-lg border border-neutral-200 pl-9 pr-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
          />
        </div>
        <select
          value={entityTypeFilter}
          onChange={e => { setEntityTypeFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
        >
          <option value="all">All types</option>
          {Object.entries(ENTITY_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
        >
          <option value="all">All time</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        <select
          value={changedByFilter}
          onChange={e => { setChangedByFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none"
        >
          <option value="all">All users</option>
          {uniqueChangedBy.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-neutral-100 bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Entity</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Field</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Change</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Changed By</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">When</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">Reason</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-400">
                  No changes match the current filters.
                </td>
              </tr>
            )}
            {pageItems.map(h => (
              <>
                <tr
                  key={h.id}
                  className="border-b border-neutral-50 hover:bg-neutral-50/50 cursor-pointer"
                  onClick={() => setExpanded(expanded === h.id ? null : h.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                          ENTITY_TYPE_COLORS[h.entityType] ?? 'bg-neutral-100 text-neutral-600'
                        )}
                      >
                        {ENTITY_TYPE_LABELS[h.entityType] ?? h.entityType}
                      </span>
                      <span className="text-sm font-medium text-neutral-800">{h.entityLabel}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600 capitalize">
                    {h.field.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm font-mono tabular-nums">
                      <span className="text-neutral-500 line-through">{h.oldValue}</span>
                      <ArrowRight className="h-3 w-3 text-neutral-400 flex-shrink-0" />
                      <span className="font-semibold text-neutral-900">{h.newValue}</span>
                      <ChangeDirectionBadge oldVal={h.oldValue} newVal={h.newValue} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-600">{h.changedBy}</td>
                  <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(h.changedAt)}</td>
                  <td className="px-4 py-3 text-xs text-neutral-400 max-w-[180px] truncate">{h.reason ?? '—'}</td>
                </tr>
                {expanded === h.id && (
                  <tr key={`${h.id}-expanded`} className="border-b border-neutral-100">
                    <td colSpan={6} className="bg-neutral-50/80 px-8 py-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-neutral-400 mb-1">Old Value</p>
                          <p className="font-mono tabular-nums font-semibold text-neutral-700 line-through">{h.oldValue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 mb-1">New Value</p>
                          <p className="font-mono tabular-nums font-semibold text-neutral-900">{h.newValue}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 mb-1">Approved By</p>
                          <p className="text-neutral-700">{h.approvedBy ?? 'No approval required'}</p>
                        </div>
                        {h.reason && (
                          <div className="col-span-2">
                            <p className="text-xs text-neutral-400 mb-1">Reason</p>
                            <p className="text-neutral-700">{h.reason}</p>
                          </div>
                        )}
                        {h.impactSummary && (
                          <div>
                            <p className="text-xs text-neutral-400 mb-1">Impact</p>
                            <p className="text-neutral-700">{h.impactSummary}</p>
                          </div>
                        )}
                        {h.operationId && (
                          <div>
                            <p className="text-xs text-neutral-400 mb-1">Bulk Operation</p>
                            <p className="font-mono text-xs text-neutral-600">{h.operationId}</p>
                          </div>
                        )}
                        <div>
                          <button
                            onClick={() => setSelectedEntity(h.entityId)}
                            className="text-xs text-primary-600 hover:underline font-medium"
                          >
                            View full timeline for this item →
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 pt-4 pb-4">
            <p className="text-xs text-neutral-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-neutral-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs disabled:opacity-40 hover:bg-neutral-50"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline panel */}
      {selectedEntity && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-neutral-800">
              Change Timeline: {history.find(h => h.entityId === selectedEntity)?.entityLabel}
            </h2>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-neutral-400 hover:text-neutral-700"
            >
              ✕
            </button>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-neutral-200" />
            <div className="space-y-4 pl-8">
              {history.filter(h => h.entityId === selectedEntity).map(h => (
                <div key={h.id} className="relative">
                  <div className="absolute -left-5 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-primary-400 ring-2 ring-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                  </div>
                  <div className="text-xs text-neutral-400 mb-1">
                    {formatDateShort(h.changedAt)} by {h.changedBy}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-mono tabular-nums">
                    <span className="text-neutral-500 line-through">{h.oldValue}</span>
                    <ArrowRight className="h-3 w-3 text-neutral-400" />
                    <span className="font-semibold text-neutral-900">{h.newValue}</span>
                  </div>
                  {h.reason && <p className="text-xs text-neutral-400 mt-0.5">{h.reason}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
