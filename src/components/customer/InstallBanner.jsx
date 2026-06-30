import { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt.js';

/**
 * Dismissible "Add to Home Screen" banner shown to customer-side users
 * when the browser fires beforeinstallprompt. Only appears if the app
 * is not already installed and the user hasn't dismissed it this session.
 */
export default function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="mx-4 mt-3 mb-1 rounded-2xl bg-primary-50 border border-primary-200 px-4 py-3 flex items-center gap-3 shadow-sm animate-fade-in">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100">
        <Download className="h-5 w-5 text-primary-600" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-primary-900 leading-tight">
          Add LonApp to your home screen
        </p>
        <p className="text-[12px] text-primary-600 mt-0.5">
          One tap for faster laundry ordering
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={promptInstall}
          className="h-9 rounded-xl bg-primary-600 px-3 text-[13px] font-semibold text-white"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-primary-400 hover:bg-primary-100"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
