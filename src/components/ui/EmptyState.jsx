import { cn } from '../../utils/classNames.js';

const EmptyState = ({ icon: Icon, title, description, action, compact = false, className }) => (
  <div className={cn(
    'flex flex-col items-center justify-center text-center animate-fade-in',
    compact ? 'py-10 px-4' : 'py-16 px-6',
    className
  )}>
    {Icon && (
      <div className={cn(
        'mb-4 flex items-center justify-center rounded-full bg-neutral-100',
        compact ? 'h-12 w-12' : 'h-16 w-16'
      )}>
        <Icon className={cn('text-neutral-400', compact ? 'h-6 w-6' : 'h-8 w-8')} aria-hidden="true" />
      </div>
    )}
    <p className={cn('font-semibold text-neutral-700', compact ? 'text-small' : 'text-body')}>{title}</p>
    {description && (
      <p className={cn('mt-1.5 text-neutral-400 max-w-xs', compact ? 'text-caption' : 'text-small')}>
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
