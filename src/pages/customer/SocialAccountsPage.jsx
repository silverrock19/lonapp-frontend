import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, CheckCircle2, X } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import GoogleIcon from '../../components/icons/GoogleIcon.jsx';
import FacebookIcon from '../../components/icons/FacebookIcon.jsx';
import AppleIcon from '../../components/icons/AppleIcon.jsx';
import WhatsAppIcon from '../../components/icons/WhatsAppIcon.jsx';

const INITIAL_ACCOUNTS = [
  {
    key: 'google',
    label: 'Google',
    email: 'adwoa.mensah@gmail.com',
    linked: true,
    Icon: GoogleIcon,
    iconBg: '#F1F3F4',
    iconColor: '#4285F4',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    email: null,
    linked: false,
    Icon: FacebookIcon,
    iconBg: '#1877F2',
    iconColor: '#fff',
  },
  {
    key: 'apple',
    label: 'Apple',
    email: null,
    linked: false,
    Icon: AppleIcon,
    iconBg: '#111827',
    iconColor: '#fff',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    phone: '+233 24 456 7890',
    linked: false,
    Icon: WhatsAppIcon,
    iconBg: '#25D366',
    iconColor: '#fff',
  },
];

const Toast = ({ toast }) => {
  if (!toast) return null;
  const isSuccess = toast.type === 'success';
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pt-2 pointer-events-none">
      <div className={`rounded-xl px-4 py-3 text-[14px] shadow-sm ${
        isSuccess
          ? 'bg-green-50 border border-green-200 text-green-700'
          : 'bg-neutral-100 border border-neutral-200 text-neutral-700'
      }`}>
        {toast.message}
      </div>
    </div>
  );
};

const UnlinkModal = ({ provider, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-[430px] rounded-t-2xl bg-white px-5 pt-6 pb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[17px] font-semibold text-neutral-900">Unlink {provider}?</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
          >
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
        <p className="text-[14px] text-neutral-500 mb-6 leading-relaxed">
          You'll still be able to sign in with your email and password.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl border border-neutral-200 text-neutral-700 text-[15px] font-semibold"
          >
            Cancel
          </button>
          <Button variant="danger" onClick={onConfirm} className="flex-1 !h-12 !rounded-2xl !text-[15px]">
            Unlink
          </Button>
        </div>
      </div>
    </div>
  );
};

const LinkModal = ({ provider, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-full max-w-[430px] rounded-t-2xl bg-white px-5 pt-6 pb-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[17px] font-semibold text-neutral-900">Link {provider}?</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100"
          >
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
        <p className="text-[14px] text-neutral-500 mb-6 leading-relaxed">
          You'll be redirected to {provider} to authorise the connection. LonApp cannot post on your behalf.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-2xl border border-neutral-200 text-neutral-700 text-[15px] font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-2xl text-white text-[15px] font-semibold"
            style={{ background: '#0E9AA7' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const SocialAccountsPage = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [modal, setModal] = useState(null); // { type: 'link'|'unlink', key, label }
  const [toast, setToast] = useState(null);

  const linkedCount = accounts.filter((a) => a.linked).length;

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAction = account => {
    if (account.linked) {
      setModal({ type: 'unlink', key: account.key, label: account.label });
    } else {
      setModal({ type: 'link', key: account.key, label: account.label });
    }
  };

  const confirmUnlink = () => {
    setAccounts(prev =>
      prev.map(a => (a.key === modal.key ? { ...a, linked: false, email: null, phone: null } : a))
    );
    setModal(null);
    showToast(`${modal.label} account unlinked.`, 'success');
  };

  const confirmLink = () => {
    setAccounts(prev =>
      prev.map(a =>
        a.key === modal.key
          ? { ...a, linked: true, email: a.key === 'google' ? 'adwoa.mensah@gmail.com' : null }
          : a
      )
    );
    setModal(null);
    showToast(`${modal.label} account linked successfully.`, 'success');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center -ml-2"
        >
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Linked Accounts</h1>
      </header>

      <Toast toast={toast} />

      <p className="px-4 pt-5 pb-4 text-[14px] text-neutral-500 leading-relaxed">
        Link your social accounts to sign in faster without entering a password.
      </p>

      {/* Accounts */}
      <p className="px-4 pb-2 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Connected accounts
      </p>
      <div className="mx-4 rounded-2xl bg-white border border-neutral-100 overflow-hidden">
        {accounts.map((account, idx) => {
          const { Icon, label, linked, email, phone, iconBg, iconColor } = account;
          const detail = email || phone;
          const canUnlink = linkedCount > 1 || !linked;

          return (
            <div
              key={account.key}
              className={`flex items-center gap-3 px-4 py-3.5 min-h-[64px] ${
                idx < accounts.length - 1 ? 'border-b border-neutral-100' : ''
              }`}
            >
              {/* Provider icon */}
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: iconBg }}
              >
                <Icon style={{ color: iconColor, width: 20, height: 20 }} />
              </div>

              {/* Label + status */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-medium text-neutral-900">{label}</span>
                  {linked && (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      <span className="text-[12px] text-green-600 font-medium">Connected</span>
                    </>
                  )}
                </div>
                {detail && (
                  <p className="text-[12px] text-neutral-400 truncate mt-0.5">{detail}</p>
                )}
                {!linked && (
                  <p className="text-[12px] text-neutral-400 mt-0.5">Not connected</p>
                )}
              </div>

              {/* Action */}
              {linked ? (
                <button
                  onClick={() => canUnlink && handleAction(account)}
                  disabled={!canUnlink}
                  className={`min-h-[40px] px-3 text-[13px] font-medium transition-colors ${canUnlink ? 'text-error hover:text-red-700' : 'text-neutral-300 cursor-not-allowed'}`}
                  title={!canUnlink ? 'Keep at least one login method linked' : ''}
                >
                  Unlink
                </button>
              ) : (
                <button
                  onClick={() => handleAction(account)}
                  className="min-h-[40px] px-4 rounded-xl text-[13px] font-semibold text-white bg-accent-500 hover:bg-accent-600 transition-colors"
                >
                  Link
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Warning if only one linked */}
      {linkedCount <= 1 && (
        <div className="mx-4 mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-[13px] text-amber-700">
          Keep at least one social account linked for quick sign-in.
        </div>
      )}

      {/* Security info */}
      <div className="mx-4 mt-5 rounded-2xl bg-white border border-neutral-100 p-4">
        <div className="flex items-start gap-3 mb-3">
          <Info className="h-5 w-5 mt-0.5 shrink-0" style={{ color: '#0E9AA7' }} />
          <p className="text-[14px] font-semibold text-neutral-700">About linked accounts</p>
        </div>
        <div className="space-y-2.5 pl-8">
          {[
            'Linked accounts cannot post on your behalf',
            'You can always sign in with your email and password',
            'Removing all social accounts keeps your email login active',
          ].map((note) => (
            <div key={note} className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-neutral-300" />
              <p className="text-[13px] text-neutral-500 leading-snug">{note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {modal?.type === 'unlink' && (
        <UnlinkModal
          provider={modal.label}
          onClose={() => setModal(null)}
          onConfirm={confirmUnlink}
        />
      )}
      {modal?.type === 'link' && (
        <LinkModal
          provider={modal.label}
          onClose={() => setModal(null)}
          onConfirm={confirmLink}
        />
      )}
    </div>
  );
};

export default SocialAccountsPage;
