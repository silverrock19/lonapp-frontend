import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, PackageSearch, Shield, ShieldAlert, Plus, X, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import {
  getAllLostItems, getAllFoundItems, getAllDamageRecords, getAllQuarantine,
  getExceptionStats, getOpenLostItems,
  reportLostItem, updateLostItem, addLostNote,
  registerFoundItem, matchFoundToLost,
  recordDamage, updateDamageRecord,
  addToQuarantine, releaseFromQuarantine, updateQuarantine,
  LOST_STATUSES, DAMAGE_STAGES, DAMAGE_SEVERITY, DAMAGE_TYPES,
  QUARANTINE_REASONS, QUARANTINE_STATUSES, QUARANTINE_DISPOSITIONS,
} from '../../lib/mock/mockExceptions.js';
import { getAllItems, getItemByBarcode } from '../../lib/mock/mockItems.js';
import { getRecentCheckpoints } from '../../lib/mock/mockTracking.js';
import ScannerInput from '../../components/ui/ScannerInput.jsx';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const SUSPECTED_CAUSES = [
  { id: '', label: 'Select cause…' },
  { id: 'stuck_machine', label: 'Stuck in Machine' },
  { id: 'mixed_batch',   label: 'Mixed with Wrong Batch' },
  { id: 'wrong_bag',     label: 'Wrong Bag Assignment' },
  { id: 'theft',         label: 'Theft' },
  { id: 'transit',       label: 'Lost in Transit' },
  { id: 'unknown',       label: 'Unknown' },
];

// ── Shared helpers ────────────────────────────────────────

function StatusBadge({ colorClass, label }) {
  return <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold', colorClass)}>{label}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 overflow-y-auto">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg my-8">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <p className="text-small font-bold text-neutral-900">{title}</p>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 hover:bg-neutral-100">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-3">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-caption font-semibold text-neutral-700">{label}</label>
      {children}
    </div>
  );
}

function Input({ ...props }) {
  return <input className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400" {...props} />;
}

function Textarea({ ...props }) {
  return <textarea className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400" rows={3} {...props} />;
}

function Select({ children, ...props }) {
  return <select className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-small outline-none focus:border-primary-300" {...props}>{children}</select>;
}

// ── Tab: Lost Items (US-0113) ─────────────────────────────

