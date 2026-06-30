import { Info } from 'lucide-react';
import { ROLES, RBAC_FEATURES, PERMISSION_CODES, mockStaff } from '../../data/mockStaff.js';
import { CODE_META } from './staffUtils.js';

const PermCell = ({ code }) => {
  const meta = CODE_META[code] || CODE_META.N;
  const desc = PERMISSION_CODES[code]?.desc || '';
  return (
    <td className="px-3 py-2.5 text-center" title={desc}>
      <span className="inline-flex h-6 w-8 items-center justify-center rounded text-caption font-bold"
        style={{ background: meta.bg, color: meta.color }}>
        {code}
      </span>
    </td>
  );
};

const RolesTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-4 gap-4">
      {ROLES.map(r => (
        <div key={r.code} className="rounded-lg border border-neutral-200 bg-white px-4 py-4">
          <div className="flex items-start gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-caption font-bold"
              style={{ background: r.bg, color: r.color }}>
              {r.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-small font-semibold leading-tight text-neutral-900">{r.name}</p>
              <p className="text-caption text-neutral-400">{r.level}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-caption text-neutral-500">
            <span>{mockStaff.filter(s => s.role === r.code).length} member(s)</span>
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-lg border border-neutral-200 bg-white p-5">
      <p className="mb-3 text-small font-semibold text-neutral-700">Permission level legend</p>
      <div className="flex flex-wrap gap-3">
        {Object.entries(PERMISSION_CODES).map(([code, meta]) => (
          <div key={code} className="flex items-center gap-1.5">
            <span className="inline-flex h-6 w-8 items-center justify-center rounded text-caption font-bold"
              style={{ background: CODE_META[code]?.bg, color: CODE_META[code]?.color }}>
              {code}
            </span>
            <span className="text-caption text-neutral-600">{meta.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-caption text-neutral-400">
        <Info className="h-3.5 w-3.5" />
        Hover any cell for a description. Inheritance: Super Admin → Admin (100%) → Ops Manager (80%) → Staff.
      </p>
    </div>

    <div className="overflow-hidden rounded-md border border-neutral-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="w-64 px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">Feature (EP-01)</th>
              {ROLES.map(r => (
                <th key={r.code} className="px-3 py-3 text-center text-caption font-semibold tracking-wide" style={{ color: r.color }}>
                  <div className="leading-tight">{r.name.split(' ').map((w, i) => <span key={i} className="block">{w}</span>)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RBAC_FEATURES.map(group => (
              <>
                <tr key={group.category} className="border-y border-neutral-100 bg-neutral-50">
                  <td colSpan={ROLES.length + 1} className="px-4 py-2 text-caption font-semibold uppercase tracking-wide text-neutral-400">
                    {group.category}
                  </td>
                </tr>
                {group.features.map(feat => (
                  <tr key={feat.story} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <p className="text-small text-neutral-900">{feat.name}</p>
                      <p className="text-caption text-neutral-400">{feat.story}</p>
                    </td>
                    {ROLES.map(r => <PermCell key={r.code} code={feat.permissions[r.code] || 'N'} />)}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default RolesTab;
