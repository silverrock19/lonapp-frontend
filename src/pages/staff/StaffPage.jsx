import { useState, useRef } from 'react';
import {
  Users, ShieldCheck, Plus, Search, X, ChevronDown,
  MoreHorizontal, Mail, Phone, MapPin, Calendar, Briefcase,
  AlertTriangle, CheckCircle2, Info, Send, Upload, Download, FileUp,
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import {
  ROLES, STAFF_STATUS, RBAC_FEATURES, PERMISSION_CODES, mockStaff,
} from '../../data/mockStaff.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];

function avatarColor(name) {
  return AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];
}
function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}
function roleFor(code) {
  return ROLES.find(r => r.code === code) || { name: code, color: '#6B7280', bg: '#F3F4F6' };
}

// ─── Bulk import helpers (US-0030) ───────────────────────────────────────────

function validateImportRow(row) {
  const errors = [];
  if (!row.name?.trim()) errors.push('Name required');
  if (!row.email?.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(row.email))
    errors.push('Valid email required');
  if (!row.role?.trim()) errors.push('Role required');
  else if (!ROLES.find(r => r.code === row.role.trim()))
    errors.push(`Unknown role "${row.role}"`);
  return errors;
}

function parseCSVText(text) {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1)
    .filter(l => l.trim())
    .map((line, i) => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = { _lineNum: i + 2 };
      headers.forEach((h, j) => { row[h] = values[j] ?? ''; });
      row._errors = validateImportRow(row);
      return row;
    });
}

