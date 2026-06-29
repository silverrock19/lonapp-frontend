import { ChevronDown, ChevronUp } from 'lucide-react';

const CollapsibleSection = ({ title, icon: Icon, open, onToggle, children }) => (
  <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-neutral-50"
    >
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-neutral-400" />
        <span className="text-small font-semibold text-neutral-800">{title}</span>
      </div>
      {open ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
    </button>
    {open && (
      <div className="space-y-4 border-t border-neutral-100 px-5 pb-5 pt-4">
        {children}
      </div>
    )}
  </div>
);

export default CollapsibleSection;
