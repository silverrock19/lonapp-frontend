import { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/forms/Input.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { ROLES } from '../../data/mockStaff.js';
import { OUTLETS, DEPARTMENTS, EMPLOYMENT_TYPES } from './staffUtils.js';

const InviteModal = ({ onClose }) => {
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', employeeId: '',
    role: '', department: '', employmentType: 'Full-time',
    startDate: '', outlet: '', sendWelcome: true,
  });
  const [sent, setSent]   = useState(false);
  const [error, setError] = useState('');

  const set = field => e => setForm(f => ({ ...f, [field]: typeof e === 'boolean' ? e : e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.role) {
      setError('Full name, email, and role are required.');
      return;
    }
    setSent(true);
  };

  const selectCls = 'h-12 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="relative w-full max-w-lg rounded-xl bg-white shadow-xl">
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
              {error && <div className="col-span-2"><Alert type="error" title={error} /></div>}
              <div className="col-span-2">
                <Input label="Full name" required value={form.fullName} onChange={set('fullName')} placeholder="e.g. Kwame Asante" />
              </div>
              <Input label="Email address" type="email" required value={form.email} onChange={set('email')} placeholder="kwame@sparkle.com" />
              <Input label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="+233 24 000 0000" />
              <Input label="Employee ID" value={form.employeeId} onChange={set('employeeId')} placeholder="EMP-0009" />

              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Role <span className="text-error">*</span></label>
                <select value={form.role} onChange={set('role')} className={selectCls}>
                  <option value="">Select role…</option>
                  {ROLES.map(r => <option key={r.code} value={r.code}>{r.level} — {r.name}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Department</label>
                <select value={form.department} onChange={set('department')} className={selectCls}>
                  <option value="">Select department…</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Employment type</label>
                <select value={form.employmentType} onChange={set('employmentType')} className={selectCls}>
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <Input label="Start date" type="date" value={form.startDate} onChange={set('startDate')} />

              <div className="col-span-2">
                <label className="mb-1.5 block text-small font-medium text-neutral-700">Assigned location</label>
                <select value={form.outlet} onChange={set('outlet')} className={selectCls}>
                  <option value="">Select outlet…</option>
                  {OUTLETS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <div className="col-span-2 flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
                <input
                  type="checkbox" id="sendWelcome" checked={form.sendWelcome}
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
              <Button type="submit"><Send className="h-3.5 w-3.5" /> Send invite</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InviteModal;
