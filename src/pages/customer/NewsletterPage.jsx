import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Toggle from '../../components/ui/Toggle.jsx';

const initialTopics = [
  { id: 1, name: 'Promotions & Discounts', frequency: 'Weekly', enabled: true },
  { id: 2, name: 'New Services & Features', frequency: 'Monthly', enabled: true },
  { id: 3, name: 'Tips & Care Guides', frequency: 'Bi-weekly', enabled: false },
  { id: 4, name: 'Loyalty Program Updates', frequency: 'Monthly', enabled: true },
  { id: 5, name: 'Seasonal Campaigns', frequency: 'Seasonal', enabled: false },
  { id: 6, name: 'Surveys & Feedback', frequency: 'As needed', enabled: false },
  { id: 7, name: 'LonApp Newsletter', frequency: 'Monthly', enabled: false },
];

const frequencyOptions = ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Paused'];
const pauseDurations = ['1 week', '2 weeks', '1 month', '3 months'];

const NewsletterPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [topics, setTopics] = useState(initialTopics);
  const [emailFormat, setEmailFormat] = useState('html');
  const [showPauseSheet, setShowPauseSheet] = useState(false);
  const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showFrequencyModal, setShowFrequencyModal] = useState(false);
  const [tempFrequency, setTempFrequency] = useState('');
  const [pausedDuration, setPausedDuration] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleTopic = (id) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const subscribeAll = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, enabled: true })));
    showToast('Subscribed to all topics.');
  };

  const unsubscribeAll = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, enabled: false })));
    setShowUnsubscribeModal(false);
    showToast('Unsubscribed from all marketing emails.');
  };

  const openFrequency = (topic) => {
    setSelectedTopic(topic);
    setTempFrequency(topic.frequency);
    setShowFrequencyModal(true);
  };

  const saveFrequency = () => {
    setTopics((prev) =>
      prev.map((t) =>
        t.id === selectedTopic.id ? { ...t, frequency: tempFrequency } : t
      )
    );
    setShowFrequencyModal(false);
    showToast(`Frequency updated for "${selectedTopic.name}".`);
  };

  const selectPause = (duration) => {
    setPausedDuration(duration);
    setShowPauseSheet(false);
    showToast(`All emails paused for ${duration}.`);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      {/* Back header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={goBack}>
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Newsletter &amp; Subscriptions</h1>
      </header>

      {/* Toast */}
      {toast && (
        <div
          className={
            toast.type === 'success'
              ? 'mx-4 mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700'
              : 'mx-4 mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[14px] text-red-700'
          }
        >
          {toast.msg}
        </div>
      )}

      {/* GLOBAL CONTROLS */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Global Controls
      </p>
      <div className="bg-white border-b border-neutral-100">
        {/* Subscribe All / Unsubscribe All */}
        <div className="flex items-center h-14 px-4 border-b border-neutral-100 gap-4">
          <button
            onClick={subscribeAll}
            className="text-[15px] font-semibold text-[#0E9AA7]"
          >
            Subscribe All
          </button>
          <span className="text-neutral-300 text-[15px]">|</span>
          <button
            onClick={() => setShowUnsubscribeModal(true)}
            className="text-[15px] font-semibold text-[#0E9AA7]"
          >
            Unsubscribe All
          </button>
        </div>

        {/* Pause all emails */}
        <button
          onClick={() => setShowPauseSheet(true)}
          className="flex items-center justify-between h-14 px-4 w-full bg-white"
        >
          <span className="text-[15px] text-neutral-900">
            Pause all emails
            {pausedDuration && (
              <span className="ml-2 text-[13px] text-[#0E9AA7]">({pausedDuration})</span>
            )}
          </span>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </button>
      </div>

      {/* EMAIL FORMAT */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Email Format
      </p>
      <div className="bg-white border-b border-neutral-100">
        <div className="flex items-center h-16 px-4 gap-3">
          <button
            onClick={() => setEmailFormat('html')}
            className={`flex-1 h-10 rounded-full text-[14px] font-semibold transition-colors ${
              emailFormat === 'html'
                ? 'bg-[#0E9AA7] text-white'
                : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            HTML (with images)
          </button>
          <button
            onClick={() => setEmailFormat('plain')}
            className={`flex-1 h-10 rounded-full text-[14px] font-semibold transition-colors ${
              emailFormat === 'plain'
                ? 'bg-[#0E9AA7] text-white'
                : 'bg-neutral-100 text-neutral-500'
            }`}
          >
            Plain text (less data)
          </button>
        </div>
      </div>

      {/* SUBSCRIPTIONS */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Subscriptions
      </p>
      <div className="bg-white">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-center justify-between h-14 px-4 bg-white border-b border-neutral-100 last:border-0"
          >
            {/* Tappable label area */}
            <button
              onClick={() => openFrequency(topic)}
              className="flex flex-col items-start flex-1 min-w-0 pr-3"
            >
              <span className="text-[15px] font-bold text-neutral-900 truncate w-full text-left">
                {topic.name}
              </span>
              <span className="text-[13px] text-neutral-400">{topic.frequency}</span>
            </button>

            {/* Toggle */}
            <Toggle size="md" checked={topic.enabled} onChange={() => toggleTopic(topic.id)} />
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="px-4 pt-5 text-[13px] text-neutral-400 leading-5">
        You'll always receive order confirmations, delivery updates, and security notifications regardless of these settings.
      </p>

      {/* ── Pause bottom sheet ── */}
      {showPauseSheet && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowPauseSheet(false)}
          />
          <div className="relative z-50 bg-white rounded-t-2xl px-4 pt-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-semibold text-neutral-900">Pause duration</h2>
              <button onClick={() => setShowPauseSheet(false)}>
                <X className="h-5 w-5 text-neutral-500" />
              </button>
            </div>
            {pauseDurations.map((d) => (
              <button
                key={d}
                onClick={() => selectPause(d)}
                className="flex items-center justify-between w-full h-14 border-b border-neutral-100 last:border-0"
              >
                <span className="text-[15px] text-neutral-900">{d}</span>
                {pausedDuration === d && (
                  <span className="h-5 w-5 rounded-full bg-[#0E9AA7] flex items-center justify-center">
                    <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Frequency modal ── */}
      {showFrequencyModal && selectedTopic && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFrequencyModal(false)}
          />
          <div className="relative z-50 bg-white rounded-2xl w-full max-w-sm px-4 pt-5 pb-5">
            <h2 className="text-[17px] font-semibold text-neutral-900 mb-4">
              {selectedTopic.name}
            </h2>
            <div className="flex flex-col gap-1 mb-6">
              {frequencyOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setTempFrequency(opt)}
                  className="flex items-center gap-3 h-12 px-1"
                >
                  <span
                    className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      tempFrequency === opt
                        ? 'border-[#0E9AA7] bg-[#0E9AA7]'
                        : 'border-neutral-300 bg-white'
                    }`}
                  >
                    {tempFrequency === opt && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[15px] text-neutral-900">{opt}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowFrequencyModal(false)}
                className="flex-1 h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={saveFrequency}
                className="flex-1 h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Unsubscribe All warning modal ── */}
      {showUnsubscribeModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowUnsubscribeModal(false)}
          />
          <div className="relative z-50 bg-white rounded-2xl w-full max-w-sm px-5 pt-6 pb-5">
            <h2 className="text-[17px] font-semibold text-neutral-900 mb-3">
              Unsubscribe from all?
            </h2>
            <p className="text-[14px] text-neutral-500 leading-5 mb-6">
              You'll no longer receive any marketing emails. Transactional emails (order updates, receipts) will still be sent.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowUnsubscribeModal(false)}
                className="flex-1 h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={unsubscribeAll}
                className="flex-1 h-12 rounded-2xl bg-red-500 text-white text-[15px] font-semibold"
              >
                Unsubscribe All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterPage;
