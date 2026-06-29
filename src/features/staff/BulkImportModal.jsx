import { useState, useRef } from 'react';
import { X, FileUp, Download, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';
import { ROLES } from '../../data/mockStaff.js';

const validateImportRow = row => {
  const errors = [];
  if (!row.name?.trim()) errors.push('Name required');
  if (!row.email?.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(row.email)) errors.push('Valid email required');
  if (!row.role?.trim()) errors.push('Role required');
  else if (!ROLES.find(r => r.code === row.role.trim())) errors.push(`Unknown role "${row.role}"`);
  return errors;
};

const parseCSVText = text => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1)
    .filter(l => l.trim())
    .map((line, i) => {
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = { _lineNum: i + 2 };
      headers.forEach((h, j) => { row[h] = values[j] ?? ''; });
      row._errors = validateImportRow(row);
      return row;
    });
};

const downloadCSVTemplate = () => {
  const csv = [
    'name,email,phone,role,department,outlet,employeeId,startDate',
    'Kwame Asante,kwame@sparkle.com,+233241234567,customer_service,Customer Success,HQ — Osu,EMP-009,2026-06-01',
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = 'staff_import_template.csv'; a.click();
  URL.revokeObjectURL(url);
};

const BulkImportModal = ({ onClose, onImport }) => {
  const [step, setStep]         = useState(1);
  const [rows, setRows]         = useState([]);
  const [isDragging, setIsDrag] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileRef = useRef(null);

  const handleFile = file => {
    if (!file || !file.name.toLowerCase().endsWith('.csv')) return;
    const reader = new FileReader();
    reader.onload = e => { setRows(parseCSVText(e.target.result)); setStep(2); };
    reader.readAsText(file);
  };

  const validRows = rows.filter(r => r._errors.length === 0);
  const errorRows = rows.filter(r => r._errors.length  > 0);

  const doImport = () => { onImport(validRows); setImportedCount(validRows.length); setStep(3); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div>
            <h2 className="text-h3 font-bold text-neutral-900">Import staff</h2>
            <p className="mt-0.5 text-small text-neutral-500">
              {step === 1 ? 'Upload a CSV file to add multiple staff members at once.' :
               step === 2 ? `${rows.length} row${rows.length !== 1 ? 's' : ''} found — ${validRows.length} valid, ${errorRows.length} with errors` :
               'Import complete'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div
                onDragOver={e => { e.preventDefault(); setIsDrag(true); }}
                onDragLeave={() => setIsDrag(false)}
                onDrop={e => { e.preventDefault(); setIsDrag(false); handleFile(e.dataTransfer.files[0]); }}
                onClick={() => fileRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  isDragging ? 'border-primary-400 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                  <FileUp className="h-6 w-6 text-neutral-500" />
                </div>
                <div>
                  <p className="text-small font-semibold text-neutral-700">
                    {isDragging ? 'Drop the CSV here' : 'Drag & drop your CSV file here'}
                  </p>
                  <p className="mt-0.5 text-caption text-neutral-400">or click to browse — CSV files only</p>
                </div>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                <div className="flex-1">
                  <p className="text-small font-medium text-neutral-700">Need a template?</p>
                  <p className="text-caption text-neutral-400">Download our CSV with the required column headers and an example row.</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadCSVTemplate}>
                  <Download className="h-3.5 w-3.5" /> Template
                </Button>
              </div>

              <div>
                <p className="mb-2 text-small font-medium text-neutral-700">Required columns</p>
                <div className="flex flex-wrap gap-1.5">
                  {['name *', 'email *', 'role *', 'phone', 'department', 'outlet', 'employeeId', 'startDate'].map(col => (
                    <code key={col} className="rounded border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-caption text-neutral-600">{col}</code>
                  ))}
                </div>
                <p className="mt-1.5 text-caption text-neutral-400">
                  * Required. Role must be a valid code: {ROLES.slice(0, 4).map(r => r.code).join(', ')}, …
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex gap-3">
                {[
                  { label: 'Total',  value: rows.length,       bg: '#EAF2FC', color: '#0C5FC5' },
                  { label: 'Valid',  value: validRows.length,  bg: '#E6F6EE', color: '#13753F' },
                  { label: 'Errors', value: errorRows.length,  bg: '#FDECEA', color: '#A31C12' },
                ].map(c => (
                  <div key={c.label} className="flex-1 rounded-lg border px-4 py-3 text-center" style={{ borderColor: c.bg, background: c.bg }}>
                    <p className="text-caption font-medium" style={{ color: c.color }}>{c.label}</p>
                    <p className="text-h3 font-bold tabular-nums" style={{ color: c.color }}>{c.value}</p>
                  </div>
                ))}
              </div>

              <div className="max-h-60 overflow-auto rounded-md border border-neutral-200">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      {['#', 'Name', 'Email', 'Role', 'Status'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-caption font-semibold uppercase tracking-wide text-neutral-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {rows.map((row, i) => {
                      const bad = row._errors.length > 0;
                      return (
                        <tr key={i} style={bad ? { background: '#FFF8F8' } : {}}>
                          <td className="px-3 py-2.5 text-caption text-neutral-400">{row._lineNum}</td>
                          <td className="px-3 py-2.5 text-small text-neutral-800">{row.name || <span className="text-neutral-300">—</span>}</td>
                          <td className="px-3 py-2.5 text-small text-neutral-500">{row.email || <span className="text-neutral-300">—</span>}</td>
                          <td className="px-3 py-2.5 text-small text-neutral-500">{row.role || <span className="text-neutral-300">—</span>}</td>
                          <td className="px-3 py-2.5">
                            {bad ? (
                              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold"
                                style={{ background: '#FDECEA', color: '#A31C12' }} title={row._errors.join('; ')}>
                                <AlertTriangle className="h-3 w-3" />
                                {row._errors[0]}{row._errors.length > 1 ? ` +${row._errors.length - 1}` : ''}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-semibold"
                                style={{ background: '#E6F6EE', color: '#13753F' }}>
                                <CheckCircle2 className="h-3 w-3" /> Ready
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {validRows.length === 0 && (
                <Alert type="error" title="No valid rows to import">Fix the errors in your CSV file and upload again.</Alert>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: '#E6F6EE' }}>
                <CheckCircle2 className="h-7 w-7 text-success" />
              </div>
              <div>
                <p className="text-body font-bold text-neutral-900">
                  {importedCount} staff member{importedCount !== 1 ? 's' : ''} imported
                </p>
                <p className="mt-1.5 text-small text-neutral-500">
                  They'll receive invitation emails with account setup links.
                  {errorRows.length > 0 && ` ${errorRows.length} row${errorRows.length !== 1 ? 's were' : ' was'} skipped due to errors.`}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
          <Button variant="outline" onClick={step === 3 ? onClose : step === 2 ? () => setStep(1) : onClose}>
            {step === 3 ? 'Close' : step === 2 ? 'Back' : 'Cancel'}
          </Button>
          {step === 2 && <Button disabled={validRows.length === 0} onClick={doImport}>Import {validRows.length} valid row{validRows.length !== 1 ? 's' : ''}</Button>}
          {step === 3 && <Button onClick={onClose}>Done</Button>}
        </div>
      </div>
    </div>
  );
};

export default BulkImportModal;
