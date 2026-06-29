import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  CreditCard,
  BookOpen,
  Vote,
  CheckCircle2,
  Upload,
  User,
  X,
  AlertCircle,
  Clock,
} from 'lucide-react';

const ID_TYPES = [
  {
    id: 'ghana-card',
    icon: CreditCard,
    title: 'Ghana Card (NIA)',
    subtitle: 'Valid national identity card',
    hasTwoSides: true,
  },
  {
    id: 'passport',
    icon: BookOpen,
    title: 'Passport',
    subtitle: 'International travel document',
    hasTwoSides: false,
  },
  {
    id: 'voter-id',
    icon: Vote,
    title: 'Voter ID Card',
    subtitle: 'Electoral Commission of Ghana ID',
    hasTwoSides: true,
  },
];

const STEPS = ['Choose ID', 'Upload', 'Review'];

const StatusBanner = ({ status }) => {
  if (status === 'verified') {
    return (
      <div className="mx-4 mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <p className="text-[14px] text-green-700 font-medium">
          Identity verified · Verified on Dec 1, 2024
        </p>
      </div>
    );
  }
  if (status === 'pending') {
    return (
      <div className="mx-4 mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 flex items-center gap-3">
        <Clock className="h-5 w-5 text-blue-600 shrink-0" />
        <p className="text-[14px] text-blue-700 font-medium">
          Under review · Submitted Dec 14, 2024
        </p>
      </div>
    );
  }
  return (
    <div className="mx-4 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
      <p className="text-[14px] text-amber-700 font-medium">
        Verification required for orders above GH₵ 500
      </p>
    </div>
  );
};

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center justify-center gap-0 px-4 py-5">
    {STEPS.map((label, idx) => {
      const stepNum = idx + 1;
      const isActive = stepNum === currentStep;
      const isDone = stepNum < currentStep;
      return (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${
                isDone
                  ? 'bg-[#0E9AA7] text-white'
                  : isActive
                  ? 'bg-[#0E9AA7] text-white'
                  : 'bg-neutral-200 text-neutral-400'
              }`}
            >
              {isDone ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
            </div>
            <span
              className={`text-[11px] font-semibold whitespace-nowrap ${
                isActive ? 'text-[#0E9AA7]' : isDone ? 'text-[#0E9AA7]' : 'text-neutral-400'
              }`}
            >
              {label}
            </span>
          </div>
          {idx < STEPS.length - 1 && (
            <div
              className={`h-[2px] w-10 mx-1 mb-5 transition-all ${
                stepNum < currentStep ? 'bg-[#0E9AA7]' : 'bg-neutral-200'
              }`}
            />
          )}
        </div>
      );
    })}
  </div>
);

const IDTypeCard = ({ idType, selected, onSelect }) => {
  const Icon = idType.icon;
  return (
    <button
      onClick={() => onSelect(idType.id)}
      className={`w-full rounded-2xl border-2 bg-white p-4 flex items-center gap-4 transition-all text-left ${
        selected ? 'border-[#0E9AA7]' : 'border-neutral-200'
      }`}
    >
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
        style={selected ? { background: '#E8F9FA' } : { background: '#F5F5F5' }}
      >
        <Icon className={`h-5 w-5 ${selected ? 'text-[#0E9AA7]' : 'text-neutral-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[15px] font-semibold ${selected ? 'text-[#0E9AA7]' : 'text-neutral-900'}`}>
          {idType.title}
        </p>
        <p className="text-[13px] text-neutral-400 mt-0.5">{idType.subtitle}</p>
      </div>
      <div
        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? 'border-[#0E9AA7] bg-[#0E9AA7]' : 'border-neutral-300 bg-white'
        }`}
      >
        {selected && <div className="h-2 w-2 rounded-full bg-white" />}
      </div>
    </button>
  );
};

const UploadBox = ({ label, icon: Icon, file, onFileChange, onClear, inputRef }) => {
  const preview = file ? URL.createObjectURL(file) : null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-neutral-600">{label}</p>
      <div
        className={`rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          file ? 'border-[#0E9AA7] bg-[#E8F9FA]/40' : 'border-neutral-200 bg-white'
        }`}
      >
        {file ? (
          <div className="relative h-36">
            {file.type.startsWith('image/') ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="h-8 w-8 text-[#0E9AA7]" />
                <p className="text-[13px] text-[#0E9AA7] font-medium px-4 text-center truncate max-w-[200px]">
                  {file.name}
                </p>
              </div>
            )}
            <button
              onClick={onClear}
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 flex items-center justify-center"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full h-36 flex flex-col items-center justify-center gap-2 active:bg-neutral-50 transition-colors"
          >
            <div className="h-11 w-11 rounded-full bg-neutral-100 flex items-center justify-center">
              {Icon ? <Icon className="h-5 w-5 text-neutral-400" /> : <Upload className="h-5 w-5 text-neutral-400" />}
            </div>
            <p className="text-[13px] text-neutral-400 font-medium">Tap to upload</p>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
};

const KYCPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('unverified');
  const [step, setStep] = useState(1);
  const [idType, setIdType] = useState(null);
  const [uploads, setUploads] = useState({ front: null, back: null, selfie: null });
  const [agreed, setAgreed] = useState(false);

  const frontRef = useRef(null);
  const backRef = useRef(null);
  const selfieRef = useRef(null);

  const selectedIdType = ID_TYPES.find((t) => t.id === idType);

  const handleFileChange = (key) => (e) => {
    const file = e.target.files?.[0];
    if (file) setUploads((prev) => ({ ...prev, [key]: file }));
  };

  const clearUpload = (key) => {
    setUploads((prev) => ({ ...prev, [key]: null }));
  };

  const canProceedStep1 = !!idType;

  const canProceedStep2 = () => {
    if (!uploads.front) return false;
    if (selectedIdType?.hasTwoSides && !uploads.back) return false;
    if (!uploads.selfie) return false;
    return true;
  };

  const handleSubmit = () => {
    setStatus('pending');
    setStep(1);
  };

  const uploadsComplete = () => {
    const frontDone = !!uploads.front;
    const backDone = selectedIdType?.hasTwoSides ? !!uploads.back : true;
    const selfieDone = !!uploads.selfie;
    return frontDone && backDone && selfieDone;
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="text-[17px] font-semibold text-neutral-900">Identity Verification</h1>
      </header>

      <StatusBanner status={status} />

      {status === 'unverified' && (
        <>
          <StepIndicator currentStep={step} />

          {/* STEP 1 — Choose ID Type */}
          {step === 1 && (
            <div className="px-4 flex flex-col gap-3">
              <p className="text-[15px] text-neutral-600 mb-1">
                Select a valid government-issued ID to verify your identity.
              </p>
              {ID_TYPES.map((t) => (
                <IDTypeCard
                  key={t.id}
                  idType={t}
                  selected={idType === t.id}
                  onSelect={setIdType}
                />
              ))}
              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className={`w-full h-12 rounded-2xl text-[15px] font-semibold mt-2 transition-all ${
                  canProceedStep1
                    ? 'bg-[#0E9AA7] text-white'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2 — Upload Documents */}
          {step === 2 && selectedIdType && (
            <div className="px-4 flex flex-col gap-5">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#E8F9FA' }}
                >
                  {(() => {
                    const Icon = selectedIdType.icon;
                    return <Icon className="h-4 w-4 text-[#0E9AA7]" />;
                  })()}
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-neutral-900">{selectedIdType.title}</p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-[13px] text-[#0E9AA7] font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>

              <UploadBox
                label="Front of card"
                file={uploads.front}
                onFileChange={handleFileChange('front')}
                onClear={() => clearUpload('front')}
                inputRef={frontRef}
              />

              {selectedIdType.hasTwoSides && (
                <UploadBox
                  label="Back of card"
                  file={uploads.back}
                  onFileChange={handleFileChange('back')}
                  onClear={() => clearUpload('back')}
                  inputRef={backRef}
                />
              )}

              <UploadBox
                label="Selfie with document"
                icon={User}
                file={uploads.selfie}
                onFileChange={handleFileChange('selfie')}
                onClear={() => clearUpload('selfie')}
                inputRef={selfieRef}
              />

              <div className="rounded-xl border border-neutral-100 bg-neutral-100 px-4 py-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                <p className="text-[13px] text-neutral-500 leading-relaxed">
                  Files must be JPG, PNG, or PDF · Max 5MB each · Must be clearly readable
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="w-full h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
                >
                  Back
                </button>
                <button
                  disabled={!canProceedStep2()}
                  onClick={() => setStep(3)}
                  className={`w-full h-12 rounded-2xl text-[15px] font-semibold transition-all ${
                    canProceedStep2()
                      ? 'bg-[#0E9AA7] text-white'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Submit */}
          {step === 3 && selectedIdType && (
            <div className="px-4 flex flex-col gap-4">
              <p className="text-[15px] text-neutral-600">
                Review your submission before sending for verification.
              </p>

              <div className="rounded-2xl border border-neutral-200 bg-white divide-y divide-neutral-100">
                <div className="flex items-center justify-between h-14 px-4">
                  <span className="text-[15px] text-neutral-500">ID Type</span>
                  <span className="text-[15px] font-semibold text-neutral-900">
                    {selectedIdType.title}
                  </span>
                </div>
                <div className="flex items-center justify-between h-14 px-4">
                  <span className="text-[15px] text-neutral-500">Front of card</span>
                  <span
                    className={`text-[14px] font-semibold ${
                      uploads.front ? 'text-[#0E9AA7]' : 'text-red-400'
                    }`}
                  >
                    {uploads.front ? uploads.front.name.slice(0, 20) + (uploads.front.name.length > 20 ? '…' : '') : 'Missing'}
                  </span>
                </div>
                {selectedIdType.hasTwoSides && (
                  <div className="flex items-center justify-between h-14 px-4">
                    <span className="text-[15px] text-neutral-500">Back of card</span>
                    <span
                      className={`text-[14px] font-semibold ${
                        uploads.back ? 'text-[#0E9AA7]' : 'text-red-400'
                      }`}
                    >
                      {uploads.back ? uploads.back.name.slice(0, 20) + (uploads.back.name.length > 20 ? '…' : '') : 'Missing'}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between h-14 px-4">
                  <span className="text-[15px] text-neutral-500">Selfie</span>
                  <span
                    className={`text-[14px] font-semibold ${
                      uploads.selfie ? 'text-[#0E9AA7]' : 'text-red-400'
                    }`}
                  >
                    {uploads.selfie ? uploads.selfie.name.slice(0, 20) + (uploads.selfie.name.length > 20 ? '…' : '') : 'Missing'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setAgreed((v) => !v)}
                className="flex items-start gap-3 text-left active:opacity-70 transition-opacity"
              >
                <div
                  className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    agreed ? 'border-[#0E9AA7] bg-[#0E9AA7]' : 'border-neutral-300 bg-white'
                  }`}
                >
                  {agreed && (
                    <svg viewBox="0 0 12 9" fill="none" className="h-3 w-3">
                      <path
                        d="M1 4l3 3 7-6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-[14px] text-neutral-600 leading-relaxed">
                  I confirm these documents are genuine and belong to me
                </p>
              </button>

              {!uploadsComplete() && (
                <div className="mx-0 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-[14px] text-red-700">
                  Please go back and upload all required documents before submitting.
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="w-full h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold"
                >
                  Back
                </button>
                <button
                  disabled={!agreed || !uploadsComplete()}
                  onClick={handleSubmit}
                  className={`w-full h-12 rounded-2xl text-[15px] font-semibold transition-all ${
                    agreed && uploadsComplete()
                      ? 'bg-[#0E9AA7] text-white'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {status === 'pending' && (
        <div className="px-4 pt-6 flex flex-col items-center gap-4 text-center">
          <div
            className="h-20 w-20 rounded-full flex items-center justify-center"
            style={{ background: '#E8F9FA' }}
          >
            <Clock className="h-10 w-10 text-[#0E9AA7]" />
          </div>
          <h2 className="text-[20px] font-bold text-neutral-900">Documents Submitted</h2>
          <p className="text-[15px] text-neutral-500 max-w-xs leading-relaxed">
            Your documents are under review. This usually takes 1–2 business days. We'll notify you when it's done.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full h-12 rounded-2xl border border-[#0E9AA7] text-[#0E9AA7] text-[15px] font-semibold mt-2"
          >
            Back to Home
          </button>
        </div>
      )}

      {status === 'verified' && (
        <div className="px-4 pt-6 flex flex-col items-center gap-4 text-center">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-[20px] font-bold text-neutral-900">Identity Verified</h2>
          <p className="text-[15px] text-neutral-500 max-w-xs leading-relaxed">
            Your identity has been verified. You can now place orders of any value.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="w-full h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold mt-2"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default KYCPage;
