import { useState, useRef } from 'react';
import { AlertTriangle, Lock, CheckCircle2, Upload, Building2, ImageOff } from 'lucide-react';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { businessProfile } from '../../data/mock.js';
import { useLogo } from '../../context/LogoContext.jsx';

const REAPPROVAL_FIELDS = new Set(['name', 'registrationNumber']);

const ReadOnlyField = ({ label, value }) => (
  <div>
    <div className="mb-1 flex items-center gap-1.5">
      <span className="text-small font-medium text-neutral-600">{label}</span>
      <Lock className="h-3 w-3 text-neutral-300" title="This field cannot be edited" />
    </div>
    <p className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2 text-small text-neutral-600">{value || '—'}</p>
  </div>
);

const ReapprovalTag = () => (
  <span
    className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
    style={{ background: '#FFF4E0', color: '#945800' }}
    title="Changes to this field require LonApp re-approval"
  >
    <AlertTriangle className="h-2.5 w-2.5" /> Re-approval
  </span>
);

const CompanyTab = () => {
  const { company, meta } = businessProfile;
  const [form, setForm]   = useState({ ...company });
  const [saved, setSaved] = useState(null);
  const { logoUrl, setLogoUrl } = useLogo();
  const logoFileRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setLogoUrl(ev.target.result); setSaved(null); };
    reader.readAsDataURL(file);
  };

  const criticalDirty =
    form.name !== company.name ||
    form.registrationNumber !== company.registrationNumber;

  const set = field => e => { setForm(f => ({ ...f, [field]: e.target.value })); setSaved(null); };

  const handleSave    = () => setSaved(criticalDirty ? 'reapproval' : 'saved');
  const handleDiscard = () => { setForm({ ...company }); setSaved(null); };

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

          <Input label="Email address"       type="email" value={form.email}    onChange={set('email')}    />
          <Input label="Phone number"        type="tel"   value={form.phone}    onChange={set('phone')}    />
          <Input label="WhatsApp number"     type="tel"   value={form.whatsapp} onChange={set('whatsapp')} />
          <Input label="Website"             type="url"   value={form.website}  onChange={set('website')}  />
          <Input label="GPS / Digital address"             value={form.gps}     onChange={set('gps')}      />

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

      <SectionCard title="Business logo" description="Appears in the sidebar, public profile, and on receipts">
        <div className="space-y-5">
          <div className="flex items-center gap-5">
            <div
              className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-neutral-50"
              style={{ borderColor: logoUrl ? '#BAD4F5' : '#E5E7EB' }}
            >
              {logoUrl
                ? <img src={logoUrl} alt="Business logo" className="h-full w-full object-contain p-1" />
                : <Building2 className="h-10 w-10 text-neutral-300" />
              }
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => logoFileRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> {logoUrl ? 'Replace logo' : 'Upload logo'}
                </Button>
                {logoUrl && (
                  <Button variant="outline" size="sm" onClick={() => setLogoUrl(null)} style={{ borderColor: '#D92D20', color: '#D92D20' }}>
                    <ImageOff className="h-3.5 w-3.5" /> Remove
                  </Button>
                )}
              </div>
              <p className="text-caption text-neutral-400">PNG, JPG or SVG · max 5 MB · recommended 256 × 256 px</p>
              <input ref={logoFileRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
            </div>
          </div>

          {logoUrl && (
            <div>
              <p className="mb-3 text-small font-medium text-neutral-700">How it appears across the app</p>
              <div className="flex items-end gap-6">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-40 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3">
                    <img src={logoUrl} alt="" className="h-6 w-auto max-w-[100px] object-contain" />
                  </div>
                  <p className="text-[10px] text-neutral-400">Sidebar</p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <img src={logoUrl} alt="" className="h-8 w-8 object-contain" />
                  </div>
                  <p className="text-[10px] text-neutral-400">Profile</p>
                </div>
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-28 items-center justify-center rounded border border-neutral-200 bg-white">
                    <img src={logoUrl} alt="" className="h-7 w-auto max-w-[90px] object-contain" />
                  </div>
                  <p className="text-[10px] text-neutral-400">Receipt</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Registration documents">
        <div className="mb-4 flex items-start gap-2.5 rounded-lg px-4 py-3 text-small" style={{ background: '#EAF2FC', color: '#093F84', border: '1px solid #BAD4F5' }}>
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p><strong>Document changes require re-approval.</strong> To update registration documents, contact LonApp support or submit through the documents renewal workflow.</p>
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
};

export default CompanyTab;
