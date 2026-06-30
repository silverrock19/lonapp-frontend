// Mock data for US-0092–0097 Issues, Disputes & Refunds

export const ISSUE_TYPES = {
  MISSING:  { key: 'MISSING',  label: 'Missing Items',    color: 'text-warning-text',   bg: 'bg-warning-bg'  },
  QUALITY:  { key: 'QUALITY',  label: 'Quality Issue',    color: 'text-error',          bg: 'bg-error-bg'    },
  DAMAGE:   { key: 'DAMAGE',   label: 'Item Damage',      color: 'text-error',          bg: 'bg-error-bg'    },
  DISPUTE:  { key: 'DISPUTE',  label: 'Dispute',          color: 'text-neutral-600',    bg: 'bg-neutral-100' },
  REFUND:   { key: 'REFUND',   label: 'Refund Request',   color: 'text-accent-600',     bg: 'bg-accent-50'   },
  RECLEAN:  { key: 'RECLEAN',  label: 'Re-Cleaning',      color: 'text-purple-600',     bg: 'bg-purple-50'   },
};

export const CASE_STATUS_LABELS = {
  SUBMITTED:      'Submitted',
  UNDER_REVIEW:   'Under Review',
  INVESTIGATION:  'Under Investigation',
  RESOLVED:       'Resolved',
  REJECTED:       'Rejected',
  CLOSED:         'Closed',
};

export const REFUND_STATUSES = {
  REQUESTED:  { label: 'Requested',   color: 'text-warning-text', bg: 'bg-warning-bg'  },
  APPROVED:   { label: 'Approved',    color: 'text-success-text', bg: 'bg-success-bg'  },
  PROCESSING: { label: 'Processing',  color: 'text-accent-600',   bg: 'bg-accent-50'   },
  COMPLETED:  { label: 'Completed',   color: 'text-success-text', bg: 'bg-success-bg'  },
  REJECTED:   { label: 'Rejected',    color: 'text-error',        bg: 'bg-error-bg'    },
};

export const MOCK_DISPUTES = [
  {
    id: 'case-001',
    type: 'MISSING',
    orderId: 'ORD-2026-05-0901',
    status: 'RESOLVED',
    title: 'Missing 2 Shirts',
    description: 'I received only 4 shirts but sent 6. Two shirts are missing from the delivery.',
    affectedItems: ['Shirt / Blouse × 2'],
    photos: ['photo1.jpg', 'photo2.jpg'],
    desiredResolution: 'Find and return items',
    createdAt: '2026-05-25T09:00:00',
    updatedAt: '2026-05-28T14:00:00',
    resolvedAt: '2026-05-28T14:00:00',
    resolutionNote: 'Items found and dispatched for re-delivery. We apologise for the inconvenience.',
    timeline: [
      { at: '2026-05-25T09:00:00', label: 'Claim submitted' },
      { at: '2026-05-25T11:00:00', label: 'Under investigation' },
      { at: '2026-05-27T15:00:00', label: 'Items located at outlet' },
      { at: '2026-05-28T14:00:00', label: 'Resolved — items returned' },
    ],
    messages: [
      { from: 'customer', text: 'I am missing 2 shirts from my delivery.', at: '2026-05-25T09:05:00' },
      { from: 'staff',    text: 'We have started investigating. We will update you shortly.', at: '2026-05-25T11:30:00' },
      { from: 'staff',    text: 'Good news! We found your shirts at the outlet. They will be re-delivered today.', at: '2026-05-27T15:10:00' },
    ],
    refundId: null,
  },
  {
    id: 'case-002',
    type: 'QUALITY',
    orderId: 'ORD-2026-04-0801',
    status: 'UNDER_REVIEW',
    title: 'Stains Not Removed on Trousers',
    description: 'My two trousers came back with the original stains still visible. The coffee stain on the grey trousers was not treated at all.',
    affectedItems: ['Trouser / Pants × 2'],
    photos: ['before.jpg', 'after.jpg'],
    desiredResolution: 'Re-clean at no charge',
    createdAt: '2026-04-20T10:00:00',
    updatedAt: '2026-04-21T08:00:00',
    resolvedAt: null,
    resolutionNote: null,
    timeline: [
      { at: '2026-04-20T10:00:00', label: 'Claim submitted' },
      { at: '2026-04-20T14:00:00', label: 'Under review by quality team' },
    ],
    messages: [
      { from: 'customer', text: 'The stains were not removed. I need a re-clean.', at: '2026-04-20T10:05:00' },
      { from: 'staff',    text: 'Thank you for reaching out. Our quality team is reviewing your case.', at: '2026-04-20T14:10:00' },
    ],
    refundId: null,
    recleanId: 'reclean-001',
  },
  {
    id: 'case-003',
    type: 'REFUND',
    orderId: 'ORD-2026-06-1005',
    status: 'SUBMITTED',
    title: 'Refund Request — Cancelled Order',
    description: 'I cancelled order ORD-2026-06-1005 before pickup. I would like a full refund to my Mobile Money account.',
    affectedItems: [],
    photos: [],
    desiredResolution: 'Full refund to MoMo',
    createdAt: '2026-06-26T16:00:00',
    updatedAt: '2026-06-26T16:00:00',
    resolvedAt: null,
    resolutionNote: null,
    timeline: [
      { at: '2026-06-26T16:00:00', label: 'Refund request submitted' },
    ],
    messages: [],
    refundId: 'refund-001',
  },
];

export const MOCK_REFUNDS = [
  {
    id: 'refund-001',
    caseId: 'case-003',
    orderId: 'ORD-2026-06-1005',
    reason: 'Order cancelled before pickup',
    amount: 55.75,
    method: 'mobile_money',
    methodDetail: 'MTN MoMo · 0244 567 890',
    status: 'REQUESTED',
    createdAt: '2026-06-26T16:00:00',
    processedAt: null,
  },
];

const CASE_MAP   = Object.fromEntries(MOCK_DISPUTES.map(d => [d.id, d]));
const REFUND_MAP = Object.fromEntries(MOCK_REFUNDS.map(r => [r.id, r]));

export const getAllDisputes    = () => [...MOCK_DISPUTES];
export const getDispute       = id => CASE_MAP[id] ?? null;
export const getRefund        = id => REFUND_MAP[id] ?? null;
export const getDisputesForOrder = orderId => MOCK_DISPUTES.filter(d => d.orderId === orderId);
