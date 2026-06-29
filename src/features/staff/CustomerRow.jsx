import { Eye, ShoppingBag } from 'lucide-react';
import { TIER_CONFIG, STATUS_CONFIG, initials } from './customerUtils.js';

export const SkeletonRow = () => (
  <tr className="animate-pulse border-b border-neutral-100 last:border-0">
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 flex-shrink-0 rounded-full bg-neutral-200" />
        <div className="space-y-1.5">
          <div className="h-3 w-28 rounded bg-neutral-200" />
          <div className="h-2.5 w-20 rounded bg-neutral-200" />
        </div>
      </div>
    </td>
    <td className="px-5 py-3.5"><div className="h-3 w-32 rounded bg-neutral-200" /></td>
    <td className="px-5 py-3.5"><div className="h-3 w-36 rounded bg-neutral-200" /></td>
    <td className="px-5 py-3.5"><div className="h-6 w-16 rounded-full bg-neutral-200" /></td>
    <td className="px-5 py-3.5"><div className="h-6 w-14 rounded-full bg-neutral-200" /></td>
    <td className="px-5 py-3.5"><div className="h-3 w-28 rounded bg-neutral-200" /></td>
    <td className="px-5 py-3.5">
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded-md bg-neutral-200" />
        <div className="h-8 w-24 rounded-md bg-neutral-200" />
      </div>
    </td>
  </tr>
);

const CustomerRow = ({ customer, onViewProfile }) => {
  const tierCfg   = TIER_CONFIG[customer.tier]     || TIER_CONFIG.Bronze;
  const statusCfg = STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive;

  return (
    <tr
      className="group cursor-pointer border-b border-neutral-100 transition-colors last:border-0 hover:bg-[#F5F8FF]"
      onClick={() => onViewProfile(customer)}
    >
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold"
            style={{ background: tierCfg.bg, color: tierCfg.color }}
          >
            {initials(customer.name)}
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-[#0C5FC5]">{customer.name}</p>
            <p className="mt-0.5 text-[12px] text-neutral-400">{customer.id}</p>
          </div>
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-3.5 text-[13px] text-neutral-600">{customer.phone}</td>

      <td className="max-w-[200px] px-5 py-3.5 text-[13px] text-neutral-500">
        <span className="block truncate">{customer.email}</span>
      </td>

      <td className="px-5 py-3.5">
        <span className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: statusCfg.bg, color: statusCfg.color }}>
          {statusCfg.label}
        </span>
      </td>

      <td className="px-5 py-3.5">
        <span className="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold"
          style={{ background: tierCfg.bg, color: tierCfg.color }}>
          {customer.tier}
        </span>
      </td>

      <td className="whitespace-nowrap px-5 py-3.5">
        {customer.lastOrder ? (
          <div>
            <p className="text-[13px] font-semibold text-neutral-800">{customer.lastOrder.amount}</p>
            <p className="text-[12px] text-neutral-400">{customer.lastOrder.date}</p>
          </div>
        ) : (
          <span className="text-[13px] text-neutral-300">No orders</span>
        )}
      </td>

      <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewProfile(customer)}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#0C5FC5] px-3 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-[#0A4EA0]"
          >
            <Eye className="h-3.5 w-3.5" /> Profile
          </button>
          <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-neutral-200 px-3 py-1.5 text-[12px] font-semibold text-neutral-600 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">
            <ShoppingBag className="h-3.5 w-3.5" /> New Order
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CustomerRow;
