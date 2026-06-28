import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Phone } from 'lucide-react';
import Brandmark from '../../components/ui/Brandmark.jsx';

const COOLDOWN_SECONDS = 60;

const PhoneVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone') || '+1 (555) 000-0000';

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [cooldown, setCooldown] = useState(COOLDOWN_SECONDS);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: '', message: '' }), 3500);
  };

  const otpValue = otp.join('');

  const handleChange = (e, i) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[i] = char;
    setOtp(next);
    if (char && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  const handleVerify = async () => {
    if (otpValue.length < 6) {
      showToast('error', 'Please enter all 6 digits.');
      return;
    }
    setLoading(true);
    try {
      // TODO: dispatch verifyPhoneOtp({ phone, otp: otpValue })
      await new Promise((res) => setTimeout(res, 1000));
      showToast('success', 'Phone verified successfully!');
      setTimeout(() => navigate('/app'), 800);
    } catch {
      showToast('error', 'Invalid or expired code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      // TODO: dispatch resendPhoneOtp({ phone })
      setCooldown(COOLDOWN_SECONDS);
      showToast('success', 'A new code has been sent to your phone.');
    } catch {
      showToast('error', 'Failed to resend code. Please try again.');
    }
  };

  const handleVoiceOtp = () => {
    showToast('success', 'Voice OTP is coming soon.');
  };

  return (
    <div className="text-center w-full space-y-6">
      {/* Brandmark */}
      <div className="flex justify-center">
        <Brandmark />
      </div>

      {/* Phone icon in teal circle */}
      <div className="flex justify-center">
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: 48, height: 48, background: '#E8F9FA' }}
        >
          <Phone className="h-6 w-6" style={{ color: '#0E9AA7' }} />
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-[22px] font-bold text-neutral-900">Enter the code</h1>
        <p className="text-[15px] text-neutral-500 leading-relaxed px-2">
          We sent a 6-digit SMS code to{' '}
          <span className="font-semibold text-neutral-700">{phone}</span>.{' '}
          It expires in 10 minutes.
        </p>
      </div>

      {/* Toast */}
      {toast.message && (
        <div
          className={
            toast.type === 'error'
              ? 'mx-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700'
              : 'mx-0 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[14px] text-green-700'
          }
        >
          {toast.message}
        </div>
      )}

      {/* 6-box OTP input */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            aria-label={`Digit ${i + 1}`}
            className="h-12 w-12 rounded-xl border border-neutral-200 text-center text-[20px] font-semibold text-neutral-800 outline-none transition-all focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20"
          />
        ))}
      </div>

      {/* Verify button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full h-12 rounded-2xl bg-[#0E9AA7] text-white text-[15px] font-semibold disabled:opacity-60 transition-opacity"
      >
        {loading ? 'Verifying…' : 'Verify Phone Number'}
      </button>

      {/* Resend countdown */}
      <p className="text-[14px] text-neutral-500">
        {cooldown > 0 ? (
          <>
            Resend code in{' '}
            <span className="font-semibold" style={{ color: '#0E9AA7' }}>
              {cooldown}s
            </span>
          </>
        ) : (
          <button
            onClick={handleResend}
            className="font-semibold underline underline-offset-2"
            style={{ color: '#0E9AA7' }}
          >
            Resend code
          </button>
        )}
      </p>

      {/* Try a different number */}
      <button
        onClick={() => navigate(-1)}
        className="text-[14px] text-neutral-500 hover:text-neutral-700 transition-colors"
      >
        Try a different number?
      </button>

      {/* Voice OTP link */}
      <button
        onClick={handleVoiceOtp}
        className="text-[14px] font-medium"
        style={{ color: '#0E9AA7' }}
      >
        Having trouble? Try voice OTP →
      </button>
    </div>
  );
};

export default PhoneVerificationPage;
