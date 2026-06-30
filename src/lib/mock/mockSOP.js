// Mock Standard Operating Procedures for EP-07 US-0187

export const MOCK_SOPS = [
  {
    id: 'SOP-001', title: 'Intake & Bag Verification', stage: 'INTAKE', version: 'v2.1',
    activeFrom: '2026-01-15', updatedBy: 'Ops Manager — Ama Kufuor',
    steps: [
      'Scan customer bag barcode at intake counter',
      'Count and verify item count against manifest',
      'Log any discrepancies (missing/extra/damaged items) in the Discrepancy Log',
      'Assign hydro tag in format Name-Outlet(Qty)-Date',
      'Photo each item at intake if condition issue suspected',
      'Advance item status to INTAKE_COMPLETED',
    ],
    acknowledgedBy: ['Yaw Owusu', 'Akua Bonsu'],
    pendingAcknowledgement: ['Kojo Asante'],
  },
  {
    id: 'SOP-002', title: 'Sorting by Fabric & Colour', stage: 'SORTING', version: 'v1.3',
    activeFrom: '2026-02-01', updatedBy: 'Ops Manager — Ama Kufuor',
    steps: [
      'Scan item barcode at sorting station',
      'Identify fabric type: Cotton / Synthetic / Wool / Silk / Delicate / Mixed',
      'Identify colour band: Whites / Lights / Darks / Colours',
      'Check garment care label — override system suggestion if label conflicts',
      'Place item in correct sort bin (colour band takes priority over fabric for wash grouping)',
      'Flag incompatible mixes to supervisor before machine loading',
    ],
    acknowledgedBy: ['Yaw Owusu', 'Akua Bonsu', 'Kojo Asante'],
    pendingAcknowledgement: [],
  },
  {
    id: 'SOP-003', title: 'Washing Machine Operation', stage: 'WASHING', version: 'v3.0',
    activeFrom: '2026-03-10', updatedBy: 'Ops Manager — Ama Kufuor',
    steps: [
      'Confirm load weight does not exceed machine capacity (max 80%)',
      'Select correct wash programme per fabric group (see programme chart)',
      'Measure detergent dose per kg using dosing guide — log in Chemical Usage',
      'Add fabric softener only for Cotton and Mixed loads',
      'Lock machine door and start cycle — record start time',
      'Monitor cycle completion — do not leave FAULT state unattended',
      'Post-wash: transfer immediately to Drying — no items left damp > 30 min',
    ],
    acknowledgedBy: ['Yaw Owusu'],
    pendingAcknowledgement: ['Akua Bonsu', 'Kojo Asante'],
  },
  {
    id: 'SOP-004', title: 'Chemical Handling & Storage', stage: 'CHEMICALS', version: 'v1.8',
    activeFrom: '2026-01-01', updatedBy: 'Compliance Officer — Abena Ofori',
    steps: [
      'Always wear PPE (gloves, apron) when handling solvents and bleach',
      'Store DC solvent in sealed drums in ventilated Chemical Storage zone only',
      'Never mix bleach with detergents or fabric softener',
      'Log all chemical usage in Chemical Usage Log (item, qty, machine, shift)',
      'If air quality alarm sounds in Chemical Storage — evacuate zone and alert supervisor',
      'Spills: contain with absorbent material, log in Incident Register, notify Compliance Officer',
    ],
    acknowledgedBy: ['Yaw Owusu', 'Akua Bonsu', 'Kojo Asante'],
    pendingAcknowledgement: [],
  },
  {
    id: 'SOP-005', title: 'QC Inspection', stage: 'QC', version: 'v2.2',
    activeFrom: '2026-04-01', updatedBy: 'QC Lead — Esi Tetteh',
    steps: [
      'Scan item barcode at QC station',
      'Inspect on 5 dimensions: Cleanliness, Fabric Condition, Finishing, Packaging, Completeness',
      'Rate each dimension: Pass / Minor Issue / Fail',
      'If any Fail: classify defect (Minor / Major / Critical) and send to Rework',
      'If all Pass: advance status to DISPATCH_QUEUE',
      'Photo any defect found — attach to QC record',
      'Log inspector name, time, and station on every record',
    ],
    acknowledgedBy: ['Yaw Owusu', 'Akua Bonsu', 'Kojo Asante', 'Esi Tetteh'],
    pendingAcknowledgement: [],
  },
];

export const getAllSOPs = () => [...MOCK_SOPS];
export const getSOP = id => MOCK_SOPS.find(s => s.id === id) ?? null;
export const getSOPsByStage = stage => MOCK_SOPS.filter(s => s.stage === stage);
