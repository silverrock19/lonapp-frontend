import { useState } from 'react';
import Input from '../../../components/forms/Input.jsx';
import Button from '../../../components/ui/Button.jsx';
import { Paperclip } from 'lucide-react';

const COUNTRIES = ['Ghana', 'Nigeria', 'Kenya', 'South Africa', 'Rwanda', 'Uganda'];
const CURRENCIES = { Ghana: 'GHS', Nigeria: 'NGN', Kenya: 'KES', 'South Africa': 'ZAR', Rwanda: 'RWF', Uganda: 'UGX' };
const REG_TYPES  = ['Sole Proprietor', 'Partnership', 'Limited Liability', 'Unregistered'];

const selectCls = 'w-full border border-neutral-200 bg-white px-3.5 py-2 text-body text-neutral-800 outline-none focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100 transition-all appearance-none';

function validate(f) {
  const e = {};
  if (!f.companyName.trim())           e.companyName = 'Company name is required';
  else if (f.companyName.length < 2)   e.companyName = 'Must be at least 2 characters';
  else if (f.companyName.length > 100) e.companyName = 'Must be 100 characters or fewer';
  if (!f.country)                      e.country     = 'Country is required';
  if (!f.email.trim())                 e.email       = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Enter a valid email address';
  if (!f.phone.trim())                 e.phone       = 'Phone number is required';
  if (!f.address.trim())               e.address     = 'Physical address is required';
  else if (f.address.length < 10)      e.address     = 'Address must be at least 10 characters';
  if (!f.registrationType)             e.registrationType = 'Select a registration type';
  if (f.registrationType && f.registrationType !== 'Unregistered') {
    if (!f.registrationNumber.trim())  e.registrationNumber = 'Registration number is required';
    if (!f.registrationDoc)            e.registrationDoc    = 'Upload your registration document';
  }
  return e;
}

