import { useState } from 'react';
import {
  Plus, MapPin, Phone, Building2, Pencil, Trash2, CreditCard,
  AlertTriangle, CheckCircle2, Lock, X, ChevronDown,
} from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Alert } from '../../components/ui/Alert.jsx';
import { businessProfile } from '../../data/mock.js';

const TABS = ['Company', 'Outlets', 'Services', 'Payments'];
const DAYS  = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Fields that require re-approval when changed
const REAPPROVAL_FIELDS = new Set(['name', 'registrationNumber']);

// ─── Shared components ────────────────────────────────────────────────────────

function SectionCard({ title, description, children, action }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div>
          <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
          {description && <p className="mt-0.5 text-small text-neutral-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5">
        <span className="text-small font-medium text-neutral-600">{label}</span>
        <Lock className="h-3 w-3 text-neutral-300" title="This field cannot be edited" />
      </div>
      <p className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2 text-small text-neutral-600">{value || '—'}</p>
    </div>
  );
}

function ReapprovalTag() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
      style={{ background: '#FFF4E0', color: '#945800' }}
      title="Changes to this field require LonApp re-approval"
    >
      <AlertTriangle className="h-2.5 w-2.5" /> Re-approval
    </span>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-primary-500' : 'bg-neutral-200'}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

// ─── Company tab ──────────────────────────────────────────────────────────────

function CompanyTab() {
  const { company, meta } = businessProfile;
  const [form, setForm]     = useState({ ...company });
  const [saved, setSaved]   = useState(null); // null | 'saved' | 'reapproval'

  const criticalDirty =
    (form.name !== company.name) ||
    (form.registrationNumber !== company.registrationNumber);

  function set(field) {
    return e => { setForm(f => ({ ...f, [field]: e.target.value })); setSaved(null); };
  }

  function handleSave() {
    setSaved(criticalDirty ? 'reapproval' : 'saved');
  }
  function handleDiscard() { setForm({ ...company }); setSaved(null); }

  return (
    <div className="space-y-6">
      {saved === 'reapproval' && (
        <Alert type="warning" title="Changes submitted for re-approval">
          You updated a critical field. Your business remains active while LonApp reviews the change — you'll be notified once approved.
        </Alert>
      )}
      {saved === 'saved' && (
        <Alert type="success" title="Changes saved">Your business information has been updated.</Alert>
      )}

      {/* View-only metadata */}
      <SectionCard title="Account status" description="Read-only system fields">
        <div className="grid grid-cols-4 gap-4">
          <ReadOnlyField label="Business ID"       value={meta.businessId}       />
          <ReadOnlyField label="Registration date" value={meta.registrationDate} />
          <ReadOnlyField label="Approval date"     value={meta.approvalDate}     />
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-small font-medium text-neutral-600">Status</span>
              <Lock className="h-3 w-3 text-neutral-300" />
            </div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: '#E6F6EE', color: '#13753F' }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#1F9D57' }} />
              {meta.status}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Editable company info */}
      <SectionCard title="Business information" description="Legal name and contact details">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-small font-medium text-neutral-700">Company name <span className="text-error">*</span></span>
              <ReapprovalTag />
            </div>
            <input
              className="w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2 text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              value={form.name}
              onChange={set('name')}
            />
          </div>

          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-small font-medium text-neutral-700">Registration number</span>
              <ReapprovalTag />
            </div>
            <input
              className="w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2 font-mono text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              value={form.registrationNumber}
              onChange={set('registrationNumber')}
            />
          </div>

          <Input label="Email address"  type="email" value={form.email}    onChange={set('email')}   />
          <Input label="Phone number"   type="tel"   value={form.phone}    onChange={set('phone')}   />
          <Input label="WhatsApp number" type="tel"  value={form.whatsapp} onChange={set('whatsapp')} />
          <Input label="Website"        type="url"   value={form.website}  onChange={set('website')} />
          <Input label="GPS / Digital address" value={form.gps} onChange={set('gps')} />

          {/* Currency — read-only after first order */}
          <div>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-small font-medium text-neutral-700">Currency</span>
              <Lock className="h-3 w-3 text-neutral-300" title="Cannot change after first order" />
            </div>
            <p
              className="flex items-center rounded-md border border-neutral-100 bg-neutral-50 px-3.5 py-2 text-small text-neutral-500"
              title="Currency cannot be changed after your first order is placed"
            >
              {form.currency}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Input label="Business address" value={form.address} onChange={set('address')} />
        </div>

        {criticalDirty && (
          <div
            className="mt-4 flex items-start gap-2.5 rounded-lg px-4 py-3 text-small"
            style={{ background: '#FFF4E0', color: '#945800', border: '1px solid #F5C76E' }}
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <p>You've changed a field marked <strong>Re-approval</strong>. Saving will submit these changes for LonApp review before they take effect.</p>
          </div>
        )}
      </SectionCard>

      {/* Logo */}
      <SectionCard title="Business logo" description="Displayed on customer-facing pages and receipts">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
            <Building2 className="h-7 w-7 text-primary-600" />
          </div>
          <div>
            <Button variant="outline" size="sm">Upload logo</Button>
            <p className="mt-1.5 text-caption text-neutral-400">PNG, JPG or SVG · max 5 MB · recommended 256×256</p>
          </div>
        </div>
      </SectionCard>

      {/* Registration documents — read-only */}
      <SectionCard title="Registration documents">
        <div
          className="mb-4 flex items-start gap-2.5 rounded-lg px-4 py-3 text-small"
          style={{ background: '#EAF2FC', color: '#093F84', border: '1px solid #BAD4F5' }}
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            <strong>Document changes require re-approval.</strong> To update registration documents, contact LonApp support or submit through the documents renewal workflow.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Registration certificate', file: 'GH-BUS-20241045_cert.pdf' },
            { label: 'Admin ID document',        file: 'passport_scan.jpg'        },
          ].map(d => (
            <div key={d.label} className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
              <p className="text-caption font-semibold uppercase tracking-wide text-neutral-400">{d.label}</p>
              <p className="mt-1 text-small font-medium text-neutral-800">{d.file}</p>
              <div className="mt-1.5 flex items-center gap-1 text-caption text-success">
                <CheckCircle2 className="h-3 w-3" /> Verified
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleDiscard}>Discard changes</Button>
        <Button onClick={handleSave}>{criticalDirty ? 'Save & submit for re-approval' : 'Save changes'}</Button>
      </div>
    </div>
  );
}

