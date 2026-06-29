import { useState } from 'react';
import { Plus, MapPin, Phone, Building2, Pencil, Trash2, ChevronDown } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import Toggle from '../../components/ui/Toggle.jsx';
import { businessProfile } from '../../data/mock.js';
import { DAYS_SHORT as DAYS } from '../../utils/geoOptions.js';

const OutletHours = ({ hours }) => (
  <div className="mt-3 grid grid-cols-7 gap-1 text-center">
    {DAYS.map(d => {
      const h = hours[d];
      return (
        <div key={d}>
          <p className="text-[10px] font-semibold uppercase text-neutral-400">{d}</p>
          {h.enabled
            ? <p className="mt-0.5 text-[10px] leading-snug text-neutral-700">{h.open}<br />{h.close}</p>
            : <p className="mt-0.5 text-[10px] text-neutral-300">Closed</p>
          }
        </div>
      );
    })}
  </div>
);

const OutletsTab = () => {
  const [outlets, setOutlets] = useState(businessProfile.outlets);
  const [expanded, setExpanded] = useState(null);

  const toggleEnabled = id => setOutlets(prev => prev.map(o => o.id === id ? { ...o, enabled: !o.enabled } : o));

  return (
    <div className="space-y-6">
      <SectionCard
        title="Outlets & factories"
        description={`${outlets.length} locations registered`}
        action={<Button size="sm"><Plus className="h-3.5 w-3.5" /> Add outlet</Button>}
      >
        <div className="divide-y divide-neutral-100">
          {outlets.map(outlet => (
            <div key={outlet.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary-50">
                    <Building2 className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-small font-semibold text-neutral-900">{outlet.name}</p>
                      <span className="font-mono text-caption text-neutral-400">{outlet.abbrev}</span>
                      {!outlet.enabled && (
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#FFF4E0', color: '#945800' }}>
                          Disabled
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-neutral-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{outlet.address}</span>
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{outlet.phone}</span>
                    </div>
                    <span className="mt-1.5 inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-caption font-medium text-neutral-600">
                      {outlet.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-caption text-neutral-500">{outlet.enabled ? 'Enabled' : 'Disabled'}</span>
                    <Toggle checked={outlet.enabled} onChange={() => toggleEnabled(outlet.id)} label={`Toggle ${outlet.name}`} />
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === outlet.id ? null : outlet.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${expanded === outlet.id ? 'rotate-180' : ''}`} />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:bg-error-bg hover:text-error transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {expanded === outlet.id && (
                <div className="mt-3 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                  <p className="text-caption font-semibold uppercase tracking-wide text-neutral-400">Operating hours</p>
                  <OutletHours hours={outlet.hours} />
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default OutletsTab;
