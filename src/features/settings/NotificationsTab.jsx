import { useState } from 'react';
import { Info } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Toggle from '../../components/ui/Toggle.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { adminProfile } from '../../data/mock.js';

const NOTIF_EVENTS = [
  { key: 'newOrders',    label: 'New orders',    desc: 'When a customer places an order'     },
  { key: 'orderUpdates', label: 'Order updates',  desc: 'Status changes and delivery updates' },
  { key: 'payments',     label: 'Payments',       desc: 'Payment confirmations and payouts'   },
];

const NotificationsTab = () => {
  const init = adminProfile.notifications;
  const [prefs, setPrefs] = useState(JSON.parse(JSON.stringify(init)));
  const [saved, setSaved] = useState(false);

  const toggleChannel = (eventKey, channel) => {
    setPrefs(p => ({ ...p, [eventKey]: { ...p[eventKey], [channel]: !p[eventKey][channel] } }));
    setSaved(false);
  };
  const toggleBool = key => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Preferences saved">Notification settings updated.</Alert>}

      <SectionCard title="Notification channels" description="Choose how you receive alerts for each event type">
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">Event</th>
                {['Email', 'SMS', 'WhatsApp'].map(ch => (
                  <th key={ch} className="px-4 py-3 text-center text-caption font-semibold uppercase tracking-wide text-neutral-400">{ch}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {NOTIF_EVENTS.map(ev => (
                <tr key={ev.key}>
                  <td className="px-4 py-3.5">
                    <p className="text-small font-medium text-neutral-900">{ev.label}</p>
                    <p className="text-caption text-neutral-400">{ev.desc}</p>
                  </td>
                  {['email', 'sms', 'whatsapp'].map(ch => (
                    <td key={ch} className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        <Toggle checked={prefs[ev.key][ch]} onChange={() => toggleChannel(ev.key, ch)} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-lg px-4 py-3 text-caption" style={{ background: '#EAF2FC', color: '#093F84' }}>
          <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
          At least one channel must remain enabled per event type. WhatsApp requires a verified WhatsApp number in Business settings.
        </div>
      </SectionCard>

      <SectionCard title="Digest & marketing">
        <div className="divide-y divide-neutral-100">
          {[
            { key: 'weeklyReport', label: 'Weekly business report', desc: 'Analytics digest every Monday morning'    },
            { key: 'marketing',    label: 'Marketing & tips',       desc: 'Product updates and promotional content'  },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
              <div>
                <p className="text-small font-medium text-neutral-900">{item.label}</p>
                <p className="text-caption text-neutral-400">{item.desc}</p>
              </div>
              <Toggle checked={prefs[item.key]} onChange={() => toggleBool(item.key)} />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setPrefs(JSON.parse(JSON.stringify(init))); setSaved(false); }}>Discard</Button>
        <Button onClick={() => setSaved(true)}>Save preferences</Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
