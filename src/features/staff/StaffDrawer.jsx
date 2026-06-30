import { useState } from 'react';
import { X, Mail, Phone, MapPin, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { STAFF_STATUS } from '../../data/mockStaff.js';
import { avatarColor, initials, roleFor } from './staffUtils.js';

const StatusBadge = ({ status }) => {
  const meta = STAFF_STATUS[status] || STAFF_STATUS.inactive;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold"
      style={{ background: meta.bg, color: meta.text }}>
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
};

const RoleBadge = ({ roleCode }) => {
  const role = roleFor(roleCode);
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold"
      style={{ background: role.bg, color: role.color }}>
      {role.name}
    </span>
  );
};

export const Avatar = ({ name, size = 'md' }) => {
  const pal = avatarColor(name);
  const sz  = size === 'lg' ? 'h-12 w-12 text-body' : 'h-8 w-8 text-caption';
  return (
    <div className={`${sz} flex flex-shrink-0 items-center justify-center rounded-full font-bold`} style={pal}>
      {initials(name)}
    </div>
  );
};

const STATUS_OPTIONS = [
  { value: 'active',     label: 'Active'     },
  { value: 'on_leave',   label: 'On Leave'   },
  { value: 'suspended',  label: 'Suspended'  },
  { value: 'terminated', label: 'Terminated', final: true },
];

const SUSPENSION_REASONS = [
  'Policy violation', 'Attendance issues', 'Performance concerns',
  'Pending investigation', 'Client complaint', 'Other',
];

const StaffDrawer = ({ staff, onClose, onStatusChange }) => {
  const [newStatus,    setNewStatus]    = useState('');
  const [reason,       setReason]       = useState('');
  const [notes,        setNotes]        = useState('');
  const [confirmText,  setConfirmText]  = useState('');
  const [saved,        setSaved]        = useState(false);
  const role          = roleFor(staff.role);
  const isFinalStatus = staff.status === 'terminated';

  const handleStatusSave = () => {
    if (!newStatus || newStatus === staff.status) return;
    if (newStatus === 'terminated' && confirmText !== 'TERMINATE') return;
    onStatusChange(staff.id, newStatus);
    setSaved(true);
  };

  const selectCls = 'h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

  return (
    <div className="fixed inset-0 z-40 flex justify-end" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-xl">
        <div className="flex items-center gap-4 border-b border-neutral-100 px-6 py-5">
          <Avatar name={staff.name} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-body font-bold text-neutral-900">{staff.name}</p>
            <p className="text-caption text-neutral-500">{staff.employeeId} · {staff.department}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {saved && (
            <Alert type="success" title="Status updated">
              {staff.name}'s status has been changed to {STAFF_STATUS[newStatus]?.label}.
            </Alert>
          )}

          <div className="flex flex-wrap gap-2">
            <RoleBadge roleCode={staff.role} />
            <StatusBadge status={staff.status} />
          </div>

          <SectionCard title="Contact">
            <div className="space-y-3 text-small">
              {[
                { icon: Mail,   label: staff.email  },
                { icon: Phone,  label: staff.phone  },
                { icon: MapPin, label: staff.outlet },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-neutral-700">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Employment">
            <dl className="grid grid-cols-2 gap-y-3 text-small">
              {[
                { term: 'Role',            val: role.name            },
                { term: 'Department',      val: staff.department     },
                { term: 'Employment type', val: staff.employmentType },
                { term: 'Start date',      val: staff.startDate      },
                { term: 'Last active',     val: staff.lastActive     },
              ].map(({ term, val }) => (
                <div key={term}>
                  <dt className="text-caption text-neutral-400">{term}</dt>
                  <dd className="mt-0.5 font-medium text-neutral-900">{val}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          {!isFinalStatus && (
            <SectionCard title="Employment status" description="Changes take effect immediately and gate system access.">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral-700">Change status to</label>
                  <select value={newStatus} onChange={e => { setNewStatus(e.target.value); setSaved(false); }} className={selectCls}>
                    <option value="">— select —</option>
                    {STATUS_OPTIONS.filter(s => s.value !== staff.status).map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {newStatus && newStatus !== 'active' && (
                  <div>
                    <label className="mb-1.5 block text-small font-medium text-neutral-700">Reason</label>
                    <select value={reason} onChange={e => setReason(e.target.value)} className={selectCls}>
                      <option value="">Select reason…</option>
                      {SUSPENSION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                )}

                {newStatus && (
                  <div>
                    <label className="mb-1.5 block text-small font-medium text-neutral-700">Notes (optional)</label>
                    <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Add context for this status change…"
                      className="w-full resize-none rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                  </div>
                )}

                {newStatus === 'terminated' && (
                  <div className="rounded-lg px-4 py-3 text-small" style={{ background: '#FDECEA', color: '#A31C12' }}>
                    <p className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" /> This action is permanent
                    </p>
                    <p className="mt-1">Termination cannot be undone. Type <strong>TERMINATE</strong> to confirm.</p>
                    <input
                      type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)}
                      placeholder="Type TERMINATE to confirm"
                      className="mt-2 w-full rounded-md border px-3 py-1.5 text-small outline-none"
                      style={{ borderColor: '#FBBCB8', background: 'white', color: '#1F2937' }}
                    />
                  </div>
                )}

                {newStatus && (
                  <Button
                    variant={newStatus === 'terminated' ? 'danger' : 'primary'}
                    className="w-full"
                    disabled={newStatus === 'terminated' && confirmText !== 'TERMINATE'}
                    onClick={handleStatusSave}
                  >
                    Update status
                  </Button>
                )}
              </div>
            </SectionCard>
          )}

          {isFinalStatus && (
            <div className="rounded-lg border border-neutral-200 px-5 py-4 text-small text-neutral-500">
              <p className="font-medium text-neutral-700">Account terminated</p>
              <p className="mt-0.5">This account has been permanently terminated and access has been revoked.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDrawer;
