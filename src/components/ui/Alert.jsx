import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { cn } from '../../utils/classNames.js';

const config = {
  success: { icon: CheckCircle, styles: 'bg-success-bg text-success-text border-success/30' },
  warning: { icon: AlertTriangle, styles: 'bg-warning-bg text-warning-text border-warning/30' },
  error:   { icon: XCircle,       styles: 'bg-error-bg   text-error-text   border-error/30'   },
  info:    { icon: Info,          styles: 'bg-info-bg    text-info-text    border-info/30'    },
};

export function Alert({ type = 'info', title, children, className }) {
  const { icon: Icon, styles } = config[type];
  return (
    <div role="alert" className={cn('flex gap-3 rounded-lg border p-4', styles, className)}>
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="text-small font-semibold mb-0.5">{title}</p>}
        <div className="text-small">{children}</div>
      </div>
    </div>
  );
}
