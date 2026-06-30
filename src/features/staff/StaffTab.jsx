import { useState } from 'react';
import { Search, Plus, Upload } from 'lucide-react';
import { MoreHorizontal } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { ROLES, STAFF_STATUS, mockStaff as initialStaff } from '../../data/mockStaff.js';
import { avatarColor, initials, roleFor } from './staffUtils.js';
import InviteModal from './InviteModal.jsx';
import BulkImportModal from './BulkImportModal.jsx';
import StaffDrawer, { Avatar } from './StaffDrawer.jsx';

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

const StaffTab = () => {
  const [staff, setStaff]               = useState(initialStaff);
  const [query, setQuery]               = useState('');
  const [filterRole, setFilterRole]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showInvite, setShowInvite]     = useState(false);
  const [showImport, setShowImport]     = useState(false);
  const [selected, setSelected]         = useState(null);

  const handleImport = validRows => {
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
  };

  const handleStatusChange = (id, newStatus) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    setSelected(s => s ? { ...s, status: newStatus } : s);
  };

  const filtered = staff.filter(s => {
    const q = query.toLowerCase();
    return (
      (!q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)) &&
      (!filterRole   || s.role   === filterRole) &&
      (!filterStatus || s.status === filterStatus)
    );
  });

  const counts = {
    total:     staff.length,
    active:    staff.filter(s => s.status === 'active').length,
    on_leave:  staff.filter(s => s.status === 'on_leave').length,
    suspended: staff.filter(s => s.status === 'suspended').length,
  };

  const selectCls = 'h-11 rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total staff', value: counts.total,     color: '#0C5FC5' },
          { label: 'Active',      value: counts.active,    color: '#1F9D57' },
          { label: 'On leave',    value: counts.on_leave,  color: '#C77700' },
          { label: 'Suspended',   value: counts.suspended, color: '#D92D20' },
        ].map(c => (
          <div key={c.label} className="rounded-lg border border-neutral-200 bg-white px-5 py-4">
            <p className="text-caption text-neutral-500">{c.label}</p>
            <p className="mt-1 text-h2 font-bold tabular-nums" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or email…"
            className="h-11 w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
        </div>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className={selectCls}>
          <option value="">All roles</option>
          {ROLES.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectCls}>
          <option value="">All statuses</option>
          {Object.entries(STAFF_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <Button variant="outline" onClick={() => setShowImport(true)}><Upload className="h-4 w-4" /> Import CSV</Button>
        <Button onClick={() => setShowInvite(true)}><Plus className="h-4 w-4" /> Add staff member</Button>
      </div>

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
              <tr><td colSpan={7} className="py-10 text-center text-small text-neutral-400">No staff members match your filters.</td></tr>
            )}
            {filtered.map(s => (
              <tr key={s.id} className="cursor-pointer transition-colors hover:bg-neutral-50" onClick={() => setSelected(s)}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} />
                    <div>
                      <p className="text-small font-semibold text-neutral-900">{s.name}</p>
                      <p className="text-caption text-neutral-400">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><RoleBadge roleCode={s.role} /></td>
                <td className="px-4 py-3.5 text-small text-neutral-700">{s.department}</td>
                <td className="px-4 py-3.5 text-small text-neutral-500">{s.outlet}</td>
                <td className="px-4 py-3.5"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3.5 text-small text-neutral-400">{s.lastActive}</td>
                <td className="px-4 py-3.5">
                  <button className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                    onClick={e => { e.stopPropagation(); setSelected(s); }}>
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {showImport && <BulkImportModal onClose={() => setShowImport(false)} onImport={handleImport} />}
      {selected && <StaffDrawer staff={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}
    </>
  );
};

export default StaffTab;
