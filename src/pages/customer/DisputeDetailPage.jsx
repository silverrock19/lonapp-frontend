import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Send, Package } from 'lucide-react';
import { getDispute, ISSUE_TYPES, CASE_STATUS_LABELS } from '../../lib/mock/mockDisputes.js';
import EmptyState from '../../components/ui/EmptyState.jsx';

const fmtTime = d => new Date(d).toLocaleString('en-GH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_STYLE = {
  SUBMITTED:     { bg: 'bg-blue-50',    text: 'text-blue-600'    },
  UNDER_REVIEW:  { bg: 'bg-warning-bg', text: 'text-warning-text' },
  INVESTIGATION: { bg: 'bg-warning-bg', text: 'text-warning-text' },
  RESOLVED:      { bg: 'bg-success-bg', text: 'text-success-text' },
  REJECTED:      { bg: 'bg-neutral-100', text: 'text-neutral-500' },
};

export default function DisputeDetailPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const dispute  = getDispute(id);
  const [msg, setMsg]         = useState('');
  const [messages, setMessages] = useState(dispute?.messages ?? []);

  if (!dispute) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center" style={{ background: '#FAFAF8' }}>
        <EmptyState icon={Package} title="Claim not found" action={
          <button onClick={() => navigate('/app/disputes')} className="text-accent-600 text-small font-semibold">Back to Claims</button>
        } />
      </div>
    );
  }

  const type   = ISSUE_TYPES[dispute.type]  ?? ISSUE_TYPES.DISPUTE;
  const status = STATUS_STYLE[dispute.status] ?? STATUS_STYLE.SUBMITTED;
  const isOpen = !['RESOLVED','REJECTED','CLOSED'].includes(dispute.status);

  function sendMessage() {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { from: 'customer', text: msg.trim(), at: new Date().toISOString() }]);
    setMsg('');
  }

  return (
    <div className="flex flex-col min-h-screen pb-4" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-14 items-center gap-3 bg-white border-b border-neutral-100 px-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-small font-bold text-neutral-900 truncate">{dispute.title}</p>
          <p className="text-caption text-neutral-400 font-mono">{dispute.orderId}</p>
        </div>
        <span className={`text-caption font-semibold px-2.5 py-0.5 rounded-full ${status.bg} ${status.text}`}>
          {CASE_STATUS_LABELS[dispute.status]}
        </span>
      </div>

      <div className="px-4 pt-4 space-y-3 flex-1">
        {/* Type badge */}
        <span className={`inline-block text-caption font-semibold px-2.5 py-1 rounded-full ${type.bg} ${type.color}`}>{type.label}</span>

        {/* Timeline */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Case Timeline</p>
          <div className="relative pl-5 space-y-4">
            {dispute.timeline.map((event, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-5 top-1.5 h-2 w-2 rounded-full bg-accent-500" />
                {i < dispute.timeline.length - 1 && (
                  <div className="absolute -left-[17px] top-3 bottom-[-12px] w-px bg-neutral-200" />
                )}
                <p className="text-small font-semibold text-neutral-800">{event.label}</p>
                <p className="text-caption text-neutral-400">{fmtTime(event.at)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Description</p>
          <p className="text-small text-neutral-700 leading-relaxed">{dispute.description}</p>
          {dispute.affectedItems.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <p className="text-caption text-neutral-400 mb-1">Affected items</p>
              {dispute.affectedItems.map(it => (
                <span key={it} className="inline-block text-caption font-semibold text-neutral-700 bg-neutral-100 rounded-full px-2.5 py-0.5 mr-1.5 mb-1">{it}</span>
              ))}
            </div>
          )}
          {dispute.desiredResolution && (
            <div className="mt-3 pt-3 border-t border-neutral-100">
              <p className="text-caption text-neutral-400">Preferred resolution</p>
              <p className="text-small font-semibold text-neutral-700">{dispute.desiredResolution}</p>
            </div>
          )}
        </div>

        {/* Resolution note */}
        {dispute.resolutionNote && (
          <div className="rounded-2xl bg-success-bg border border-success-text/20 p-4">
            <p className="text-[11px] font-bold text-success-text uppercase tracking-widest mb-1">Resolution</p>
            <p className="text-small text-success-text">{dispute.resolutionNote}</p>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 pt-4 pb-2">
              <MessageCircle className="h-4 w-4 text-neutral-400" />
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Messages</p>
            </div>
            <div className="px-4 pb-4 space-y-3">
              {messages.map((m, i) => {
                const isMe = m.from === 'customer';
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-small ${isMe ? 'bg-accent-500 text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                      {m.text}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5 px-1">{fmtTime(m.at)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Reply input */}
        {isOpen && (
          <div className="flex gap-2 pb-2">
            <input
              type="text"
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Add a message…"
              className="flex-1 rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-small text-neutral-700 outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-100 placeholder:text-neutral-400"
            />
            <button onClick={sendMessage} disabled={!msg.trim()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-white disabled:opacity-40 hover:bg-accent-600 transition-colors">
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
