import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Check, Package2, Plus, Trash2, Pencil, Tag } from 'lucide-react';
import { cn } from '../../../utils/classNames.js';
import { getPricingConfig, updateBundle, addBundle, removeBundle } from '../../../lib/mock/mockPricing.js';

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        enabled ? 'bg-primary-600' : 'bg-neutral-200'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  );
}

const emptyBundle = {
  name: '',
  description: '',
  retailPrice: '',
  commercialPrice: '',
  retailSavings: '',
  commercialSavings: '',
  services: [],
  enabled: true,
};

function BundleModal({ title, bundle, onChange, onSave, onClose }) {
  const inputClass =
    'mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100';
  const numClass =
    'mt-1 block w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono tabular-nums focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <h2 className="font-semibold text-neutral-900">{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-xl leading-none">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-neutral-600">Bundle Name</label>
            <input
              type="text"
              value={bundle.name}
              onChange={e => onChange({ ...bundle, name: e.target.value })}
              placeholder="e.g. Weekly Wash Package"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-600">Description</label>
            <input
              type="text"
              value={bundle.description}
              onChange={e => onChange({ ...bundle, description: e.target.value })}
              placeholder="Short description of this bundle"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-neutral-600">Retail Price (GH₵)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={bundle.retailPrice}
                onChange={e => onChange({ ...bundle, retailPrice: e.target.value })}
                className={numClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">Commercial Price (GH₵)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={bundle.commercialPrice}
                onChange={e => onChange({ ...bundle, commercialPrice: e.target.value })}
                className={numClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">Retail Savings (GH₵)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={bundle.retailSavings}
                onChange={e => onChange({ ...bundle, retailSavings: e.target.value })}
                className={numClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-600">Commercial Savings (GH₵)</label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={bundle.commercialSavings}
                onChange={e => onChange({ ...bundle, commercialSavings: e.target.value })}
                className={numClass}
              />
            </div>
          </div>
          <div className="rounded-lg bg-neutral-50 px-4 py-3 text-xs text-neutral-500">
            Services can be added after creating the bundle via the bundle editor.
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-neutral-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            <Save className="h-3.5 w-3.5" /> Save Bundle
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BundlePricingPage() {
  const [bundles, setBundles] = useState(() => getPricingConfig().bundles);
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBundle, setNewBundle] = useState({ ...emptyBundle });

  function handleToggleBundle(id, enabled) {
    updateBundle(id, { enabled });
    setBundles(getPricingConfig().bundles);
  }

  function handleDelete(id) {
    removeBundle(id);
    setBundles(getPricingConfig().bundles);
  }

  function openEdit(bundle) {
    setEditingId(bundle.id);
    setEditDraft({ ...bundle });
  }

  function handleEditSave() {
    if (!editDraft) return;
    updateBundle(editingId, {
      name: editDraft.name,
      description: editDraft.description,
      retailPrice: Number(editDraft.retailPrice),
      commercialPrice: Number(editDraft.commercialPrice),
      retailSavings: Number(editDraft.retailSavings),
      commercialSavings: Number(editDraft.commercialSavings),
    });
    setBundles(getPricingConfig().bundles);
    setEditingId(null);
    setEditDraft(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleAddSave() {
    if (!newBundle.name) return;
    addBundle({
      name: newBundle.name,
      description: newBundle.description,
      retailPrice: Number(newBundle.retailPrice) || 0,
      commercialPrice: Number(newBundle.commercialPrice) || 0,
      retailSavings: Number(newBundle.retailSavings) || 0,
      commercialSavings: Number(newBundle.commercialSavings) || 0,
      services: [],
      enabled: true,
    });
    setBundles(getPricingConfig().bundles);
    setNewBundle({ ...emptyBundle });
    setShowAddModal(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <Link to="/services" className="hover:text-neutral-800">Pricing</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-neutral-800 font-medium">Service Bundles</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Service Bundles</h1>
          <p className="mt-1 text-small text-neutral-500">
            Create and manage bundled service packages at combined pricing.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-small font-semibold text-white hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Bundle
        </button>
      </div>

      {bundles.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-12 text-center">
          <Package2 className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">No bundles yet. Create your first bundle to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {bundles.map(bundle => (
            <div key={bundle.id} className="rounded-xl border border-neutral-200 bg-white p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                    <Package2 className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{bundle.name}</h3>
                    <p className="text-xs text-neutral-500">{bundle.description}</p>
                  </div>
                </div>
                <Toggle enabled={bundle.enabled} onChange={v => handleToggleBundle(bundle.id, v)} />
              </div>

              {bundle.services && bundle.services.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {bundle.services.map(svc => (
                    <span
                      key={svc.serviceId}
                      className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700"
                    >
                      <Tag className="h-3 w-3" />
                      {svc.serviceId} × {svc.qty}
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 rounded-lg bg-neutral-50 p-3 text-sm">
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">Retail</p>
                  <p className="font-mono font-semibold tabular-nums">GH₵ {Number(bundle.retailPrice).toFixed(2)}</p>
                  <p className="text-xs text-success">save GH₵ {Number(bundle.retailSavings).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-0.5">Commercial</p>
                  <p className="font-mono font-semibold tabular-nums">GH₵ {Number(bundle.commercialPrice).toFixed(2)}</p>
                  <p className="text-xs text-success">save GH₵ {Number(bundle.commercialSavings).toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => openEdit(bundle)}
                  className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(bundle.id)}
                  className="flex items-center gap-1 rounded-lg border border-error/20 px-3 py-1.5 text-xs font-medium text-error hover:bg-error/5 transition-colors"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingId && editDraft && (
        <BundleModal
          title="Edit Bundle"
          bundle={editDraft}
          onChange={setEditDraft}
          onSave={handleEditSave}
          onClose={() => { setEditingId(null); setEditDraft(null); }}
        />
      )}

      {showAddModal && (
        <BundleModal
          title="Add Bundle"
          bundle={newBundle}
          onChange={setNewBundle}
          onSave={handleAddSave}
          onClose={() => { setShowAddModal(false); setNewBundle({ ...emptyBundle }); }}
        />
      )}

      {saved && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-medium text-white shadow-lg z-50">
          <Check className="h-4 w-4" /> Changes saved
        </div>
      )}
    </div>
  );
}
