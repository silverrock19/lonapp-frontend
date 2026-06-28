import { useState } from 'react';
import { Stepper } from '../../components/ui/Stepper.jsx';
import { Brandmark } from '../../components/ui/Brandmark.jsx';
import Step1Company from './steps/Step1Company.jsx';
import Step2Outlets from './steps/Step2Outlets.jsx';
import Step3Services from './steps/Step3Services.jsx';
import Step4Payment from './steps/Step4Payment.jsx';
import Step5Admin from './steps/Step5Admin.jsx';
import StepReview from './StepReview.jsx';

const STEPS       = ['Company', 'Outlets', 'Services', 'Payment', 'Admin'];
const FULL_LABELS = ['Company information', 'Outlets & factories', 'Services & pricing', 'Payment methods', 'Admin account'];

const defaultStep1 = {
  companyName: '', country: '', email: '', phone: '', whatsapp: '', gps: '',
  currency: '', address: '', registrationType: '', registrationNumber: '',
  registrationDoc: null, logo: null,
};
const defaultStep2 = { model: '', outlets: [], factories: [], location: null };
const defaultStep3 = {
  businessTypes: [], retailServices: [], commercialServices: [],
  standardDuration: '3', standardUnit: 'days',
  expressEnabled: false, expressDuration: '6', expressUnit: 'hours', expressSurcharge: '',
};
const defaultStep4 = { methods: [], cashEnabled: false };
const defaultStep5 = {};

export default function BusinessWizardPage() {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState({
    company:  { ...defaultStep1 },
    outlets:  { ...defaultStep2 },
    services: { ...defaultStep3 },
    payment:  { ...defaultStep4 },
    admin:    { ...defaultStep5 },
  });

  function handleNext1(data) { setDraft(d => ({ ...d, company:  data })); setStep(1); }
  function handleNext2(data) { setDraft(d => ({ ...d, outlets:  data })); setStep(2); }
  function handleNext3(data) { setDraft(d => ({ ...d, services: data })); setStep(3); }
  function handleNext4(data) { setDraft(d => ({ ...d, payment:  data })); setStep(4); }
  function handleNext5(data) { setDraft(d => ({ ...d, admin:    data })); setStep(5); }

  function saveDraft(key, data) {
    setDraft(d => ({ ...d, [key]: { ...d[key], ...data } }));
    // In production this would POST to /drafts
    console.log('[draft saved]', key, data);
  }

  const isReview = step === 5;

  return (
    <div className="relative min-h-screen overflow-auto" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Brand-washed background — matches AuthLayout */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #5C99E6 0%, #2E79D6 40%, transparent 70%)', opacity: 0.13, filter: 'blur(72px)' }} />
        <div className="absolute left-32 top-16 h-[400px] w-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #99C0F0 0%, transparent 70%)', opacity: 0.18, filter: 'blur(60px)' }} />
        <div className="absolute -bottom-20 -right-16 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #4FCFD6 0%, #1FB6BF 40%, transparent 70%)', opacity: 0.11, filter: 'blur(80px)' }} />
        <div className="absolute bottom-24 right-40 h-[350px] w-[350px] rounded-full"
          style={{ background: 'radial-gradient(circle, #8AE3E8 0%, transparent 70%)', opacity: 0.14, filter: 'blur(50px)' }} />
        <div className="absolute inset-0 bg-[#F4F8FF]/70" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center px-4 py-10">

        {/* Brand mark — matches auth pages exactly */}
        <Brandmark />

        {/* Card */}
        <div className="w-full max-w-[720px] overflow-hidden bg-white shadow-lg shadow-neutral-200/50 ring-1 ring-neutral-100/80" style={{ borderRadius: 4 }}>

          {/* Stepper header */}
          {!isReview && (
            <div className="border-b border-neutral-100 px-8 pt-7 pb-7">
              <Stepper steps={STEPS} fullLabels={FULL_LABELS} currentStep={step} />
            </div>
          )}

          {/* Step content */}
          {step === 0 && (
            <Step1Company
              data={draft.company}
              onNext={handleNext1}
              onSaveDraft={d => saveDraft('company', d)}
            />
          )}
          {step === 1 && (
            <Step2Outlets
              data={draft.outlets}
              onNext={handleNext2}
              onBack={() => setStep(0)}
              onSaveDraft={d => saveDraft('outlets', d)}
            />
          )}
          {step === 2 && (
            <Step3Services
              data={draft.services}
              onNext={handleNext3}
              onBack={() => setStep(1)}
              onSaveDraft={d => saveDraft('services', d)}
            />
          )}
          {step === 3 && (
            <Step4Payment
              data={draft.payment}
              onNext={handleNext4}
              onBack={() => setStep(2)}
              onSaveDraft={d => saveDraft('payment', d)}
            />
          )}
          {step === 4 && (
            <Step5Admin
              data={{ ...draft.admin, companyPhone: draft.company.phone, companyEmail: draft.company.email }}
              onNext={handleNext5}
              onBack={() => setStep(3)}
              onSaveDraft={d => saveDraft('admin', d)}
            />
          )}
          {isReview && (
            <StepReview
              data={{ company: draft.company, outlets: draft.outlets, services: draft.services, payment: draft.payment, admin: draft.admin }}
              onBack={() => setStep(4)}
            />
          )}
        </div>

        <p className="mt-6 text-caption text-neutral-400">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-primary-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
