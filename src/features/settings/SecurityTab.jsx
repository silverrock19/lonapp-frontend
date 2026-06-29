import { useState } from 'react';
import {
  Check, X, AlertTriangle, Download,
  ShieldAlert, ShieldCheck, Smartphone, LogOut, Key,
} from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import PasswordInput from '../../components/forms/PasswordInput.jsx';
const pwStrength = pw => {
  const checks = [
    { label: 'At least 8 characters',        ok: pw.length >= 8           },
    { label: 'Uppercase letter',              ok: /[A-Z]/.test(pw)         },
    { label: 'Lowercase letter',              ok: /[a-z]/.test(pw)         },
    { label: 'Number',                        ok: /[0-9]/.test(pw)         },
    { label: 'Special character (!@#$…)',     ok: /[^A-Za-z0-9]/.test(pw)  },
  ];
  return { checks, score: checks.filter(c => c.ok).length };
};

const STRENGTH_LABELS = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
const STRENGTH_COLORS = ['', '#D92D20', '#F79009', '#F79009', '#1F9D57', '#1F9D57'];

const TOTP_SECRET  = 'JBSW Y3DP EHPK 3PXP';
const BACKUP_CODES = [
  'AB12-CD34', 'EF56-GH78', 'IJ90-KL12', 'MN34-OP56',
  'QR78-ST90', 'UV12-WX34', 'YZ56-AB78', 'CD90-EF12',
];

const QRCodeMock = () => {
  const CELL = 6;
  const rows = [
    '111111100010001111111', '100000101010101000001', '101110101111101011101',
    '101110101011101011101', '101110100100101011101', '100000100110101000001',
    '111111101010101111111', '000000001011000000000', '110110111001001101101',
    '010101001110100101010', '101010110100110100101', '010100010011001001010',
    '110111001000101110010', '000000010100000000010', '111111101100111111101',
    '100000100011001000001', '101110110001101011101', '101110101100101011101',
    '101110101010001011101', '100000100001001000001', '111111100110001111111',
  ];
  const size = 21 * CELL;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {rows.map((row, y) =>
        [...row].map((bit, x) =>
          bit === '1' ? <rect key={`${x}-${y}`} x={x * CELL} y={y * CELL} width={CELL} height={CELL} fill="#1a1a1a" /> : null
        )
      )}
    </svg>
  );
};

