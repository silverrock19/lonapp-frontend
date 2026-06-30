import { Link } from 'react-router-dom';
import { Tag, Scale, Timer, Package2, Globe2, Receipt, ChevronRight, TrendingUp, TrendingDown, Award, Ticket, FileText, Calculator, History } from 'lucide-react';
import { getPricingConfig } from '../../../lib/mock/mockPricing.js';
import { getDiscountsConfig } from '../../../lib/mock/mockDiscounts.js';
import { getPriceHistory } from '../../../lib/mock/mockPriceHistory.js';

export default function PricingIndexPage() {
  const cfg = getPricingConfig();
  const dcfg = getDiscountsConfig();

  const SECTIONS = [
    {
      to: '/services/per-item',
      icon: Tag,
      title: 'Item Pricing',
      description: 'Set retail & commercial prices for every service item',
      color: 'bg-primary-50 text-primary-600',
      stat: `${cfg.itemRules.length} items configured`,
    },
    {
      to: '/services/per-weight',
      icon: Scale,
      title: 'Weight Pricing',
      description: 'Tiered per-kg rates for weight-based services',
      color: 'bg-accent-50 text-accent-600',
      stat: `${cfg.weightTiers.length} weight tiers`,
    },
    {
      to: '/services/turnaround',
      icon: Timer,
      title: 'Turnaround & Surcharges',
      description: 'Configure Standard, Express, and Same-Day pricing',
      color: 'bg-warning/10 text-amber-700',
      stat: `${cfg.turnaround.filter(t => t.enabled).length} options active`,
    },
    {
      to: '/services/bundles',
      icon: Package2,
      title: 'Service Bundles',
      description: 'Bundle multiple services at a combined price',
      color: 'bg-purple-50 text-purple-600',
      stat: `${cfg.bundles.filter(b => b.enabled).length} bundles active`,
    },
    {
      to: '/services/tax',
      icon: Receipt,
      title: 'Tax Configuration',
      description: 'Ghana VAT, NHIL, GetFund rates and exemptions',
      color: 'bg-rose-50 text-rose-600',
      stat: `${cfg.tax.mode} mode`,
    },
    {
      to: '/services/currency',
      icon: Globe2,
      title: 'Multi-Currency',
      description: 'Exchange rates and mobile money rounding rules',
      color: 'bg-teal-50 text-teal-600',
      stat: `${cfg.currencies.filter(c => c.enabled).length} currencies active`,
    },
  ];

  const DISCOUNT_SECTIONS = [
    { to: '/services/bulk-discounts', icon: TrendingDown, title: 'Bulk Discounts',      description: 'Volume-based discount tiers (item count, weight, or order value)', color: 'bg-success/10 text-success',   stat: `${dcfg.bulkTiers.filter(t => t.isActive).length} active tiers` },
    { to: '/services/loyalty',        icon: Award,        title: 'Loyalty Program',      description: 'Tier-based discounts for repeat customers (Bronze → Platinum)',    color: 'bg-amber-50 text-amber-600',    stat: `${dcfg.loyaltyTiers.reduce((s, t) => s + (t.memberCount || 0), 0)} members` },
    { to: '/services/promotions',     icon: Ticket,       title: 'Promotions & Coupons', description: 'Time-limited campaigns with promo codes and auto-apply rules',      color: 'bg-orange-50 text-orange-600', stat: `${dcfg.promotions.filter(p => p.status === 'active').length} active` },
    { to: '/services/contracts',      icon: FileText,     title: 'Customer Contracts',   description: 'Negotiated rates for corporate clients and VIP accounts',          color: 'bg-purple-50 text-purple-600', stat: `${dcfg.contracts.filter(c => c.status === 'active').length} active` },
  ];

  const ENGINE_SECTIONS = [
    { to: '/services/quote-calculator', icon: Calculator, title: 'Quote Calculator',      description: 'Live sandbox — test any rule combination and see the full breakdown',      color: 'bg-primary-50 text-primary-600', stat: 'Try it now' },
    { to: '/services/price-history',    icon: History,    title: 'Price Change History',  description: 'Filterable audit log of all pricing rule changes with old→new values',     color: 'bg-neutral-100 text-neutral-600', stat: `${getPriceHistory().length} changes recorded` },
  ];

  function SectionCard({ section }) {
    const Icon = section.icon;
    return (
      <Link
        to={section.to}
        className="group flex flex-col rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md hover:border-neutral-300"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                {section.title}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">{section.description}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-600 transition-colors flex-shrink-0 mt-1" />
        </div>
        <div className="mt-4 flex justify-end">
          <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 capitalize">
            {section.stat}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-small text-neutral-500">
        <span className="text-neutral-800 font-medium">Pricing</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Services & Pricing</h1>
          <p className="mt-1 text-small text-neutral-500">
            Manage pricing rules, tax configuration, and currency settings for your laundry business.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-2">
          <TrendingUp className="h-4 w-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-700">Pricing Hub</span>
        </div>
      </div>

      {/* Base Pricing Rules */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Base Pricing Rules</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SECTIONS.map(section => <SectionCard key={section.to} section={section} />)}
        </div>
      </div>

      {/* Discounts & Loyalty */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Discounts & Loyalty</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DISCOUNT_SECTIONS.map(section => <SectionCard key={section.to} section={section} />)}
        </div>
      </div>

      {/* Engine & Audit */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Engine & Audit</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ENGINE_SECTIONS.map(section => <SectionCard key={section.to} section={section} />)}
        </div>
      </div>

      <p className="text-right text-xs text-neutral-400">
        Last updated by {cfg.lastUpdatedBy} on {cfg.lastUpdatedAt.slice(0, 10)}
      </p>
    </div>
  );
}
