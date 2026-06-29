import { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ApprovalDrawerContent from '../../features/admin/ApprovalDrawerContent.jsx';
import { mockBusinesses, REJECTION_REASONS, STATUS_META } from '../../data/mockAdminData.js';

const BIZ_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];
const bizColor = name => BIZ_PALETTE[(name?.charCodeAt(0) || 0) % BIZ_PALETTE.length];
const bizInitials = name => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};

const FILTER_TABS = [
  { key: 'all',                  label: 'All'               },
  { key: 'pending',              label: 'Pending'           },
  { key: 'resubmission',         label: 'Resubmission'      },
  { key: 'awaiting_clarification',label: 'Awaiting Response'},
  { key: 'approved',             label: 'Approved'          },
  { key: 'rejected',             label: 'Rejected'          },
];

const DRAWER_TABS = ['Overview', 'Company', 'Outlets', 'Services', 'Payment', 'Admin', 'History'];

// ─── Main page ───────────────────────────────────────────────────────────────

const ACTIONABLE = new Set(['pending', 'resubmission', 'awaiting_clarification']);

const BusinessApprovalPage = () => {
  const [businesses, setBusinesses]     = useState(mockBusinesses);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch]             = useState('');
  const [selected, setSelected]         = useState(new Set());
  const [reviewing, setReviewing]       = useState(null);
  const [drawerTab, setDrawerTab]       = useState('Overview');

  // Action form state
  const [action, setAction]             = useState('');
  const [rejectionReason, setRejection] = useState('');
  const [additionalNotes, setAdditional]= useState('');
  const [internalNotes, setInternal]    = useState('');
  const [formErrors, setFormErrors]     = useState({});
  const [toast, setToast]               = useState(null);

  // Filtered businesses
  const filtered = useMemo(() => businesses.filter(b => {
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.email.toLowerCase().includes(q);
    }
    return true;
  }), [businesses, filterStatus, search]);

  // Tab counts
  const counts = useMemo(() => {
    const c = { all: businesses.length };
    businesses.forEach(b => { c[b.status] = (c[b.status] || 0) + 1; });
    return c;
  }, [businesses]);

  const openReview = biz => {
    setReviewing(biz);
    setDrawerTab('Overview');
    setAction('');
    setRejection('');
    setAdditional('');
    setInternal('');
    setFormErrors({});
  }

  const closeDrawer = () => setReviewing(null);

  const toggleSelect = id => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const toggleAll = () => {
    setSelected(selected.size === filtered.length && filtered.length > 0
      ? new Set()
      : new Set(filtered.map(b => b.id))
    );
  }

  const applyDecision = (id, newStatus, historyEntry) => {
    setBusinesses(prev => prev.map(b => b.id !== id ? b : {
      ...b,
      status: newStatus,
      history: [...(b.history || []), historyEntry],
    }));
  }

  const handleSubmit = () => {
    const errs = {};
    if (!action) errs.action = 'Please select an action';
    if (action === 'reject' && !rejectionReason) errs.rejectionReason = 'Rejection reason is required';
    if (action === 'reject' && rejectionReason === 'Other (requires additional notes)' && !additionalNotes.trim())
      errs.additionalNotes = 'Notes are required when reason is "Other"';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }

    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    const entry = action === 'approve'
      ? { action: 'approved', date: 'Jun 28, 2026', by: 'Admin', notes: internalNotes || null }
      : { action: 'rejected', date: 'Jun 28, 2026', by: 'Admin', reason: rejectionReason, notes: additionalNotes || null };

    applyDecision(reviewing.id, newStatus, entry);
    showToast(action === 'approve' ? 'success' : 'error',
      action === 'approve'
        ? `${reviewing.name} has been approved and activated.`
        : `${reviewing.name} has been rejected.`
    );
    closeDrawer();
  }

  const handleClarification = () => {
    if (!additionalNotes.trim()) {
      setFormErrors({ additionalNotes: 'Enter your clarification message to send to the business' });
      return;
    }
    applyDecision(reviewing.id, 'awaiting_clarification', {
      action: 'clarification_requested', date: 'Jun 28, 2026', by: 'Admin', notes: additionalNotes,
    });
    showToast('info', `Clarification request sent to ${reviewing.name}.`);
    closeDrawer();
  }

  const handleBulkApprove = () => {
    const toApprove = filtered.filter(b => selected.has(b.id) && ACTIONABLE.has(b.status));
    toApprove.forEach(b => applyDecision(b.id, 'approved', {
      action: 'approved', date: 'Jun 28, 2026', by: 'Admin (bulk)', notes: null,
    }));
    showToast('success', `${toApprove.length} business(es) approved.`);
    setSelected(new Set());
  }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  const isOther = rejectionReason === 'Other (requires additional notes)';

  return (
    <div className="min-h-full" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 top-6 z-[60] w-80">
          <Alert type={toast.type}>{toast.message}</Alert>
        </div>
      )}

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-h3 font-bold text-neutral-900">Business Approvals</h1>
          <p className="mt-0.5 text-small text-neutral-500">
            {counts.pending || 0} pending · {counts.resubmission || 0} resubmission · {counts.awaiting_clarification || 0} awaiting response
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-4 flex items-center gap-0.5 border-b border-neutral-200">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => { setFilterStatus(tab.key); setSelected(new Set()); }}
            className={cn(
              '-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-small font-medium transition-colors',
              filterStatus === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            )}
          >
            {tab.label}
            {(counts[tab.key] || 0) > 0 && (
              <span className={cn('rounded-full px-1.5 py-px text-[10px] font-bold', filterStatus === tab.key ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-500')}>
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + bulk bar */}
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            placeholder="Search name, ID, or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-neutral-200 bg-white py-2 pl-9 pr-3.5 text-small placeholder:text-neutral-400 outline-none focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100 transition-all"
            style={{ borderRadius: 8 }}
          />
        </div>
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-small text-neutral-600">{selected.size} selected</span>
            <Button size="sm" onClick={handleBulkApprove}>Bulk Approve</Button>
            <button onClick={() => setSelected(new Set())} className="text-small text-neutral-500 hover:text-neutral-700 transition-colors">Clear</button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-neutral-500">Business</th>
              <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-neutral-500">Contact</th>
              <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-neutral-500">Submitted</th>
              <th className="px-4 py-3 text-caption font-semibold uppercase tracking-wide text-neutral-500">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-small text-neutral-400">
                  No businesses match your filter.
                </td>
              </tr>
            )}
            {filtered.map(biz => (
              <tr key={biz.id} className={cn('transition-colors hover:bg-neutral-50', selected.has(biz.id) && 'bg-primary-50/50')}>
                <td className="w-10 px-4 py-3.5">
                  <Checkbox checked={selected.has(biz.id)} onChange={() => toggleSelect(biz.id)} />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[12px] font-bold"
                      style={bizColor(biz.name)}
                    >
                      {bizInitials(biz.name)}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-caption text-neutral-400">{biz.id}</span>
                        {biz.resubmissionCount > 0 && (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#EAF2FC', color: '#093F84' }}>
                            Resubmission
                          </span>
                        )}
                      </div>
                      <span className="text-small font-semibold text-neutral-900">{biz.name}</span>
                      <span className="text-caption text-neutral-400">{biz.registrationType}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-small text-neutral-700">{biz.email}</span>
                    <span className="text-caption text-neutral-400">{biz.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-small text-neutral-700">{biz.submittedLabel}</span>
                    {biz.daysPending > 0 && (
                      <span className={cn('text-caption', biz.daysPending >= 5 ? 'text-error' : 'text-neutral-400')}>
                        {biz.daysPending}d pending
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5"><StatusBadge {...(STATUS_META[biz.status] || STATUS_META.pending)} /></td>
                <td className="px-4 py-3.5 text-right">
                  <Button variant="outline" size="sm" onClick={() => openReview(biz)}>Review</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dimmed backdrop */}
      {reviewing && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ background: 'rgba(15,23,42,0.40)' }}
          onClick={closeDrawer}
        />
      )}

      {/* Review drawer */}
      {reviewing && (
        <div
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white"
          style={{
            width: 720,
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            boxShadow: '-8px 0 32px -4px rgba(15,23,42,0.14), -2px 0 8px -2px rgba(15,23,42,0.08)',
          }}
        >
          {/* ── Sticky header ── */}
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-[13px] font-bold"
                style={bizColor(reviewing.name)}
              >
                {bizInitials(reviewing.name)}
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-[16px] font-bold leading-tight text-neutral-900">{reviewing.name}</h2>
                  <StatusBadge {...(STATUS_META[reviewing.status] || STATUS_META.pending)} />
                  {reviewing.resubmissionCount > 0 && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#EAF2FC', color: '#093F84' }}>
                      Resubmission #{reviewing.resubmissionCount}
                    </span>
                  )}
                </div>
                <p className="text-caption text-neutral-400">
                  <span className="font-mono">{reviewing.id}</span>
                  {' · '}Submitted {reviewing.submittedLabel}
                </p>
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Sticky tab bar ── */}
          <div className="flex shrink-0 items-center gap-0 overflow-x-auto border-b border-neutral-200 bg-white px-5">
            {DRAWER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setDrawerTab(tab)}
                className={cn(
                  '-mb-px flex-shrink-0 border-b-2 px-3.5 py-2.5 text-small font-medium transition-colors',
                  drawerTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── Scrollable area: tab content + decision forms ── */}
          <div className="min-h-0 flex-1 overflow-y-auto bg-neutral-50/60 pb-2">
            <ApprovalDrawerContent biz={reviewing} tab={drawerTab} />

            {/* Decision + forms (scrollable, above sticky footer) */}
            {ACTIONABLE.has(reviewing.status) && (
              <div className="mx-4 my-3 overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-sm">
                <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-2.5">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Decision</p>
                </div>
                <div className="space-y-5 px-5 py-5">

                  {/* Decision cards */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        value: 'approve',
                        title: 'Approve',
                        sub: 'Activate this business',
                        icon: CheckCircle2,
                        activeBorder: '#1F9D57',
                        activeBg: '#E6F6EE',
                        activeIconBg: '#1F9D57',
                        activeColor: '#13753F',
                        hoverBg: '#F4FBF7',
                      },
                      {
                        value: 'reject',
                        title: 'Reject',
                        sub: 'Decline this registration',
                        icon: XCircle,
                        activeBorder: '#D92D20',
                        activeBg: '#FEF2F2',
                        activeIconBg: '#D92D20',
                        activeColor: '#A31C12',
                        hoverBg: '#FFF7F7',
                      },
                    ].map(opt => {
                      const isActive = action === opt.value;
                      const Icon = opt.icon;
                      return (
                        <label
                          key={opt.value}
                          className="flex cursor-pointer flex-col gap-3 p-4 transition-all"
                          style={{
                            borderRadius: 10,
                            border: isActive ? `2px solid ${opt.activeBorder}` : '1.5px solid #E5E7EB',
                            background: isActive ? opt.activeBg : '#FAFAFA',
                          }}
                        >
                          <input
                            type="radio" name="action" className="sr-only"
                            value={opt.value} checked={isActive}
                            onChange={() => { setAction(opt.value); setFormErrors({}); }}
                          />
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                            style={{
                              background: isActive ? opt.activeBg : '#F3F4F6',
                              border: isActive ? `1.5px solid ${opt.activeBorder}` : '1.5px solid transparent',
                            }}
                          >
                            <Icon
                              className="h-5 w-5 transition-colors"
                              style={{ color: isActive ? opt.activeBorder : '#9CA3AF' }}
                              strokeWidth={isActive ? 2.5 : 2}
                            />
                          </div>
                          <div>
                            <p className="text-[14px] font-semibold leading-tight transition-colors"
                              style={{ color: isActive ? opt.activeColor : '#374151' }}>
                              {opt.title}
                            </p>
                            <p className="mt-0.5 text-caption text-neutral-500">{opt.sub}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {formErrors.action && <p className="text-caption text-error">{formErrors.action}</p>}

                  {/* Rejection reason */}
                  {action === 'reject' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-small font-semibold text-neutral-700">
                        Rejection reason <span className="text-error">*</span>
                      </label>
                      <select
                        className={cn('w-full appearance-none border bg-white px-3.5 py-2.5 text-small text-neutral-800 outline-none transition-all focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100', formErrors.rejectionReason ? 'border-error' : 'border-neutral-200')}
                        style={{ borderRadius: 8 }}
                        value={rejectionReason}
                        onChange={e => { setRejection(e.target.value); setFormErrors(p => ({ ...p, rejectionReason: undefined })); }}
                      >
                        <option value="">Select a reason…</option>
                        {REJECTION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      {formErrors.rejectionReason && <p className="text-caption text-error">{formErrors.rejectionReason}</p>}
                    </div>
                  )}

                  {/* Message to business */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-small font-semibold text-neutral-700">
                      Message to business{isOther && <span className="text-error ml-0.5">*</span>}
                      <span className="ml-1.5 font-normal text-neutral-400">(sent to business email)</span>
                    </label>
                    <textarea
                      rows={3} maxLength={1000}
                      placeholder={action === 'reject' ? 'Explain what the business needs to fix and resubmit…' : 'Optional message to the business…'}
                      className={cn('w-full resize-none border px-3.5 py-2.5 text-small text-neutral-800 placeholder:text-neutral-400 outline-none transition-all focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100', formErrors.additionalNotes ? 'border-error' : 'border-neutral-200 bg-white')}
                      style={{ borderRadius: 8 }}
                      value={additionalNotes}
                      onChange={e => { setAdditional(e.target.value); setFormErrors(p => ({ ...p, additionalNotes: undefined })); }}
                    />
                    <div className="flex items-center justify-between">
                      {formErrors.additionalNotes
                        ? <p className="text-caption text-error">{formErrors.additionalNotes}</p>
                        : <span />}
                      <p className="text-caption text-neutral-400">{additionalNotes.length}/1000</p>
                    </div>
                  </div>

                  {/* Internal notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-small font-semibold text-neutral-700">
                      Internal notes
                      <span className="ml-1.5 font-normal text-neutral-400">(admin only, not sent)</span>
                    </label>
                    <textarea
                      rows={3} maxLength={1000}
                      placeholder="Notes for the review team…"
                      className="w-full resize-none border border-neutral-200 bg-white px-3.5 py-2.5 text-small text-neutral-800 placeholder:text-neutral-400 outline-none transition-all focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100"
                      style={{ borderRadius: 8 }}
                      value={internalNotes}
                      onChange={e => setInternal(e.target.value)}
                    />
                    <p className="text-right text-caption text-neutral-400">{internalNotes.length}/1000</p>
                  </div>
                </div>
              </div>
            )}

            {/* Resolved notice (also scrollable) */}
            {!ACTIONABLE.has(reviewing.status) && (
              <div className="mx-4 my-3">
                <Alert type={reviewing.status === 'approved' ? 'success' : 'error'}>
                  This registration was <strong>{reviewing.status}</strong>
                  {(reviewing.approvedAt || reviewing.rejectedAt) && <> on {reviewing.approvedAt || reviewing.rejectedAt}</>}
                  {reviewing.rejectionReason && <> — <em>{reviewing.rejectionReason}</em></>}.
                </Alert>
              </div>
            )}
          </div>

          {/* ── Sticky footer ── */}
          <div className="shrink-0 border-t border-neutral-200 bg-white px-6 py-4">
            {ACTIONABLE.has(reviewing.status) ? (
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={handleClarification}>
                  Request Clarification
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={closeDrawer}>Cancel</Button>
                  <Button size="sm" onClick={handleSubmit}>Submit Decision</Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={closeDrawer}>Close</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessApprovalPage;


