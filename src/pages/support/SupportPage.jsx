import { useState } from 'react';
import {
  MessageCircle, Phone, Mail, Smartphone, Store,
  Search, Plus, ChevronRight, X, Send,
  AlertCircle, CheckCircle, Clock, User,
} from 'lucide-react';
import {
  getAllTickets,
  TICKET_STATUSES,
  TICKET_PRIORITIES,
  TICKET_CHANNELS,
  CANNED_RESPONSES,
} from '../../lib/mock/mockTickets.js';
import { cn } from '../../utils/classNames.js';

// ─── helpers ────────────────────────────────────────────────────────────────

const CHANNEL_ICONS = { CALL: Phone, WHATSAPP: MessageCircle, EMAIL: Mail, IN_APP: Smartphone, WALK_IN: Store };

function ticketAge(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 24) return hours + 'h ago';
  return Math.floor(hours / 24) + 'd ago';
}

function initials(name = '') {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

const TABS = ['OPEN', 'PENDING', 'RESOLVED', 'ALL'];

// ─── sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = TICKET_STATUSES[status] ?? TICKET_STATUSES.OPEN;
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', s.color, s.bg)}>
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const p = TICKET_PRIORITIES[priority] ?? TICKET_PRIORITIES.NORMAL;
  return (
    <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-bold', p.color, p.bg)}>
      {p.label}
    </span>
  );
}

