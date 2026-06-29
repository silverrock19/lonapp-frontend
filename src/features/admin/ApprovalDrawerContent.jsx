import { FileText, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import Alert from '../../components/ui/Alert.jsx';
import DrawerSection from '../../components/ui/DrawerSection.jsx';
import Field from '../../components/ui/Field.jsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const HISTORY_COLORS = {
  approved:                { dot: 'bg-success',     label: 'Approved'                },
  rejected:                { dot: 'bg-error',       label: 'Rejected'                },
  resubmitted:             { dot: 'bg-primary-400', label: 'Resubmitted'             },
  clarification_requested: { dot: 'bg-primary-400', label: 'Clarification Requested' },
};

const TabOverview = ({ biz }) => (
  <>
    {biz.previousRejection && (
      <DrawerSection>
        <Alert type="warning" title="Previously Rejected">
          Rejected {biz.previousRejection.date}: <em>{biz.previousRejection.reason}</em>.{' '}
          {biz.previousRejection.notes && <span>"{biz.previousRejection.notes}"</span>}
        </Alert>
      </DrawerSection>
    )}
    {biz.clarificationQuestion && (
      <DrawerSection>
        <Alert type="info" title="Awaiting Clarification">
          Sent {biz.clarificationSent}: "{biz.clarificationQuestion}"
        </Alert>
      </DrawerSection>
    )}
    <DrawerSection title="Quick Summary">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Business Name"     value={biz.name}             />
        <Field label="Registration Type" value={biz.registrationType} />
        <Field label="Country"           value={biz.country}          />
        <Field label="Currency"          value={biz.currency}         />
        <Field label="Business Email"    value={biz.email}            />
        <Field label="Phone Number"      value={biz.phone}            />
        <div className="col-span-2"><Field label="Physical Address" value={biz.address} /></div>
        <Field label="GPS / Location"    value={biz.gps}              />
      </div>
    </DrawerSection>
    <DrawerSection title="Submission Checklist">
      <div className="space-y-2">
        {[
          ['Registration type selected',     true                               ],
          ['Registration number provided',   !!(biz.registrationNumber)         ],
          ['Registration document uploaded', !!(biz.registrationDoc)            ],
          ['Business logo uploaded',         !!(biz.logo)                       ],
          ['At least one outlet added',      biz.outlets.length > 0             ],
          ['Services configured',            biz.services.businessTypes.length > 0],
          ['Payment method added',           biz.payment.methods.length > 0     ],
          ['Admin account created',          !!(biz.admin.email)                ],
        ].map(([label, done]) => (
          <div key={label} className="flex items-center gap-2.5">
            <div className={done ? 'text-success' : 'text-neutral-300'}>
              {done ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </div>
            <span className={cn('text-small', done ? 'text-neutral-700' : 'text-neutral-400')}>{label}</span>
          </div>
        ))}
      </div>
    </DrawerSection>
  </>
);

const TabCompany = ({ biz }) => (
  <DrawerSection title="Company Details">
    <div className="grid grid-cols-2 gap-4">
      <Field label="Company Name"        value={biz.name}               />
      <Field label="Registration Type"   value={biz.registrationType}   />
      <Field label="Country"             value={biz.country}            />
      <Field label="Currency"            value={biz.currency}           />
      <Field label="Business Email"      value={biz.email}              />
      <Field label="Phone"               value={biz.phone}              />
      <Field label="WhatsApp"            value={biz.whatsapp}           />
      <Field label="GPS Code"            value={biz.gps}                />
      <div className="col-span-2"><Field label="Physical Address" value={biz.address} /></div>
      <Field label="Registration Number" value={biz.registrationNumber} mono />
      <div>
        <p className="text-caption text-neutral-400">Registration Document</p>
        {biz.registrationDoc
          ? <a href="#" className="mt-0.5 inline-flex items-center gap-1 text-small text-primary-600 hover:underline">
              <FileText className="h-3.5 w-3.5" />{biz.registrationDoc}
            </a>
          : <p className="mt-0.5 text-small text-neutral-300">Not uploaded</p>
        }
      </div>
      <div>
        <p className="text-caption text-neutral-400">Business Logo</p>
        {biz.logo
          ? <a href="#" className="mt-0.5 inline-flex items-center gap-1 text-small text-primary-600 hover:underline">
              <FileText className="h-3.5 w-3.5" />{biz.logo}
            </a>
          : <p className="mt-0.5 text-small text-neutral-300">Not uploaded</p>
        }
      </div>
    </div>
  </DrawerSection>
);

const TabOutlets = ({ biz }) => (
  <>
    {biz.outlets.map((o, i) => (
      <DrawerSection key={o.id} title={`Outlet ${i + 1}${o.doublesAsFactory ? ' (+ Factory)' : ''}`}>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <Field label="Name"               value={o.name}                              />
          <Field label="Abbreviation"       value={o.abbrev}                  mono      />
          <div className="col-span-2"><Field label="Address" value={o.address} /></div>
          <Field label="Phone"              value={o.phone}                             />
          <Field label="Doubles as Factory" value={o.doublesAsFactory ? 'Yes' : 'No'}  />
        </div>
        <p className="mb-2 text-caption text-neutral-400">Operating Hours</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {DAYS.map(d => (
            <div key={d} className="flex flex-col items-center">
              <span className="mb-1 text-caption font-semibold text-neutral-500">{d}</span>
              {o.hours[d] === 'Closed'
                ? <span className="text-[10px] text-neutral-300">Closed</span>
                : <span className="whitespace-pre-wrap text-[10px] leading-tight text-neutral-700">
                    {(o.hours[d] || '').replace('–', '\n')}
                  </span>
              }
            </div>
          ))}
        </div>
      </DrawerSection>
    ))}
    {biz.factories.filter(f => !f.doublesAsOutlet).map((f, i) => (
      <DrawerSection key={f.id} title={`Factory ${i + 1}`}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" value={f.name}      />
          <Field label="GPS"  value={f.gps}  mono />
          <div className="col-span-2"><Field label="Address" value={f.address} /></div>
        </div>
      </DrawerSection>
    ))}
    {biz.outlets.length === 0 && biz.factories.length === 0 && (
      <DrawerSection><p className="text-small text-neutral-400">No outlets or factories added.</p></DrawerSection>
    )}
  </>
);

const TabServices = ({ biz }) => {
  const s = biz.services;
  return (
    <>
      <DrawerSection title="Business Type">
        <div className="flex flex-wrap gap-2">
          {s.businessTypes.map(t => (
            <span key={t} className="rounded-full border border-primary-200 bg-primary-50 px-2.5 py-0.5 text-small font-semibold text-primary-700">{t}</span>
          ))}
        </div>
      </DrawerSection>
      {s.retailServices.length > 0 && (
        <DrawerSection title="Retail Services">
          <div className="flex flex-wrap gap-2">
            {s.retailServices.map(sv => (
              <span key={sv} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-small text-neutral-700">{sv}</span>
            ))}
          </div>
        </DrawerSection>
      )}
      {s.commercialServices.length > 0 && (
        <DrawerSection title="Commercial Services">
          <div className="flex flex-wrap gap-2">
            {s.commercialServices.map(sv => (
              <span key={sv} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 text-small text-neutral-700">{sv}</span>
            ))}
          </div>
        </DrawerSection>
      )}
      <DrawerSection title="Turnaround Time">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Standard Turnaround" value={`${s.standardDuration} ${s.standardUnit}`}              />
          <Field label="Express Enabled"     value={s.expressEnabled ? 'Yes' : 'No'}                        />
          {s.expressEnabled && <>
            <Field label="Express Turnaround" value={`${s.expressDuration} ${s.expressUnit}`}               />
            <Field label="Express Surcharge"  value={s.expressSurcharge ? `${s.expressSurcharge}%` : '—'}  />
          </>}
        </div>
      </DrawerSection>
    </>
  );
};

const TabPayment = ({ biz }) => (
  <>
    {biz.payment.methods.map((m, i) => (
      <DrawerSection key={i} title={m.type === 'bank' ? `Bank Transfer ${i + 1}` : `Mobile Money ${i + 1}`}>
        <div className="grid grid-cols-2 gap-4">
          {m.type === 'bank' ? <>
            <Field label="Bank Name"      value={m.bankName}              />
            <Field label="Account Name"   value={m.accountName}           />
            <Field label="Account Number" value={m.accountNumber}   mono  />
            <Field label="Branch"         value={m.branch}                />
            <Field label="Account Type"   value={m.accountType}           />
          </> : <>
            <Field label="Provider"     value={m.provider}          />
            <Field label="Account Name" value={m.accountName}       />
            <Field label="Phone Number" value={m.phone}        mono />
          </>}
        </div>
      </DrawerSection>
    ))}
    <DrawerSection title="Cash Payments">
      <Field label="Accept Cash" value={biz.payment.cashEnabled ? 'Yes — cash accepted at outlets' : 'No'} />
    </DrawerSection>
  </>
);

const TabAdmin = ({ biz }) => {
  const a = biz.admin;
  return (
    <DrawerSection title="Admin Account">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" value={`${a.title} ${a.firstName} ${a.lastName}`} />
        <Field label="Role"      value={a.role}   />
        <Field label="Email"     value={a.email}  />
        <Field label="Phone"     value={a.phone}  />
        <Field label="ID Type"   value={a.idType} />
        <div>
          <p className="text-caption text-neutral-400">ID Document</p>
          {a.idDoc
            ? <a href="#" className="mt-0.5 inline-flex items-center gap-1 text-small text-primary-600 hover:underline">
                <FileText className="h-3.5 w-3.5" />{a.idDoc}
              </a>
            : <p className="mt-0.5 text-small text-neutral-300">Not uploaded</p>
          }
        </div>
      </div>
    </DrawerSection>
  );
};

const TabHistory = ({ biz }) => {
  const history = biz.history || [];
  if (!history.length) return <DrawerSection><p className="text-small text-neutral-400">No history yet.</p></DrawerSection>;
  return (
    <DrawerSection>
      <div className="relative pl-5">
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-neutral-100" />
        <div className="space-y-5">
          {history.map((h, i) => {
            const cfg = HISTORY_COLORS[h.action] || { dot: 'bg-neutral-300', label: h.action };
            return (
              <div key={i} className="relative">
                <div className={cn('absolute top-1 h-3 w-3 rounded-full border-2 border-white', cfg.dot)} style={{ left: -19 }} />
                <p className="text-small font-semibold text-neutral-800">{cfg.label}</p>
                <p className="text-caption text-neutral-400">{h.date} · {h.by}</p>
                {h.reason && <p className="mt-1 text-small text-neutral-600">Reason: {h.reason}</p>}
                {h.notes  && <p className="mt-0.5 text-small italic text-neutral-500">"{h.notes}"</p>}
              </div>
            );
          })}
        </div>
      </div>
    </DrawerSection>
  );
};

const ApprovalDrawerContent = ({ biz, tab }) => {
  switch (tab) {
    case 'Overview':  return <TabOverview biz={biz} />;
    case 'Company':   return <TabCompany  biz={biz} />;
    case 'Outlets':   return <TabOutlets  biz={biz} />;
    case 'Services':  return <TabServices biz={biz} />;
    case 'Payment':   return <TabPayment  biz={biz} />;
    case 'Admin':     return <TabAdmin    biz={biz} />;
    case 'History':   return <TabHistory  biz={biz} />;
    default:          return null;
  }
};

export default ApprovalDrawerContent;