function downloadCSVTemplate() {
  const csv = [
    'name,email,phone,role,department,outlet,employeeId,startDate',
    'Kwame Asante,kwame@sparkle.com,+233241234567,customer_service,Customer Success,HQ — Osu,EMP-009,2026-06-01',
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'staff_import_template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Bulk Import Modal ────────────────────────────────────────────────────────

function BulkImportModal({ onClose, onImport }) {
  const [step, setStep]         = useState(1); // 1=upload, 2=preview, 3=done
  const [rows, setRows]         = useState([]);
  const [isDragging, setIsDrag] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileRef = useRef(null);

  function handleFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.csv')) return;
    const reader = new FileReader();
    reader.onload = e => { setRows(parseCSVText(e.target.result)); setStep(2); };
    reader.readAsText(file);
  }

  const validRows = rows.filter(r => r._errors.length === 0);
  const errorRows = rows.filter(r => r._errors.length  > 0);

  function doImport() {
    onImport(validRows);
    setImportedCount(validRows.length);
    setStep(3);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-h3 font-bold text-neutral-900">Import staff</h2>
            <p className="mt-0.5 text-small text-neutral-500">
              {step === 1 ? 'Upload a CSV file to add multiple staff members at once.' :
               step === 2 ? `${rows.length} row${rows.length !== 1 ? 's' : ''} found — ${validRows.length} valid, ${errorRows.length} with errors` :
               'Import complete'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">

          {/* Step 1 — upload */}
          {step === 1 && (
            <div className="space-y-5">
              <div
                onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                onDragLeave={() => setIsDrag(false)}
                onDrop={e => { e.preventDefault(); setIsDrag(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging ? 'border-primary-400 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                  <FileUp className="h-6 w-6 text-neutral-500" />
                </div>
                <div>
                  <p className="text-small font-semibold text-neutral-700">
                    {isDragging ? 'Drop the CSV here' : 'Drag & drop your CSV file here'}
                  </p>
                  <p className="mt-0.5 text-caption text-neutral-400">or click to browse — CSV files only</p>
                </div>
                <input
                  ref={fileRef} type="file" accept=".csv" className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
              </div>

              {/* Template */}
              <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                <div className="flex-1">
                  <p className="text-small font-medium text-neutral-700">Need a template?</p>
                  <p className="text-caption text-neutral-400">Download our CSV with the required column headers and an example row.</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadCSVTemplate}>
                  <Download className="h-3.5 w-3.5" /> Template
                </Button>
              </div>

              {/* Column guide */}
              <div>
                <p className="mb-2 text-small font-medium text-neutral-700">Required columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {['name *', 'email *', 'role *', 'phone', 'department', 'outlet', 'employeeId', 'startDate'].map(col => (
                    <code key={col} className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-caption text-neutral-600">{col}</code>
                  ))}
                </div>
                <p className="mt-1.5 text-caption text-neutral-400">
                  * Required. Role must be a valid code: {ROLES.slice(0, 4).map(r => r.code).join(', ')}, …
                </p>
              </div>
            </div>
          )}

          {/* Step 2 — preview */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex gap-3">
                {[
                  { label: 'Total', value: rows.length,       bg: '#EAF2FC', color: '#0C5FC5' },
                  { label: 'Valid', value: validRows.length,  bg: '#E6F6EE', color: '#13753F' },
                  { label: 'Errors', value: errorRows.length, bg: '#FDECEA', color: '#A31C12' },
                ].map(c => (
                  <div key={c.label} className="flex-1 rounded-lg border px-4 py-3 text-center" style={{ borderColor: c.bg, background: c.bg }}>
                    <p className="text-caption font-medium" style={{ color: c.color }}>{c.label}</p>
                    <p className="text-h3 font-bold tabular-nums" style={{ color: c.color }}>{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="max-h-60 overflow-auto rounded-md border border-neutral-200">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      {['#', 'Name', 'Email', 'Role', 'Status'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-caption font-semibold uppercase tracking-wide text-neutral-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {rows.map((row, i) => {
                      const bad = row._errors.length > 0;
                      return (
                        <tr key={i} style={bad ? { background: '#FFF8F8' } : {}}>
                          <td className="px-3 py-2.5 text-caption text-neutral-400">{row._lineNum}</td>
                          <td className="px-3 py-2.5 text-small text-neutral-800">{row.name || <span className="text-neutral-300">—</span>}</td>
                          <td className="px-3 py-2.5 text-small text-neutral-500">{row.email || <span className="text-neutral-300">—</span>}</td>
                          <td className="px-3 py-2.5 text-small text-neutral-500">{row.role || <span className="text-neutral-300">—</span>}</td>
                          <td className="px-3 py-2.5">
                            {bad ? (
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold"
                                style={{ background: '#FDECEA', color: '#A31C12' }}
                                title={row._errors.join('; ')}
                              >
                                <AlertTriangle className="h-3 w-3" />
                                {row._errors[0]}{row._errors.length > 1 ? ` +${row._errors.length - 1}` : ''}
                              </span>
                            ) : (
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold"
                                style={{ background: '#E6F6EE', color: '#13753F' }}
                              >
                                <CheckCircle2 className="h-3 w-3" /> Ready
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {validRows.length === 0 && (
                <Alert type="error" title="No valid rows to import">
                  Fix the errors in your CSV file and upload again.
                </Alert>
              )}
            </div>
          )}

          {/* Step 3 — done */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#E6F6EE' }}>
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <div>
                <p className="text-body font-bold text-neutral-900">
                  {importedCount} staff member{importedCount !== 1 ? 's' : ''} imported
                </p>
                <p className="mt-1.5 text-small text-neutral-500">
                  They'll receive invitation emails with account setup links.
                  {errorRows.length > 0 && ` ${errorRows.length} row${errorRows.length !== 1 ? 's were' : ' was'} skipped due to errors.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
          <Button
            variant="outline"
            onClick={step === 3 ? onClose : step === 2 ? () => setStep(1) : onClose}
          >
            {step === 3 ? 'Close' : step === 2 ? 'Back' : 'Cancel'}
          </Button>
          {step === 2 && (
            <Button disabled={validRows.length === 0} onClick={doImport}>
              Import {validRows.length} valid row{validRows.length !== 1 ? 's' : ''}
            </Button>
          )}
          {step === 3 && (
            <Button onClick={onClose}>Done</Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const meta = STAFF_STATUS[status] || STAFF_STATUS.inactive;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold"
      style={{ background: meta.bg, color: meta.text }}
    >
      <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

function RoleBadge({ roleCode }) {
  const role = roleFor(roleCode);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-caption font-semibold"
      style={{ background: role.bg, color: role.color }}
    >
      {role.name}
    </span>
  );
}

function Avatar({ name, size = 'md' }) {
  const pal = avatarColor(name);
  const sz = size === 'lg' ? 'h-12 w-12 text-body' : 'h-8 w-8 text-caption';
  return (
    <div
      className={`${sz} flex-shrink-0 flex items-center justify-center rounded-full font-bold`}
      style={pal}
    >
      {initials(name)}
    </div>
  );
}

// ─── Invite Staff Modal ───────────────────────────────────────────────────────

const OUTLETS = ['HQ — Osu', 'Spintex Outlet', 'Tema Factory'];
const DEPARTMENTS = ['Management', 'Operations', 'Customer Success', 'Quality Assurance', 'Logistics', 'Finance'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract'];

function InviteModal({ onClose }) {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', employeeId: '',
    role: '', department: '', employmentType: 'Full-time',
    startDate: '', outlet: '', sendWelcome: true,
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: typeof e === 'boolean' ? e : e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role) {
      setError('Full name, email, and role are required.');
      return;
    }
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-h3 font-bold text-neutral-900">Invite staff member</h2>
            <p className="mt-0.5 text-small text-neutral-500">They'll receive an email with a setup link.</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <div className="p-6">
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-success" />
              <p className="text-body font-semibold text-neutral-900">Invitation sent!</p>
              <p className="text-small text-neutral-500">
                {form.fullName} will receive a setup link at <strong>{form.email}</strong>
              </p>
            </div>
            <Button className="w-full" onClick={onClose}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="divide-y divide-neutral-100">
            <div className="grid grid-cols-2 gap-4 p-6">
              {error && (
                <div className="col-span-2">
                  <Alert type="error" title={error} />
                </div>
              )}
              <div className="col-span-2">
                <Input label="Full name" required value={form.fullName} onChange={set('fullName')} placeholder="e.g. Kwame Asante" />
              </div>
              <Input label="Email address" type="email" required value={form.email} onChange={set('email')} placeholder="kwame@sparkle.com" />
              <Input label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+233 24 000 0000" />
              <Input label="Employee ID" value={form.employeeId} onChange={set('employeeId')} placeholder="EMP-0009" />

              {/* Role */}
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Role <span className="text-error">*</span></label>
                <select
                  value={form.role}
                  onChange={set('role')}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select role…</option>
                  {ROLES.map(r => (
                    <option key={r.code} value={r.code}>{r.level} — {r.name}</option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Department</label>
                <select
                  value={form.department}
                  onChange={set('department')}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Employment type */}
              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Employment type</label>
                <select
                  value={form.employmentType}
                  onChange={set('employmentType')}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                >
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <Input label="Start date" type="date" value={form.startDate} onChange={set('startDate')} />

              {/* Assigned outlet */}
              <div className="col-span-2">
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Assigned location</label>
                <select
                  value={form.outlet}
                  onChange={set('outlet')}
                  className="h-12 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                >
                  <option value="">Select outlet…</option>
                  {OUTLETS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              {/* Send welcome email */}
              <div className="col-span-2 flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
                <input
                  type="checkbox"
                  id="sendWelcome"
                  checked={form.sendWelcome}
                  onChange={e => setForm(f => ({ ...f, sendWelcome: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-300 accent-primary-500"
                />
                <label htmlFor="sendWelcome" className="cursor-pointer text-small text-neutral-700">
                  Send welcome email with account setup instructions
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">
                <Send className="h-3.5 w-3.5" /> Send invite
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Staff Profile Drawer (US-0025) ──────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: 'active',     label: 'Active',     allowed: true  },
  { value: 'on_leave',   label: 'On Leave',   allowed: true  },
  { value: 'suspended',  label: 'Suspended',  allowed: true  },
  { value: 'terminated', label: 'Terminated', allowed: true, final: true },
];

const SUSPENSION_REASONS = [
  'Policy violation', 'Attendance issues', 'Performance concerns',
  'Pending investigation', 'Client complaint', 'Other',
];

function StaffDrawer({ staff, onClose, onStatusChange }) {
  const [newStatus, setNewStatus]   = useState('');
  const [reason, setReason]         = useState('');
  const [notes, setNotes]           = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [saved, setSaved]           = useState(false);
  const role = roleFor(staff.role);
  const isFinalStatus = staff.status === 'terminated';

  function handleStatusSave() {
    if (!newStatus || newStatus === staff.status) return;
    if (newStatus === 'terminated' && confirmText !== 'TERMINATE') return;
    onStatusChange(staff.id, newStatus);
    setSaved(true);
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end" style={{ background: 'rgba(0,0,0,0.35)' }}>
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-xl overflow-hidden">
        {/* Drawer header */}
        <div className="flex items-center gap-4 border-b border-neutral-100 px-6 py-5">
          <Avatar name={staff.name} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="truncate text-body font-bold text-neutral-900">{staff.name}</p>
            <p className="text-caption text-neutral-500">{staff.employeeId} · {staff.department}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {saved && (
            <Alert type="success" title="Status updated">
              {staff.name}'s status has been changed to {STAFF_STATUS[newStatus]?.label}.
            </Alert>
          )}

          {/* Quick info */}
          <div className="flex flex-wrap gap-2">
            <RoleBadge roleCode={staff.role} />
            <StatusBadge status={staff.status} />
          </div>

          {/* Personal info */}
          <SectionCard title="Contact">
            <div className="space-y-3 text-small">
              {[
                { icon: Mail,     label: staff.email },
                { icon: Phone,    label: staff.phone },
                { icon: MapPin,   label: staff.outlet },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 text-neutral-700">
                  <Icon className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Employment details */}
          <SectionCard title="Employment">
            <dl className="grid grid-cols-2 gap-y-3 text-small">
              {[
                { term: 'Role',            val: role.name                },
                { term: 'Department',      val: staff.department         },
                { term: 'Employment type', val: staff.employmentType     },
                { term: 'Start date',      val: staff.startDate          },
                { term: 'Last active',     val: staff.lastActive         },
              ].map(({ term, val }) => (
                <div key={term}>
                  <dt className="text-caption text-neutral-400">{term}</dt>
                  <dd className="mt-0.5 font-medium text-neutral-900">{val}</dd>
                </div>
              ))}
            </dl>
          </SectionCard>

          {/* Status management (US-0025) */}
          {!isFinalStatus && (
            <SectionCard title="Employment status" description="Changes take effect immediately and gate system access.">
              {isFinalStatus ? (
                <p className="text-small text-neutral-500">This status is final and cannot be changed.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-small font-medium text-neutral-700">Change status to</label>
                    <select
                      value={newStatus}
                      onChange={e => { setNewStatus(e.target.value); setSaved(false); }}
                      className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    >
                      <option value="">— select —</option>
                      {STATUS_OPTIONS.filter(s => s.value !== staff.status).map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  {newStatus && newStatus !== 'active' && (
                    <div>
                      <label className="mb-1.5 block text-small font-medium text-neutral-700">Reason</label>
                      <select
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      >
                        <option value="">Select reason…</option>
                        {SUSPENSION_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  )}

                  {newStatus && (
                    <div>
                      <label className="mb-1.5 block text-small font-medium text-neutral-700">Notes (optional)</label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Add context for this status change…"
                        className="w-full resize-none rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                      />
                    </div>
                  )}

                  {newStatus === 'terminated' && (
                    <div
                      className="rounded-lg px-4 py-3 text-small"
                      style={{ background: '#FDECEA', color: '#A31C12' }}
                    >
                      <p className="font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" /> This action is permanent
                      </p>
                      <p className="mt-1">
                        Termination cannot be undone. Type <strong>TERMINATE</strong> to confirm.
                      </p>
                      <input
                        type="text"
                        value={confirmText}
                        onChange={e => setConfirmText(e.target.value)}
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
              )}
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
}

// ─── Staff List Tab ───────────────────────────────────────────────────────────

function StaffTab() {
  const [staff, setStaff]           = useState(mockStaff);
  const [query, setQuery]           = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selected, setSelected]     = useState(null);

  function handleImport(validRows) {
    const newMembers = validRows.map((row, i) => ({
      id:           Date.now() + i,
      name:         row.name,
      email:        row.email,
      phone:        row.phone || '',
      role:         row.role,
      department:   row.department || 'Operations',
      outlet:       row.outlet || 'HQ — Osu',
      status:       'active',
      employeeId:   row.employeeId || `EMP-${String(Date.now()).slice(-4)}`,
      startDate:    row.startdate || row.startDate || '',
      lastActive:   'Just now',
    }));
    setStaff(prev => [...prev, ...newMembers]);
  }

  const filtered = staff.filter(s => {
    const q = query.toLowerCase();
    const matchQ = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const matchR = !filterRole   || s.role   === filterRole;
    const matchS = !filterStatus || s.status === filterStatus;
    return matchQ && matchR && matchS;
  });

  const counts = {
    total:     staff.length,
    active:    staff.filter(s => s.status === 'active').length,
    on_leave:  staff.filter(s => s.status === 'on_leave').length,
    suspended: staff.filter(s => s.status === 'suspended').length,
  };

  function handleStatusChange(id, newStatus) {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSelected(s => s ? { ...s, status: newStatus } : s);
  }

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total staff',  value: counts.total,     color: '#0C5FC5' },
          { label: 'Active',       value: counts.active,    color: '#1F9D57' },
          { label: 'On leave',     value: counts.on_leave,  color: '#C77700' },
          { label: 'Suspended',    value: counts.suspended, color: '#D92D20' },
        ].map(c => (
          <div key={c.label} className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
            <p className="text-caption text-neutral-500">{c.label}</p>
            <p className="mt-1 text-h2 font-bold tabular-nums" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>
        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All roles</option>
          {ROLES.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
        >
          <option value="">All statuses</option>
          {Object.entries(STAFF_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <Button variant="outline" onClick={() => setShowImport(true)}>
          <Upload className="h-4 w-4" /> Import CSV
        </Button>
        <Button onClick={() => setShowInvite(true)}>
          <Plus className="h-4 w-4" /> Add staff member
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              {['Employee', 'Role', 'Department', 'Location', 'Status', 'Last active', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-small text-neutral-400">
                  No staff members match your filters.
                </td>
              </tr>
            )}
            {filtered.map(s => (
              <tr
                key={s.id}
                className="cursor-pointer hover:bg-neutral-50 transition-colors"
                onClick={() => setSelected(s)}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div>
                      <p className="text-small font-semibold text-neutral-900">{s.name}</p>
                      <p className="text-caption text-neutral-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <RoleBadge roleCode={s.role} />
                </td>
                <td className="px-4 py-3.5 text-small text-neutral-700">{s.department}</td>
                <td className="px-4 py-3.5 text-small text-neutral-500">{s.outlet}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3.5 text-small text-neutral-400">{s.lastActive}</td>
                <td className="px-4 py-3.5">
                  <button
                    className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    onClick={e => { e.stopPropagation(); setSelected(s); }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {showImport && (
        <BulkImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}
      {selected && (
        <StaffDrawer
          staff={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}

// ─── RBAC Roles + Permissions Tab ────────────────────────────────────────────

const CODE_META = {
  F:  { color: '#1F9D57', bg: '#E6F6EE' },
  'F*': { color: '#0E9AA7', bg: '#E6FAFB' },
  E:  { color: '#0C5FC5', bg: '#EAF2FC' },
  R:  { color: '#C77700', bg: '#FFF4E0' },
  C:  { color: '#7C3AED', bg: '#F3F0FF' },
  A:  { color: '#0C5FC5', bg: '#EAF2FC' },
  O:  { color: '#6B7280', bg: '#F3F4F6' },
  T:  { color: '#6B7280', bg: '#F3F4F6' },
  M:  { color: '#6B7280', bg: '#F3F4F6' },
  N:  { color: '#9CA3AF', bg: '#F9FAFB' },
};

function PermCell({ code }) {
  const meta = CODE_META[code] || CODE_META.N;
  const desc = PERMISSION_CODES[code]?.desc || '';
  return (
    <td className="px-3 py-2.5 text-center" title={desc}>
      <span
        className="inline-flex h-6 w-8 items-center justify-center rounded text-caption font-bold"
        style={{ background: meta.bg, color: meta.color }}
      >
        {code}
      </span>
    </td>
  );
}

function RolesTab() {
  return (
    <div className="space-y-6">
      {/* Role cards */}
      <div className="grid grid-cols-4 gap-4">
        {ROLES.map(r => (
          <div key={r.code} className="rounded-lg border border-neutral-200 bg-white px-4 py-4">
            <div className="flex items-start gap-2">
              <div
                className="h-8 w-8 flex-shrink-0 rounded-full flex items-center justify-center text-caption font-bold"
                style={{ background: r.bg, color: r.color }}
              >
                {r.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-small font-semibold text-neutral-900 leading-tight">{r.name}</p>
                <p className="text-caption text-neutral-400">{r.level}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-caption text-neutral-500">
              <span>{mockStaff.filter(s => s.role === r.code).length} member(s)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="rounded-lg border border-neutral-200 bg-white p-5">
        <p className="mb-3 text-small font-semibold text-neutral-700">Permission level legend</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(PERMISSION_CODES).map(([code, meta]) => (
            <div key={code} className="flex items-center gap-1.5">
              <span
                className="inline-flex h-6 w-8 items-center justify-center rounded text-caption font-bold"
                style={{ background: CODE_META[code]?.bg, color: CODE_META[code]?.color }}
              >
                {code}
              </span>
              <span className="text-caption text-neutral-600">{meta.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-caption text-neutral-400">
          <Info className="h-3.5 w-3.5" />
          Hover any cell for a description. Inheritance: Super Admin → Admin (100%) → Ops Manager (80%) → Staff.
        </p>
      </div>

      {/* Permission matrix */}
      <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400 w-64">
                  Feature (EP-01)
                </th>
                {ROLES.map(r => (
                  <th
                    key={r.code}
                    className="px-3 py-3 text-center text-caption font-semibold tracking-wide"
                    style={{ color: r.color }}
                  >
                    <div className="leading-tight">
                      {r.name.split(' ').map((w, i) => (
                        <span key={i} className="block">{w}</span>
                      ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RBAC_FEATURES.map(group => (
                <>
                  <tr key={group.category} className="bg-neutral-50 border-y border-neutral-100">
                    <td
                      colSpan={ROLES.length + 1}
                      className="px-4 py-2 text-caption font-semibold uppercase tracking-wide text-neutral-400"
                    >
                      {group.category}
                    </td>
                  </tr>
                  {group.features.map(feat => (
                    <tr key={feat.story} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-small text-neutral-900">{feat.name}</p>
                        <p className="text-caption text-neutral-400">{feat.story}</p>
                      </td>
                      {ROLES.map(r => (
                        <PermCell key={r.code} code={feat.permissions[r.code] || 'N'} />
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Page tabs ────────────────────────────────────────────────────────────────

const TABS = [
  { key: 'staff', label: 'Staff Members',      icon: Users      },
  { key: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

const StaffPage = () => {
  const [activeTab, setActiveTab] = useState('staff');

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Staff & Roles</h1>
        <p className="mt-0.5 text-small text-neutral-500">
          Manage your team, assign roles, and control access to features.
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-neutral-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative flex items-center gap-1.5 px-5 pb-3 pt-1 text-small font-semibold transition-colors ${
              activeTab === key ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {activeTab === key && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'staff' && <StaffTab />}
      {activeTab === 'roles' && <RolesTab />}
    </div>
  );
}

export default StaffPage;