function TicketRow({ ticket, selected, onClick }) {
  const ChannelIcon = CHANNEL_ICONS[ticket.channel] ?? MessageCircle;
  const isUrgent = ticket.priority === 'URGENT';
  const unassigned = !ticket.assignee;

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-neutral-100 transition-colors',
        'hover:bg-neutral-50',
        selected && 'bg-primary-50',
        unassigned && !selected && 'bg-neutral-50',
        isUrgent && 'border-l-4 border-l-error',
      )}
    >
      {/* priority dot */}
      <span className={cn(
        'mt-1.5 shrink-0 w-2 h-2 rounded-full',
        TICKET_PRIORITIES[ticket.priority]?.bg ?? 'bg-neutral-300',
      )} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-neutral-400">{ticket.id}</span>
          <span className="flex-1 text-sm font-semibold text-neutral-800 truncate">{ticket.subject}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5 text-[12px] text-neutral-500">
          <User size={11} />
          <span>{ticket.customerName}</span>
          <ChannelIcon size={11} />
          <span>{ticket.assignee ?? <span className="italic">Unassigned</span>}</span>
          <Clock size={11} />
          <span>{ticketAge(ticket.updatedAt)}</span>
        </div>
        {ticket.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {ticket.tags.map(tag => (
              <span key={tag} className="rounded-full bg-neutral-100 text-neutral-500 text-[10px] px-2 py-0.5">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <StatusBadge status={ticket.status} />
        <ChevronRight size={14} className="text-neutral-300" />
      </div>
    </div>
  );
}

// ─── detail panel ───────────────────────────────────────────────────────────

function TicketDetail({ ticket, onClose }) {
  const [thread, setThread] = useState(ticket.thread);
  const [notes, setNotes] = useState(ticket.internalNotes);
  const [replyText, setReplyText] = useState('');
  const [newNote, setNewNote] = useState('');
  const [showCanned, setShowCanned] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);

  function handleSend() {
    if (!replyText.trim()) return;
    setThread(prev => [...prev, {
      from: 'agent', name: 'Esi Tetteh', text: replyText.trim(),
      at: new Date().toISOString(),
    }]);
    setReplyText('');
    setShowCanned(false);
  }

  function handleAddNote() {
    if (!newNote.trim()) return;
    setNotes(prev => [...prev, newNote.trim()]);
    setNewNote('');
    setShowNoteInput(false);
  }

  function handleCanned(text) {
    setReplyText(text);
    setShowCanned(false);
  }

  const ChannelIcon = CHANNEL_ICONS[ticket.channel] ?? MessageCircle;

  return (
    <div className="flex flex-col h-full rounded-lg bg-white border border-neutral-200 shadow-sm overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-neutral-400">{ticket.id}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <p className="text-sm font-semibold text-neutral-800 mt-0.5 truncate">{ticket.subject}</p>
        </div>
        <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* customer info */}
        <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-[13px] font-bold shrink-0">
              {initials(ticket.customerName)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-800">{ticket.customerName}</p>
              <p className="text-[12px] text-neutral-500">{ticket.customerPhone} · {ticket.customerEmail}</p>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-[12px] text-neutral-500 flex-wrap">
            {ticket.orderId && (
              <span>
                Order:{' '}
                <a href="#" className="text-primary-600 font-semibold hover:underline">{ticket.orderId}</a>
              </span>
            )}
            {ticket.disputeId && (
              <span>
                Dispute:{' '}
                <a href="#" className="text-error font-semibold hover:underline">{ticket.disputeId}</a>
              </span>
            )}
            <span className="flex items-center gap-1">
              <ChannelIcon size={11} /> {TICKET_CHANNELS[ticket.channel]?.label}
            </span>
          </div>
        </div>

        {/* status / assignee strip */}
        <div className="px-5 py-3 border-b border-neutral-100 flex flex-wrap gap-4 text-[12px]">
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.status} />
              <button
                onClick={() => {
                  const next = prompt('Set status (OPEN / PENDING / RESOLVED / CLOSED):');
                  if (next && TICKET_STATUSES[next.toUpperCase()]) alert('Status updated to: ' + next.toUpperCase());
                }}
                className="text-[11px] text-primary-600 font-semibold hover:underline"
              >
                Change
              </button>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Priority</p>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={ticket.priority} />
              <button
                onClick={() => {
                  const next = prompt('Set priority (URGENT / HIGH / NORMAL / LOW):');
                  if (next && TICKET_PRIORITIES[next.toUpperCase()]) alert('Priority updated to: ' + next.toUpperCase());
                }}
                className="text-[11px] text-primary-600 font-semibold hover:underline"
              >
                Change
              </button>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Assignee</p>
            <div className="flex items-center gap-2">
              <span className={cn('text-sm font-medium', ticket.assignee ? 'text-neutral-700' : 'italic text-neutral-400')}>
                {ticket.assignee ?? 'Unassigned'}
              </span>
              <button
                onClick={() => alert('Assigned to you')}
                className="text-[11px] text-primary-600 font-semibold hover:underline"
              >
                Assign to me
              </button>
            </div>
          </div>
        </div>

        {/* thread */}
        <div className="px-5 py-3 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Conversation</p>
          {thread.map((msg, i) => {
            const isCustomer = msg.from === 'customer';
            return (
              <div key={i} className={cn('flex', isCustomer ? 'justify-end' : 'justify-start')}>
                <div className={cn(
                  'max-w-[80%] px-4 py-2.5 text-[13px] text-neutral-800',
                  isCustomer
                    ? 'bg-neutral-100 rounded-2xl rounded-tr-sm'
                    : 'bg-primary-50 rounded-2xl rounded-tl-sm',
                )}>
                  <p className="text-[10px] font-bold text-neutral-400 mb-0.5">
                    {msg.name} · {new Date(msg.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p>{msg.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* canned responses */}
        <div className="px-5 pb-2">
          <button
            onClick={() => setShowCanned(v => !v)}
            className="text-[12px] text-primary-600 font-semibold hover:underline"
          >
            {showCanned ? 'Hide' : 'Show'} Canned Responses
          </button>
          {showCanned && (
            <ul className="mt-2 space-y-1">
              {CANNED_RESPONSES.map((r, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleCanned(r)}
                    className="w-full text-left text-[12px] text-neutral-600 bg-neutral-50 hover:bg-primary-50 rounded-lg px-3 py-2 transition-colors"
                  >
                    {r}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* internal notes */}
        <div className="px-5 pb-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-2">Internal Notes</p>
          <div className="bg-warning-bg/30 rounded-lg p-3 space-y-1">
            {notes.length === 0 && (
              <p className="text-[12px] text-neutral-400 italic">No internal notes yet.</p>
            )}
            {notes.map((note, i) => (
              <p key={i} className="text-[12px] text-neutral-700">— {note}</p>
            ))}
            {showNoteInput ? (
              <div className="mt-2 flex gap-2">
                <input
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Write a note…"
                  className="flex-1 text-[12px] border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button
                  onClick={handleAddNote}
                  className="text-[12px] bg-primary-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-primary-700"
                >
                  Save
                </button>
                <button onClick={() => setShowNoteInput(false)} className="text-[12px] text-neutral-400 hover:text-neutral-600">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowNoteInput(true)}
                className="text-[11px] text-primary-600 font-semibold hover:underline mt-1"
              >
                + Add note
              </button>
            )}
          </div>
        </div>
      </div>

      {/* reply bar */}
      <div className="px-5 py-3 border-t border-neutral-100 bg-white flex gap-3 items-end">
        <textarea
          rows={2}
          value={replyText}
          onChange={e => setReplyText(e.target.value)}
          placeholder="Type a reply…"
          className="flex-1 resize-none text-[13px] border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <button
          onClick={handleSend}
          disabled={!replyText.trim()}
          className="p-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 transition-colors"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── create ticket modal ─────────────────────────────────────────────────────

function CreateTicketModal({ onClose }) {
  const [form, setForm] = useState({
    customerName: '', customerPhone: '', subject: '', orderId: '',
    channel: 'CALL', priority: 'NORMAL', description: '', assignee: 'Esi Tetteh',
  });

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })); }

  function handleSubmit(e) {
    e.preventDefault();
    alert('Ticket created: ' + form.subject);
    onClose();
  }

  const inputCls = 'w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-base font-bold text-neutral-800">New Ticket</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-3 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Customer Name</label>
              <input required value={form.customerName} onChange={e => set('customerName', e.target.value)} className={cn(inputCls, 'mt-1')} placeholder="Full name" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Phone</label>
              <input type="tel" value={form.customerPhone} onChange={e => set('customerPhone', e.target.value)} className={cn(inputCls, 'mt-1')} placeholder="+233…" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Subject</label>
            <input required value={form.subject} onChange={e => set('subject', e.target.value)} className={cn(inputCls, 'mt-1')} placeholder="Brief description of issue" />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Order ID (optional)</label>
            <input value={form.orderId} onChange={e => set('orderId', e.target.value)} className={cn(inputCls, 'mt-1')} placeholder="ORD-2026-…" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Channel</label>
              <select value={form.channel} onChange={e => set('channel', e.target.value)} className={cn(inputCls, 'mt-1 bg-white')}>
                <option value="CALL">Phone Call</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
                <option value="IN_APP">In-App</option>
                <option value="WALK_IN">Walk-In</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)} className={cn(inputCls, 'mt-1 bg-white')}>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className={cn(inputCls, 'mt-1 resize-none')} placeholder="Full details of the issue…" />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Assign to</label>
            <select value={form.assignee} onChange={e => set('assignee', e.target.value)} className={cn(inputCls, 'mt-1 bg-white')}>
              <option value="Esi Tetteh">Esi Tetteh</option>
              <option value="">Unassigned</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-neutral-600 rounded-lg hover:bg-neutral-100">Cancel</button>
            <button type="submit" className="px-5 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function SupportPage() {
  const allTickets = getAllTickets();

  const [activeTab, setActiveTab]         = useState('OPEN');
  const [search, setSearch]               = useState('');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const counts = {
    OPEN:     allTickets.filter(t => t.status === 'OPEN').length,
    PENDING:  allTickets.filter(t => t.status === 'PENDING').length,
    RESOLVED: allTickets.filter(t => t.status === 'RESOLVED').length,
    ALL:      allTickets.length,
  };

  const tabSource = activeTab === 'ALL' ? allTickets : allTickets.filter(t => t.status === activeTab);

  const filtered = tabSource.filter(t => {
    const matchSearch = !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchChannel = channelFilter === 'ALL' || t.channel === channelFilter;
    const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchSearch && matchChannel && matchPriority;
  });

  function selectTicket(ticket) {
    setSelectedTicket(ticket);
  }

  const openCount = counts.OPEN;

  return (
    <div className="flex flex-col h-full gap-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-neutral-800">Customer Support</h1>
          {openCount > 0 && (
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold bg-primary-50 text-primary-700">
              {openCount} open
            </span>
          )}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={15} /> New Ticket
        </button>
      </div>

      {/* tabs */}
      <div className="flex gap-1 border-b border-neutral-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors',
              activeTab === tab
                ? 'bg-white border border-b-white border-neutral-200 text-primary-700 -mb-px'
                : 'text-neutral-500 hover:text-neutral-700',
            )}
          >
            {tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by subject or customer…"
            className="w-full pl-8 pr-3 py-2 text-sm border border-neutral-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <select
          value={channelFilter}
          onChange={e => setChannelFilter(e.target.value)}
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="ALL">All Channels</option>
          <option value="CALL">Phone</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
          <option value="IN_APP">In-App</option>
        </select>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="border border-neutral-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
        >
          <option value="ALL">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="NORMAL">Normal</option>
        </select>
      </div>

      {/* list + detail */}
      <div className="flex gap-5 flex-1 min-h-0">
        {/* ticket list */}
        <div className={cn(
          'rounded-lg bg-white border border-neutral-200 shadow-sm overflow-y-auto',
          selectedTicket ? 'w-[45%]' : 'w-[55%]',
        )}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-neutral-400">
              <AlertCircle size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No tickets match your filters.</p>
            </div>
          ) : (
            filtered.map(ticket => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                selected={selectedTicket?.id === ticket.id}
                onClick={() => selectTicket(ticket)}
              />
            ))
          )}
        </div>

        {/* detail panel */}
        {selectedTicket ? (
          <div className="flex-1 min-w-0 overflow-hidden">
            <TicketDetail
              key={selectedTicket.id}
              ticket={selectedTicket}
              onClose={() => setSelectedTicket(null)}
            />
          </div>
        ) : (
          <div className="flex-1 rounded-lg bg-white border border-neutral-200 shadow-sm flex flex-col items-center justify-center gap-2 text-neutral-400 min-h-[300px]">
            <MessageCircle size={40} className="opacity-20" />
            <p className="text-sm font-semibold text-neutral-500">Select a ticket to view</p>
            <p className="text-xs text-neutral-400">{filtered.length} ticket{filtered.length !== 1 ? 's' : ''} in this view</p>
          </div>
        )}
      </div>

      {/* create modal */}
      {showCreateModal && <CreateTicketModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
