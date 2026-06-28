import { useState } from 'react';
import { Button } from '../../../components/ui/Button.jsx';

const RETAIL_SERVICES = ['Washing', 'Ironing', 'Dry Cleaning', 'Wash & Iron', 'Wash & Fold'];
const COMMERCIAL_SERVICES = ['Bulk Washing', 'Linen Service', 'Uniform Cleaning', 'Industrial Laundry'];
const DURATION_DAYS  = ['1', '2', '3', '4', '5', '6', '7'];
const DURATION_HOURS = ['6', '8', '12', '18', '24', '36', '48'];

function validate(f) {
  const e = {};
  if (!f.businessTypes.length) { e.businessTypes = 'Select at least one business type'; }
  if (f.businessTypes.includes('Retail')     && !f.retailServices.length)     e.retailServices     = 'Select at least one retail service';
  if (f.businessTypes.includes('Commercial') && !f.commercialServices.length) e.commercialServices = 'Select at least one commercial service';
  if (f.expressEnabled) {
    const stdSecs  = f.standardUnit === 'days' ? +f.standardDuration * 86400 : +f.standardDuration * 3600;
    const expSecs  = f.expressUnit  === 'days' ? +f.expressDuration  * 86400 : +f.expressDuration  * 3600;
    if (expSecs >= stdSecs) e.expressDuration = 'Express duration must be shorter than standard';
    if (!f.expressSurcharge || +f.expressSurcharge <= 0) e.expressSurcharge = 'Express surcharge must be greater than 0%';
  }
  return e;
}

function CheckboxGroup({ label, items, selected, onChange, error, cols = 3 }) {
  function toggle(item) {
    onChange(selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item]);
  }
  return (
    <div>
      <p className="mb-2 text-small font-medium text-neutral-700">{label}</p>
      <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {items.map(item => (
          <label key={item} className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2.5 text-small transition-colors ${
            selected.includes(item)
              ? 'border-primary-300 bg-primary-50 text-primary-700 font-medium'
              : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
          }`}>
            <input type="checkbox" className="sr-only" checked={selected.includes(item)} onChange={() => toggle(item)} />
            <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
              selected.includes(item) ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300 bg-white'
            }`}>
              {selected.includes(item) && '✓'}
            </span>
            {item}
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-caption text-error">{error}</p>}
    </div>
  );
}

function TurnaroundRow({ label, durationVal, durationUnit, surcharge, showSurcharge,
  onDuration, onUnit, onSurcharge, error, errorSurcharge }) {
  const options = durationUnit === 'days' ? DURATION_DAYS : DURATION_HOURS;
  const selectCls = 'rounded-md border border-neutral-200 bg-white px-3 py-2 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all';
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="min-w-[140px] text-small font-medium text-neutral-700">{label}</span>
        <select className={selectCls} value={durationVal} onChange={e => onDuration(e.target.value)}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <select className={selectCls} value={durationUnit} onChange={e => { onUnit(e.target.value); onDuration('1'); }}>
          <option value="days">days</option>
          <option value="hours">hours</option>
        </select>
        {showSurcharge && (
          <div className="flex items-center gap-2">
            <span className="text-small text-neutral-500">+</span>
            <div className="relative">
              <input type="number" min="1" max="999"
                className={`w-20 rounded-md border px-3 py-2 text-small text-neutral-900 outline-none focus:ring-2 transition-all pr-7 ${
                  errorSurcharge ? 'border-error focus:ring-error/20' : 'border-neutral-200 focus:border-primary-400 focus:ring-primary-100'
                }`}
                value={surcharge} onChange={e => onSurcharge(e.target.value)} />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-small text-neutral-400">%</span>
            </div>
            <span className="text-small text-neutral-500">express surcharge</span>
          </div>
        )}
      </div>
      {error          && <p className="text-caption text-error">{error}</p>}
      {errorSurcharge && <p className="text-caption text-error">{errorSurcharge}</p>}
    </div>
  );
}