const SecurityTab = () => {
  const [current, setCurrent]   = useState('');
  const [newPw, setNewPw]       = useState('');
  const [confirm, setConfirm]   = useState('');
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [logoutSent, setLogoutSent] = useState(false);

  const [twoFAEnabled,     setTwoFAEnabled]     = useState(false);
  const [twoFAStep,        setTwoFAStep]        = useState(null);
  const [twoFACode,        setTwoFACode]        = useState('');
  const [twoFADisableCode, setTwoFADisableCode] = useState('');
  const [twoFAVerifyError, setTwoFAVerifyError] = useState('');

  const { checks, score } = pwStrength(newPw);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!current)        { setError('Enter your current password.'); return; }
    if (score < 3)       { setError('Password is too weak. Meet at least 3 criteria.'); return; }
    if (newPw !== confirm) { setError('New passwords do not match.'); return; }
    setSaved(true);
    setCurrent(''); setNewPw(''); setConfirm('');
  };

  return (
    <div className="space-y-6">
      <SectionCard title="Change password" description="Use a strong, unique password you don't use elsewhere.">
        <form onSubmit={handleSubmit} className="space-y-5">
          {saved && <Alert type="success" title="Password updated">Your password has been changed. You may need to re-login on other devices.</Alert>}
          {error && <Alert type="error" title={error} />}

          <PasswordInput label="Current password" value={current}
            onChange={e => { setCurrent(e.target.value); setSaved(false); }} autoComplete="current-password" />

          <PasswordInput label="New password" value={newPw}
            onChange={e => { setNewPw(e.target.value); setSaved(false); }} autoComplete="new-password" />

          {newPw && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-1.5 flex-1 rounded-full transition-colors"
                      style={{ background: i <= score ? STRENGTH_COLORS[score] : '#E5E7EB' }} />
                  ))}
                </div>
                <span className="text-caption font-medium" style={{ color: STRENGTH_COLORS[score] }}>
                  {STRENGTH_LABELS[score]}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {checks.map(c => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    {c.ok
                      ? <Check className="h-3 w-3 flex-shrink-0 text-success" />
                      : <X     className="h-3 w-3 flex-shrink-0 text-neutral-300" />}
                    <span className={`text-caption ${c.ok ? 'text-success-text' : 'text-neutral-400'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <PasswordInput label="Confirm new password" value={confirm}
              onChange={e => { setConfirm(e.target.value); setSaved(false); }} autoComplete="new-password" />
            {confirm && newPw && (
              <p className={`mt-1 text-caption ${confirm === newPw ? 'text-success-text' : 'text-error-text'}`}>
                {confirm === newPw ? 'Passwords match' : 'Passwords do not match'}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Session security" description="Manage active sessions and sign out of all devices.">
        <div className="space-y-4">
          {logoutSent ? (
            <Alert type="success" title="All other sessions terminated">You have been signed out from all other devices and browsers.</Alert>
          ) : (
            <div className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: '#FDECEA' }}>
                <ShieldAlert className="h-4 w-4" style={{ color: '#A31C12' }} />
              </div>
              <div className="flex-1">
                <p className="text-small font-semibold text-neutral-900">Log out all other sessions</p>
                <p className="mt-0.5 text-caption text-neutral-500">
                  Sign out from all other browsers and devices. Your current session will remain active.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setLogoutSent(true)}>
                <LogOut className="h-3.5 w-3.5" /> Log out others
              </Button>
            </div>
          )}
          <p className="text-caption text-neutral-400">
            If you suspect unauthorized access, log out all sessions and change your password immediately.
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Protect your account with a time-based code from an authenticator app."
        action={
          twoFAEnabled ? (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold" style={{ background: '#E6F6EE', color: '#13753F' }}>
              <Check className="h-3 w-3" /> Enabled
            </span>
          ) : null
        }
      >
        {twoFAEnabled ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: '#E6F6EE' }}>
                <ShieldCheck className="h-4 w-4" style={{ color: '#1F9D57' }} />
              </div>
              <div className="flex-1">
                <p className="text-small font-semibold text-neutral-900">2FA is active</p>
                <p className="mt-0.5 text-caption text-neutral-500">Your account is protected with an authenticator app. 8 backup codes available.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setTwoFAStep('backup')}>
                <Key className="h-3.5 w-3.5" /> View backup codes
              </Button>
              <Button variant="outline" size="sm"
                onClick={() => { setTwoFAStep('disable'); setTwoFADisableCode(''); }}
                style={{ borderColor: '#D92D20', color: '#D92D20' }}>
                Disable 2FA
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100">
                <Smartphone className="h-4 w-4 text-neutral-500" />
              </div>
              <div>
                <p className="text-small font-medium text-neutral-900">Not enabled</p>
                <p className="mt-0.5 text-caption text-neutral-500">
                  Add an extra layer of security — you'll need an authenticator app such as Google Authenticator or Authy.
                </p>
              </div>
            </div>
            <Button onClick={() => { setTwoFAStep('setup'); setTwoFACode(''); setTwoFAVerifyError(''); }}>Enable 2FA</Button>
          </div>
        )}

        {twoFAStep === 'setup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <h3 className="text-h4 font-bold text-neutral-900">Set up 2FA</h3>
                  <p className="mt-0.5 text-small text-neutral-500">Step 1 of 2 — Scan and verify</p>
                </div>
                <button onClick={() => { setTwoFAStep(null); setTwoFACode(''); setTwoFAVerifyError(''); }}
                  className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-5 p-6">
                <p className="text-small text-neutral-600">Open your authenticator app and scan the QR code below, then enter the 6-digit code it shows.</p>
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl border-2 border-neutral-200 p-3"><QRCodeMock /></div>
                  <div className="w-full">
                    <p className="mb-2 text-center text-caption text-neutral-500">Or enter the key manually:</p>
                    <code className="block select-all rounded-md border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-center font-mono text-small text-neutral-800">
                      {TOTP_SECRET}
                    </code>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral-700">Verification code</label>
                  <input type="text" inputMode="numeric" maxLength={6} placeholder="000 000"
                    value={twoFACode}
                    onChange={e => { setTwoFACode(e.target.value.replace(/\D/g, '')); setTwoFAVerifyError(''); }}
                    className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-center font-mono text-body tracking-[0.35em] text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                  {twoFAVerifyError && <p className="mt-1 text-caption text-error">{twoFAVerifyError}</p>}
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setTwoFAStep(null); setTwoFACode(''); }}>Cancel</Button>
                  <Button onClick={() => {
                    if (twoFACode.length !== 6) { setTwoFAVerifyError('Enter the 6-digit code from your authenticator app.'); return; }
                    setTwoFAStep('backup'); setTwoFACode('');
                  }}>Verify &amp; enable</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {twoFAStep === 'backup' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <div>
                  <h3 className="text-h4 font-bold text-neutral-900">Save your backup codes</h3>
                  <p className="mt-0.5 text-small text-neutral-500">{twoFAEnabled ? 'Your one-time backup codes' : 'Step 2 of 2 — Store these safely'}</p>
                </div>
                {twoFAEnabled && (
                  <button onClick={() => setTwoFAStep(null)} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <div className="space-y-4 p-6">
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-small text-neutral-600">
                  <strong>Each code can only be used once.</strong> If you lose access to your authenticator app, use one of these to sign in. Keep them somewhere safe.
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {BACKUP_CODES.map(code => (
                    <code key={code} className="select-all rounded-md border border-neutral-200 bg-white px-3 py-2.5 text-center font-mono text-small text-neutral-800">
                      {code}
                    </code>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><Download className="h-3.5 w-3.5" /> Download</Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigator.clipboard?.writeText(BACKUP_CODES.join('\n'))}>Copy all</Button>
                </div>
                <div className="flex justify-end gap-3">
                  {!twoFAEnabled
                    ? <Button onClick={() => { setTwoFAEnabled(true); setTwoFAStep(null); }}><Check className="h-4 w-4" /> Done — codes saved</Button>
                    : <Button variant="outline" onClick={() => setTwoFAStep(null)}>Close</Button>
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {twoFAStep === 'disable' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
                <h3 className="text-h4 font-bold text-neutral-900">Disable 2FA</h3>
                <button onClick={() => { setTwoFAStep(null); setTwoFADisableCode(''); }} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4 p-6">
                <div className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-small" style={{ background: '#FFF4E0', color: '#945800', border: '1px solid #F5C76E' }}>
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>Disabling 2FA will make your account less secure. Enter your current authenticator code to confirm.</p>
                </div>
                <div>
                  <label className="mb-1.5 block text-small font-medium text-neutral-700">Current 2FA code</label>
                  <input type="text" inputMode="numeric" maxLength={6} placeholder="000 000"
                    value={twoFADisableCode}
                    onChange={e => setTwoFADisableCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-center font-mono text-body tracking-[0.35em] text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => { setTwoFAStep(null); setTwoFADisableCode(''); }}>Cancel</Button>
                  <Button disabled={twoFADisableCode.length !== 6}
                    onClick={() => { setTwoFAEnabled(false); setTwoFAStep(null); setTwoFADisableCode(''); }}
                    style={{ background: '#D92D20', color: '#fff', borderColor: '#D92D20', opacity: twoFADisableCode.length !== 6 ? 0.4 : 1 }}>
                    Disable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default SecurityTab;
