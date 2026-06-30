import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Users, CreditCard, FileText, ChevronRight, CheckCircle } from 'lucide-react';

import { formatGHS as fmtPrice } from '../../utils/formatCurrency.js';

const MOCK_ACCOUNT = {
  company: 'Silverrock Technologies Ltd.',
  contractRef: 'SRT-2026-01',
  tier: 'Enterprise',
  creditLimit: 5000,
  creditUsed: 2340.50,
  nextInvoiceDate: '2026-07-01',
  paymentTerms: 'Net 30',
  discountPct: 15,
};

const MOCK_USERS = [
  { id: 'u1', name: 'Adwoa Mensah',    role: 'Admin',    email: 'adwoa@silverrocktech.com',  active: true  },
  { id: 'u2', name: 'Kofi Boateng',    role: 'Approver', email: 'kofi@silverrocktech.com',   active: true  },
  { id: 'u3', name: 'Ama Asante',      role: 'Orderer',  email: 'ama@silverrocktech.com',    active: true  },
  { id: 'u4', name: 'Kweku Owusu',     role: 'Orderer',  email: 'kweku@silverrocktech.com',  active: false },
];

const COST_CENTERS = [
  { id: 'cc1', name: 'Executive',  budget: 1200, spent: 480  },
  { id: 'cc2', name: 'Marketing',  budget: 800,  spent: 650  },
  { id: 'cc3', name: 'Operations', budget: 1500, spent: 880  },
  { id: 'cc4', name: 'Finance',    budget: 500,  spent: 330  },
];

const INVOICES = [
  { id: 'INV-2026-05', date: '2026-06-01', amount: 1240.00, status: 'PAID'    },
  { id: 'INV-2026-04', date: '2026-05-01', amount: 980.50,  status: 'PAID'    },
  { id: 'INV-2026-06', date: '2026-07-01', amount: 2340.50, status: 'PENDING' },
];

const ROLE_COLORS = { Admin: 'bg-accent-50 text-accent-700', Approver: 'bg-warning-bg text-warning-text', Orderer: 'bg-neutral-100 text-neutral-600' };

