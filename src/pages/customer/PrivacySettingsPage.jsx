import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Toggle from '../../components/ui/Toggle.jsx';

const PrivacySettingsPage = () => {
  const navigate = useNavigate();

  const [personalised, setPersonalised] = useState(true);
  const [location, setLocation] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [sharePartners, setSharePartners] = useState(false);

  const [profileVisibility, setProfileVisibility] = useState('partners');
  const [showOrderHistory, setShowOrderHistory] = useState(true);
  const [showReviews, setShowReviews] = useState(true);

  const [toast, setToast] = useState(null);
  const [shareWarning, setShareWarning] = useState(false);

  const showToast = (msg, type = 'saved') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), type === 'saved' ? 1000 : 3000);
  };

  const handleToggle = (setter, current) => {
    setter(!current);
    showToast('Saved', 'saved');
  };

  const handleShareToggle = () => {
    if (!sharePartners) {
      setShareWarning(true);
    } else {
      setSharePartners(false);
      showToast('Saved', 'saved');
    }
  };

  const confirmShare = () => {
    setShareWarning(false);
    setSharePartners(true);
    showToast('Saved', 'saved');
  };

  const cancelShare = () => {
    setShareWarning(false);
  };

  const visibilityOptions = [
    { key: 'private', label: 'Private' },
    { key: 'partners', label: 'Partners Only' },
    { key: 'public', label: 'Public' },
  ];

  const visibilityDescriptions = {
    private: 'Only you can view your profile information',
    partners: 'Only laundry companies you order from can view your profile',
    public: 'Anyone using LonApp can view your profile',
  };

  const handleDataRight = (action) => {
    if (action === 'correction') {
      showToast("We'll review your request within 48 hours", 'info');
    } else if (action === 'privacy') {
      showToast('Coming soon', 'info');
    } else if (action === 'officer') {
      showToast('Contact: privacy@lonapp.com', 'info');
    } else if (action === 'export') {
      navigate('/app/export');
    } else if (action === 'account') {
      navigate('/app/account');
    }
  };


  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      {/* Back Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Privacy & Data</h1>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 px-4 pt-1 pointer-events-none">
          {toast.type === 'saved' && (
            <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700 text-center shadow-sm">
              {toast.msg}
            </div>
          )}
          {toast.type === 'info' && (
            <div className="rounded-xl bg-[#E8F9FA] border border-[#0E9AA7]/30 px-4 py-3 text-[14px] text-[#0E9AA7] text-center shadow-sm">
              {toast.msg}
            </div>
          )}
        </div>
      )}

      {/* Share Partners Warning Modal */}
      {shareWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 backdrop-blur-[2px] animate-fade-in px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <h2 className="text-[16px] font-semibold text-neutral-900">Share with Partners?</h2>
            </div>
            <p className="text-[14px] text-neutral-600 mb-6 leading-relaxed">
              This will share your data with our partner companies. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelShare}
                className="flex-1 h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmShare}
                className="flex-1 h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold"
              >
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA COLLECTION */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Data Collection
      </p>
      <div className="rounded-2xl border border-neutral-200 bg-white mx-4 overflow-hidden">
        <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100">
          <span className="text-[15px] text-neutral-900">Allow personalised recommendations</span>
          <Toggle size="md" checked={personalised} onChange={() => handleToggle(setPersonalised, personalised)} />
        </div>
        <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100">
          <span className="text-[15px] text-neutral-900">Allow location-based services</span>
          <Toggle size="md" checked={location} onChange={() => handleToggle(setLocation, location)} />
        </div>
        <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100">
          <span className="text-[15px] text-neutral-900">Allow usage analytics</span>
          <Toggle size="md" checked={analytics} onChange={() => handleToggle(setAnalytics, analytics)} />
        </div>
        <div className="flex items-center justify-between h-14 px-4 bg-white">
          <div>
            <span className="text-[15px] text-neutral-900">Share data with partners</span>
            <p className="text-[12px] text-neutral-400 mt-0.5">Opt-in only</p>
          </div>
          <Toggle size="md" checked={sharePartners} onChange={handleShareToggle} />
        </div>
      </div>

      {/* PROFILE VISIBILITY */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Profile Visibility
      </p>
      <div className="rounded-2xl border border-neutral-200 bg-white mx-4 overflow-hidden">
        <div className="px-4 pt-4 pb-3 border-b border-neutral-100">
          <p className="text-[15px] text-neutral-900 mb-3">Profile visibility</p>
          <div className="flex rounded-xl border border-neutral-200 overflow-hidden">
            {visibilityOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setProfileVisibility(opt.key);
                  showToast('Saved', 'saved');
                }}
                className={`flex-1 py-2 text-[13px] font-medium transition-colors ${
                  profileVisibility === opt.key
                    ? 'bg-[#0E9AA7] text-white'
                    : 'bg-white text-neutral-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[13px] text-neutral-500 mt-2">{visibilityDescriptions[profileVisibility]}</p>
        </div>
        <div className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100">
          <span className="text-[15px] text-neutral-900">Show order history to laundry companies</span>
          <Toggle size="md" checked={showOrderHistory} onChange={() => handleToggle(setShowOrderHistory, showOrderHistory)} />
        </div>
        <div className="flex items-center justify-between h-14 px-4 bg-white">
          <span className="text-[15px] text-neutral-900">Show reviews & ratings publicly</span>
          <Toggle size="md" checked={showReviews} onChange={() => handleToggle(setShowReviews, showReviews)} />
        </div>
      </div>

      {/* MARKETING */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Marketing
      </p>
      <div className="rounded-2xl border border-neutral-200 bg-white mx-4 overflow-hidden">
        <button
          onClick={() => navigate('/app/notifications')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white"
        >
          <span className="text-[15px] text-neutral-900">Manage marketing preferences</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
      </div>

      {/* YOUR DATA RIGHTS */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Your Data Rights
      </p>
      <div className="rounded-2xl border border-neutral-200 bg-white mx-4 overflow-hidden">
        <button
          onClick={() => handleDataRight('export')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-neutral-100"
        >
          <span className="text-[15px] text-neutral-900">Download my data</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
        <button
          onClick={() => handleDataRight('correction')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-neutral-100"
        >
          <span className="text-[15px] text-neutral-900">Request data correction</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
        <button
          onClick={() => handleDataRight('account')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-neutral-100"
        >
          <span className="text-[15px] text-red-500">Delete my account</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
        <button
          onClick={() => handleDataRight('privacy')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-neutral-100"
        >
          <span className="text-[15px] text-neutral-900">Privacy policy</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
        <button
          onClick={() => handleDataRight('officer')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white"
        >
          <span className="text-[15px] text-neutral-900">Contact Privacy Officer</span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
      </div>

      {/* Footer */}
      <p className="px-6 pt-5 pb-6 text-[12px] text-neutral-400 text-center leading-relaxed">
        LonApp complies with the Ghana Data Protection Act 2012. Essential data for order processing and security cannot be disabled.
      </p>
    </div>
  );
};

export default PrivacySettingsPage;
