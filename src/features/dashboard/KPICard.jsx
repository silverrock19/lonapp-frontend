import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const KPICard = ({ label, value, trend, up, down }) => {
  const trendColor = up ? '#1F9D57' : down ? '#D92D20' : '#6B7280';
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="text-caption font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
      <p className="mt-3 text-[28px] font-extrabold tabular-nums leading-none text-neutral-900">{value}</p>
      <div className="mt-2.5 flex items-center gap-1 text-caption font-semibold" style={{ color: trendColor }}>
        {up   && <TrendingUp   className="h-3 w-3 flex-shrink-0" />}
        {down && <TrendingDown className="h-3 w-3 flex-shrink-0" />}
        {!up && !down && <Minus className="h-3 w-3 flex-shrink-0" />}
        <span>{trend}</span>
      </div>
    </div>
  );
};

export default KPICard;
