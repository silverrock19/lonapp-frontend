import { useState } from 'react';
import AppShell from '../../components/layout/AppShell.jsx';
import CompanyTab      from '../../features/business/CompanyTab.jsx';
import OutletsTab      from '../../features/business/OutletsTab.jsx';
import ServicesTab     from '../../features/business/ServicesTab.jsx';
import PaymentsTab     from '../../features/business/PaymentsTab.jsx';
import DocumentsTab    from '../../features/business/DocumentsTab.jsx';
import HolidayHoursTab from '../../features/business/HolidayHoursTab.jsx';

const TABS = ['Company', 'Outlets', 'Services', 'Payments', 'Documents', 'Holiday Hours'];

const TAB_CONTENT = {
  Company:       <CompanyTab />,
  Outlets:       <OutletsTab />,
  Services:      <ServicesTab />,
  Payments:      <PaymentsTab />,
  Documents:     <DocumentsTab />,
  'Holiday Hours': <HolidayHoursTab />,
};

const BusinessProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Company');

  return (
    <AppShell>
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white px-8 pt-8">
          <h1 className="text-h3 font-bold text-neutral-900">Business Profile</h1>
          <p className="mt-0.5 text-small text-neutral-500">Manage your business information, outlets, and settings</p>
          <div className="mt-5 flex gap-1">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-t-md px-4 py-2 text-small font-medium transition-colors ${
                  activeTab === tab
                    ? 'border border-b-white border-neutral-200 bg-white text-primary-600'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-8 py-6">
          {TAB_CONTENT[activeTab]}
        </div>
      </div>
    </AppShell>
  );
};

export default BusinessProfilePage;
