import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const config = {
  success: { icon: CheckCircle2, bar: 'bg-success',       bg: 'bg-success/5',    border: 'border-success/25',   iconCls: 'text-success',       textCls: 'text-neutral-700' },
  warning: { icon: AlertTriangle, bar: 'bg-warning',      bg: 'bg-warning/5',    border: 'border-warning/25',   iconCls: 'text-warning',       textCls: 'text-neutral-700' },
  error:   { icon: XCircle,       bar: 'bg-error',        bg: 'bg-error/5',      border: 'border-error/25',     iconCls: 'text-error',         textCls: 'text-neutral-700' },
  info:    { icon: Info,          bar: 'bg-primary-400',  bg: 'bg-primary-50',   border: 'border-primary-200',  iconCls: 'text-primary-500',   textCls: 'text-neutral-700' },
};

const Alert = ({ type = 'info', title, children, className }) => {
  const { icon: Icon, bar, bg, border, iconCls, textCls } = config[type];
  return (
    <div
      role="alert"
      className={cn(`relative flex gap-3 overflow-hidden border ${bg} ${border} px-4 py-3`, className)}
      style={{ borderRadius: 2 }}
    >
      {/* Left accent bar */}
      <div className={`absolute inset-y-0 left-0 w-[3px] ${bar}`} />
      <Icon className={`mt-0.5 h-4 w-4 flex-shrink-0 ${iconCls}`} aria-hidden="true" />
      <div className={textCls}>
        {title && <p className="mb-0.5 text-small font-semibold">{title}</p>}
        <div className="text-small">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
