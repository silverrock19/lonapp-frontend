import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight, AlertTriangle, Trash2, Check, X, ShieldAlert, LogOut } from 'lucide-react';
import PasswordInput from '../../components/forms/PasswordInput.jsx';
import Button from '../../components/ui/Button.jsx';
import { resetAuth } from '../../store/slices/authSlice.js';

const PauseModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-neutral-900">Pause Account</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100">
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
        <p className="mb-6 text-[15px] text-neutral-600 leading-relaxed">
          Temporarily pausing your account will hide your profile and pause all notifications. You can resume anytime from settings.
        </p>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold mb-3"
        >
          Pause My Account
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const ConfirmDeactivateModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    if (password.trim()) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-neutral-900">Are you sure?</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100">
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
        <p className="mb-5 text-[14px] text-neutral-500">
          Enter your password to confirm account deactivation.
        </p>
        <div className="mb-6">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button
          onClick={handleConfirm}
          disabled={!password.trim()}
          className="w-full h-12 rounded-2xl border border-amber-500 text-amber-700 text-[15px] font-semibold mb-3 disabled:opacity-40"
        >
          Deactivate Account
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-2xl border border-neutral-200 text-neutral-600 text-[15px] font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const DeleteModal = ({ onClose, onConfirm }) => {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [agreed, setAgreed] = useState(false);

  const isValid = password.trim() && confirmText === 'DELETE' && agreed;

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 overflow-y-auto">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10 mt-auto">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-neutral-900">This is permanent</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100">
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        </div>

        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-[14px] text-red-700 leading-relaxed">
            Your account and data will be permanently deleted after a <span className="font-semibold">30-day grace period.</span>
          </p>
        </div>

        <div className="mb-4">
          <p className="mb-1 text-[13px] font-semibold text-neutral-500">Password</p>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="mb-4">
          <p className="mb-1 text-[13px] font-semibold text-neutral-500">
            Type <span className="font-bold text-red-600">DELETE</span> to confirm
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[15px] outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
          />
          {confirmText.length > 0 && confirmText !== 'DELETE' && (
            <p className="mt-1 text-[12px] text-red-500">Must type DELETE exactly</p>
          )}
        </div>

        <button
          onClick={() => setAgreed(!agreed)}
          className="mb-6 flex items-start gap-3 w-full text-left"
        >
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${agreed ? 'bg-red-500 border-red-500' : 'border-neutral-300'}`}>
            {agreed && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          </span>
          <span className="text-[14px] text-neutral-700 leading-snug">
            I understand this cannot be undone
          </span>
        </button>

        <Button
          variant="danger"
          onClick={handleConfirm}
          disabled={!isValid}
          className="w-full mb-3"
        >
          Delete Account
        </Button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-2xl border border-neutral-200 text-neutral-600 text-[15px] font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const LogOutAllDevicesModal = ({ onClose, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
    <div className="w-full max-w-md rounded-t-3xl bg-white p-6 pb-10">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[17px] font-semibold text-neutral-900">Log out all devices?</h2>
        <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-full bg-neutral-100">
          <X className="h-4 w-4 text-neutral-600" />
        </button>
      </div>
      <p className="mb-6 text-[15px] text-neutral-600 leading-relaxed">
        This will sign you out of all browsers and devices. You'll need to sign in again on each device.
      </p>
      <button
        onClick={onConfirm}
        className="w-full h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold mb-3"
      >
        Log Out All Devices
      </button>
      <button
        onClick={onClose}
        className="w-full h-12 rounded-2xl border border-neutral-200 text-neutral-600 text-[15px] font-semibold"
      >
        Cancel
      </button>
    </div>
  </div>
);

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogOutAllModal, setShowLogOutAllModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeactivateConfirm = () => {
    setShowDeactivateModal(false);
    showToast("Account deactivated. You'll be logged out.", 'success');
    setTimeout(() => navigate('/customer/login'), 2000);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    showToast('Deletion scheduled. You have 30 days to cancel via email.', 'success');
    setTimeout(() => navigate('/customer/login'), 2000);
  };

  const handleLogOutAllConfirm = () => {
    setShowLogOutAllModal(false);
    // Mock "all devices" API call — in production this would invalidate all sessions server-side
    dispatch(resetAuth());
    navigate('/customer/login');
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      {/* Back Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center">
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Account Settings</h1>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pt-1 pointer-events-none">
          <div className={toast.type === 'success'
            ? "rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700 shadow-sm"
            : "rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[14px] text-red-700 shadow-sm"
          }>
            {toast.message}
          </div>
        </div>
      )}

      {/* SECURITY Section */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Security
      </p>
      <div className="border-t border-neutral-100 bg-white">
        <button
          onClick={() => setShowLogOutAllModal(true)}
          className="flex items-center justify-between h-14 px-4 w-full border-b border-neutral-100 last:border-0"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5 text-[#0E9AA7]" />
            <span className="text-[15px] text-[#0E9AA7] font-medium">Log out all devices</span>
          </div>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
      </div>

      {/* ACCOUNT STATUS Section */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Account Status
      </p>
      <div className="border-t border-neutral-100 bg-white">
        {/* Status row */}
        <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100">
          <span className="text-[15px] text-neutral-700">Account status</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-[15px] font-medium text-green-600">Active</span>
          </div>
        </div>

        {/* Pause row */}
        <button
          onClick={() => setShowPauseModal(true)}
          className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100 w-full last:border-0"
        >
          <span className="text-[15px] text-neutral-700">Temporarily pause account</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
      </div>

      {/* DEACTIVATE ACCOUNT Section */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Deactivate Account
      </p>
      <div className="px-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          {/* Warning icon + title */}
          <div className="mb-3 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-neutral-900">Deactivate Account</p>
              <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed">
                Your account will be hidden and you won't receive emails. You can reactivate anytime by logging back in.
              </p>
            </div>
          </div>

          {/* Effects list */}
          <div className="mb-4 space-y-2 pl-1">
            {[
              'Orders in progress will be completed',
              'Saved data is preserved',
              'Reactivate by signing back in',
            ].map((effect) => (
              <div key={effect} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0 text-amber-500" />
                <span className="text-[13px] text-neutral-600">{effect}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="w-full h-12 rounded-2xl border border-amber-500 text-amber-700 text-[15px] font-semibold"
          >
            Deactivate My Account
          </button>
        </div>
      </div>

      {/* DELETE ACCOUNT Section */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Delete Account
      </p>
      <div className="px-4">
        <div className="rounded-2xl border border-red-200 bg-white p-4">
          {/* Warning icon + title + badge */}
          <div className="mb-3 flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-semibold text-neutral-900">Delete Account & All Data</p>
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                  Permanent
                </span>
              </div>
              <p className="mt-1 text-[13px] text-neutral-500 leading-relaxed">
                This permanently deletes your account and all personal data. This <span className="font-bold uppercase">cannot</span> be undone.
              </p>
            </div>
          </div>

          {/* Effects list */}
          <div className="mb-3 space-y-2 pl-1">
            {[
              'Profile deleted',
              'Addresses deleted',
              'Payment methods removed',
              'Order history anonymized',
              'Loyalty points forfeited',
            ].map((effect) => (
              <div key={effect} className="flex items-center gap-2">
                <X className="h-4 w-4 shrink-0 text-red-500" />
                <span className="text-[13px] text-neutral-600">{effect}</span>
              </div>
            ))}
          </div>

          {/* Legal note */}
          <div className="mb-4 rounded-xl bg-neutral-50 border border-neutral-100 px-3 py-2">
            <div className="flex items-start gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-neutral-400" />
              <p className="text-[12px] text-neutral-500 leading-relaxed">
                Financial records required by law (7 years) are anonymized, not deleted.
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            className="w-full"
          >
            Delete My Account
          </Button>
        </div>
      </div>

      {/* Modals */}
      {showPauseModal && (
        <PauseModal onClose={() => setShowPauseModal(false)} />
      )}

      {showDeactivateModal && (
        <ConfirmDeactivateModal
          onClose={() => setShowDeactivateModal(false)}
          onConfirm={handleDeactivateConfirm}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {showLogOutAllModal && (
        <LogOutAllDevicesModal
          onClose={() => setShowLogOutAllModal(false)}
          onConfirm={handleLogOutAllConfirm}
        />
      )}
    </div>
  );
};

export default AccountSettingsPage;
