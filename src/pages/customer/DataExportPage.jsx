import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Clock } from 'lucide-react';
import PasswordInput from '../../components/forms/PasswordInput.jsx';

const DataExportPage = () => {
  const navigate = useNavigate();

  const [view, setView] = useState('REQUEST'); // 'REQUEST' | 'PROCESSING'

  // Format checkboxes
  const [formats, setFormats] = useState({
    json: true,
    csv: true,
    pdf: false,
  });

  // Category checkboxes
  const [categories, setCategories] = useState({
    profile: true,
    addresses: true,
    payment_methods: true,
    order_history: true,
    payment_transactions: true,
    reviews: true,
    activity_logs: true,
    privacy_settings: true,
  });

  const [password, setPassword] = useState('');
  const [progress, setProgress] = useState(0);

  const categoryLabels = {
    profile: 'Profile & account info',
    addresses: 'Delivery addresses',
    payment_methods: 'Payment methods (masked)',
    order_history: 'Order history',
    payment_transactions: 'Payment transactions',
    reviews: 'Reviews & ratings',
    activity_logs: 'Activity logs',
    privacy_settings: 'Privacy settings',
  };

  const anyFormatSelected = Object.values(formats).some(Boolean);
  const anyCategorySelected = Object.values(categories).some(Boolean);
  const canSubmit = anyFormatSelected && anyCategorySelected && password.trim().length > 0;

  const handleSelectAll = () => {
    const updated = {};
    Object.keys(categories).forEach((k) => { updated[k] = true; });
    setCategories(updated);
  };

  const handleClearAll = () => {
    const updated = {};
    Object.keys(categories).forEach((k) => { updated[k] = false; });
    setCategories(updated);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setProgress(0);
    setView('PROCESSING');
  };

  // Animate progress bar from 0 → 80 over 8 seconds
  useEffect(() => {
    if (view !== 'PROCESSING') return;
    const start = Date.now();
    const duration = 8000;
    const target = 80;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(target, (elapsed / duration) * target);
      setProgress(pct);
      if (pct < target) {
        requestAnimationFrame(tick);
      }
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [view]);

  const pastExports = [
    { date: 'Dec 15, 2024', formats: 'JSON + CSV', status: 'expired_download' },
    { date: 'Nov 28, 2024', formats: 'JSON', status: 'expired' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      {/* Back Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Download My Data</h1>
      </header>

      {view === 'REQUEST' && (
        <>
          {/* Intro */}
          <div className="px-4 pt-5 pb-4">
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              Request a copy of all your LonApp data. We'll prepare it and email you a download link within 10 minutes.
            </p>
          </div>

          {/* Choose Format */}
          <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Choose Format
          </p>
          <div className="rounded-2xl border border-neutral-200 bg-white mx-4">
            {[
              { key: 'json', label: 'JSON', sub: 'machine-readable' },
              { key: 'csv', label: 'CSV', sub: 'spreadsheet' },
              { key: 'pdf', label: 'PDF', sub: 'human-readable summary' },
            ].map(({ key, label, sub }, idx, arr) => (
              <button
                key={key}
                onClick={() => setFormats((f) => ({ ...f, [key]: !f[key] }))}
                className={`flex items-center gap-3 w-full h-14 px-4 bg-white text-left ${
                  idx < arr.length - 1 ? 'border-b border-neutral-100' : ''
                } ${idx === 0 ? 'rounded-t-2xl' : ''} ${idx === arr.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                {/* Checkbox */}
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    formats[key] ? 'bg-[#0E9AA7] border-[#0E9AA7]' : 'border-neutral-300 bg-white'
                  }`}
                >
                  {formats[key] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[15px] text-neutral-900 font-medium">{label}</span>
                <span className="text-[13px] text-neutral-400">({sub})</span>
              </button>
            ))}
          </div>

          {/* Include in Export */}
          <div className="flex items-center justify-between px-4 pt-5 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              Include in Export
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSelectAll}
                className="text-[13px] text-[#0E9AA7] font-medium"
              >
                Select All
              </button>
              <span className="text-neutral-300">|</span>
              <button
                onClick={handleClearAll}
                className="text-[13px] text-[#0E9AA7] font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white mx-4">
            {Object.entries(categoryLabels).map(([key, label], idx, arr) => (
              <button
                key={key}
                onClick={() => setCategories((c) => ({ ...c, [key]: !c[key] }))}
                className={`flex items-center gap-3 w-full h-14 px-4 bg-white text-left ${
                  idx < arr.length - 1 ? 'border-b border-neutral-100' : ''
                } ${idx === 0 ? 'rounded-t-2xl' : ''} ${idx === arr.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    categories[key] ? 'bg-[#0E9AA7] border-[#0E9AA7]' : 'border-neutral-300 bg-white'
                  }`}
                >
                  {categories[key] && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="text-[15px] text-neutral-900">{label}</span>
              </button>
            ))}
          </div>

          {/* Password Confirmation */}
          <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Password Confirmation
          </p>
          <div className="mx-4">
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
            />
          </div>

          {/* Submit Button */}
          <div className="mx-4 mt-6">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`w-full h-12 rounded-2xl text-[15px] font-semibold transition-opacity ${
                canSubmit
                  ? 'bg-[#0E9AA7] text-white'
                  : 'bg-[#0E9AA7] text-white opacity-40 cursor-not-allowed'
              }`}
            >
              Request Data Export
            </button>
          </div>

          {/* Export History */}
          <p className="px-4 pt-8 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
            Export History
          </p>
          <div className="rounded-2xl border border-neutral-200 bg-white mx-4">
            {pastExports.map((exp, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between h-14 px-4 bg-white ${
                  idx < pastExports.length - 1 ? 'border-b border-neutral-100' : ''
                } ${idx === 0 ? 'rounded-t-2xl' : ''} ${idx === pastExports.length - 1 ? 'rounded-b-2xl' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neutral-400 shrink-0" />
                  <div>
                    <p className="text-[14px] text-neutral-900 font-medium">{exp.date}</p>
                    <p className="text-[12px] text-neutral-400">{exp.formats}</p>
                  </div>
                </div>
                {exp.status === 'expired_download' ? (
                  <div className="flex items-center gap-1 text-neutral-400">
                    <Download className="h-4 w-4" />
                    <span className="text-[13px] line-through">Download</span>
                  </div>
                ) : (
                  <span className="text-[12px] font-medium px-2 py-1 rounded-full bg-neutral-100 text-neutral-400">
                    Expired
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Rate limit note */}
          <p className="px-4 pt-3 pb-2 text-[13px] text-neutral-500 text-center">
            You can request up to 5 exports per day (4 remaining today).
          </p>
        </>
      )}

      {view === 'PROCESSING' && (
        <div className="flex flex-col items-center px-6 pt-16 gap-6">
          {/* Spinner */}
          <div className="h-16 w-16 rounded-full border-4 border-[#0E9AA7] border-t-transparent animate-spin" />

          {/* Heading */}
          <h2 className="text-[20px] font-semibold text-neutral-900 text-center">
            Preparing your data...
          </h2>

          {/* Subtext */}
          <p className="text-[15px] text-neutral-500 text-center leading-relaxed max-w-xs">
            We'll email you at{' '}
            <span className="font-medium text-neutral-700">adwoa.mensah@gmail.com</span>{' '}
            when it's ready. Usually takes 2–10 minutes.
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-xs">
            <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
              <div
                className="h-2 rounded-full bg-[#0E9AA7] transition-all ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[12px] text-neutral-400 text-center">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Done button */}
          <div className="w-full max-w-xs mt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExportPage;
