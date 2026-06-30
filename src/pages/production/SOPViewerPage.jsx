import { useState } from 'react';
import { BookOpen, CheckCircle, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllSOPs } from '../../lib/mock/mockSOP.js';
import { cn } from '../../utils/classNames.js';

const LABEL = 'text-[11px] font-bold text-neutral-400 uppercase tracking-widest';
const CARD = 'rounded-lg bg-white border border-neutral-200 shadow-sm p-5';

const STAGE_COLORS = {
  INTAKE:     'bg-primary-50 text-primary-600',
  SORTING:    'bg-accent-50 text-accent-600',
  WASHING:    'bg-blue-50 text-blue-600',
  CHEMICALS:  'bg-error-bg text-error',
  QC:         'bg-success-bg text-success-text',
};

export default function SOPViewerPage() {
  const sops = getAllSOPs();
  const [activeId, setActiveId] = useState(sops[0]?.id);
  const active = sops.find(s => s.id === activeId);

  const total = active ? active.acknowledgedBy.length + active.pendingAcknowledgement.length : 0;
  const ackCount = active?.acknowledgedBy.length ?? 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={20} className="text-neutral-500" />
        <h1 className="text-xl font-bold text-neutral-900">Standard Operating Procedures</h1>
      </div>

      <div className="flex gap-6">
        {/* SOP List — 40% */}
        <div className="w-[40%] flex-shrink-0 space-y-2">
          {sops.map(sop => {
            const pendingCount = sop.pendingAcknowledgement.length;
            const acked = sop.acknowledgedBy.length;
            const tot = acked + pendingCount;
            const isActive = sop.id === activeId;
            return (
              <button
                key={sop.id}
                onClick={() => setActiveId(sop.id)}
                className={cn(
                  'w-full text-left rounded-lg border p-4 transition-all',
                  isActive ? 'border-primary-500 bg-primary-50/40 shadow-sm' : 'border-neutral-100 bg-white hover:border-neutral-200 shadow-sm'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className={cn('font-bold text-sm', isActive ? 'text-primary-700' : 'text-neutral-800')}>{sop.title}</p>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold flex-shrink-0', STAGE_COLORS[sop.stage] ?? 'bg-neutral-100 text-neutral-500')}>
                    {sop.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{sop.version}</span>
                  <span className={pendingCount > 0 ? 'text-warning-text font-medium' : 'text-success-text'}>
                    {acked}/{tot} acknowledged
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* SOP Detail — 60% */}
        <div className="flex-1 min-w-0">
          {active ? (
            <div className={cn(CARD, 'space-y-5')}>
              {/* Title row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">{active.title}</h2>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', STAGE_COLORS[active.stage] ?? 'bg-neutral-100 text-neutral-500')}>
                      {active.stage}
                    </span>
                    <span className="text-xs font-bold text-neutral-400 bg-neutral-100 rounded-full px-2.5 py-0.5">{active.version}</span>
                    <span className="text-xs text-neutral-400">Active since {active.activeFrom}</span>
                  </div>
                </div>
                <button
                  onClick={() => alert('Printing SOP: ' + active.title)}
                  className="flex-shrink-0 text-sm font-semibold text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg px-3 py-1.5 hover:bg-primary-50 transition-colors"
                >
                  Print SOP
                </button>
              </div>

              <p className="text-xs text-neutral-400 flex items-center gap-1">
                <User size={12} /> Last updated by {active.updatedBy}
              </p>

              {/* Acknowledgement Progress */}
              <div className="rounded-lg bg-neutral-50 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <p className={LABEL}>Acknowledgements</p>
                  <span className="text-sm font-bold text-neutral-700">{ackCount} of {total} staff</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                  <div className="h-full rounded-full bg-success" style={{ width: `${total > 0 ? (ackCount / total) * 100 : 0}%` }} />
                </div>

                {active.acknowledgedBy.length > 0 && (
                  <div>
                    <p className={cn(LABEL, 'mb-1.5')}>Acknowledged by</p>
                    <div className="flex flex-wrap gap-1.5">
                      {active.acknowledgedBy.map(name => (
                        <span key={name} className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-success-bg text-success-text flex items-center gap-1">
                          <CheckCircle size={10} /> {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {active.pendingAcknowledgement.length > 0 && (
                  <div>
                    <p className={cn(LABEL, 'mb-1.5')}>Pending Acknowledgement</p>
                    <div className="flex flex-wrap gap-2">
                      {active.pendingAcknowledgement.map(name => (
                        <div key={name} className="flex items-center gap-1.5">
                          <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-warning-bg text-warning-text flex items-center gap-1">
                            <Clock size={10} /> {name}
                          </span>
                          <button
                            onClick={() => alert('Acknowledged: ' + name)}
                            className="text-[11px] font-bold text-primary-600 underline hover:text-primary-800"
                          >
                            Acknowledge
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Steps */}
              <div>
                <p className={cn(LABEL, 'mb-3')}>Steps</p>
                <ol className="space-y-2">
                  {active.steps.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-[11px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-sm text-neutral-700 leading-relaxed pt-0.5">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className={cn(CARD, 'flex items-center justify-center h-48 text-neutral-400')}>
              Select an SOP to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
