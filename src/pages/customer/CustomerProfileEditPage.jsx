import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { MOCK_CUSTOMER } from '../../data/mockCustomer.js';
import Input from '../../components/ui/Input.jsx';

const CustomerProfileEditPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: MOCK_CUSTOMER.firstName,
    lastName: MOCK_CUSTOMER.lastName,
    dob: '',
  });

  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState(null);

  const initial = {
    firstName: MOCK_CUSTOMER.firstName,
    lastName: MOCK_CUSTOMER.lastName,
    dob: '',
  };

  useEffect(() => {
    const changed =
      form.firstName !== initial.firstName ||
      form.lastName !== initial.lastName ||
      form.dob !== initial.dob;
    setIsDirty(changed);
  }, [form]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setToast({ type: 'success', message: 'Profile saved' });
    setTimeout(() => {
      setToast(null);
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center h-9 w-9">
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="flex-1 text-[17px] font-semibold text-neutral-900">Edit Profile</h1>
        <button
          onClick={handleSave}
          disabled={!isDirty}
          className={`text-[15px] font-semibold transition-opacity ${
            isDirty ? 'text-[#0E9AA7]' : 'text-neutral-300 pointer-events-none'
          }`}
        >
          Save
        </button>
      </header>

      {/* Toast */}
      {toast && (
        <div className="mx-4 mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700">
          {toast.message}
        </div>
      )}

      {/* Profile Photo */}
      <div className="flex flex-col items-center py-6 bg-white border-b border-neutral-100">
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            background: '#E8F9FA',
          }}
        >
          {MOCK_CUSTOMER.photo ? (
            <img
              src={MOCK_CUSTOMER.photo}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <Camera className="h-8 w-8" style={{ color: '#0E9AA7' }} />
          )}
        </div>
        <button
          onClick={() => navigate('/app/profile/photo')}
          className="mt-2 text-[14px] font-medium"
          style={{ color: '#0E9AA7' }}
        >
          Change photo
        </button>
      </div>

      {/* Edit Form */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Personal Info
      </p>
      <div className="mx-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        {/* First Name */}
        <div className="px-4 pt-4 pb-3 border-b border-neutral-100">
          <Input
            label="First name"
            required
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange('firstName')}
          />
        </div>

        {/* Last Name */}
        <div className="px-4 pt-4 pb-3 border-b border-neutral-100">
          <Input
            label="Last name"
            required
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange('lastName')}
          />
        </div>

        {/* Date of Birth */}
        <div className="px-4 pt-4 pb-3">
          <Input
            label="Date of birth"
            type="date"
            value={form.dob}
            onChange={handleChange('dob')}
          />
        </div>
      </div>

      {/* Email & Phone (display-only with change links) */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Contact
      </p>
      <div className="mx-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        {/* Email */}
        <button
          onClick={() => navigate('/app/profile/change-email')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-neutral-100 text-left"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 leading-none mb-0.5">
              Email address
            </p>
            <p className="text-[15px] text-neutral-800">{MOCK_CUSTOMER.email}</p>
          </div>
          <span className="text-[13px] font-semibold" style={{ color: '#0E9AA7' }}>
            Change email →
          </span>
        </button>

        {/* Phone */}
        <button
          onClick={() => navigate('/app/profile/change-phone')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white text-left"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 leading-none mb-0.5">
              Phone number
            </p>
            <p className="text-[15px] text-neutral-800">{MOCK_CUSTOMER.phone}</p>
          </div>
          <span className="text-[13px] font-semibold" style={{ color: '#0E9AA7' }}>
            Change number →
          </span>
        </button>
      </div>

      {/* Preferences */}
      <p className="px-4 pt-5 pb-1 text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
        Preferences
      </p>
      <div className="mx-4 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
        {/* Preferred Language */}
        <button
          onClick={() => navigate('/app/profile/language')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white border-b border-neutral-100"
        >
          <span className="text-[15px] text-neutral-800">Preferred language</span>
          <div className="flex items-center gap-2">
            <span className="text-[15px] text-neutral-400">
              {MOCK_CUSTOMER.language === 'en' ? 'English' : MOCK_CUSTOMER.language}
            </span>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </div>
        </button>

        {/* Preferred Outlet */}
        <button
          onClick={() => navigate('/app/profile/outlet')}
          className="flex items-center justify-between w-full h-14 px-4 bg-white"
        >
          <span className="text-[15px] text-neutral-800">Preferred outlet</span>
          <div className="flex items-center gap-2">
            <span className="text-[15px] text-neutral-400 max-w-[160px] truncate text-right">
              {MOCK_CUSTOMER.preferredOutlet}
            </span>
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CustomerProfileEditPage;
