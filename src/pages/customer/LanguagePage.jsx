import { useState } from 'react';
import { Globe, Clock, ChevronRight, Check } from 'lucide-react';
import CustomerSettingsLayout, { SettingsSection } from '../../components/layout/CustomerSettingsLayout.jsx';
import { LANGUAGES, DATE_FORMATS, TIME_FORMATS } from '../../utils/localeOptions.js';


const NAV_SECTIONS = [
  { id: 'language', icon: Globe,  label: 'Language' },
  { id: 'region',   icon: Globe,  label: 'Region'   },
  { id: 'datetime', icon: Clock,  label: 'Date & time' },
];

export default function LanguagePage() {
  const [language,   setLanguage]   = useState('en');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [timeFormat, setTimeFormat] = useState('12hr');

  const [saved,  setSaved]  = useState({ language: 'en', dateFormat: 'DD/MM/YYYY', timeFormat: '12hr' });
  const [saving, setSaving] = useState(false);
  const [toast,  setToast]  = useState(null);

  const current = { language, dateFormat, timeFormat };
  const dirty = JSON.stringify(current) !== JSON.stringify(saved);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      setSaved({ ...current });
      showToast('Language & region saved');
    } finally {
      setSaving(false);
    }
  }

  const handleDiscard = () => {
    setLanguage(saved.language);
    setDateFormat(saved.dateFormat);
    setTimeFormat(saved.timeFormat);
  }

  return (
    <CustomerSettingsLayout
      title="Language & Region"
      sections={NAV_SECTIONS}
      dirty={dirty}
      onSave={handleSave}
      onDiscard={handleDiscard}
      saving={saving}
    >
      {toast && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700">{toast}</div>
      )}

      {/* ── Language ─────────────────────────────────────────────────────── */}
      <SettingsSection id="language" icon={Globe} title="Language" helper="The language used throughout the LonApp interface">
        <div className="divide-y divide-neutral-100">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="flex w-full items-center justify-between py-3.5 text-left transition-colors hover:bg-neutral-50"
            >
              <div>
                <p className="text-[15px] font-medium text-neutral-900">{lang.name}</p>
                <p className="text-[12px] text-neutral-400">{lang.subtitle}</p>
              </div>
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                language === lang.code ? 'border-[#0E9AA7] bg-[#0E9AA7]' : 'border-neutral-300 bg-white'
              }`}>
                {language === lang.code && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* ── Region ───────────────────────────────────────────────────────── */}
      <SettingsSection id="region" icon={Globe} title="Region" helper="Your country, currency, and time zone">
        <div className="divide-y divide-neutral-100">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[12px] text-neutral-400">Country</p>
              <p className="text-[15px] font-medium text-neutral-900">Ghana 🇬🇭</p>
            </div>
            <ChevronRight className="h-4 w-4 text-neutral-300" />
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[12px] text-neutral-400">Currency</p>
              <p className="text-[15px] font-medium text-neutral-900">GH₵ Ghanaian Cedi</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3.5">
            <div>
              <p className="text-[12px] text-neutral-400">Time zone</p>
              <p className="text-[15px] font-medium text-neutral-900">GMT+0 · Accra</p>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* ── Date & time ──────────────────────────────────────────────────── */}
      <SettingsSection id="datetime" icon={Clock} title="Date & time" helper="How dates and times are displayed to you">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-neutral-800">Date format</p>
            <div className="flex gap-2">
              {DATE_FORMATS.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setDateFormat(fmt)}
                  className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    dateFormat === fmt
                      ? 'bg-[#0E9AA7] text-white border-[#0E9AA7]'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <div className="border-t border-neutral-100" />
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-medium text-neutral-800">Time format</p>
            <div className="flex gap-2">
              {TIME_FORMATS.map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setTimeFormat(fmt)}
                  className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    timeFormat === fmt
                      ? 'bg-[#0E9AA7] text-white border-[#0E9AA7]'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>
    </CustomerSettingsLayout>
  );
}
