import { Phone, Mail, ShoppingBag, Eye } from 'lucide-react';
import { TIER_CONFIG, STATUS_CONFIG, initials } from './customerUtils.js';

const Badge = ({ children, bg, color }) => (
  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
    {children}
  </span>
);

export const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg border border-neutral-200 bg-white p-4">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-neutral-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-neutral-200" />
        <div className="h-3 w-1/3 rounded bg-neutral-200" />
        <div className="h-3 w-2/3 rounded bg-neutral-200" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="h-7 w-24 rounded bg-neutral-200" />
      <div className="h-7 w-24 rounded bg-neutral-200" />
    </div>
  </div>
);

const CustomerCard = ({ customer, onViewProfile }) => {
  const tierCfg   = TIER_CONFIG[customer.tier]     || TIER_CONFIG.Bronze;
  const statusCfg = STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive;

  return (
    <div
      className="cursor-pointer rounded-lg border border-neutral-200 bg-white p-4 transition-all hover:border-[#0C5FC5]/40 hover:shadow-sm"
      onClick={() => onViewProfile(customer)}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold"
          style={{ background: tierCfg.bg, color: tierCfg.color }}
        >
          {initials(customer.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-neutral-900">{customer.name}</span>
            <Badge bg={statusCfg.bg} color={statusCfg.color}>{statusCfg.label}</Badge>
            <Badge bg={tierCfg.bg}   color={tierCfg.color}>{customer.tier}</Badge>
          </div>
          <p className="mt-0.5 text-xs text-neutral-400">{customer.id}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Phone className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-600">
          <Mail className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
          <span className="truncate">{customer.email}</span>
        </div>
        {customer.lastOrder && (
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <ShoppingBag className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" />
            <span>Last order: {customer.lastOrder.date} · <span className="font-medium text-neutral-700">{customer.lastOrder.amount}</span></span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onViewProfile(customer)}
          className="flex items-center gap-1.5 rounded-md bg-[#0C5FC5] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0A4EA0]"
        >
          <Eye className="h-3.5 w-3.5" /> View Profile
        </button>
        <button className="flex items-center gap-1.5 rounded-md border border-[#0C5FC5] px-3 py-1.5 text-xs font-medium text-[#0C5FC5] transition-colors hover:bg-[#0C5FC5]/5">
          <ShoppingBag className="h-3.5 w-3.5" /> Create Order
        </button>
        <a
          href={`tel:${customer.phone}`}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]"
          title={`Call ${customer.phone}`}
        >
          <Phone className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};

export default CustomerCard;