const Step1Company = ({ data, onNext, onSaveDraft }) => {
  const [f, setF] = useState({ ...data });
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setF(p => ({ ...p, [field]: value }));
    setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  }

  function handleCountryChange(country) {
    setF(p => ({ ...p, country, currency: CURRENCIES[country] || '' }));
    setErrors(e => { const n = { ...e }; delete n.country; return n; });
  }

  function handleNext() {
    const errs = validate(f);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(f);
  }

  const requiresRegDocs = f.registrationType && f.registrationType !== 'Unregistered';

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Company Information</h2>
      <p className="mt-1 mb-7 text-body text-neutral-500">
        Tell us about your laundry business. Fields marked <span className="text-error">*</span> are required.
      </p>

      <div className="space-y-5">

        {/* Company name + Country */}
        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Company name" required
            placeholder="e.g. Sparkle Laundry Ltd"
            maxLength={100}
            value={f.companyName}
            onChange={e => set('companyName', e.target.value)}
            error={errors.companyName}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-small font-semibold text-neutral-800">
              Country <span className="text-error">*</span>
            </label>
            <select
              style={{ borderRadius: 8 }}
              className={`${selectCls} ${errors.country ? 'border-error' : ''}`}
              value={f.country}
              onChange={e => handleCountryChange(e.target.value)}
            >
              <option value="">Select country…</option>
              {COUNTRIES.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.country && <p className="text-caption text-error-text">{errors.country}</p>}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Business email" required type="email"
            placeholder="owner@yourbusiness.com"
            value={f.email}
            onChange={e => set('email', e.target.value)}
            error={errors.email}
          />
          <Input
            label="Phone number" required type="tel"
            placeholder="+233 24 000 0000"
            value={f.phone}
            onChange={e => set('phone', e.target.value)}
            error={errors.phone}
          />
        </div>

        {/* WhatsApp + Currency */}
        <div className="grid grid-cols-2 gap-5">
          <Input
            label="WhatsApp number"
            type="tel"
            placeholder="Same as phone? Leave blank"
            value={f.whatsapp}
            onChange={e => set('whatsapp', e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-small font-semibold text-neutral-800">Currency</label>
            <input
              readOnly
              style={{ borderRadius: 8 }}
              className="w-full border border-neutral-100 bg-neutral-50 px-3.5 py-2 text-body text-neutral-400 outline-none cursor-default"
              value={f.currency || (f.country ? CURRENCIES[f.country] : 'Select a country first')}
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-small font-semibold text-neutral-800">
            Physical address <span className="text-error">*</span>
          </label>
          <textarea
            rows={2}
            style={{ borderRadius: 8 }}
            className={`w-full border px-3.5 py-2 text-body text-neutral-800 placeholder:text-neutral-400 outline-none transition-all resize-none ${
              errors.address
                ? 'border-error bg-error-bg focus:border-error focus:ring-[3px] focus:ring-error-bg'
                : 'border-neutral-200 bg-white focus:border-primary-400 focus:ring-[3px] focus:ring-primary-100'
            }`}
            placeholder="e.g. 42 Liberation Road, Osu, Accra"
            maxLength={500}
            value={f.address}
            onChange={e => set('address', e.target.value)}
          />
          {errors.address && <p className="text-caption text-error-text">{errors.address}</p>}
        </div>

        {/* GPS */}
        <Input
          label="GPS / Location code"
          helper="Optional — e.g. GA-123-4567 or coordinates"
          placeholder="e.g. GA-123-4567"
          value={f.gps}
          onChange={e => set('gps', e.target.value)}
        />

        {/* Registration type */}
        <div className="flex flex-col gap-2">
          <label className="text-small font-semibold text-neutral-800">
            Business registration type <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {REG_TYPES.map(type => (
              <label
                key={type}
                style={{ borderRadius: 8 }}
                className={`flex cursor-pointer items-center gap-3 border px-4 py-2.5 text-small transition-colors ${
                  f.registrationType === type
                    ? 'border-primary-300 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <input type="radio" className="sr-only" name="regType"
                  checked={f.registrationType === type}
                  onChange={() => set('registrationType', type)} />
                <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center border ${
                  f.registrationType === type ? 'border-primary-500 bg-primary-500' : 'border-neutral-300 bg-white'
                }`} style={{ borderRadius: 100 }}>
                  {f.registrationType === type && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                {type}
              </label>
            ))}
          </div>
          {errors.registrationType && <p className="text-caption text-error-text">{errors.registrationType}</p>}
        </div>

        {/* Conditional reg docs */}
        {requiresRegDocs && (
          <div className="grid grid-cols-2 gap-5 border border-neutral-100 bg-neutral-50 p-4" style={{ borderRadius: 8 }}>
            <Input
              label="Registration number" required
              placeholder="e.g. GH-BUS-20241045"
              value={f.registrationNumber}
              onChange={e => set('registrationNumber', e.target.value)}
              error={errors.registrationNumber}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-small font-semibold text-neutral-800">
                Registration document <span className="text-error">*</span>
              </label>
              <label
                style={{ borderRadius: 8 }}
                className={`flex cursor-pointer items-center gap-2.5 border px-3.5 py-2 text-body transition-all ${
                  errors.registrationDoc
                    ? 'border-error bg-error-bg'
                    : 'border-neutral-200 bg-white hover:border-primary-400 hover:bg-primary-50'
                }`}
              >
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="sr-only"
                  onChange={e => { if (e.target.files[0]) set('registrationDoc', { name: e.target.files[0].name, file: e.target.files[0] }); }} />
                <Paperclip className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <span className={f.registrationDoc ? 'text-neutral-800' : 'text-neutral-400'}>
                  {f.registrationDoc?.name ?? f.registrationDoc ?? 'Upload PDF or JPG'}
                </span>
              </label>
              {errors.registrationDoc
                ? <p className="text-caption text-error-text">{errors.registrationDoc}</p>
                : <p className="text-caption text-neutral-500">PDF, JPG, PNG · max 5 MB</p>
              }
            </div>
          </div>
        )}

        {/* Logo upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-small font-semibold text-neutral-800">
            Business logo <span className="text-caption text-neutral-400 font-normal">(optional)</span>
          </label>
          <label
            style={{ borderRadius: 8 }}
            className="flex cursor-pointer items-center gap-3 border border-dashed border-neutral-300 px-4 py-3 text-body hover:border-primary-300 hover:bg-primary-50 transition-all"
          >
            <input type="file" accept=".png,.jpg,.jpeg,.svg" className="sr-only"
              onChange={e => { if (e.target.files[0]) set('logo', { name: e.target.files[0].name, file: e.target.files[0] }); }} />
            <Paperclip className="h-4 w-4 text-neutral-400 flex-shrink-0" />
            <span className="flex-1 text-neutral-400">{f.logo?.name ?? f.logo ?? 'Click to upload your logo'}</span>
            <span className="text-caption text-neutral-400">PNG, JPG, SVG · 256×256</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-end gap-3 border-t border-neutral-100 pt-5">
        <Button variant="ghost" type="button" onClick={() => onSaveDraft(f)}>Save draft</Button>
        <Button type="button" onClick={handleNext}>Continue →</Button>
      </div>
    </div>
  );
}

export default Step1Company;


