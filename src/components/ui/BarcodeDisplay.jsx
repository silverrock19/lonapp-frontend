import { cn } from '../../utils/classNames.js';

// Code128B symbol patterns: [bar,space,bar,space,bar,space] widths, each sum=11
// Index 106 = stop symbol (7 widths, sum=13)
const C128 = [
  [2,1,2,2,2,2],[2,2,2,1,2,2],[2,2,2,2,2,1],[1,2,1,2,2,3],[1,2,1,3,2,2], // 0-4
  [1,3,1,2,2,2],[1,2,2,2,1,3],[1,2,2,3,1,2],[1,3,2,2,1,2],[2,2,1,2,1,3], // 5-9
  [2,2,1,3,1,2],[2,3,1,2,1,2],[1,1,2,2,3,2],[1,2,2,1,3,2],[1,2,2,2,3,1], // 10-14
  [1,1,3,2,2,2],[1,2,3,1,2,2],[1,2,3,2,2,1],[2,2,3,2,1,1],[2,2,1,1,3,2], // 15-19
  [2,2,1,2,3,1],[2,1,3,2,1,2],[2,2,3,1,1,2],[3,1,2,1,3,1],[3,1,1,2,2,2], // 20-24
  [3,2,1,1,2,2],[3,2,1,2,2,1],[3,1,2,2,1,2],[3,2,2,1,1,2],[3,2,2,2,1,1], // 25-29
  [2,1,2,1,2,3],[2,1,2,3,2,1],[2,3,2,1,2,1],[1,1,1,3,2,3],[1,3,1,1,2,3], // 30-34
  [1,3,1,3,2,1],[1,1,2,3,1,3],[1,3,2,1,1,3],[1,3,2,3,1,1],[2,1,1,3,1,3], // 35-39
  [2,3,1,1,1,3],[2,3,1,3,1,1],[1,1,2,1,3,3],[1,1,2,3,3,1],[1,3,2,1,3,1], // 40-44
  [1,1,3,1,2,3],[1,1,3,3,2,1],[1,3,3,1,2,1],[3,1,3,1,2,1],[2,1,1,3,3,1], // 45-49
  [2,3,1,1,3,1],[2,1,3,1,1,3],[2,1,3,3,1,1],[2,1,3,1,3,1],[3,1,1,1,2,3], // 50-54
  [3,1,1,3,2,1],[3,3,1,1,2,1],[3,1,2,1,1,3],[3,1,2,3,1,1],[3,3,2,1,1,1], // 55-59
  [3,1,4,1,1,1],[2,2,1,4,1,1],[4,3,1,1,1,1],[1,1,1,2,2,4],[1,1,1,4,2,2], // 60-64
  [1,2,1,1,2,4],[1,2,1,4,2,1],[1,4,1,1,2,2],[1,4,1,2,2,1],[1,1,2,2,1,4], // 65-69
  [1,1,2,4,1,2],[1,2,2,1,1,4],[1,2,2,4,1,1],[1,4,2,1,1,2],[1,4,2,2,1,1], // 70-74
  [2,4,1,2,1,1],[2,2,1,1,1,4],[4,1,3,1,1,1],[2,4,1,1,1,2],[1,3,4,1,1,1], // 75-79
  [1,1,1,2,4,2],[1,2,1,1,4,2],[1,2,1,2,4,1],[1,1,4,2,1,2],[1,2,4,1,1,2], // 80-84
  [1,2,4,2,1,1],[4,1,1,2,1,2],[4,2,1,1,1,2],[4,2,1,2,1,1],[2,1,2,1,4,1], // 85-89
  [2,1,4,1,2,1],[4,1,2,1,2,1],[1,1,1,1,4,3],[1,1,1,3,4,1],[1,3,1,1,4,1], // 90-94
  [1,1,4,1,1,3],[1,1,4,3,1,1],[4,1,1,1,1,3],[4,1,1,3,1,1],[1,1,3,1,4,1], // 95-99
  [1,1,4,1,3,1],[3,1,1,1,4,1],[4,1,1,1,3,1],[2,1,1,4,1,2],[2,1,1,2,1,4], // 100-104
  [2,1,1,2,3,2],[2,3,3,1,1,1,2],                                            // 105, 106 (stop)
];

