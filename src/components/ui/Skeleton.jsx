import { cn } from '../../utils/classNames.js';

const Skeleton = ({ className }) => (
  <div
    className={cn('rounded-md animate-shimmer', className)}
    aria-hidden="true"
  />
);

export const SkeletonCard = ({ lines = 3, className }) => (
  <div className={cn('rounded-xl border border-neutral-100 bg-white p-5 shadow-sm space-y-3', className)}>
    <Skeleton className="h-4 w-2/5" />
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-3/5' : 'w-full')} />
    ))}
  </div>
);

export const SkeletonRow = ({ cols = 4, className }) => (
  <tr className={className} aria-hidden="true">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3.5">
        <Skeleton className="h-4 w-3/4" />
      </td>
    ))}
  </tr>
);

export const SkeletonList = ({ count = 5, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} lines={2} />
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-4/5' : 'w-full')} />
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = 'md', className }) => {
  const sz = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }[size] ?? 'h-10 w-10';
  return <Skeleton className={cn('rounded-full', sz, className)} />;
};

export default Skeleton;