export default function Step3Services({ data, onNext, onBack, onSaveDraft }) {
  const [f, setF] = useState({ ...data });
  const [errors, setErrors] = useState({});

  function set(field, value) {
    setF(p => ({ ...p, [field]: value }));
    setErrors(e => ({ ...e, [field]: '', retailServices: '', commercialServices: '' }));
  }

  function toggleBusinessType(type) {
    const current = f.businessTypes;
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    set('businessTypes', next);
  }

  function handleNext() {
    const errs = validate(f);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(f);
  }

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Service Configuration</h2>
      <p className="mt-1 mb-7 text-body text-neutral-500">
        Select what your laundry offers and set your turnaround times.
      </p>

      <div className="space-y-7">

        {/* Business type */}
        <div>
          <p className="mb-2 text-small font-semibold text-neutral-700">Laundry business type <span className="text-error">*</span></p>
          <p className="mb-3 text-caption text-neutral-500">Select all that apply — determines which services you can offer.</p>
          <div className="flex gap-3">
            {['Retail', 'Commercial'].map(type => (
              <label key={type} className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                f.businessTypes.includes(type)
                  ? 'border-primary-300 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}>
                <input type="checkbox" className="sr-only" checked={f.businessTypes.includes(type)}
                  onChange={() => toggleBusinessType(type)} />
                <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border font-bold text-[11px] ${
                  f.businessTypes.includes(type) ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300 bg-white'
                }`}>{f.businessTypes.includes(type) && '✓'}</span>
                <div>
                  <p className={`text-small font-semibold ${f.businessTypes.includes(type) ? 'text-primary-700' : 'text-neutral-700'}`}>
                    {type} Laundry
                  </p>
                  <p className="text-caption text-neutral-500">
                    {type === 'Retail' ? 'Individual customers (B2C)' : 'Businesses & institutions (B2B)'}
                  </p>
                </div>
              </label>
            ))}
          </div>
          {errors.businessTypes && <p className="mt-1.5 text-caption text-error">{errors.businessTypes}</p>}
        </div>

        {/* Retail services */}
        {f.businessTypes.includes('Retail') && (
          <CheckboxGroup
            label="Retail services *"
            items={RETAIL_SERVICES}
            selected={f.retailServices}
            onChange={v => set('retailServices', v)}
            error={errors.retailServices}
          />
        )}

        {/* Commercial services */}
        {f.businessTypes.includes('Commercial') && (
          <CheckboxGroup
            label="Commercial services *"
            items={COMMERCIAL_SERVICES}
            selected={f.commercialServices}
            onChange={v => set('commercialServices', v)}
            error={errors.commercialServices}
            cols={2}
          />
        )}

        {/* Turnaround */}
        <div className="rounded-lg border border-neutral-200 p-5 space-y-4">
          <div>
            <p className="text-small font-semibold text-neutral-800">Turnaround times</p>
            <p className="text-caption text-neutral-500 mt-0.5">Set how long orders take to complete.</p>
          </div>

          <TurnaroundRow
            label="Standard (required)"
            durationVal={f.standardDuration}
            durationUnit={f.standardUnit}
            onDuration={v => set('standardDuration', v)}
            onUnit={v => set('standardUnit', v)}
          />

          {/* Express toggle */}
          <div className="pt-2 border-t border-neutral-100">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                f.expressEnabled ? 'bg-primary-500' : 'bg-neutral-200'
              }`} onClick={() => set('expressEnabled', !f.expressEnabled)}>
                <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  f.expressEnabled ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </div>
              <span className="text-small font-medium text-neutral-700">Offer express service</span>
            </label>

            {f.expressEnabled && (
              <div className="mt-4">
                <TurnaroundRow
                  label="Express duration"
                  durationVal={f.expressDuration}
                  durationUnit={f.expressUnit}
                  surcharge={f.expressSurcharge}
                  showSurcharge
                  onDuration={v => set('expressDuration', v)}
                  onUnit={v => set('expressUnit', v)}
                  onSurcharge={v => set('expressSurcharge', v)}
                  error={errors.expressDuration}
                  errorSurcharge={errors.expressSurcharge}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <div className="flex gap-3">
          <Button variant="ghost" type="button" onClick={() => onSaveDraft(f)}>Save draft</Button>
          <Button type="button" onClick={handleNext}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
