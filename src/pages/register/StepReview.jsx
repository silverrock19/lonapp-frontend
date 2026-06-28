import { useState } from 'react';
import Button from '../../components/ui/Button.jsx';
import { CheckCircle2, Building2, Store, Factory, CreditCard, Smartphone, Banknote, User } from 'lucide-react';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2 text-small">
      <span className="text-neutral-500 min-w-[160px]">{label}</span>
      <span className="text-neutral-900 font-medium text-right">{value}</span>
    </div>
  );
}

function Section({ title, icon: Icon, children, color = 'text-primary-500' }) {
  return (
    <div className="rounded-lg border border-neutral-200 overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-neutral-100 bg-neutral-50 px-5 py-3">
        <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
        <h3 className="text-small font-semibold text-neutral-800">{title}</h3>
      </div>
      <div className="px-5 divide-y divide-neutral-100">{children}</div>
    </div>
  );
}

const StepReview = ({ data, onBack, onEdit }) => {
  const [submitted, setSubmitted] = useState(false);
  const { company, outlets: outletData, services, payment, admin } = data;

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-h3 font-bold text-neutral-900">Registration Submitted!</h2>
        <p className="mt-2 mb-6 text-body text-neutral-500 max-w-sm mx-auto">
          Your business profile has been sent for review. We'll send a confirmation to{' '}
          <strong className="text-neutral-800">{company?.email}</strong>.
        </p>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-4 text-left max-w-xs mx-auto">
          <p className="text-small font-semibold text-neutral-700 mb-2">What happens next?</p>
          <ol className="space-y-1.5 text-small text-neutral-600 list-decimal list-inside">
            <li>Our team reviews your submission (1–2 business days)</li>
            <li>You receive an approval email</li>
            <li>Log in to set up your full account</li>
          </ol>
        </div>
        <div className="mt-7">
          <Button onClick={() => window.location.href = '/login'}>Go to Login →</Button>
        </div>
      </div>
    );
  }

  const outlets   = outletData?.outlets   || [];
  const factories = outletData?.factories || [];

  return (
    <div className="p-8">
      <h2 className="text-h3 font-bold text-neutral-900">Review &amp; Submit</h2>
      <p className="mt-1 mb-7 text-body text-neutral-500">
        Review your information before submitting for approval.
      </p>

      <div className="space-y-4">

        {/* Company */}
        <Section title="Company Information" icon={Building2}>
          <Row label="Company name"    value={company?.companyName} />
          <Row label="Country"         value={company?.country} />
          <Row label="Email"           value={company?.email} />
          <Row label="Phone"           value={company?.phone} />
          <Row label="WhatsApp"        value={company?.whatsapp} />
          <Row label="Currency"        value={company?.currency} />
          <Row label="Address"         value={company?.address} />
          <Row label="GPS"             value={company?.gps} />
          <Row label="Business type"   value={company?.registrationType} />
          <Row label="Reg. number"     value={company?.registrationNumber} />
          <Row label="Reg. document"   value={company?.registrationDoc} />
        </Section>

        {/* Outlets */}
        {(outlets.length > 0 || factories.length > 0) && (
          <Section title={`Outlets & Factories (${outlets.length + factories.length})`} icon={Store}>
            {outlets.map((o, i) => (
              <div key={i} className="py-2.5">
                <div className="flex items-center gap-2 text-small font-semibold text-neutral-800 mb-1">
                  <Store className="h-3.5 w-3.5 text-primary-400" />
                  {o.name} ({o.abbrev})
                  {o.doublesAsFactory && <span className="text-caption text-amber-600 font-normal">+ factory</span>}
                </div>
                <p className="text-caption text-neutral-500">{o.address} · {o.phone}</p>
              </div>
            ))}
            {factories.map((fa, i) => (
              <div key={i} className="py-2.5">
                <div className="flex items-center gap-2 text-small font-semibold text-neutral-800 mb-1">
                  <Factory className="h-3.5 w-3.5 text-amber-400" />
                  {fa.name}
                  {fa.doublesAsOutlet && <span className="text-caption text-primary-600 font-normal">+ outlet</span>}
                </div>
                <p className="text-caption text-neutral-500">{fa.address}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Services */}
        {services && (
          <Section title="Services" icon={CheckCircle2} color="text-success">
            <Row label="Business types" value={services.businessTypes?.join(', ')} />
            {services.retailServices?.length > 0 && (
              <Row label="Retail services" value={services.retailServices?.join(', ')} />
            )}
            {services.commercialServices?.length > 0 && (
              <Row label="Commercial services" value={services.commercialServices?.join(', ')} />
            )}
            <Row label="Standard turnaround" value={`${services.standardDuration} ${services.standardUnit}`} />
            {services.expressEnabled && (
              <>
                <Row label="Express turnaround" value={`${services.expressDuration} ${services.expressUnit}`} />
                <Row label="Express surcharge"  value={`${services.expressSurcharge}%`} />
              </>
            )}
          </Section>
        )}

        {/* Payment */}
        {payment && (
          <Section title="Payment Methods" icon={CreditCard}>
            {payment.methods?.map((m, i) => (
              <div key={i} className="py-2.5">
                <div className="flex items-center gap-2 text-small font-medium text-neutral-800">
                  {m.type === 'bank' ? <CreditCard className="h-3.5 w-3.5 text-primary-400" /> : <Smartphone className="h-3.5 w-3.5 text-green-500" />}
                  {m.type === 'bank' ? `${m.bankName} · ${m.accountType}` : `${m.provider}`}
                </div>
                <p className="text-caption text-neutral-500 mt-0.5">
                  {m.type === 'bank' ? `${m.accountName} · ${m.accountNumber}` : `${m.phone} · ${m.accountName}`}
                </p>
              </div>
            ))}
            {payment.cashEnabled && (
              <div className="py-2.5">
                <div className="flex items-center gap-2 text-small font-medium text-neutral-800">
                  <Banknote className="h-3.5 w-3.5 text-neutral-400" /> Cash payments accepted
                </div>
              </div>
            )}
          </Section>
        )}

        {/* Admin */}
        {admin?.profile && (
          <Section title="Admin Account" icon={User}>
            <Row label="Name"   value={[admin.profile.title, admin.profile.firstName, admin.profile.lastName].filter(Boolean).join(' ')} />
            <Row label="Phone"  value={admin.profile.phone} />
            <Row label="Role"   value={admin.profile.role} />
            <Row label="ID type" value={admin.profile.idType} />
            <Row label="ID doc"  value={admin.profile.idDoc} />
          </Section>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-neutral-100 py-5">
        <Button variant="outline" type="button" onClick={onBack}>← Back</Button>
        <Button type="button" onClick={() => setSubmitted(true)}>
          Submit for approval →
        </Button>
      </div>
    </div>
  );
}

export default StepReview;


