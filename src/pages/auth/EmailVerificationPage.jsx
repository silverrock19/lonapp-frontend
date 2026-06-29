import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Brandmark from '../../components/ui/Brandmark.jsx';

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const otpString = otp.join('');
  const isComplete = otpString.length === 6 && otp.every((d) => d !== '');

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = ['', '', '', '', '', ''];
    pasted.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = () => {
    if (!isComplete || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/app');
    }, 1000);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(60);
    setToast('Code resent!');
    setTimeout(() => setToast(''), 3000);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center px-6 pt-12 pb-24">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <Brandmark />

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[22px] font-bold text-neutral-900">Verify your email</h1>
          <p className="text-[15px] text-neutral-500 leading-relaxed">
            We sent a 6-digit code to <span className="font-semibold text-neutral-700">{email}</span>. Enter it below — expires in 30 minutes.
          </p>
        </div>

        {toast ? (
          <div className="w-full mx-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700 text-center">
            {toast}
          </div>
        ) : null}

        <div className="flex flex-row gap-2 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-[22px] font-bold border rounded-xl outline-none transition-all"
              style={{
                borderColor: digit ? '#0E9AA7' : document.activeElement === inputRefs.current[index] ? '#0E9AA7' : '#e5e7eb',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#0E9AA7')}
              onBlur={(e) => (e.target.style.borderColor = digit ? '#0E9AA7' : '#e5e7eb')}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete || loading}
          className="w-full h-12 rounded-2xl text-white text-[15px] font-semibold transition-all"
          style={{
            background: isComplete && !loading ? '#0E9AA7' : '#a5d8dd',
            cursor: isComplete && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Verifying…' : 'Verify Email'}
        </button>

        <div className="text-[14px] text-neutral-500 text-center">
          {cooldown > 0 ? (
            <span>
              Didn't receive it?{' '}
              <span className="text-neutral-400">
                Resend in {pad(Math.floor(cooldown / 60))}:{pad(cooldown % 60)}
              </span>
            </span>
          ) : (
            <span>
              Didn't receive it?{' '}
              <button
                onClick={handleResend}
                className="text-[#0E9AA7] font-semibold underline-offset-2 hover:underline"
              >
                Resend code
              </button>
            </span>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-[14px] text-neutral-400 hover:text-neutral-600 transition-colors min-h-12 flex items-center"
        >
          Change email address
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