// ─── Outlets tab ──────────────────────────────────────────────────────────────

function OutletHours({ hours }) {
  return (
    <div className="mt-3 grid grid-cols-7 gap-1 text-center">
      {DAYS.map(d => {
        const h = hours[d];
        return (
          <div key={d}>
            <p className="text-[10px] font-semibold uppercase text-neutral-400">{d}</p>
            {h.enabled
              ? <p className="mt-0.5 text-[10px] leading-snug text-neutral-700">{h.open}<br />{h.close}</p>
              : <p className="mt-0.5 text-[10px] text-neutral-300">Closed</p>
            }
          </div>
        );
      })}
    </div>
  );
}

function OutletsTab() {
  const [outlets, setOutlets] = useState(businessProfile.outlets);
  const [expanded, setExpanded] = useState(null);

  function toggleEnabled(id) {
    setOutlets(prev => prev.map(o => o.id === id ? { ...o, enabled: !o.enabled } : o));
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Outlets & factories"
        description={`${outlets.length} locations registered`}
        action={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Add outlet</Button>}
      >
        <div className="divide-y divide-neutral-100">
          {outlets.map(outlet => (
            <div key={outlet.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary-50">
                    <Building2 className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-small font-semibold text-neutral-900">{outlet.name}</p>
                      <span className="font-mono text-caption text-neutral-400">{outlet.abbrev}</span>
                      {!outlet.enabled && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#FFF4E0', color: '#945800' }}>
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-neutral-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{outlet.address}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{outlet.phone}</span>
                    </div>
                    <span className="mt-1.5 inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-caption font-medium text-neutral-600">
                      {outlet.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Disable / Enable toggle */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-caption text-neutral-500">{outlet.enabled ? 'Enabled' : 'Disabled'}</span>
                    <Toggle checked={outlet.enabled} onChange={() => toggleEnabled(outlet.id)} label={`Toggle ${outlet.name}`} />
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === outlet.id ? null : outlet.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expanded === outlet.id ? 'rotate-180' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-error-bg hover:text-error transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Expandable hours */}
              {expanded === outlet.id && (
                <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-caption font-semibold uppercase tracking-wide text-neutral-400">Operating hours</p>
                  <OutletHours hours={outlet.hours} />
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Services tab ─────────────────────────────────────────────────────────────

function ServiceGroup({ title, services, onToggle }) {
  return (
    <div>
      <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-neutral-400">{title}</p>
      <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
        {services.map(s => (
          <div key={s.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <p className={`text-small font-medium ${s.active ? 'text-neutral-900' : 'text-neutral-400'}`}>{s.name}</p>
              <p className="text-caption text-neutral-400">{s.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-caption font-medium ${s.active ? 'text-success' : 'text-neutral-400'}`}>
                {s.active ? 'Active' : 'Inactive'}
              </span>
              <Toggle checked={s.active} onChange={() => onToggle(s.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesTab() {
  const init = businessProfile.services;
  const [retail,     setRetail]     = useState(init.retail);
  const [commercial, setCommercial] = useState(init.commercial);
  const [turnaround, setTurnaround] = useState(init.turnaround);
  const [saved, setSaved] = useState(false);

  function toggleRetail(id)     { setRetail(p => p.map(s => s.id === id ? { ...s, active: !s.active } : s)); setSaved(false); }
  function toggleCommercial(id) { setCommercial(p => p.map(s => s.id === id ? { ...s, active: !s.active } : s)); setSaved(false); }

  const activeRetail     = retail.filter(s => s.active).length;
  const activeCommercial = commercial.filter(s => s.active).length;
  const tooFew = activeRetail + activeCommercial < 1;

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Services updated">Your service catalogue has been saved.</Alert>}

      <SectionCard title="Service catalogue" description="Toggle which services your business offers">
        <div className="space-y-5">
          <ServiceGroup title="Retail services" services={retail}     onToggle={toggleRetail}     />
          <ServiceGroup title="Commercial services" services={commercial} onToggle={toggleCommercial} />
        </div>
        {tooFew && (
          <p className="mt-3 text-caption text-error">At least one service must be active.</p>
        )}
      </SectionCard>

      <SectionCard title="Turnaround settings" description="Applies to all services unless overridden per outlet">
        <div className="grid grid-cols-3 gap-5">
          {[
            { key: 'standard',         label: 'Standard turnaround'  },
            { key: 'express',          label: 'Express turnaround'   },
            { key: 'expressSurcharge', label: 'Express surcharge (%)', type: 'number' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="mb-1.5 block text-small font-medium text-neutral-700">{label}</label>
              <input
                type={type ?? 'text'}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                value={turnaround[key]}
                onChange={e => { setTurnaround(t => ({ ...t, [key]: type === 'number' ? +e.target.value : e.target.value })); setSaved(false); }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setRetail(init.retail); setCommercial(init.commercial); setTurnaround(init.turnaround); setSaved(false); }}>
          Discard changes
        </Button>
        <Button disabled={tooFew} onClick={() => setSaved(true)}>Save changes</Button>
      </div>
    </div>
  );
}

// ─── Payments tab ─────────────────────────────────────────────────────────────

function PaymentsTab() {
  const [methods, setMethods] = useState(businessProfile.payments.methods);
  const [deleteError, setDeleteError] = useState('');

  function handleDelete(id) {
    if (methods.length <= 1) {
      setDeleteError('Cannot delete the only payment method. Add another method first.');
      return;
    }
    setMethods(prev => prev.filter(m => m.id !== id));
    setDeleteError('');
  }

  function handleSetPrimary(id) {
    setMethods(prev => prev.map(m => ({ ...m, primary: m.id === id })));
  }

  return (
    <div className="space-y-6">
      {deleteError && (
        <Alert type="error" title="Cannot delete payment method">{deleteError}</Alert>
      )}

      <SectionCard
        title="Payment methods"
        description="Where customers pay and where payouts are sent"
        action={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Add method</Button>}
      >
        <div className="divide-y divide-neutral-100">
          {methods.map(m => (
            <div key={m.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-neutral-100">
                  <CreditCard className="h-4 w-4 text-neutral-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-small font-semibold text-neutral-900">{m.provider}</p>
                    {m.primary && (
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-caption font-semibold text-primary-600">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-neutral-500">{m.type} · {m.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!m.primary && (
                  <button onClick={() => handleSetPrimary(m.id)} className="text-caption font-medium text-primary-600 hover:underline">
                    Set as primary
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-error-bg hover:text-error transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {methods.length === 1 && (
          <p className="mt-3 flex items-center gap-1.5 text-caption text-neutral-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Minimum 1 payment method required. Add another before you can remove this one.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Payout schedule" description="When earnings are transferred to your account">
        <div className="flex flex-col gap-3">
          {[
            { label: 'Daily',   desc: 'Payouts every business day' },
            { label: 'Weekly',  desc: 'Every Monday'               },
            { label: 'Monthly', desc: 'On the 1st of each month'   },
          ].map((opt, i) => (
            <label key={opt.label} className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50 transition-colors">
              <input type="radio" name="payout_schedule" defaultChecked={i === 1} className="h-4 w-4 accent-primary-500" />
              <div>
                <p className="text-small font-medium text-neutral-900">{opt.label}</p>
                <p className="text-caption text-neutral-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BusinessProfilePage() {
  const [activeTab, setActiveTab] = useState('Company');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Business Profile</h1>
        <p className="mt-0.5 text-small text-neutral-500">
          Manage your company details, outlets, services, and payment settings.
        </p>
      </div>

      <div className="flex border-b border-neutral-200">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-5 pb-3 pt-1 text-small font-semibold transition-colors ${
              activeTab === tab ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-500" />
            )}
          </button>
        ))}
      </div>

      {activeTab === 'Company'  && <CompanyTab />}
      {activeTab === 'Outlets'  && <OutletsTab />}
      {activeTab === 'Services' && <ServicesTab />}
      {activeTab === 'Payments' && <PaymentsTab />}
    </div>
  );
}
