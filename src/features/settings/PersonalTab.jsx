import { useState } from 'react';
import { Lock, Upload } from 'lucide-react';
import Input from '../../components/forms/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import PasswordInput from '../../components/forms/PasswordInput.jsx';

const VerificationNote = () => (
  <p className="mt-1 flex items-center gap-1 text-caption text-neutral-400">
    <Lock className="h-3 w-3" /> Changing this field requires OTP verification
  </p>
);

const PersonalTab = ({ profile, onChange }) => {
  const [form, setForm] = useState({ ...profile });
  const [saved, setSaved] = useState(false);

  const set = field => e => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    setSaved(false);
    onChange({ ...profile, [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Personal information updated">Your details have been saved.</Alert>}

      <SectionCard title="Profile photo" description="Shown in the admin dashboard">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-h3 font-bold text-primary-700">
            {form.fullName ? form.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'}
          </div>
          <div>
            <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5" /> Upload photo</Button>
            <p className="mt-1.5 text-caption text-neutral-400">JPG or PNG · max 2 MB · min 200×200 px</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Personal information" description="Your name and contact details">
        <div className="grid grid-cols-2 gap-5">
          <Input label="Full name"     required value={form.fullName}    onChange={set('fullName')}    autoComplete="name"  />
          <Input label="Display name"           value={form.displayName} onChange={set('displayName')}                      />
          <Input label="Job title"              value={form.jobTitle}    onChange={set('jobTitle')}    placeholder="e.g. General Manager" />
          <div />
          <div>
            <Input label="Email address" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
            <VerificationNote />
          </div>
          <div>
            <Input label="Phone number" type="tel" required value={form.phone} onChange={set('phone')} autoComplete="tel" />
            <VerificationNote />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setForm({ ...profile }); setSaved(false); }}>Discard</Button>
        <Button onClick={() => setSaved(true)}>Save changes</Button>
      </div>
    </div>
  );
};

export default PersonalTab;
