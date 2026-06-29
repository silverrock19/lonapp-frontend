import { cn } from '../../utils/classNames.js';

const Field = ({ label, value, mono }) => (
  <div>
    <p className="text-caption text-neutral-400">{label}</p>
    <p className={cn('mt-0.5 text-small text-neutral-800', mono && 'font-mono')}>{value || '—'}</p>
  </div>
);

export default Field;
