const DrawerSection = ({ title, children }) => (
  <div className="mx-4 my-3 overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-sm">
    {title && (
      <div className="border-b border-neutral-100 bg-neutral-50 px-5 py-2.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">{title}</p>
      </div>
    )}
    <div className="px-5 py-4">{children}</div>
  </div>
);

export default DrawerSection;
