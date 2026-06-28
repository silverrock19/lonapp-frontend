import { useState, useEffect, useRef } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';

export default function CustomerSettingsLayout({
  title,
  sections = [],
  dirty = false,
  onSave,
  onDiscard,
  saving = false,
  children,
}) {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (!sections.length) return;
    const obs = [];
    sections.forEach(({ id }) => {
      const el = document.getElementById(`section-${id}`);
      if (!el) return;
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id); },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, [sections]);

  function scrollTo(id) {
    const el = document.getElementById(`section-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile header */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-neutral-100 bg-white px-4 md:hidden">
        <button onClick={() => navigate(-1)} className="flex h-11 w-11 items-center justify-center -ml-2 shrink-0">
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="flex-1 text-[17px] font-semibold text-neutral-900 truncate">{title}</h1>
      </header>

      <div className="mx-auto flex max-w-5xl md:px-6 md:py-8">
        {/* Sticky left nav — desktop only */}
        {sections.length > 0 && (
          <aside className="hidden md:flex md:w-52 md:flex-shrink-0">
            <div className="sticky top-6 w-full">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                {title}
              </p>
              <nav className="flex flex-col gap-0.5">
                {sections.map(({ id, icon: Icon, label }) => {
                  const active = activeId === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium text-left transition-colors ${
                        active
                          ? 'bg-[#E8F9FA] text-[#0B7C87]'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
        )}

        {/* Content */}
        <main className="min-w-0 flex-1 md:ml-8 md:max-w-[720px] pb-32 md:pb-24">
          {/* Desktop breadcrumb */}
          <div className="hidden md:flex items-center gap-2 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-[13px] text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Back
            </button>
            <span className="text-neutral-300 text-[13px]">/</span>
            <h1 className="text-[18px] font-bold text-neutral-900">{title}</h1>
          </div>
          <div className="space-y-3 px-4 md:px-0">
            {children}
          </div>
        </main>
      </div>

      {/* Sticky save bar */}
      {dirty && (
        <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-lg md:bottom-0">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
            <p className="text-[13px] text-neutral-500">Unsaved changes</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onDiscard} disabled={saving}>
                Discard
              </Button>
              <Button size="sm" loading={saving} onClick={onSave}>
                Save changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section anchor wrapper ────────────────────────────────────────────────────
// Wrap each logical section in this so scroll-spy can find them.

export function SettingsSection({ id, icon: Icon, title, helper, children }) {
  return (
    <section id={`section-${id}`} className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-3 border-b border-neutral-100 bg-neutral-50/70 px-5 py-4">
        {Icon && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: '#E8F9FA' }}>
            <Icon className="h-4 w-4" style={{ color: '#0E9AA7' }} />
          </div>
        )}
        <div>
          <h2 className="text-[14px] font-semibold text-neutral-900">{title}</h2>
          {helper && <p className="text-[12px] text-neutral-400 leading-tight">{helper}</p>}
        </div>
      </div>
      <div className="px-5 py-5">{children}</div>
    </section>
  );
}
