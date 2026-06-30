import { cn } from '../../utils/classNames.js';

const SectionCard = ({ title, description, children, action, className, noPadding = false }) => (
  <div className={cn('rounded-xl border border-neutral-100 bg-white shadow-sm overflow-hidden', className)}>
    {(title || action) && (
      <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
        <div>
          <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
          {description && <p className="mt-0.5 text-small text-neutral-500">{description}</p>}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    )}
    <div className={noPadding ? '' : 'p-6'}>{children}</div>
  </div>
);

export default SectionCard;
