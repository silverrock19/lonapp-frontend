import { useState } from 'react';
import { Plus, AlertTriangle, CreditCard, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { businessProfile } from '../../data/mock.js';

const PaymentsTab = () => {
  const [methods, setMethods]       = useState(businessProfile.payments.methods);
  const [deleteError, setDeleteError] = useState('');

  const handleDelete = id => {
    if (methods.length <= 1) {
      setDeleteError('Cannot delete the only payment method. Add another method first.');
      return;
    }
    setMethods(prev => prev.filter(m => m.id !== id));
    setDeleteError('');
  };

  const handleSetPrimary = id => setMethods(prev => prev.map(m => ({ ...m, primary: m.id === id })));

  return (
    <div className="space-y-6">
      {deleteError && <Alert type="error" title="Cannot delete payment method">{deleteError}</Alert>}

      <SectionCard
        title="Payment methods"
        description="Where customers pay and where payouts are sent"
        action={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Add method</Button>}
      >
        <div className="divide-y divide-neutral-100">
          {methods.map(m => (
            <div key={m.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-neutral-100">
                  <CreditCard className="h-4 w-4 text-neutral-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-small font-semibold text-neutral-900">{m.provider}</p>
                    {m.primary && (
                      <span className="inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-caption font-semibold text-primary-600">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-caption text-neutral-500">{m.type} · {m.number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!m.primary && (
                  <button onClick={() => handleSetPrimary(m.id)} className="text-caption font-medium text-primary-600 hover:underline">
                    Set as primary
                  </button>
                )}
                <button
                  onClick={() => handleDelete(m.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-error-bg hover:text-error transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        {methods.length === 1 && (
          <p className="mt-3 flex items-center gap-1.5 text-caption text-neutral-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Minimum 1 payment method required. Add another before you can remove this one.
          </p>
        )}
      </SectionCard>

      <SectionCard title="Payout schedule" description="When earnings are transferred to your account">
        <div className="flex flex-col gap-3">
          {[
            { label: 'Daily',   desc: 'Payouts every business day' },
            { label: 'Weekly',  desc: 'Every Monday'               },
            { label: 'Monthly', desc: 'On the 1st of each month'   },
          ].map((opt, i) => (
            <label key={opt.label} className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 hover:bg-neutral-50 transition-colors">
              <input type="radio" name="payout_schedule" defaultChecked={i === 1} className="h-4 w-4 accent-primary-500" />
              <div>
                <p className="text-small font-medium text-neutral-900">{opt.label}</p>
                <p className="text-caption text-neutral-500">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default PaymentsTab;
