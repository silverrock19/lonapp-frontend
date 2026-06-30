import { useState, useMemo } from 'react';
import { Search, Download, Check, X } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { mockAuditLogs, AUDIT_CATEGORIES, AUDIT_CATEGORY_META } from '../../data/mockStaff.js';

const PAGE_SIZE = 8;

const AuditLogTab = () => {
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('');
  const [result, setResult]     = useState('');
  const [page, setPage]         = useState(1);
  const [detail, setDetail]     = useState(null);

  const filtered = useMemo(() => mockAuditLogs.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.event.toLowerCase().includes(q) || e.actor.toLowerCase().includes(q) || e.entity.toLowerCase().includes(q) || e.detail.toLowerCase().includes(q);
    const matchC = !category || e.category === category;
    const matchR = !result   || e.result   === result;
    return matchQ && matchC && matchR;
  }), [search, category, result]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage  = () => setPage(1);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); resetPage(); }}
            placeholder="Search events, actors, entities…"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); resetPage(); }}
          className="h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          {AUDIT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <select
          value={result}
          onChange={e => { setResult(e.target.value); resetPage(); }}
          className="h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All results</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              {['Timestamp', 'Event', 'Actor', 'Entity', 'Result', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-small text-neutral-400">No events match your filters.</td>
              </tr>
            )}
            {paginated.map(entry => {
              const catMeta = AUDIT_CATEGORY_META[entry.category] || { bg: '#F3F4F6', text: '#374151' };
              return (
                <tr key={entry.id} className="transition-colors hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-4 py-3.5 text-caption text-neutral-500">{entry.timestamp}</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-semibold"
                      style={{ background: catMeta.bg, color: catMeta.text }}>
                      {entry.event}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-small text-neutral-900">{entry.actor}</td>
                  <td className="px-4 py-3.5 text-small text-neutral-700">{entry.entity}</td>
                  <td className="px-4 py-3.5">
                    {entry.result === 'success'
                      ? <span className="inline-flex items-center gap-1 text-caption font-semibold" style={{ color: '#13753F' }}><Check className="h-3 w-3" /> Success</span>
                      : <span className="inline-flex items-center gap-1 text-caption font-semibold" style={{ color: '#A31C12' }}><X className="h-3 w-3" /> Failed</span>
                    }
                  </td>
                  <td className="px-4 py-3.5">
                    <button onClick={() => setDetail(entry)} className="text-caption text-primary-500 hover:text-primary-700 hover:underline">
                      Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
            <p className="text-caption text-neutral-500">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} events
            </p>
            <div className="flex gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-caption text-neutral-700 hover:bg-neutral-50 disabled:opacity-40">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className="h-8 w-8 rounded-md border text-caption font-semibold transition-colors"
                  style={p === page
                    ? { borderColor: '#0C5FC5', background: '#0C5FC5', color: 'white' }
                    : { borderColor: '#E5E7EB', background: 'white', color: '#374151' }
                  }>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-caption text-neutral-700 hover:bg-neutral-50 disabled:opacity-40">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
              <h3 className="text-h4 font-bold text-neutral-900">Event detail</h3>
              <button onClick={() => setDetail(null)} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4 p-6">
              {[
                { label: 'Event ID',   value: detail.id        },
                { label: 'Timestamp',  value: detail.timestamp },
                { label: 'Event type', value: detail.event     },
                { label: 'Category',   value: detail.category  },
                { label: 'Actor',      value: detail.actor     },
                { label: 'Entity',     value: detail.entity    },
                { label: 'IP address', value: detail.ip        },
                { label: 'Result',     value: detail.result.charAt(0).toUpperCase() + detail.result.slice(1) },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-4">
                  <dt className="w-28 flex-shrink-0 text-caption text-neutral-400">{label}</dt>
                  <dd className="text-small text-neutral-900">{value}</dd>
                </div>
              ))}
              <div className="flex gap-4">
                <dt className="w-28 flex-shrink-0 text-caption text-neutral-400">Details</dt>
                <dd className="text-small text-neutral-700">{detail.detail}</dd>
              </div>
            </div>
            <div className="flex justify-end border-t border-neutral-100 px-6 py-4">
              <Button variant="outline" onClick={() => setDetail(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogTab;
