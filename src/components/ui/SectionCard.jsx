const SectionCard = ({ title, description, children, action }) => (
  <div className="rounded-lg border border-neutral-200 bg-white">
    <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-4">
      <div>
        <h3 className="text-h4 font-semibold text-neutral-900">{title}</h3>
        {description && <p className="mt-0.5 text-small text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

export default SectionCard;
