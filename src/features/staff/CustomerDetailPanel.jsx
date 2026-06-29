import { useState } from 'react';
import {
  X, Plus, Phone, Mail, MapPin, Calendar,
  Eye, ShoppingBag, AlertCircle, ExternalLink,
} from 'lucide-react';
import { TIER_CONFIG, STATUS_CONFIG, ORDER_STATUS, avatarColor, initials } from './customerUtils.js';

const Badge = ({ children, bg, color }) => (
  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{ background: bg, color }}>
    {children}
  </span>
);

const CustomerDetailPanel = ({ customer, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!customer) return null;

  const tierCfg   = TIER_CONFIG[customer.tier]     || TIER_CONFIG.Bronze;
  const statusCfg = STATUS_CONFIG[customer.status] || STATUS_CONFIG.Inactive;
  const avatar    = avatarColor(customer.name);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-neutral-100 px-6 py-5">
          <div className="flex items-start gap-4">
            <div
              className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold"
              style={{ background: avatar.background, color: avatar.color }}
            >
              {initials(customer.name)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-[17px] font-bold leading-tight text-neutral-900">{customer.name}</h2>
                  <p className="mt-0.5 font-mono text-[13px] text-neutral-400">{customer.id}</p>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 transition-colors hover:bg-neutral-200"
                >
                  <X className="h-4 w-4 text-neutral-600" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge bg={statusCfg.bg} color={statusCfg.color}>{statusCfg.label}</Badge>
                <Badge bg={tierCfg.bg}   color={tierCfg.color}>{customer.tier} tier</Badge>
                {customer.hasPendingOrders && <Badge bg="#FFF4E0" color="#945800">Pending order</Badge>}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Total orders', value: customer.totalOrders      },
              { label: 'Total spend',  value: customer.totalSpend       },
              { label: 'Outlet',       value: customer.preferredOutlet  },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-neutral-50 px-3 py-2.5 text-center">
                <p className="text-[13px] font-bold text-neutral-900">{value}</p>
                <p className="mt-0.5 text-[11px] text-neutral-400">{label}</p>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex gap-2">
            <button className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#0C5FC5] text-[13px] font-semibold text-white transition-colors hover:bg-[#0A4EA0]">
              <Plus className="h-4 w-4" /> Create Order
            </button>
            <a href={`tel:${customer.phone}`}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-4 text-[13px] font-medium text-neutral-700 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">
              <Phone className="h-4 w-4" /> Call
            </a>
            <a href={`mailto:${customer.email}`}
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-4 text-[13px] font-medium text-neutral-700 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>

          {/* Tabs */}
          <div className="-mb-5 mt-4 flex gap-1 border-b border-neutral-200">
            {['overview', 'orders', 'addresses'].map(tab => (
              <button key={tab}
                onClick={() => setActiveTab(tab)}
                className={`-mb-px border-b-2 px-4 py-2.5 text-[13px] font-semibold capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-[#0C5FC5] text-[#0C5FC5]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">

          {activeTab === 'overview' && (
            <>
              {customer.status === 'Suspended' && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-red-800">Account suspended</p>
                    <p className="mt-0.5 text-[12px] text-red-600">This customer cannot place new orders until the suspension is lifted.</p>
                  </div>
                </div>
              )}

              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Contact</p>
                <div className="divide-y divide-neutral-100 overflow-hidden rounded-lg border border-neutral-100 bg-white">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Phone className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-500">Phone</p>
                      <p className="text-[14px] font-medium text-neutral-900">{customer.phone}</p>
                    </div>
                    <a href={`tel:${customer.phone}`} className="text-[12px] font-medium text-[#0C5FC5] hover:underline">Call</a>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Mail className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-[13px] text-neutral-500">Email</p>
                      <p className="truncate text-[14px] font-medium text-neutral-900">{customer.email}</p>
                    </div>
                    <a href={`mailto:${customer.email}`} className="flex-shrink-0 text-[12px] font-medium text-[#0C5FC5] hover:underline">Email</a>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Calendar className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-[13px] text-neutral-500">Registered</p>
                      <p className="text-[14px] font-medium text-neutral-900">{customer.registeredDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Recent Orders</p>
                  <button onClick={() => setActiveTab('orders')} className="text-[12px] font-medium text-[#0C5FC5] hover:underline">
                    View all
                  </button>
                </div>
                <div className="space-y-2">
                  {customer.recentOrders.slice(0, 2).map(order => {
                    const s = ORDER_STATUS[order.status] || ORDER_STATUS.Completed;
                    return (
                      <div key={order.id} className="flex items-center gap-3 rounded-lg border border-neutral-100 bg-white px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[13px] font-semibold text-neutral-900">{order.id}</span>
                            <Badge bg={s.bg} color={s.color}>{order.status}</Badge>
                          </div>
                          <p className="mt-0.5 text-[12px] text-neutral-400">{order.date} · {order.items}</p>
                        </div>
                        <span className="flex-shrink-0 text-[13px] font-semibold text-neutral-800">{order.amount}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {customer.addresses.filter(a => a.primary).map(addr => (
                <div key={addr.label}>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Primary Address</p>
                  <div className="flex items-start gap-3 rounded-lg border border-neutral-100 bg-white px-4 py-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-neutral-900">{addr.line1}</p>
                      <p className="text-[12px] text-neutral-400">{addr.area}, {addr.city}</p>
                      {addr.gps && <p className="mt-0.5 font-mono text-[12px] text-neutral-400">{addr.gps}</p>}
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-[#EBF2FD] px-2 py-0.5 text-[11px] font-semibold text-[#0C5FC5]">{addr.label}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-2">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-[13px] text-neutral-500">{customer.recentOrders.length} recent orders</p>
                <button className="flex items-center gap-1 text-[12px] font-medium text-[#0C5FC5] hover:underline">
                  <ExternalLink className="h-3 w-3" /> Full history
                </button>
              </div>
              {customer.recentOrders.map(order => {
                const s = ORDER_STATUS[order.status] || ORDER_STATUS.Completed;
                return (
                  <div key={order.id} className="rounded-lg border border-neutral-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-mono text-[13px] font-bold text-neutral-900">{order.id}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge bg={s.bg} color={s.color}>{order.status}</Badge>
                          <span className="text-[12px] text-neutral-400">{order.items}</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-[14px] font-bold text-neutral-900">{order.amount}</p>
                        <p className="mt-0.5 text-[12px] text-neutral-400">{order.date}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">
                        <Eye className="h-3 w-3" /> View order
                      </button>
                      {order.status === 'Completed' && (
                        <button className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">
                          <ShoppingBag className="h-3 w-3" /> Reorder
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {customer.addresses.map(addr => (
                <div key={addr.label} className="rounded-lg border border-neutral-200 bg-white p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-neutral-400" />
                      <span className="text-[14px] font-semibold text-neutral-900">{addr.label}</span>
                      {addr.primary && (
                        <span className="rounded-full bg-[#EBF2FD] px-2 py-0.5 text-[11px] font-semibold text-[#0C5FC5]">Primary</span>
                      )}
                    </div>
                  </div>
                  <p className="pl-6 text-[14px] text-neutral-800">{addr.line1}</p>
                  <p className="mt-0.5 pl-6 text-[13px] text-neutral-500">{addr.area}, {addr.city}</p>
                  {addr.gps && <p className="mt-0.5 pl-6 font-mono text-[12px] text-neutral-400">{addr.gps}</p>}
                </div>
              ))}
              {customer.addresses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MapPin className="mb-3 h-8 w-8 text-neutral-300" />
                  <p className="text-[14px] text-neutral-500">No addresses on file</p>
                  <p className="mt-1 text-[12px] text-neutral-400">Customer can add addresses in the app</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerDetailPanel;
