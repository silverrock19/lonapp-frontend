import { useState } from 'react';
import { User, Building2, Bell, Lock, Monitor, ClipboardList } from 'lucide-react';
import { adminProfile } from '../../data/mock.js';
import ProfileCompleteness from '../../features/settings/ProfileCompleteness.jsx';
import PersonalTab       from '../../features/settings/PersonalTab.jsx';
import BusinessTab       from '../../features/settings/BusinessTab.jsx';
import NotificationsTab  from '../../features/settings/NotificationsTab.jsx';
import SecurityTab       from '../../features/settings/SecurityTab.jsx';
import SessionsTab       from '../../features/settings/SessionsTab.jsx';
import AuditLogTab       from '../../features/settings/AuditLogTab.jsx';

const TABS = [
  { key: 'personal',      label: 'Personal',      icon: User          },
  { key: 'business',      label: 'Business',       icon: Building2     },
  { key: 'notifications', label: 'Notifications',  icon: Bell          },
  { key: 'security',      label: 'Security',        icon: Lock          },
  { key: 'sessions',      label: 'Sessions',        icon: Monitor       },
  { key: 'audit',         label: 'Audit Log',       icon: ClipboardList },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profile, setProfile]     = useState(adminProfile);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold text-neutral-900">Settings</h1>
        <p className="mt-0.5 text-small text-neutral-500">Manage your profile, security, sessions, and account preferences.</p>
      </div>

      <ProfileCompleteness profile={profile} />

      <div className="flex flex-wrap border-b border-neutral-200">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
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

      {activeTab === 'personal'      && <PersonalTab profile={profile} onChange={setProfile} />}
      {activeTab === 'business'      && <BusinessTab />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'security'      && <SecurityTab />}
      {activeTab === 'sessions'      && <SessionsTab />}
      {activeTab === 'audit'         && <AuditLogTab />}
    </div>
  );
};

export default SettingsPage;
