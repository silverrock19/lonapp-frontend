import { Link } from 'react-router-dom';
import { Camera, ClipboardCheck, Droplets, ShieldAlert, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { getAllItems, ITEM_STATUS_LABELS, ITEM_STATUS_COLOR } from '../../lib/mock/mockItems.js';
import { getAllIntakeData, getIntakeStats } from '../../lib/mock/mockIntake.js';
import { cn } from '../../utils/classNames.js';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className={cn('mb-2 flex h-8 w-8 items-center justify-center rounded-lg', color)}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-h3 font-bold text-neutral-900">{value}</p>
      <p className="text-caption text-neutral-500">{label}</p>
    </div>
  );
}

function IntakeStatusBadge({ status }) {
  const styles = {
    completed:   'bg-success/10 text-success',
    in_progress: 'bg-primary-50 text-primary-700',
    pending:     'bg-neutral-100 text-neutral-600',
  };
  const labels = {
    completed:   'Done',
    in_progress: 'In Progress',
    pending:     'Pending',
  };
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', styles[status] ?? styles.pending)}>
      {labels[status] ?? 'Pending'}
    </span>
  );
}

export default function IntakePage() {
  const stats     = getIntakeStats();
  const items     = getAllItems();
  const intakeMap = Object.fromEntries(getAllIntakeData().map(d => [d.itemId, d]));

  const STAT_CARDS = [
    { icon: Clock,         label: 'Pending intake',   value: stats.pending,        color: 'bg-neutral-100 text-neutral-600'   },
    { icon: CheckCircle2,  label: 'Completed today',  value: stats.completedToday, color: 'bg-success/10 text-success'        },
    { icon: Droplets,      label: 'Stains documented',value: stats.totalStains,    color: 'bg-amber-50 text-amber-600'        },
    { icon: ShieldAlert,   label: 'Care flags raised', value: stats.careFlags,      color: 'bg-primary-50 text-primary-600'   },
  ];

  const QUICK_ACTIONS = [
    {
      icon: Camera,
      label: 'Item Photography',
      desc:  'Capture intake photos for all item types',
      sub:   'US-0106',
      color: 'border-blue-200 bg-blue-50 text-blue-700',
    },
    {
      icon: ClipboardCheck,
      label: 'Attributes & Weight',
      desc:  'Record fabric, colour, brand and weight',
      sub:   'US-0107 / 0120 / 0121 / 0122',
      color: 'border-accent-200 bg-accent-50 text-accent-700',
    },
    {
      icon: Droplets,
      label: 'Stain Mapping',
      desc:  'Pin stain locations on garment diagram',
      sub:   'US-0119',
      color: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    {
      icon: ShieldAlert,
      label: 'Special Care',
      desc:  'Flag delicate and dry-clean-only items',
      sub:   'US-0123',
      color: 'border-primary-200 bg-primary-50 text-primary-700',
    },
  ];

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Item Intake</h1>
        <p className="text-caption text-neutral-500">
          US-0106–0108 · 0119–0123 · Document item condition, photos, attributes and care requirements at intake
        </p>
      </div>

      {/* ── Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {STAT_CARDS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Quick action cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(a => (
          <div key={a.label} className={cn('rounded-xl border p-4', a.color)}>
            <div className="flex items-start gap-3">
              <a.icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-small font-semibold">{a.label}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{a.desc}</p>
                <p className="text-[9px] mt-1 font-mono opacity-50">{a.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Items queue ─────────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-neutral-100 bg-neutral-50 px-4 py-3 flex items-center justify-between">
          <p className="text-small font-semibold text-neutral-800">Items Queue</p>
          <p className="text-[10px] text-neutral-400">{items.length} items in system</p>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-50 text-neutral-500">
              {['Barcode', 'Type / Qty', 'Customer', 'Item Status', 'Intake', ''].map(h => (
                <th key={h} className="px-4 py-2.5 text-caption font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {items.map(item => {
              const intake = intakeMap[item.id];
              return (
                <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-neutral-700">{item.barcode}</span>
                  </td>
                  <td className="px-4 py-3 text-small text-neutral-800">
                    {item.typeName} × {item.qty}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-small font-medium text-neutral-800">{item.customerName}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{item.orderId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold', ITEM_STATUS_COLOR[item.status])}>
                      {ITEM_STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <IntakeStatusBadge status={intake?.status ?? 'pending'} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/intake/items/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-primary-200 bg-primary-50 px-2.5 py-1 text-[10px] font-semibold text-primary-700 hover:bg-primary-100 transition-colors"
                    >
                      {intake?.status === 'completed' ? 'View' : 'Start'} <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
