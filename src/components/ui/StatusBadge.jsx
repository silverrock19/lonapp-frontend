const StatusBadge = ({ label, dot, bg, color, text }) => (
  <span
    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
    style={{ background: bg, color: color ?? text }}
  >
    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: dot }} />
    {label}
  </span>
);

export default StatusBadge;
