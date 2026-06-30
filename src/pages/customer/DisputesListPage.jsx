import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { getAllDisputes, ISSUE_TYPES, CASE_STATUS_LABELS } from '../../lib/mock/mockDisputes.js';

const fmtDate = d => new Date(d).toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });

const STATUS_STYLE = {
  SUBMITTED:     { bg: 'bg-blue-50',    text: 'text-blue-600'    },
  UNDER_REVIEW:  { bg: 'bg-warning-bg', text: 'text-warning-text' },
  INVESTIGATION: { bg: 'bg-warning-bg', text: 'text-warning-text' },
  RESOLVED:      { bg: 'bg-success-bg', text: 'text-success-text' },
  REJECTED:      { bg: 'bg-neutral-100', text: 'text-neutral-500' },
  CLOSED:        { bg: 'bg-neutral-100', text: 'text-neutral-500' },
};

export default function DisputesListPage() {
  const navigate = useNavigate();
  const disputes = getAllDisputes();

  const open   = disputes.filter(d => !['RESOLVED','REJECTED','CLOSED'].includes(d.status));
  const closed = disputes.filter(d =>  ['RESOLVED','REJECTED','CLOSED'].includes(d.status));

  return (
    <div className="min-h-screen pb-8" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 flex h-14 items-center bg-white border-b border-neutral-100 px-4 shadow-sm">
        <h1 className="text-h3 font-bold text-neutral-900">Claims & Disputes</h1>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {disputes.length === 0 && (
          <div className="text-center py-20">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-neutral-200" />
            <p className="text-small font-semibold text-neutral-500">No claims yet</p>
          </div>
        )}

        {open.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Open ({open.length})</p>
            {open.map(d => <DisputeCard key={d.id} d={d} navigate={navigate} />)}
          </div>
        )}

        {closed.length > 0 && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Resolved ({closed.length})</p>
            {closed.map(d => <DisputeCard key={d.id} d={d} navigate={navigate} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function DisputeCard({ d, navigate }) {
  const type   = ISSUE_TYPES[d.type]   ?? ISSUE_TYPES.DISPUTE;
  const status = STATUS_STYLE[d.status] ?? STATUS_STYLE.SUBMITTED;

  return (
    <button
      onClick={() => navigate(`/app/disputes/${d.id}`)}
      className="w-full text-left rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 hover:shadow-md transition-all active:opacity-70"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${type.bg} ${type.color}`}>{type.label}</span>
          </div>
          <p className="text-small font-bold text-neutral-900 truncate">{d.title}</p>
          <p className="text-caption text-neutral-400 font-mono">{d.orderId}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-caption font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
            {CASE_STATUS_LABELS[d.status]}
          </span>
          <ChevronRight className="h-4 w-4 text-neutral-300" />
        </div>
      </div>
      <p className="text-caption text-neutral-400">Submitted {fmtDate(d.createdAt)}</p>
    </button>
  );
}
