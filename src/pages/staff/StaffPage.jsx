import { useState } from 'react';
import { Users, ShieldCheck } from 'lucide-react';
import StaffTab from '../../features/staff/StaffTab.jsx';
import RolesTab from '../../features/staff/RolesTab.jsx';

const TABS = [
  { key: 'staff', label: 'Staff Members',       icon: Users       },
  { key: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
];

const StaffPage = () => {
  const [activeTab, setActiveTab] = useState('staff');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Staff & Roles</h1>
        <p className="mt-0.5 text-small text-neutral-500">Manage your team, assign roles, and control access to features.</p>
      </div>

      <div className="flex border-b border-neutral-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`relative flex items-center gap-1.5 px-5 pb-3 pt-1 text-small font-semibold transition-colors ${
              activeTab === key ? 'text-primary-600' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
            {activeTab === key && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-500" />}
          </button>
        ))}
      </div>

      {activeTab === 'staff' && <StaffTab />}
      {activeTab === 'roles' && <RolesTab />}
    </div>
  );
};

export default StaffPage;
