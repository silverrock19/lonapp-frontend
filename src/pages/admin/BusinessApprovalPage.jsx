import { useState, useMemo } from 'react';
import { Search, X, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { mockBusinesses, REJECTION_REASONS, STATUS_META } from '../../data/mockAdminData.js';

const BIZ_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];
function bizColor(name) { return BIZ_PALETTE[(name?.charCodeAt(0) || 0) % BIZ_PALETTE.length]; }
function bizInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const FILTER_TABS = [
  { key: 'all',                  label: 'All'               },
  { key: 'pending',              label: 'Pending'           },
  { key: 'resubmission',         label: 'Resubmission'      },
  { key: 'awaiting_clarification',label: 'Awaiting Response'},
  { key: 'approved',             label: 'Approved'          },
  { key: 'rejected',             label: 'Rejected'          },
];

const DRAWER_TABS = ['Overview', 'Company', 'Outlets', 'Services', 'Payment', 'Admin', 'History'];

function StatusBadge({ status }) {
  const { label, dot, bg, text } = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ background: bg, color: text }}>
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: dot }} />
      {label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div className="border-b border-neutral-100 px-6 py-5 last:border-b-0">
      {title && <p className="mb-3 text-caption font-semibold uppercase tracking-wide text-neutral-400">{title}</p>}
      {children}
    </div>
  );
}

function Field({ label, value, mono }) {
  return (
    <div>
      <p className="text-caption text-neutral-400">{label}</p>
      <p className={cn('mt-0.5 text-small text-neutral-800', mono && 'font-mono')}>{value || '—'}</p>
    </div>
  );
}

// ─── Drawer tab panels ──────────────────────────────────────────────────────

