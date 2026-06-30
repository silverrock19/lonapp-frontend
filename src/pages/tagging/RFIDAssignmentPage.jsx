import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff, CheckCircle2, Crown } from 'lucide-react';
import { getItemByBarcode } from '../../lib/mock/mockItems.js';
import { addRFIDAssignment, getRFIDAssignments } from '../../lib/mock/mockTagging.js';
import RFIDTagBadge from '../../components/ui/RFIDTagBadge.jsx';
import Button from '../../components/ui/Button.jsx';
import { cn } from '../../utils/classNames.js';

function generateEPC() {
  // 24-char hex EPC
  return Array.from({ length: 24 }, () => '0123456789ABCDEF'[Math.floor(Math.random() * 16)]).join('');
}

function ReaderAnimation({ phase }) {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      {/* Pulsing rings */}
      {phase === 'scanning' && [1, 2, 3].map(i => (
        <span
          key={i}
          className="absolute rounded-full border-2 border-purple-400/40"
          style={{
            width:  `${48 + i * 36}px`,
            height: `${48 + i * 36}px`,
            animation: `ping ${1 + i * 0.3}s cubic-bezier(0,0,0.2,1) infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
      {/* Core */}
      <div className={cn(
        'relative z-10 flex h-16 w-16 flex-col items-center justify-center rounded-2xl border-2 shadow-md transition-all duration-500',
        phase === 'scanning'  ? 'border-purple-400 bg-purple-50 shadow-purple-200'
          : phase === 'found'   ? 'border-success bg-success/10 shadow-success/20'
          : phase === 'error'   ? 'border-error bg-error/10'
          : 'border-neutral-200 bg-neutral-50',
      )}>
        {phase === 'scanning' && <Wifi     className="h-7 w-7 text-purple-500 animate-pulse" />}
        {phase === 'found'    && <CheckCircle2 className="h-7 w-7 text-success" />}
        {phase === 'idle'     && <WifiOff  className="h-7 w-7 text-neutral-300" />}
      </div>
      <p className={cn(
        'absolute bottom-0 text-caption font-medium',
        phase === 'scanning' ? 'text-purple-500' : phase === 'found' ? 'text-success' : 'text-neutral-400',
      )}>
        {phase === 'scanning' ? 'Scanning…' : phase === 'found' ? 'Tag found!' : 'Reader idle'}
      </p>
    </div>
  );
}

export default function RFIDAssignmentPage() {
  const [readerPhase, setReaderPhase] = useState('idle'); // idle | scanning | found
  const [epcInput, setEpcInput]       = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [assignedItem, setAssignedItem] = useState(null);
  const [assignedEpc, setAssignedEpc]   = useState(null);
  const [history, setHistory] = useState(getRFIDAssignments);
  const scanTimerRef = useRef(null);

  function startScan() {
    setReaderPhase('scanning');
    scanTimerRef.current = setTimeout(() => {
      // Mock: reader finds a tag after ~2s
      const mockEpc = generateEPC();
      setEpcInput(mockEpc);
      setReaderPhase('found');
    }, 2000);
  }

  function stopScan() {
    clearTimeout(scanTimerRef.current);
    setReaderPhase('idle');
    setEpcInput('');
  }

  useEffect(() => () => clearTimeout(scanTimerRef.current), []);

  function handleAssign() {
    const epc = epcInput.trim().toUpperCase();
    if (!epc || epc.length !== 24) return;
    const item = barcodeInput ? getItemByBarcode(barcodeInput.trim()) : null;

    const entry = {
      epc,
      barcode: item?.barcode ?? barcodeInput ?? '—',
      itemId: item?.id ?? null,
      customerName: item?.customerName ?? 'Unlinked',
      typeName: item?.typeName ?? '—',
      washCount: 0,
    };
    addRFIDAssignment(entry);
    setAssignedItem(item);
    setAssignedEpc(epc);
    setHistory(getRFIDAssignments());
    setEpcInput('');
    setBarcodeInput('');
    setReaderPhase('idle');
  }

  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link to="/tagging" className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-h2 font-bold text-neutral-900">RFID Tag Assignment</h1>
            <span className="flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
              <Crown className="h-3 w-3" /> Premium
            </span>
          </div>
          <p className="text-caption text-neutral-500">US-0104 · Associate RFID tags with items using the wireless reader (mock)</p>
        </div>
      </div>

      {/* ── Premium notice ──────────────────────────────────── */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3">
        <Crown className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-small font-semibold text-amber-800">Post-MVP · Premium feature</p>
          <p className="text-caption text-amber-700 mt-0.5">
            RFID tagging requires hardware integration (UHF reader + Impinj tags). This screen uses a mocked
            reader — data is stored but no physical hardware is required during prototype testing.
          </p>
        </div>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left: reader + assignment ─── */}
        <div className="flex-1 space-y-4">
          {/* Reader animation */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col items-center gap-4">
            <ReaderAnimation phase={readerPhase} />
            <div className="flex gap-2">
              {readerPhase === 'idle' ? (
                <Button variant="primary" onClick={startScan}>
                  <Wifi className="h-4 w-4" /> Activate Reader
                </Button>
              ) : (
                <Button variant="outline" onClick={stopScan}>Stop</Button>
              )}
            </div>
          </div>

          {/* Manual entry */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="text-small font-semibold text-neutral-800">Manual Entry</h2>

            <div className="space-y-1">
              <label className="text-caption font-medium text-neutral-600">EPC Code (24-char hex)</label>
              <input
                value={epcInput}
                onChange={e => setEpcInput(e.target.value.toUpperCase())}
                placeholder="E.g. 3000E2000019A50D000197FF"
                maxLength={24}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-small text-neutral-800 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-neutral-400"
                spellCheck={false}
              />
              <p className={cn('text-[10px]', epcInput.length === 24 ? 'text-success' : 'text-neutral-400')}>
                {epcInput.length}/24 characters
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-caption font-medium text-neutral-600">Link to item barcode (optional)</label>
              <input
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="LA-XXXXXXXX-XXXXXX"
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 font-mono text-small text-neutral-800 outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-neutral-400"
                spellCheck={false}
              />
            </div>

            <Button
              variant="primary"
              size="default"
              className="w-full !bg-purple-600 hover:!bg-purple-700"
              onClick={handleAssign}
              disabled={epcInput.length !== 24}
            >
              <Wifi className="h-4 w-4" /> Assign RFID Tag
            </Button>
          </div>

          {/* Success badge */}
          {assignedEpc && (
            <div className="rounded-xl border border-success/30 bg-success/5 p-4">
              <p className="text-small font-semibold text-success mb-2">Tag assigned successfully</p>
              <RFIDTagBadge epc={assignedEpc} washCount={0} status="assigned" />
            </div>
          )}
        </div>

        {/* ── Right: recent assignments ─── */}
        <div className="w-72 flex-shrink-0">
          <p className="mb-3 text-caption font-semibold uppercase tracking-wider text-neutral-400">
            Recent Assignments ({history.length})
          </p>
          {history.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-10 flex flex-col items-center text-center px-4">
              <Wifi className="h-6 w-6 text-neutral-300 mb-2" />
              <p className="text-caption text-neutral-400">No RFID assignments yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((a, i) => (
                <div key={i} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] text-neutral-700 truncate">{a.epc}</p>
                      <p className="text-caption text-neutral-500">{a.customerName} · {a.typeName}</p>
                    </div>
                    <Wifi className="h-3.5 w-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                  </div>
                  <p className="font-mono text-[10px] text-neutral-400">{a.barcode}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
