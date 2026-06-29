export const isValidEmail = v => /\S+@\S+\.\S+/.test(v);

export const detectMode = val => {
  if (!val) return 'email';
  if (/^[\d+()\s-]/.test(val)) return 'phone';
  return 'email';
};

export const strengthScore = pw => {
  if (!pw) return { score: 0, label: '', color: '#E5E7EB' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw)) s++;
  const map = [
    { label: '', color: '#E5E7EB' },
    { label: 'Weak', color: '#EF4444' },
    { label: 'Fair', color: '#F97316' },
    { label: 'Good', color: '#EAB308' },
    { label: 'Strong', color: '#22C55E' },
  ];
  return { score: s, ...map[s] };
};

export const passwordStrength = pw => {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-error' };
  if (score === 2) return { score, label: 'Fair', color: 'bg-warning' };
  if (score === 3) return { score, label: 'Good', color: 'bg-accent-400' };
  return { score, label: 'Strong', color: 'bg-success' };
};