function TabOverview({ biz }) {
  return (
    <>
      {biz.previousRejection && (
        <Section>
          <Alert type="warning" title="Previously Rejected">
            Rejected {biz.previousRejection.date}: <em>{biz.previousRejection.reason}</em>.{' '}
            {biz.previousRejection.notes && <span>"{biz.previousRejection.notes}"</span>}
          </Alert>
        </Section>
      )}
      {biz.clarificationQuestion && (
        <Section>
          <Alert type="info" title="Awaiting Clarification">
            Sent {biz.clarificationSent}: "{biz.clarificationQuestion}"
          </Alert>
        </Section>
      )}
      <Section title="Quick Summary">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Business Name"       value={biz.name}               />
          <Field label="Registration Type"   value={biz.registrationType}   />
          <Field label="Country"             value={biz.country}            />
          <Field label="Currency"            value={biz.currency}           />
          <Field label="Business Email"      value={biz.email}              />
          <Field label="Phone Number"        value={biz.phone}              />
          <div className="col-span-2"><Field label="Physical Address" value={biz.address} /></div>
          <Field label="GPS / Location"      value={biz.gps}                />
        </div>
      </Section>
      <Section title="Submission Checklist">
        <div className="space-y-2">
          {[
            ['Registration type selected',       true                          ],
            ['Registration number provided',     !!(biz.registrationNumber)    ],
            ['Registration document uploaded',   !!(biz.registrationDoc)       ],
            ['Business logo uploaded',           !!(biz.logo)                  ],
            ['At least one outlet added',        biz.outlets.length > 0        ],
            ['Services configured',              biz.services.businessTypes.length > 0],
            ['Payment method added',             biz.payment.methods.length > 0],
            ['Admin account created',            !!(biz.admin.email)           ],
          ].map(([label, done]) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className={done ? 'text-success' : 'text-neutral-300'}>
                {done
                  ? <CheckCircle2 className="h-4 w-4" />
                  : <XCircle      className="h-4 w-4" />
                }
              </div>
              <span className={cn('text-small', done ? 'text-neutral-700' : 'text-neutral-400')}>{label}</span>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function TabCompany({ biz }) {
  return (
    <Section title="Company Details">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Company Name"        value={biz.name}               />
        <Field label="Registration Type"   value={biz.registrationType}   />
        <Field label="Country"             value={biz.country}            />
        <Field label="Currency"            value={biz.currency}           />
        <Field label="Business Email"      value={biz.email}              />
        <Field label="Phone"               value={biz.phone}              />
        <Field label="WhatsApp"            value={biz.whatsapp}           />
        <Field label="GPS Code"            value={biz.gps}                />
        <div className="col-span-2"><Field label="Physical Address" value={biz.address} /></div>
        <Field label="Registration Number" value={biz.registrationNumber} mono />
        <div>
          <p className="text-caption text-neutral-400">Registration Document</p>
          {biz.registrationDoc
            ? <a href="#" className="mt-0.5 inline-flex items-center gap-1 text-small text-primary-600 hover:underline">
                <FileText className="h-3.5 w-3.5" />{biz.registrationDoc}
              </a>
            : <p className="mt-0.5 text-small text-neutral-300">Not uploaded</p>}
        </div>
        <div>
          <p className="text-caption text-neutral-400">Business Logo</p>
          {biz.logo
            ? <a href="#" className="mt-0.5 inline-flex items-center gap-1 text-small text-primary-600 hover:underline">
                <FileText className="h-3.5 w-3.5" />{biz.logo}
              </a>
            : <p className="mt-0.5 text-small text-neutral-300">Not uploaded</p>}
        </div>
      </div>
    </Section>
  );
}

function TabOutlets({ biz }) {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <>
      {biz.outlets.map((o, i) => (
        <Section key={o.id} title={`Outlet ${i + 1}${o.doublesAsFactory ? ' (+ Factory)' : ''}`}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Field label="Name"              value={o.name}             />
            <Field label="Abbreviation"      value={o.abbrev}  mono     />
            <div className="col-span-2"><Field label="Address" value={o.address} /></div>
            <Field label="Phone"             value={o.phone}            />
            <Field label="Doubles as Factory" value={o.doublesAsFactory ? 'Yes' : 'No'} />
          </div>
          <p className="text-caption text-neutral-400 mb-2">Operating Hours</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAYS.map(d => (
              <div key={d} className="flex flex-col items-center">
                <span className="text-caption font-semibold text-neutral-500 mb-1">{d}</span>
                {o.hours[d] === 'Closed'
                  ? <span className="text-[10px] text-neutral-300">Closed</span>
                  : <span className="text-[10px] text-neutral-700 leading-tight whitespace-pre-wrap">
                      {(o.hours[d] || '').replace('–', '\n')}
                    </span>
                }
              </div>
            ))}
          </div>
        </Section>
      ))}
      {biz.factories.filter(f => !f.doublesAsOutlet).map((f, i) => (
        <Section key={f.id} title={`Factory ${i + 1}`}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name"    value={f.name} />
            <Field label="GPS"     value={f.gps}  mono />
            <div className="col-span-2"><Field label="Address" value={f.address} /></div>
          </div>
        </Section>
      ))}
      {biz.outlets.length === 0 && biz.factories.length === 0 && (
        <Section><p className="text-small text-neutral-400">No outlets or factories added.</p></Section>
      )}
    </>
  );
}

function TabServices({ biz }) {
  const s = biz.services;
  return (
    <>
      <Section title="Business Type">
        <div className="flex flex-wrap gap-2">
          {s.businessTypes.map(t => (
            <span key={t} className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-small font-semibold text-primary-700">{t}</span>
          ))}
        </div>
      </Section>
      {s.retailServices.length > 0 && (
        <Section title="Retail Services">
          <div className="flex flex-wrap gap-2">
            {s.retailServices.map(sv => (
              <span key={sv} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-small text-neutral-700">{sv}</span>
            ))}
          </div>
        </Section>
      )}
      {s.commercialServices.length > 0 && (
        <Section title="Commercial Services">
          <div className="flex flex-wrap gap-2">
            {s.commercialServices.map(sv => (
              <span key={sv} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-small text-neutral-700">{sv}</span>
            ))}
          </div>
        </Section>
      )}
      <Section title="Turnaround Time">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Standard Turnaround"  value={`${s.standardDuration} ${s.standardUnit}`}                   />
          <Field label="Express Enabled"       value={s.expressEnabled ? 'Yes' : 'No'}                             />
          {s.expressEnabled && <>
            <Field label="Express Turnaround" value={`${s.expressDuration} ${s.expressUnit}`}                     />
            <Field label="Express Surcharge"  value={s.expressSurcharge ? `${s.expressSurcharge}%` : '—'}         />
          </>}
        </div>
      </Section>
    </>
  );
}

function TabPayment({ biz }) {
  return (
    <>
      {biz.payment.methods.map((m, i) => (
        <Section key={i} title={m.type === 'bank' ? `Bank Transfer ${i + 1}` : `Mobile Money ${i + 1}`}>
          <div className="grid grid-cols-2 gap-4">
            {m.type === 'bank' ? <>
              <Field label="Bank Name"       value={m.bankName}    />
              <Field label="Account Name"    value={m.accountName} />
              <Field label="Account Number"  value={m.accountNumber} mono />
              <Field label="Branch"          value={m.branch}      />
              <Field label="Account Type"    value={m.accountType} />
            </> : <>
              <Field label="Provider"     value={m.provider}    />
              <Field label="Account Name" value={m.accountName} />
              <Field label="Phone Number" value={m.phone} mono  />
            </>}
          </div>
        </Section>
      ))}
      <Section title="Cash Payments">
        <Field label="Accept Cash" value={biz.payment.cashEnabled ? 'Yes — cash accepted at outlets' : 'No'} />
      </Section>
    </>
  );
}

function TabAdmin({ biz }) {
  const a = biz.admin;
  return (
    <Section title="Admin Account">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name"  value={`${a.title} ${a.firstName} ${a.lastName}`} />
        <Field label="Role"       value={a.role}   />
        <Field label="Email"      value={a.email}  />
        <Field label="Phone"      value={a.phone}  />
        <Field label="ID Type"    value={a.idType} />
        <div>
          <p className="text-caption text-neutral-400">ID Document</p>
          {a.idDoc
            ? <a href="#" className="mt-0.5 inline-flex items-center gap-1 text-small text-primary-600 hover:underline">
                <FileText className="h-3.5 w-3.5" />{a.idDoc}
              </a>
            : <p className="mt-0.5 text-small text-neutral-300">Not uploaded</p>}
        </div>
      </div>
    </Section>
  );
}

const HISTORY_COLORS = {
  approved:                { dot: 'bg-success',       label: 'Approved'                },
  rejected:                { dot: 'bg-error',         label: 'Rejected'                },
  resubmitted:             { dot: 'bg-primary-400',   label: 'Resubmitted'             },
  clarification_requested: { dot: 'bg-primary-400',   label: 'Clarification Requested' },
};

function TabHistory({ biz }) {
  const history = biz.history || [];
  if (!history.length) return <Section><p className="text-small text-neutral-400">No history yet.</p></Section>;
  return (
    <Section>
      <div className="relative pl-5">
        <div className="absolute left-[7px] top-0 bottom-0 w-px bg-neutral-100" />
        <div className="space-y-5">
          {history.map((h, i) => {
            const cfg = HISTORY_COLORS[h.action] || { dot: 'bg-neutral-300', label: h.action };
            return (
              <div key={i} className="relative">
                <div className={cn('absolute top-1 h-3 w-3 rounded-full border-2 border-white', cfg.dot)} style={{ left: -19 }} />
                <p className="text-small font-semibold text-neutral-800">{cfg.label}</p>
                <p className="text-caption text-neutral-400">{h.date} · {h.by}</p>
                {h.reason && <p className="mt-1 text-small text-neutral-600">Reason: {h.reason}</p>}
                {h.notes  && <p className="mt-0.5 text-small text-neutral-500 italic">"{h.notes}"</p>}
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function DrawerContent({ biz, tab }) {
  switch (tab) {
    case 'Overview':  return <TabOverview  biz={biz} />;
    case 'Company':   return <TabCompany   biz={biz} />;
    case 'Outlets':   return <TabOutlets   biz={biz} />;
    case 'Services':  return <TabServices  biz={biz} />;
    case 'Payment':   return <TabPayment   biz={biz} />;
    case 'Admin':     return <TabAdmin     biz={biz} />;
    case 'History':   return <TabHistory   biz={biz} />;
    default:          return null;
  }
}

// ─── Checkbox ────────────────────────────────────────────────────────────────

function Checkbox({ checked, onChange }) {
  return (
    <button onClick={onChange} className="flex items-center justify-center text-neutral-400 hover:text-neutral-700">
      <div className={cn('flex h-4 w-4 items-center justify-center border', checked ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white')} style={{ borderRadius: 2 }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

const ACTIONABLE = new Set(['pending', 'resubmission', 'awaiting_clarification']);

export default function BusinessApprovalPage() {
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

  function openReview(biz) {
    setReviewing(biz);
    setDrawerTab('Overview');
    setAction('');
    setRejection('');
    setAdditional('');
    setInternal('');
    setFormErrors({});
  }

  function closeDrawer() { setReviewing(null); }

  function toggleSelect(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(selected.size === filtered.length && filtered.length > 0
      ? new Set()
      : new Set(filtered.map(b => b.id))
    );
  }

  function applyDecision(id, newStatus, historyEntry) {
    setBusinesses(prev => prev.map(b => b.id !== id ? b : {
      ...b,
      status: newStatus,
      history: [...(b.history || []), historyEntry],
    }));
  }

  function handleSubmit() {
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

  function handleClarification() {
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

  function handleBulkApprove() {
    const toApprove = filtered.filter(b => selected.has(b.id) && ACTIONABLE.has(b.status));
    toApprove.forEach(b => applyDecision(b.id, 'approved', {
      action: 'approved', date: 'Jun 28, 2026', by: 'Admin (bulk)', notes: null,
    }));
    showToast('success', `${toApprove.length} business(es) approved.`);
    setSelected(new Set());
  }

  function showToast(type, message) {
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
                <td className="px-4 py-3.5"><StatusBadge status={biz.status} /></td>
                <td className="px-4 py-3.5 text-right">
                  <Button variant="outline" size="sm" onClick={() => openReview(biz)}>Review</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Backdrop */}
      {reviewing && (
        <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.22)' }} onClick={closeDrawer} />
      )}

      {/* Review drawer */}
      {reviewing && (
        <div
          className="fixed right-0 top-0 bottom-0 z-50 flex flex-col bg-white shadow-2xl"
          style={{ width: 680, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
          {/* Drawer header */}
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200 px-6 py-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <StatusBadge status={reviewing.status} />
                {reviewing.resubmissionCount > 0 && (
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#EAF2FC', color: '#093F84' }}>
                    Resubmission #{reviewing.resubmissionCount}
                  </span>
                )}
              </div>
              <h2 className="text-h4 font-bold text-neutral-900">{reviewing.name}</h2>
              <p className="text-caption text-neutral-500">{reviewing.id} · Submitted {reviewing.submittedLabel}</p>
            </div>
            <button
              onClick={closeDrawer}
              className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer tab nav */}
          <div className="flex shrink-0 items-center overflow-x-auto border-b border-neutral-200 px-6">
            {DRAWER_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setDrawerTab(tab)}
                className={cn(
                  '-mb-px flex-shrink-0 border-b-2 px-3 py-2.5 text-small font-medium transition-colors',
                  drawerTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-800'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Drawer scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <DrawerContent biz={reviewing} tab={drawerTab} />
          </div>

          {/* Action panel — only for actionable statuses */}
          {ACTIONABLE.has(reviewing.status) && (
            <div className="shrink-0 space-y-4 border-t border-neutral-200 bg-neutral-50 px-6 py-5">
              <p className="text-small font-semibold text-neutral-700">Decision</p>

              {/* Action radio cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: 'approve', title: 'Approve', sub: 'Activate this business',
                    icon: CheckCircle2,
                    activeBorder: '#1F9D57', activeBg: '#E6F6EE', activeColor: '#13753F',
                  },
                  {
                    value: 'reject', title: 'Reject', sub: 'Decline this registration',
                    icon: XCircle,
                    activeBorder: '#D92D20', activeBg: '#FDECEA', activeColor: '#A31C12',
                  },
                ].map(opt => {
                  const isActive = action === opt.value;
                  const Icon = opt.icon;
                  return (
                    <label
                      key={opt.value}
                      className="flex cursor-pointer flex-col gap-2 border p-3.5 transition-all"
                      style={{
                        borderRadius: 10,
                        borderColor: isActive ? opt.activeBorder : '#E5E7EB',
                        background: isActive ? opt.activeBg : '#fff',
                      }}
                    >
                      <input type="radio" name="action" className="sr-only" value={opt.value} checked={isActive}
                        onChange={() => { setAction(opt.value); setFormErrors({}); }} />
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isActive ? opt.activeBorder : '#D1D5DB' }}
                      />
                      <div>
                        <p className="text-small font-semibold" style={{ color: isActive ? opt.activeColor : '#374151' }}>{opt.title}</p>
                        <p className="text-caption text-neutral-500">{opt.sub}</p>
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
                    className={cn('w-full appearance-none border bg-white px-3.5 py-2 text-small text-neutral-800 outline-none transition-all focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100', formErrors.rejectionReason ? 'border-error' : 'border-neutral-200')}
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

              {/* Additional notes (visible to business) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-small font-semibold text-neutral-700">
                  Message to business{isOther && <span className="text-error ml-0.5">*</span>}
                  <span className="ml-1 font-normal text-neutral-400">(sent to business email)</span>
                </label>
                <textarea
                  rows={2} maxLength={1000}
                  placeholder={action === 'reject' ? 'Explain what the business needs to fix and resubmit…' : 'Optional message to the business…'}
                  className={cn('w-full resize-none border px-3.5 py-2 text-small text-neutral-800 placeholder:text-neutral-400 outline-none transition-all focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100', formErrors.additionalNotes ? 'border-error' : 'border-neutral-200 bg-white')}
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
                  <span className="ml-1 font-normal text-neutral-400">(admin only, not sent)</span>
                </label>
                <textarea
                  rows={2} maxLength={1000}
                  placeholder="Notes for the review team…"
                  className="w-full resize-none border border-neutral-200 bg-white px-3.5 py-2 text-small text-neutral-800 placeholder:text-neutral-400 outline-none transition-all focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100"
                  style={{ borderRadius: 8 }}
                  value={internalNotes}
                  onChange={e => setInternal(e.target.value)}
                />
                <p className="text-right text-caption text-neutral-400">{internalNotes.length}/1000</p>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
                <Button variant="outline" size="sm" onClick={handleClarification}>Request Clarification</Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={closeDrawer}>Cancel</Button>
                  <Button size="sm" onClick={handleSubmit}>Submit Decision</Button>
                </div>
              </div>
            </div>
          )}

          {/* Read-only footer for resolved businesses */}
          {!ACTIONABLE.has(reviewing.status) && (
            <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-6 py-4">
              <Alert type={reviewing.status === 'approved' ? 'success' : 'error'}>
                This registration was <strong>{reviewing.status}</strong>
                {(reviewing.approvedAt || reviewing.rejectedAt) && <> on {reviewing.approvedAt || reviewing.rejectedAt}</>}
                {reviewing.rejectionReason && <> — <em>{reviewing.rejectionReason}</em></>}.
              </Alert>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