export default function CorporateAccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  const creditAvail = MOCK_ACCOUNT.creditLimit - MOCK_ACCOUNT.creditUsed;
  const creditPct   = Math.round((MOCK_ACCOUNT.creditUsed / MOCK_ACCOUNT.creditLimit) * 100);

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FAFAF8' }}>
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
        <div className="flex h-14 items-center gap-3 px-4">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-neutral-100">
            <ArrowLeft className="h-5 w-5 text-neutral-700" />
          </button>
          <div className="flex-1">
            <p className="text-small font-bold text-neutral-900">Corporate Account</p>
            <p className="text-caption text-neutral-400">{MOCK_ACCOUNT.company}</p>
          </div>
          <span className="rounded-full bg-accent-50 text-accent-700 text-[10px] font-bold px-2 py-0.5">{MOCK_ACCOUNT.tier}</span>
        </div>
        <div className="flex border-t border-neutral-100 overflow-x-auto">
          {[['overview', 'Overview'], ['users', 'Users'], ['centers', 'Cost Centers'], ['invoices', 'Invoices']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`flex-shrink-0 py-2.5 px-4 text-small font-semibold border-b-2 transition-all ${tab === k ? 'border-accent-500 text-accent-700' : 'border-transparent text-neutral-500'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {tab === 'overview' && (
          <>
            {/* Credit limit */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-neutral-400" />
                  <p className="text-small font-bold text-neutral-800">Credit Line</p>
                </div>
                <p className="text-caption text-neutral-400">{creditPct}% used</p>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 mb-3">
                <div className={`h-2 rounded-full ${creditPct > 80 ? 'bg-warning-text' : 'bg-accent-500'}`} style={{ width: `${creditPct}%` }} />
              </div>
              <div className="flex justify-between text-small">
                <div><p className="text-neutral-400 text-caption">Used</p><p className="font-bold text-neutral-800 tabular-nums">{fmtPrice(MOCK_ACCOUNT.creditUsed)}</p></div>
                <div className="text-right"><p className="text-neutral-400 text-caption">Available</p><p className="font-bold text-accent-600 tabular-nums">{fmtPrice(creditAvail)}</p></div>
                <div className="text-right"><p className="text-neutral-400 text-caption">Limit</p><p className="font-bold text-neutral-800 tabular-nums">{fmtPrice(MOCK_ACCOUNT.creditLimit)}</p></div>
              </div>
            </div>

            {/* Contract details */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4 space-y-2">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Contract</p>
              {[
                { label: 'Contract Ref',    value: MOCK_ACCOUNT.contractRef   },
                { label: 'Volume Discount', value: `${MOCK_ACCOUNT.discountPct}% off standard rates`  },
                { label: 'Payment Terms',   value: MOCK_ACCOUNT.paymentTerms  },
                { label: 'Next Invoice',    value: MOCK_ACCOUNT.nextInvoiceDate },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-small">
                  <span className="text-neutral-500">{label}</span>
                  <span className="font-semibold text-neutral-800">{value}</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Quick Actions</p>
              {[
                { label: 'Place Bulk Order', sub: 'Grid or CSV entry',           path: '/app/commercial/bulk-order' },
                { label: 'View Invoices',    sub: 'Consolidated billing',         action: () => setTab('invoices')   },
                { label: 'Manage Users',     sub: `${MOCK_USERS.filter(u=>u.active).length} active`,      action: () => setTab('users')    },
              ].map(item => (
                <button key={item.label} onClick={item.path ? () => navigate(item.path) : item.action} className="w-full flex items-center gap-3 px-4 py-3 border-t border-neutral-100 hover:bg-neutral-50">
                  <div className="flex-1 text-left">
                    <p className="text-small font-semibold text-neutral-800">{item.label}</p>
                    <p className="text-caption text-neutral-400">{item.sub}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Authorised Users</p>
              <button className="text-caption text-accent-600 font-semibold">+ Invite</button>
            </div>
            {MOCK_USERS.map(u => (
              <div key={u.id} className={`flex items-center gap-3 px-4 py-3 border-t border-neutral-100 ${!u.active ? 'opacity-40' : ''}`}>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-small font-bold text-neutral-500">
                  {u.name.split(' ').map(w => w[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-small font-semibold text-neutral-800">{u.name} {!u.active && <span className="text-[10px] font-normal text-neutral-400">(Inactive)</span>}</p>
                  <p className="text-caption text-neutral-400">{u.email}</p>
                </div>
                <span className={`rounded-full text-[10px] font-bold px-2 py-0.5 ${ROLE_COLORS[u.role]}`}>{u.role}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'centers' && (
          <div className="space-y-3">
            {COST_CENTERS.map(cc => {
              const pct = Math.round((cc.spent / cc.budget) * 100);
              return (
                <div key={cc.id} className="rounded-2xl bg-white border border-neutral-100 shadow-sm p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-small font-bold text-neutral-800">{cc.name}</p>
                    <p className="text-caption text-neutral-400">{pct}% of budget</p>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-neutral-100 mb-2">
                    <div className={`h-1.5 rounded-full ${pct > 85 ? 'bg-warning-text' : 'bg-accent-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-caption text-neutral-500">
                    <span>Spent: <strong className="text-neutral-800">{fmtPrice(cc.spent)}</strong></span>
                    <span>Budget: <strong className="text-neutral-800">{fmtPrice(cc.budget)}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'invoices' && (
          <div className="rounded-2xl bg-white border border-neutral-100 shadow-sm overflow-hidden">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest px-4 pt-4 pb-2">Invoices</p>
            {INVOICES.map(inv => (
              <div key={inv.id} className="flex items-center gap-3 px-4 py-3 border-t border-neutral-100">
                <FileText className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-small font-semibold text-neutral-800">{inv.id}</p>
                  <p className="text-caption text-neutral-400">Due {inv.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-small font-bold tabular-nums text-neutral-800">{fmtPrice(inv.amount)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inv.status === 'PAID' ? 'bg-success-bg text-success-text' : 'bg-warning-bg text-warning-text'}`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