const START_B = 104;
const STOP    = 106;

function encodeCode128B(str) {
  // Build symbol value list
  const syms = [START_B];
  let check = START_B;
  for (let i = 0; i < str.length; i++) {
    const v = str.charCodeAt(i) - 32;
    syms.push(v);
    check += v * (i + 1);
  }
  syms.push(check % 103);
  syms.push(STOP);

  // Flatten to [{w, dark}] bars
  const bars = [{ w: 10, dark: false }]; // left quiet zone
  for (const sym of syms) {
    const pat = C128[sym];
    pat.forEach((w, i) => bars.push({ w, dark: i % 2 === 0 }));
  }
  bars.push({ w: 10, dark: false }); // right quiet zone
  return bars;
}

// ── QR visual mock ────────────────────────────────────────────────────────────

function stringHash(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return Math.abs(h);
}

function lcg(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function buildQRGrid(value, n = 25) {
  const rand = lcg(stringHash(value));
  const grid = Array.from({ length: n }, () => Array(n).fill(0));

  // Finder pattern (7×7): outer ring black, inner ring white, core 3×3 black
  function addFinder(r0, c0) {
    for (let dr = 0; dr < 7; dr++) {
      for (let dc = 0; dc < 7; dc++) {
        if (r0 + dr >= n || c0 + dc >= n) continue;
        const outer = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const inner = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        grid[r0 + dr][c0 + dc] = (outer || inner) ? 1 : 0;
      }
    }
  }
  addFinder(0, 0);          // top-left
  addFinder(0, n - 7);      // top-right
  addFinder(n - 7, 0);      // bottom-left

  // Timing patterns on row/col 6
  for (let i = 8; i < n - 8; i++) {
    grid[6][i] = i % 2 === 0 ? 1 : 0;
    grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // Dark module (required by QR spec)
  if (4 * 1 + 9 < n) grid[4 * 1 + 9][8] = 1;

  // Fill remaining with deterministic pseudo-data
  const reserved = new Set();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (r < 9 && c < 9) { reserved.add(`${r},${c}`); continue; }
      if (r < 9 && c >= n - 8) { reserved.add(`${r},${c}`); continue; }
      if (r >= n - 8 && c < 9) { reserved.add(`${r},${c}`); continue; }
      if (r === 6 || c === 6) { reserved.add(`${r},${c}`); continue; }
    }
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!reserved.has(`${r},${c}`)) {
        grid[r][c] = rand() > 0.52 ? 1 : 0;
      }
    }
  }
  return grid;
}

function QRCodeMock({ value, size }) {
  const n = 25;
  const grid = buildQRGrid(value, n);
  const cell = size / n;
  const cells = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c]) {
        cells.push(
          <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#111" />
        );
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {cells}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function BarcodeDisplay({
  value,
  format = 'barcode',
  width = 280,
  height = 80,
  showLabel = true,
  className,
}) {
  if (!value) return null;

  if (format === 'qr') {
    const qSize = Math.min(width, height + (showLabel ? 20 : 0));
    return (
      <div className={cn('flex flex-col items-center gap-1', className)}>
        <QRCodeMock value={value} size={qSize} />
        {showLabel && (
          <span className="font-mono text-[10px] tracking-wider text-neutral-500 select-all">{value}</span>
        )}
      </div>
    );
  }

  // Linear Code128B barcode
  const bars = encodeCode128B(value);
  const totalUnits = bars.reduce((s, b) => s + b.w, 0);
  const barH = showLabel ? height - 18 : height;
  const unitW = width / totalUnits;

  let x = 0;
  const rects = bars.map((bar, i) => {
    const bx = x;
    x += bar.w * unitW;
    return bar.dark
      ? <rect key={i} x={bx} y={0} width={bar.w * unitW} height={barH} fill="#111" />
      : null;
  });

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={width}
        height={barH}
        viewBox={`0 0 ${width} ${barH}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={width} height={barH} fill="white" />
        {rects}
      </svg>
      {showLabel && (
        <span className="mt-0.5 font-mono text-[10px] tracking-wider text-neutral-500 select-all">{value}</span>
      )}
    </div>
  );
}
