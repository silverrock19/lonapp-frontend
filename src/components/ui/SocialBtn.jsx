const SocialBtn = ({ icon: Icon, label, onClick, iconColor }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-4 text-[14px] font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 active:bg-neutral-100"
  >
    <Icon style={{ color: iconColor }} />
    {label}
  </button>
);

export default SocialBtn;