function LostItemsTab() {
  const [records, setRecords] = useState(getAllLostItems);
  const [showAdd, setShowAdd] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Form state
  const [form, setForm] = useState({ itemDesc: '', barcode: '', orderId: '', customerName: '', lastSeen: '', lastSeenAt: '', suspectedCause: '', reportedBy: 'Ama Otu' });

  function handleScan(barcode) {
    const item = getItemByBarcode(barcode);
    if (!item) return;
    const checkpoints = getRecentCheckpoints(50).filter(c => c.itemId === item.id);
    const lastChk = checkpoints[0];
    setForm(f => ({
      ...f,
      barcode,
      itemDesc: `${item.typeName} × ${item.qty}`,
      orderId:  item.orderId ?? '',
      customerName: item.customerName ?? '',
      lastSeen: lastChk ? lastChk.location ?? '' : item.location ?? '',
      lastSeenAt: lastChk ? lastChk.scanAt?.slice(0, 16) ?? '' : '',
    }));
  }

  function handleReport() {
    if (!form.itemDesc.trim()) return;
    reportLostItem({ ...form, suspectedCause: form.suspectedCause, lastSeenAt: form.lastSeenAt });
    setRecords(getAllLostItems());
    setShowAdd(false);
    setForm({ itemDesc: '', barcode: '', orderId: '', customerName: '', lastSeen: '', lastSeenAt: '', suspectedCause: '', reportedBy: 'Ama Otu' });
  }

  function handleStatus(id, status) {
    updateLostItem(id, { status, resolvedAt: status === 'found' || status === 'compensation' ? '2026-06-29T12:00:00' : null, resolvedBy: 'Ama Otu' });
    setRecords(getAllLostItems());
  }

  function handleNote(id) {
    if (!noteText.trim()) return;
    addLostNote(id, 'Ama Otu', noteText);
    setNoteText('');
    setRecords(getAllLostItems());
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-caption text-neutral-500">{records.filter(r => r.status === 'reported' || r.status === 'investigating').length} open reports</p>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-3.5 w-3.5" /> Report Lost Item
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
          <AlertTriangle className="h-6 w-6 text-neutral-300 mb-2" />
          <p className="text-caption text-neutral-400">No lost item reports</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(r => {
            const s = LOST_STATUSES[r.status];
            const open = expanded === r.id;
            return (
              <div key={r.id} className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                <div className="flex items-start gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[10px] text-neutral-500">{r.id}</span>
                      <StatusBadge colorClass={s?.color} label={s?.label} />
                    </div>
                    <p className="text-small font-semibold text-neutral-900">{r.itemDesc}</p>
                    <p className="text-[10px] text-neutral-500">{r.customerName} · {r.orderId}</p>
                    {r.lastSeen && <p className="text-[10px] text-neutral-400 mt-0.5">Last seen: {r.lastSeen}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {r.status === 'reported' && (
                      <button onClick={() => handleStatus(r.id, 'investigating')} className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">
                        Investigate
                      </button>
                    )}
                    {(r.status === 'reported' || r.status === 'investigating') && (
                      <button onClick={() => handleStatus(r.id, 'found')} className="rounded-md border border-success/30 bg-success/5 px-2 py-1 text-[10px] font-semibold text-success hover:bg-success/10">
                        Mark Found
                      </button>
                    )}
                    <button onClick={() => setExpanded(open ? null : r.id)} className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100">
                      {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                {open && (
                  <div className="border-t border-neutral-100 bg-neutral-50 p-4 space-y-3">
                    <div className="space-y-1.5">
                      {r.notes.map((n, i) => (
                        <div key={i} className="rounded-md border border-neutral-200 bg-white px-3 py-2">
                          <p className="text-[10px] font-semibold text-neutral-700">{n.author} · {n.at.slice(11, 16)}</p>
                          <p className="text-caption text-neutral-600 mt-0.5">{n.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={noteText}
                        onChange={e => setNoteText(e.target.value)}
                        placeholder="Add investigation note…"
                        className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-caption outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 placeholder:text-neutral-400"
                      />
                      <button onClick={() => handleNote(r.id)} className="flex-shrink-0 rounded-lg border border-primary-300 bg-primary-50 px-3 py-2 text-caption font-semibold text-primary-700 hover:bg-primary-100">
                        Add
                      </button>
                    </div>
                    {(r.status === 'reported' || r.status === 'investigating') && (
                      <button
                        onClick={() => handleStatus(r.id, 'unresolved')}
                        className="text-caption text-neutral-400 hover:text-error transition-colors"
                      >
                        Mark as unresolved / close report
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Report Lost Item" onClose={() => setShowAdd(false)}>
          {/* Scanner for auto-populate */}
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
            <p className="text-[10px] font-semibold text-neutral-500 mb-1.5">Scan barcode to auto-fill</p>
            <ScannerInput onScan={handleScan} placeholder="Scan barcode…" compact />
          </div>
          <Field label="Item description"><Input value={form.itemDesc} onChange={e => setForm(f => ({ ...f, itemDesc: e.target.value }))} placeholder="e.g. Silk Suit × 1" /></Field>
          <Field label="Barcode (if known)"><Input value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="LA-XXXXXXXX-XXXXXX" /></Field>
          <Field label="Order ID"><Input value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} placeholder="ORD-2026-XXXXXXXX" /></Field>
          <Field label="Customer name"><Input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Full name" /></Field>
          <Field label="Last known location"><Input value={form.lastSeen} onChange={e => setForm(f => ({ ...f, lastSeen: e.target.value }))} placeholder="e.g. Sorting Bay — CleanPro Osu" /></Field>
          <Field label="Last seen at (date/time)">
            <input type="datetime-local" value={form.lastSeenAt} onChange={e => setForm(f => ({ ...f, lastSeenAt: e.target.value }))}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-small outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100" />
          </Field>
          <Field label="Suspected cause">
            <Select value={form.suspectedCause} onChange={e => setForm(f => ({ ...f, suspectedCause: e.target.value }))}>
              {SUSPECTED_CAUSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </Select>
          </Field>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="danger" size="sm" className="flex-1" disabled={!form.itemDesc.trim()} onClick={handleReport}>
              Report Lost
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Found Items (US-0114) ────────────────────────────

function FoundItemsTab() {
  const [records, setRecords] = useState(getAllFoundItems);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ description: '', foundBy: 'Kojo Mensah', foundLocation: '', notes: '' });

  const openLost = getOpenLostItems();

  function handleRegister() {
    if (!form.description.trim()) return;
    registerFoundItem({ ...form });
    setRecords(getAllFoundItems());
    setShowAdd(false);
    setForm({ description: '', foundBy: 'Kojo Mensah', foundLocation: '', notes: '' });
  }

  function handleMatch(foundId, lostId) {
    matchFoundToLost(foundId, lostId);
    setRecords(getAllFoundItems());
  }

  const STATUS_COLORS = {
    unmatched: 'bg-amber-50 text-amber-700',
    matched:   'bg-success/10 text-success',
    returned:  'bg-neutral-100 text-neutral-500',
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-caption text-neutral-500">{records.filter(r => r.status === 'unmatched').length} unmatched items</p>
        <Button variant="accent" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-3.5 w-3.5" /> Register Found Item
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
          <PackageSearch className="h-6 w-6 text-neutral-300 mb-2" />
          <p className="text-caption text-neutral-400">No found items registered</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(r => (
            <div key={r.id} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[10px] text-neutral-500">{r.id}</span>
                    <StatusBadge colorClass={STATUS_COLORS[r.status]} label={r.status === 'unmatched' ? 'Unmatched' : r.status === 'matched' ? 'Matched' : 'Returned'} />
                  </div>
                  <p className="text-small font-semibold text-neutral-900 leading-snug">{r.description}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{r.foundBy} · {r.foundLocation}</p>
                </div>
              </div>

              {/* Suggested matches */}
              {r.status === 'unmatched' && openLost.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                  <p className="text-[10px] font-semibold text-amber-800 uppercase tracking-wider">Suggested matches from open lost reports</p>
                  {openLost.map(lost => (
                    <div key={lost.id} className="flex items-center gap-2 rounded-md border border-amber-200 bg-white px-2 py-1.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-caption font-semibold text-neutral-800">{lost.itemDesc}</p>
                        <p className="text-[10px] text-neutral-500">{lost.customerName} · {lost.lastSeen}</p>
                      </div>
                      <button
                        onClick={() => handleMatch(r.id, lost.id)}
                        className="flex-shrink-0 rounded-md border border-success/30 bg-success/10 px-2 py-1 text-[10px] font-semibold text-success hover:bg-success/20"
                      >
                        Confirm Match
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {r.status === 'matched' && r.matchedLostId && (
                <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                  <p className="text-caption text-success font-medium">Matched to {r.matchedLostId}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="Register Found Item" onClose={() => setShowAdd(false)}>
          <Field label="Item description"><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the item in detail — type, color, fabric, any markings…" /></Field>
          <Field label="Found by"><Input value={form.foundBy} onChange={e => setForm(f => ({ ...f, foundBy: e.target.value }))} /></Field>
          <Field label="Found location"><Input value={form.foundLocation} onChange={e => setForm(f => ({ ...f, foundLocation: e.target.value }))} placeholder="e.g. Drying Area — CleanPro Osu" /></Field>
          <Field label="Additional notes"><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Condition, estimated value, etc." /></Field>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="primary" size="sm" className="flex-1" disabled={!form.description.trim()} onClick={handleRegister}>
              Register
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Damage Records (US-0115) ─────────────────────────

function DamageTab() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(getAllDamageRecords);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ itemDesc: '', barcode: '', orderId: '', customerName: '', stage: 'washing', damageType: '', severity: 'minor', description: '', photoCount: 0, recordedBy: 'Ama Otu' });

  function handleRecord() {
    if (!form.itemDesc.trim() || !form.damageType) return;
    recordDamage({ ...form, photos: form.photoCount });
    setRecords(getAllDamageRecords());
    setShowAdd(false);
    setForm({ itemDesc: '', barcode: '', orderId: '', customerName: '', stage: 'washing', damageType: '', severity: 'minor', description: '', photoCount: 0, recordedBy: 'Ama Otu' });
  }

  function handleResolve(id) {
    updateDamageRecord(id, { resolved: true });
    setRecords(getAllDamageRecords());
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-caption text-neutral-500">{records.filter(r => !r.resolved).length} unresolved</p>
        <Button variant="warning" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-3.5 w-3.5" /> Record Damage
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
          <ShieldAlert className="h-6 w-6 text-neutral-300 mb-2" />
          <p className="text-caption text-neutral-400">No damage records</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(r => {
            const sev = DAMAGE_SEVERITY.find(s => s.id === r.severity);
            const stage = DAMAGE_STAGES.find(s => s.id === r.stage);
            return (
              <div key={r.id} className={cn('rounded-xl border bg-white p-4 shadow-sm', r.resolved ? 'opacity-60' : 'border-neutral-200')}>
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-mono text-[10px] text-neutral-500">{r.id}</span>
                      <span className={cn('inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold', sev?.color)}>{sev?.label}</span>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">{stage?.label}</span>
                      {r.resolved && <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">Resolved</span>}
                    </div>
                    <p className="text-small font-semibold text-neutral-900">{r.damageType}</p>
                    <p className="text-caption text-neutral-600 mt-0.5">{r.description}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">{r.itemDesc} · {r.customerName}</p>
                    <p className="text-[10px] text-neutral-400">{r.recordedBy} · {r.recordedAt.slice(0, 10)}</p>
                  </div>
                  {!r.resolved && (
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleResolve(r.id)}
                        className="rounded-md border border-success/30 bg-success/5 px-2 py-1 text-[10px] font-semibold text-success hover:bg-success/10 whitespace-nowrap"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => {
                          if (r.orderId) navigate(`/app/orders/${r.orderId}/report`);
                          else alert('No order ID linked to this damage record');
                        }}
                        className="rounded-md border border-neutral-200 px-2 py-1 text-[10px] text-neutral-500 hover:bg-neutral-50 whitespace-nowrap"
                      >
                        Link Dispute
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Record Damage" onClose={() => setShowAdd(false)}>
          <Field label="Item description"><Input value={form.itemDesc} onChange={e => setForm(f => ({ ...f, itemDesc: e.target.value }))} placeholder="e.g. Dress Shirt × 2" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Barcode"><Input value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="LA-…" /></Field>
            <Field label="Order ID"><Input value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} placeholder="ORD-…" /></Field>
          </div>
          <Field label="Customer name"><Input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stage">
              <Select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                {DAMAGE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </Select>
            </Field>
            <Field label="Severity">
              <Select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
                {DAMAGE_SEVERITY.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Damage type">
            <Select value={form.damageType} onChange={e => setForm(f => ({ ...f, damageType: e.target.value }))}>
              <option value="">Select type…</option>
              {DAMAGE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Description"><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the damage in detail…" /></Field>
          <Field label="Photos">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: form.photoCount }).map((_, i) => (
                <div key={i} className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-slate-600">
                  <span className="text-[9px] text-white/80">Photo {i + 1}</span>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, photoCount: f.photoCount + 1 }))}
                className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 text-neutral-400 hover:border-primary-300 hover:text-primary-400 transition-colors"
              >
                <span className="text-xl leading-none">+</span>
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">Mock camera — tap + to add photo placeholder</p>
          </Field>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="warning" size="sm" className="flex-1" disabled={!form.itemDesc.trim() || !form.damageType} onClick={handleRecord}>
              Record Damage
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Tab: Quarantine (US-0125) ─────────────────────────────

function QuarantineTab() {
  const [records, setRecords] = useState(getAllQuarantine);
  const [showAdd, setShowAdd] = useState(false);
  const [releasing, setReleasing] = useState(null); // id being released
  const [disposition, setDisposition] = useState('returned');
  const [form, setForm] = useState({ itemDesc: '', barcode: '', orderId: '', customerName: '', reason: 'contamination', notes: '', heldBy: 'Ama Otu' });

  function handleAdd() {
    if (!form.itemDesc.trim()) return;
    addToQuarantine({ ...form });
    setRecords(getAllQuarantine());
    setShowAdd(false);
    setForm({ itemDesc: '', barcode: '', orderId: '', customerName: '', reason: 'contamination', notes: '', heldBy: 'Ama Otu' });
  }

  function handleRelease(id) {
    releaseFromQuarantine(id, 'Ama Otu', disposition);
    setRecords(getAllQuarantine());
    setReleasing(null);
  }

  function handleReview(id) {
    updateQuarantine(id, { status: 'under_review' });
    setRecords(getAllQuarantine());
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-caption text-neutral-500">{records.filter(r => r.status === 'held' || r.status === 'under_review').length} items in hold</p>
        <Button variant="danger" size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-3.5 w-3.5" /> Add to Quarantine
        </Button>
      </div>

      {records.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-12 text-center">
          <Shield className="h-6 w-6 text-neutral-300 mb-2" />
          <p className="text-caption text-neutral-400">No quarantined items</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map(r => {
            const st = QUARANTINE_STATUSES[r.status];
            const reason = QUARANTINE_REASONS.find(q => q.id === r.reason);
            const active = r.status === 'held' || r.status === 'under_review';
            return (
              <div key={r.id} className={cn('rounded-xl border bg-white p-4 shadow-sm', active ? 'border-error/30' : 'border-neutral-200 opacity-60')}>
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-mono text-[10px] text-neutral-500">{r.id}</span>
                      <StatusBadge colorClass={st?.color} label={st?.label} />
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">{reason?.label ?? r.reason}</span>
                    </div>
                    <p className="text-small font-semibold text-neutral-900">{r.itemDesc}</p>
                    <p className="text-caption text-neutral-600 mt-0.5">{r.notes}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">{r.customerName} · {r.orderId}</p>
                    <p className="text-[10px] text-neutral-400">Held by {r.heldBy} · {r.heldAt.slice(11, 16)}</p>
                    {r.disposition && <p className="text-[10px] text-success mt-0.5">Disposition: {QUARANTINE_DISPOSITIONS.find(d => d.id === r.disposition)?.label ?? r.disposition}</p>}
                  </div>
                  {active && (
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {r.status === 'held' && (
                        <button onClick={() => handleReview(r.id)} className="rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100">
                          Start Review
                        </button>
                      )}
                      <button onClick={() => setReleasing(r.id)} className="rounded-md border border-success/30 bg-success/5 px-2 py-1 text-[10px] font-semibold text-success hover:bg-success/10">
                        Release
                      </button>
                    </div>
                  )}
                </div>

                {releasing === r.id && (
                  <div className="mt-3 rounded-lg border border-success/20 bg-success/5 p-3 space-y-2">
                    <p className="text-[10px] font-semibold text-neutral-700">Disposition</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUARANTINE_DISPOSITIONS.map(d => (
                        <button
                          key={d.id}
                          onClick={() => setDisposition(d.id)}
                          className={cn(
                            'rounded-md border px-2.5 py-1 text-[10px] font-medium transition-all',
                            disposition === d.id ? 'border-primary-400 bg-primary-50 text-primary-700' : 'border-neutral-200 text-neutral-600',
                          )}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setReleasing(null)} className="text-caption text-neutral-500 hover:text-neutral-700">Cancel</button>
                      <Button variant="accent" size="sm" onClick={() => handleRelease(r.id)}>Confirm Release</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showAdd && (
        <Modal title="Add Item to Quarantine" onClose={() => setShowAdd(false)}>
          <Field label="Item description"><Input value={form.itemDesc} onChange={e => setForm(f => ({ ...f, itemDesc: e.target.value }))} placeholder="e.g. Bed Linen × 3" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Barcode"><Input value={form.barcode} onChange={e => setForm(f => ({ ...f, barcode: e.target.value }))} placeholder="LA-…" /></Field>
            <Field label="Order ID"><Input value={form.orderId} onChange={e => setForm(f => ({ ...f, orderId: e.target.value }))} placeholder="ORD-…" /></Field>
          </div>
          <Field label="Customer name"><Input value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} /></Field>
          <Field label="Quarantine reason">
            <Select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}>
              {QUARANTINE_REASONS.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}
            </Select>
          </Field>
          <Field label="Notes"><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Describe the issue requiring quarantine…" /></Field>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button variant="danger" size="sm" className="flex-1" disabled={!form.itemDesc.trim()} onClick={handleAdd}>
              Quarantine Item
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────

const TABS = [
  { id: 'lost',       label: 'Lost Items',    icon: AlertTriangle,  statKey: 'openLost',         statColor: 'text-amber-600'  },
  { id: 'found',      label: 'Found Items',   icon: PackageSearch,  statKey: 'unmatchedFound',   statColor: 'text-blue-600'   },
  { id: 'damage',     label: 'Damage',        icon: ShieldAlert,    statKey: 'unresolvedDamage', statColor: 'text-error'      },
  { id: 'quarantine', label: 'Quarantine',    icon: Shield,         statKey: 'activeQuarantine', statColor: 'text-amber-700'  },
];

export default function ExceptionsPage() {
  const [tab, setTab] = useState('lost');
  const stats = getExceptionStats();

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Exceptions</h1>
        <p className="text-caption text-neutral-500">US-0113–0115 · 0125 · Lost items, found items, damage records and quarantine management</p>
      </div>

      {/* ── Stat tabs ────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-3">
        {TABS.map(t => {
          const Icon = t.icon;
          const count = stats[t.statKey];
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all',
                active ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100' : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm',
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-primary-600' : t.statColor)} />
              <p className={cn('text-h3 font-bold', active ? 'text-primary-700' : 'text-neutral-900')}>{count}</p>
              <p className="text-[10px] font-medium text-neutral-500 leading-tight">{t.label}</p>
            </button>
          );
        })}
      </div>

      {/* ── Tab content ──────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        {tab === 'lost'       && <LostItemsTab />}
        {tab === 'found'      && <FoundItemsTab />}
        {tab === 'damage'     && <DamageTab />}
        {tab === 'quarantine' && <QuarantineTab />}
      </div>
    </div>
  );
}
