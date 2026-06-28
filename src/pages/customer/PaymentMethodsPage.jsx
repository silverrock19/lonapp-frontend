import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Smartphone, CreditCard, Trash2, Plus, X } from 'lucide-react';
import { MOCK_PAYMENT_METHODS } from '../../data/mockCustomer.js';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState(MOCK_PAYMENT_METHODS);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showMomoModal, setShowMomoModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [toast, setToast] = useState(null);

  const [momoForm, setMomoForm] = useState({ provider: 'MTN', phone: '', name: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSetDefault = (id) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleDeleteConfirm = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirmId(null);
    showToast('Payment method removed.');
  };

  const handleAddMomo = () => {
    if (!momoForm.phone.trim() || !momoForm.name.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    const masked = momoForm.phone.replace(/(\+\d{3}\s?\d{2})\s?\d+(\d{4})/, '$1 *** $2');
    const providerLabel =
      momoForm.provider === 'MTN'
        ? 'MTN Mobile Money'
        : momoForm.provider === 'Vodafone'
        ? 'Vodafone Cash'
        : 'AirtelTigo Money';
    setMethods((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'momo',
        provider: providerLabel,
        phone: masked || momoForm.phone,
        isDefault: false,
      },
    ]);
    setMomoForm({ provider: 'MTN', phone: '', name: '' });
    setShowMomoModal(false);
    showToast('Method added');
  };

  const maskPhone = (phone) => {
    return phone.replace(/(\+\d{3}\s?\d{2})\s?\d+(\d{4})/, '$1 *** $2');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center h-10 w-10 -ml-2">
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Payment Methods</h1>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className={`mx-4 mt-3 rounded-xl px-4 py-3 text-[14px] ${
            toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-green-50 border border-green-200 text-green-700'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Saved Methods */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Saved Methods
      </p>

      <div className="px-4 flex flex-col gap-3">
        {methods.map((method) => (
          <div key={method.id} className="rounded-2xl border border-neutral-200 bg-white p-4">
            {/* Top row: icon + details + default badge */}
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full flex-shrink-0"
                style={
                  method.type === 'momo'
                    ? { background: '#E8F9FA', color: '#0E9AA7' }
                    : { background: '#EFF6FF', color: '#3B82F6' }
                }
              >
                {method.type === 'momo' ? (
                  <Smartphone className="h-5 w-5" />
                ) : (
                  <CreditCard className="h-5 w-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[15px] font-semibold text-neutral-900">
                    {method.type === 'momo' ? method.provider : `${method.brand} ···· ${method.last4}`}
                  </p>
                  {method.isDefault && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ background: '#E8F9FA', color: '#0E9AA7' }}
                    >
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-neutral-500 mt-0.5">
                  {method.type === 'momo'
                    ? maskPhone(method.phone)
                    : `Expires ${method.expiry}`}
                </p>
              </div>
            </div>

            {/* Actions row or delete confirmation */}
            {deleteConfirmId === method.id ? (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <p className="text-[14px] text-red-700 font-medium mb-3">Remove this method?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 h-10 rounded-full border border-neutral-300 text-[14px] font-semibold text-neutral-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(method.id)}
                    className="flex-1 h-10 rounded-full bg-red-500 text-white text-[14px] font-semibold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                {!method.isDefault ? (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    className="h-9 rounded-full border border-[#0E9AA7] px-4 text-[13px] font-semibold text-[#0E9AA7]"
                  >
                    Set as default
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => setDeleteConfirmId(method.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))}

        {methods.length === 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center">
            <p className="text-[15px] text-neutral-500">No payment methods saved yet.</p>
          </div>
        )}
      </div>

      {/* Add Payment Method */}
      <p className="px-4 pt-6 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Add Payment Method
      </p>

      <div className="px-4 flex flex-col gap-3">
        <button
          onClick={() => setShowMomoModal(true)}
          className="w-full h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Mobile Money
        </button>
        <button
          onClick={() => setShowCardModal(true)}
          className="w-full h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Card
        </button>
      </div>

      {/* Add MoMo Bottom Sheet */}
      {showMomoModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMomoModal(false)}
          />
          <div className="relative z-10 bg-white rounded-t-3xl px-4 pt-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-semibold text-neutral-900">Add Mobile Money</h2>
              <button
                onClick={() => setShowMomoModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Provider select */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-neutral-600 mb-1.5">
                Provider
              </label>
              <select
                value={momoForm.provider}
                onChange={(e) => setMomoForm((f) => ({ ...f, provider: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[15px] outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20 transition-all bg-white"
              >
                <option value="MTN">MTN</option>
                <option value="Vodafone">Vodafone</option>
                <option value="AirtelTigo">AirtelTigo</option>
              </select>
            </div>

            {/* Phone number */}
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-neutral-600 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+233 24 000 0000"
                value={momoForm.phone}
                onChange={(e) => setMomoForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[15px] outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20 transition-all"
              />
            </div>

            {/* Account name */}
            <div className="mb-6">
              <label className="block text-[13px] font-medium text-neutral-600 mb-1.5">
                Account Name
              </label>
              <input
                type="text"
                placeholder="Full name on account"
                value={momoForm.name}
                onChange={(e) => setMomoForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-[15px] outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20 transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMomoModal(false)}
                className="flex-1 h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMomo}
                className="flex-1 h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold"
              >
                Add Method
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Bottom Sheet (coming soon) */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCardModal(false)}
          />
          <div className="relative z-10 bg-white rounded-t-3xl px-4 pt-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[17px] font-semibold text-neutral-900">Add Card</h2>
              <button
                onClick={() => setShowCardModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col items-center py-8 gap-3">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: '#E8F9FA', color: '#0E9AA7' }}
              >
                <CreditCard className="h-7 w-7" />
              </div>
              <p className="text-[17px] font-semibold text-neutral-900">Coming Soon</p>
              <p className="text-[14px] text-neutral-500 text-center px-6">
                Card payments will be available in a future update.
              </p>
            </div>
            <button
              onClick={() => setShowCardModal(false)}
              className="w-full h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPage;
