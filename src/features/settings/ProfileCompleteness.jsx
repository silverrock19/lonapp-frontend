const COMPLETENESS_CHECKS = [
  p => !!p.fullName,
  p => !!p.email,
  p => !!p.phone,
  p => !!p.jobTitle,
  p => !!p.photo,
  p => !!p.business.description,
  p => !!p.business.website,
  p => Object.values(p.business.hours).some(h => h.enabled),
];

const ProfileCompleteness = ({ profile }) => {
  const done  = COMPLETENESS_CHECKS.filter(fn => fn(profile)).length;
  const total = COMPLETENESS_CHECKS.length;
  const pct   = Math.round((done / total) * 100);
  const complete = pct === 100;

  return (
    <div
      className="flex items-center gap-4 rounded-lg border px-5 py-4"
      style={{ borderColor: complete ? '#1F9D57' : '#E5E7EB', background: complete ? '#E6F6EE' : '#FAFAFA' }}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-small font-semibold text-neutral-800">
            {complete ? 'Profile 100% complete' : `Profile ${pct}% complete`}
          </p>
          <span className="text-caption text-neutral-500">{done}/{total} fields</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: complete ? '#1F9D57' : '#0C5FC5' }}
          />
        </div>
        {!complete && (
          <p className="mt-1.5 text-caption text-neutral-500">
            Add a profile photo, job title, and business description to complete your profile.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileCompleteness;
