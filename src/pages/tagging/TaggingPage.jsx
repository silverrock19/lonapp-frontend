import { Link } from 'react-router-dom';
import { QrCode, Droplets, Wifi, RotateCcw, Tag, Clock, CheckCircle2, Inbox } from 'lucide-react';
import { getTaggingStats } from '../../lib/mock/mockTagging.js';
import { getAllItems, ITEM_STATUS_COLOR, ITEM_STATUS_LABELS } from '../../lib/mock/mockItems.js';
import { cn } from '../../utils/classNames.js';

const STATS = [
  { key: 'taggedToday',    label: 'Tagged today',    icon: CheckCircle2, color: 'text-success'  },
  { key: 'pendingTag',     label: 'Awaiting tag',    icon: Inbox,        color: 'text-warning'  },
  { key: 'printQueueSize', label: 'In print queue',  icon: QrCode,       color: 'text-primary-500' },
  { key: 'replacedToday',  label: 'Replaced today',  icon: RotateCcw,    color: 'text-neutral-500' },
];

const ACTIONS = [
  {
    to: '/tagging/barcodes',
    icon: QrCode,
    title: 'Barcode Generation',
    desc: 'Generate & print barcodes or QR codes for order items',
    badge: null,
    color: 'border-primary-200 hover:border-primary-300 hover:bg-primary-50 group-hover:text-primary-600',
    iconColor: 'text-primary-500',
  },
  {
    to: '/tagging/hydro',
    icon: Droplets,
    title: 'Hydro Tags',
    desc: 'Create heat-seal hydro tags for garments going through wet processing',
    badge: null,
    color: 'border-accent-200 hover:border-accent-300 hover:bg-accent-50',
    iconColor: 'text-accent-500',
  },
  {
    to: '/tagging/rfid',
    icon: Wifi,
    title: 'RFID Assignment',
    desc: 'Associate RFID tags with items using the wireless reader',
    badge: 'Premium',
    color: 'border-purple-200 hover:border-purple-300 hover:bg-purple-50',
    iconColor: 'text-purple-500',
  },
  {
    to: '/tagging/replace',
    icon: RotateCcw,
    title: 'Tag Replacement',
    desc: 'Replace damaged or lost tags and preserve the item history',
    badge: null,
    color: 'border-amber-200 hover:border-amber-300 hover:bg-amber-50',
    iconColor: 'text-amber-500',
  },
];

function fmtTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function TaggingPage() {
  const stats   = getTaggingStats();
  const items   = getAllItems().slice().reverse();

  return (
    <div className="space-y-6">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Tagging &amp; Identification</h1>
          <p className="mt-0.5 text-small text-neutral-500">
            Factory floor · CleanPro Osu · Barcode, hydro tag, and RFID management
          </p>
        </div>
        <Link
          to="/tagging/barcodes"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-small font-semibold text-white shadow-sm hover:bg-primary-600 transition-colors"
        >
          <QrCode className="h-4 w-4" />
          Generate Labels
        </Link>
      </div>

      {/* ── Stats row ────────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-neutral-500">{label}</p>
              <Icon className={cn('h-4 w-4', color)} />
            </div>
            <p className="text-[28px] font-bold text-neutral-900 leading-none">{stats[key]}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ────────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-small font-semibold uppercase tracking-wider text-neutral-400">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {ACTIONS.map(({ to, icon: Icon, title, desc, badge, color, iconColor }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'group flex flex-col gap-3 rounded-xl border-2 bg-white p-4 shadow-sm transition-all',
                color,
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 transition-colors', color)}>
                  <Icon className={cn('h-5 w-5', iconColor)} />
                </div>
                {badge && (
                  <span className="rounded-full bg-amber-100 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                    {badge}
                  </span>
                )}
              </div>
              <div>
                <p className="text-small font-semibold text-neutral-900">{title}</p>
                <p className="mt-0.5 text-caption text-neutral-500 leading-snug">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent activity ──────────────────────────────────── */}
      <div>
        <h2 className="mb-3 text-small font-semibold uppercase tracking-wider text-neutral-400">
          Items in System
        </h2>
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {['Barcode', 'Type', 'Order', 'Customer', 'Status', 'Last updated'].map(h => (
                  <th key={h} className="px-4 py-3 text-caption font-semibold text-neutral-500 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={item.id}
                  className={cn('border-b border-neutral-50 hover:bg-neutral-50 transition-colors', i === items.length - 1 && 'border-b-0')}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-neutral-700 select-all">{item.barcode}</span>
                  </td>
                  <td className="px-4 py-3 text-small text-neutral-800">{item.typeName} × {item.qty}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] text-neutral-500">{item.orderId}</span>
                  </td>
                  <td className="px-4 py-3 text-small text-neutral-800">{item.customerName}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      ITEM_STATUS_COLOR[item.status],
                    )}>
                      {ITEM_STATUS_LABELS[item.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-caption text-neutral-400">
                    {fmtTime(item.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
