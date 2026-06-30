import { useState } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import SectionCard from '../../components/ui/SectionCard.jsx';
import { DOC_STATUS } from '../../utils/statuses.js';

const initDocs = [
  { id: 1, name: 'Business Registration Certificate', ref: 'BRC-2021-00345',   expiryDate: '2027-12-31', fileName: 'BRC_Sparkle_2021.pdf',   status: 'active'   },
  { id: 2, name: 'Tax Identification Certificate',    ref: 'TIN-GH-0023456',   expiryDate: '2026-08-05', fileName: 'TIN_Sparkle.pdf',          status: 'expiring' },
  { id: 3, name: 'Food & Safety Hygiene Permit',      ref: 'FSH-ACC-2022-089', expiryDate: '2026-04-01', fileName: 'FSH_Sparkle.pdf',          status: 'expired'  },
  { id: 4, name: 'Environmental Compliance Cert.',    ref: 'ECC-2023-0112',    expiryDate: '2028-03-15', fileName: 'ECC_Sparkle.pdf',          status: 'active'   },
  { id: 5, name: "Employer's Liability Insurance",    ref: 'INS-GH-4456',      expiryDate: '2027-01-31', fileName: 'Insurance_Sparkle.pdf',    status: 'active'   },
];

const fmt = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const DocumentsTab = () => {
  const [docs, setDocs]               = useState(initDocs);
  const [uploadModal, setUploadModal] = useState(null);
  const [expiryInput, setExpiryInput] = useState('');
  const [dragging, setDragging]       = useState(false);
  const [uploaded, setUploaded]       = useState(false);

  const handleUpload = () => {
    setDocs(prev => prev.map(d =>
      d.id === uploadModal.id ? { ...d, status: 'active', expiryDate: expiryInput || d.expiryDate, fileName: 'updated_document.pdf' } : d
    ));
    setUploadModal(null);
    setExpiryInput('');
    setUploaded(true);
    setTimeout(() => setUploaded(false), 3500);
  };

  const counts = {
    active:   docs.filter(d => d.status === 'active').length,
    expiring: docs.filter(d => d.status === 'expiring').length,
    expired:  docs.filter(d => d.status === 'expired').length,
  };

  return (
    <div className="space-y-6">
      {uploaded && <Alert type="success" title="Document updated">The replacement has been uploaded and is pending LonApp verification.</Alert>}

      <div className="grid grid-cols-3 gap-4">
        {[
          { key: 'active',   label: 'Active'        },
          { key: 'expiring', label: 'Expiring soon' },
          { key: 'expired',  label: 'Expired'       },
        ].map(c => (
          <div key={c.key} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-5 py-4">
            <span className="text-small font-medium text-neutral-700">{c.label}</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-small font-bold"
              style={{ background: DOC_STATUS[c.key].bg, color: DOC_STATUS[c.key].color }}>
              {counts[c.key]}
            </span>
          </div>
        ))}
      </div>

      <SectionCard title="Compliance documents" description="Keep documents current — expired permits may affect your account standing.">
        <div className="overflow-hidden rounded-lg border border-neutral-200">
          <table className="w-full border-collapse text-small">
            <thead>
              <tr className="bg-neutral-50">
                {['Document', 'Reference', 'Expiry date', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-caption font-semibold uppercase tracking-wide text-neutral-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docs.map((doc, i) => {
                const st = DOC_STATUS[doc.status];
                return (
                  <tr key={doc.id} className={i < docs.length - 1 ? 'border-b border-neutral-100' : ''}>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-neutral-900">{doc.name}</p>
                      <p className="text-caption text-neutral-400">{doc.fileName}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-caption text-neutral-600">{doc.ref}</td>
                    <td className="px-4 py-3.5 text-neutral-700">{fmt(doc.expiryDate)}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: st.bg, color: st.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: st.color }} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button className="text-caption font-medium text-primary-600 hover:underline"
                        onClick={() => { setExpiryInput(''); setUploadModal(doc); }}>
                        Replace
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-h4 font-bold text-neutral-900">Replace document</h3>
                <p className="mt-0.5 text-small text-neutral-500">{uploadModal.name}</p>
              </div>
              <button onClick={() => setUploadModal(null)} className="rounded p-1 hover:bg-neutral-100">
                <X className="h-4 w-4 text-neutral-400" />
              </button>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); }}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-10 transition-colors ${
                dragging ? 'border-primary-400 bg-primary-50' : 'border-neutral-200 bg-neutral-50 hover:border-neutral-300'
              }`}
            >
              <Upload className="mb-3 h-7 w-7 text-neutral-400" />
              <p className="text-small font-medium text-neutral-700">
                Drag and drop, or{' '}
                <span className="cursor-pointer text-primary-600 hover:underline">browse</span>
              </p>
              <p className="mt-1 text-caption text-neutral-400">PDF, JPG, PNG · max 10 MB</p>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-small font-medium text-neutral-700">
                New expiry date <span className="text-neutral-400">(optional)</span>
              </label>
              <input type="date" value={expiryInput} onChange={e => setExpiryInput(e.target.value)}
                className="w-full rounded-md border border-neutral-200 px-3 py-2 text-small text-neutral-900 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setUploadModal(null)}>Cancel</Button>
              <Button onClick={handleUpload}><Upload className="h-3.5 w-3.5" /> Upload document</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;
