import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import Toggle from '../../components/ui/Toggle.jsx';
import { businessProfile } from '../../data/mock.js';

const ServiceGroup = ({ title, services, onToggle }) => (
  <div>
    <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-neutral-400">{title}</p>
    <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-white">
      {services.map(s => (
        <div key={s.id} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className={`text-small font-medium ${s.active ? 'text-neutral-900' : 'text-neutral-400'}`}>{s.name}</p>
            <p className="text-caption text-neutral-400">{s.price}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-caption font-medium ${s.active ? 'text-success' : 'text-neutral-400'}`}>
              {s.active ? 'Active' : 'Inactive'}
            </span>
            <Toggle checked={s.active} onChange={() => onToggle(s.id)} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ServicesTab = () => {
  const init = businessProfile.services;
  const [retail,     setRetail]     = useState(init.retail);
  const [commercial, setCommercial] = useState(init.commercial);
  const [turnaround, setTurnaround] = useState(init.turnaround);
  const [saved, setSaved] = useState(false);

  const toggleRetail     = id => { setRetail(p => p.map(s => s.id === id ? { ...s, active: !s.active } : s)); setSaved(false); };
  const toggleCommercial = id => { setCommercial(p => p.map(s => s.id === id ? { ...s, active: !s.active } : s)); setSaved(false); };

  const tooFew = retail.filter(s => s.active).length + commercial.filter(s => s.active).length < 1;

  return (
    <div className="space-y-6">
      {saved && <Alert type="success" title="Services updated">Your service catalogue has been saved.</Alert>}

      <SectionCard title="Service catalogue" description="Toggle which services your business offers">
        <div className="space-y-5">
          <ServiceGroup title="Retail services"     services={retail}     onToggle={toggleRetail}     />
          <ServiceGroup title="Commercial services" services={commercial} onToggle={toggleCommercial} />
        </div>
        {tooFew && <p className="mt-3 text-caption text-error">At least one service must be active.</p>}
      </SectionCard>

      <SectionCard title="Turnaround settings" description="Applies to all services unless overridden per outlet">
        <div className="grid grid-cols-3 gap-5">
          {[
            { key: 'standard',         label: 'Standard turnaround'      },
            { key: 'express',          label: 'Express turnaround'       },
            { key: 'expressSurcharge', label: 'Express surcharge (%)', type: 'number' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="mb-1.5 block text-small font-medium text-neutral-700">{label}</label>
              <input
                type={type ?? 'text'}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-small text-neutral-900 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                value={turnaround[key]}
                onChange={e => { setTurnaround(t => ({ ...t, [key]: type === 'number' ? +e.target.value : e.target.value })); setSaved(false); }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => { setRetail(init.retail); setCommercial(init.commercial); setTurnaround(init.turnaround); setSaved(false); }}>
          Discard changes
        </Button>
        <Button disabled={tooFew} onClick={() => setSaved(true)}>Save changes</Button>
      </div>
    </div>
  );
};

export default ServicesTab;
