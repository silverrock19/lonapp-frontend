import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplets, Printer, PenLine, CheckCircle2 } from 'lucide-react';
import ScannerInput from '../../components/ui/ScannerInput.jsx';
import HydroTagLabel from '../../components/ui/HydroTagLabel.jsx';
import { getItemByBarcode, updateItem, addItemEvent } from '../../lib/mock/mockItems.js';
import { HYDRO_MATERIALS } from '../../lib/mock/mockTagging.js';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

const DELIVERY_DATES = {
  'ORD-ACC-0629-0001': '30/06/2026',
  'ORD-ACC-0629-0002': '02/07/2026',
  'ORD-ACC-0629-0003': '02/07/2026',
};

export default function HydroTagPage() {
  const [item, setItem]           = useState(null);
  const [scanError, setScanError] = useState('');
  const [material, setMaterial]   = useState('tyvek');
  const [writeMode, setWriteMode] = useState('print'); // print | write
  const [success, setSuccess]     = useState(false);

  function handleScan(barcode) {
    const found = getItemByBarcode(barcode);
    if (!found) {
      setScanError(`No item found for barcode ${barcode}`);
      setItem(null);
      return;
    }
    setScanError('');
    setItem(found);
    setSuccess(false);
  }

  function handleCreate() {
    if (!item) return;
    const hydroData = {
      material,
      createdAt: new Date().toISOString(),
      createdBy: 'Ama Otu',
      deliveryDate: DELIVERY_DATES[item.orderId] ?? '—',
    };
    updateItem(item.id, { tags: { ...item.tags, hydro: hydroData } });
    addItemEvent(item.id, 'HYDRO_TAGGED', 'Ama Otu', `Hydro tag created (${material})`);
    setSuccess(true);
    setItem(null);
  }

  const deliveryDate = item ? (DELIVERY_DATES[item.orderId] ?? '—') : null;

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tagging" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-h2 font-bold text-neutral-900">Hydro Tag Creation</h1>
          <p className="text-caption text-neutral-500">US-0105 · Create heat-seal hydro tags for garments entering wet processing</p>
        </div>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left: scan + config ─── */}
        <div className="flex-1 space-y-4">

          {/* Step 1: Scan */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">1</span>
              <h2 className="text-small font-semibold text-neutral-800">Scan or search item</h2>
            </div>
            <ScannerInput
              onScan={handleScan}
              label="Barcode scanner"
              placeholder="Scan barcode or type LA-XXXXXXXX-XXXXXX…"
              mockCameraBarcode="LA-10000002-000001"
            />
            {scanError && <p className="mt-2 text-caption text-error">{scanError}</p>}
          </div>

          {/* Step 2: Item details (shows once scanned) */}
          {item && (
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">2</span>
                <h2 className="text-small font-semibold text-neutral-800">Item details</h2>
              </div>

              {/* Item card */}
              <div className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 grid grid-cols-2 gap-2">
                {[
                  ['Customer',     item.customerName],
                  ['Order',        item.orderId],
                  ['Item type',    `${item.typeName} × ${item.qty}`],
                  ['Service',      item.service],
                  ['Outlet',       item.outletName],
                  ['Delivery',     deliveryDate],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider">{k}</p>
                    <p className="text-small font-medium text-neutral-800">{v}</p>
                  </div>
                ))}
              </div>

              {/* Material selector */}
              <div>
                <p className="mb-2 text-caption font-medium text-neutral-600">Tag material</p>
                <div className="grid grid-cols-2 gap-2">
                  {HYDRO_MATERIALS.map(mat => (
                    <button
                      key={mat.id}
                      onClick={() => setMaterial(mat.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all',
                        material === mat.id
                          ? 'border-accent-400 bg-accent-50 ring-2 ring-accent-100'
                          : 'border-neutral-200 hover:border-neutral-300',
                      )}
                    >
                      <span className="text-base">{mat.icon}</span>
                      <div>
                        <p className="text-[11px] font-semibold text-neutral-800">{mat.label}</p>
                        {mat.waterproof && (
                          <p className="text-[9px] text-accent-600">Waterproof</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Output mode */}
              <div>
                <p className="mb-2 text-caption font-medium text-neutral-600">Output</p>
                <div className="flex gap-2">
                  {[
                    ['print', 'Print Label', Printer],
                    ['write', 'Write to Tag', PenLine],
                  ].map(([val, label, Icon]) => (
                    <button
                      key={val}
                      onClick={() => setWriteMode(val)}
                      className={cn(
                        'flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-small font-medium transition-all',
                        writeMode === val
                          ? 'border-primary-400 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Button variant="accent" size="default" className="w-full" onClick={handleCreate}>
                <Droplets className="h-4 w-4" />
                {writeMode === 'print' ? 'Print Hydro Tag' : 'Write to Tag (Mock)'}
              </Button>
            </div>
          )}

          {/* Success state */}
          {success && (
            <div className="rounded-xl border border-success/30 bg-success/5 p-5 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-success flex-shrink-0" />
              <div>
                <p className="text-small font-semibold text-success">Hydro tag created successfully</p>
                <p className="text-caption text-neutral-500">
                  {writeMode === 'print' ? 'Label sent to printer.' : 'Tag written.'} Scan next item to continue.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Label preview ─── */}
        <div className="w-64 flex-shrink-0 space-y-3">
          <p className="text-caption font-semibold text-neutral-500 uppercase tracking-wider">Preview</p>
          {item ? (
            <div className="flex flex-col items-center gap-3">
              {/* Full size label */}
              <HydroTagLabel
                customerName={item.customerName}
                outletAbbrev={item.outletAbbrev}
                qty={item.qty}
                deliveryDate={deliveryDate}
                typeName={item.typeName}
                service={item.service}
                material={material}
              />
              {/* Small preview */}
              <HydroTagLabel
                customerName={item.customerName}
                outletAbbrev={item.outletAbbrev}
                qty={item.qty}
                deliveryDate={deliveryDate}
                typeName={item.typeName}
                service={item.service}
                material={material}
                size="preview"
              />
              <p className="text-[10px] text-neutral-400 text-center">Full label (top) · Garment tag (bottom)</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-14 px-4 text-center">
              <Droplets className="h-8 w-8 text-neutral-300 mb-2" />
              <p className="text-caption text-neutral-400">Scan an item to preview the hydro tag</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
