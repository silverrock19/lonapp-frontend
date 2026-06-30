export const TICKET_STATUSES = {
  OPEN:     { label: 'Open',     color: 'text-primary-700', bg: 'bg-primary-50'  },
  PENDING:  { label: 'Pending',  color: 'text-warning-text', bg: 'bg-warning-bg'  },
  RESOLVED: { label: 'Resolved', color: 'text-success-text', bg: 'bg-success-bg'  },
  CLOSED:   { label: 'Closed',   color: 'text-neutral-500',  bg: 'bg-neutral-100' },
};

export const TICKET_PRIORITIES = {
  URGENT: { label: 'Urgent', color: 'text-error',        bg: 'bg-error-bg'    },
  HIGH:   { label: 'High',   color: 'text-warning-text', bg: 'bg-warning-bg'  },
  NORMAL: { label: 'Normal', color: 'text-neutral-600',  bg: 'bg-neutral-100' },
  LOW:    { label: 'Low',    color: 'text-neutral-400',  bg: 'bg-neutral-50'  },
};

export const TICKET_CHANNELS = {
  CALL:     { label: 'Phone Call', icon: 'phone' },
  WHATSAPP: { label: 'WhatsApp',   icon: 'message-circle' },
  EMAIL:    { label: 'Email',      icon: 'mail' },
  IN_APP:   { label: 'In-App',     icon: 'smartphone' },
  WALK_IN:  { label: 'Walk-In',    icon: 'store' },
};

export const CANNED_RESPONSES = [
  "Thank you for reaching out! We're looking into this and will get back to you shortly.",
  'We apologise for the inconvenience. Your order is being prioritised.',
  'Your refund has been approved and will be processed within 3–5 business days.',
  'We have escalated this to our quality team for investigation.',
  'Could you please share more details or photos to help us resolve this faster?',
];

export const MOCK_TICKETS = [
  {
    id: 'TKT-2026-0041',
    subject: 'Missing shirts from order ORD-2026-06-1001',
    customerId: 'cust-001', customerName: 'Adwoa Frimpong',
    customerPhone: '+233 24 567 890', customerEmail: 'adwoa.f@gmail.com',
    orderId: 'ORD-2026-06-1001', disputeId: null,
    channel: 'WHATSAPP', status: 'OPEN', priority: 'HIGH',
    assignee: 'Esi Tetteh', assigneeId: 'staff-cs-001',
    tags: ['missing-items', 'order'],
    createdAt: '2026-06-28T10:00:00', updatedAt: '2026-06-28T10:30:00',
    thread: [
      { from: 'customer', name: 'Adwoa Frimpong', text: 'Hi, I received my order but 2 shirts are missing. Please help.', at: '2026-06-28T10:00:00' },
      { from: 'agent', name: 'Esi Tetteh', text: 'Hello Adwoa, thank you for reaching out! We are looking into this right away.', at: '2026-06-28T10:30:00' },
    ],
    internalNotes: ['Customer is a regular — handle with priority.'],
  },
  {
    id: 'TKT-2026-0040',
    subject: 'Stain not removed — quality complaint',
    customerId: 'cust-003', customerName: 'Kweku Mensah',
    customerPhone: '+233 50 234 5678', customerEmail: 'kweku.m@email.com',
    orderId: 'ORD-2026-04-0801', disputeId: 'case-002',
    channel: 'CALL', status: 'PENDING', priority: 'HIGH',
    assignee: 'Esi Tetteh', assigneeId: 'staff-cs-001',
    tags: ['quality', 'stain', 're-clean'],
    createdAt: '2026-06-27T14:00:00', updatedAt: '2026-06-28T09:00:00',
    thread: [
      { from: 'customer', name: 'Kweku Mensah', text: 'The coffee stain on my trousers was not removed at all. I want a re-clean.', at: '2026-06-27T14:00:00' },
      { from: 'agent', name: 'Esi Tetteh', text: 'We apologise for this. We have escalated to our quality team. A re-clean has been scheduled.', at: '2026-06-27T15:00:00' },
      { from: 'customer', name: 'Kweku Mensah', text: 'When will it be done?', at: '2026-06-28T08:00:00' },
    ],
    internalNotes: ['Linked to dispute case-002. QC team notified.'],
  },
  {
    id: 'TKT-2026-0039',
    subject: 'Refund request for cancelled order',
    customerId: 'cust-001', customerName: 'Adwoa Frimpong',
    customerPhone: '+233 24 567 890', customerEmail: 'adwoa.f@gmail.com',
    orderId: 'ORD-2026-06-1005', disputeId: 'case-003',
    channel: 'IN_APP', status: 'PENDING', priority: 'NORMAL',
    assignee: null, assigneeId: null,
    tags: ['refund', 'cancelled-order'],
    createdAt: '2026-06-26T16:30:00', updatedAt: '2026-06-26T16:30:00',
    thread: [
      { from: 'customer', name: 'Adwoa Frimpong', text: 'I cancelled order ORD-2026-06-1005 before pickup. When will I get my refund?', at: '2026-06-26T16:30:00' },
    ],
    internalNotes: [],
  },
  {
    id: 'TKT-2026-0038',
    subject: 'Overdue invoice — payment plan query',
    customerId: 'cust-002', customerName: 'GoldCoast Hotels',
    customerPhone: '+233 30 987 6543', customerEmail: 'laundry@gchotels.com',
    orderId: 'ORD-2026-05-0701', disputeId: null,
    channel: 'EMAIL', status: 'RESOLVED', priority: 'URGENT',
    assignee: 'Esi Tetteh', assigneeId: 'staff-cs-001',
    tags: ['billing', 'overdue', 'corporate'],
    createdAt: '2026-06-20T09:00:00', updatedAt: '2026-06-22T11:00:00',
    thread: [
      { from: 'customer', name: 'GoldCoast Hotels', text: 'We would like to discuss the overdue invoice INV-2026-000045. Can we set up a payment plan?', at: '2026-06-20T09:00:00' },
      { from: 'agent', name: 'Esi Tetteh', text: 'Absolutely — we have set up a 2-month installment plan. Finance team will send confirmation.', at: '2026-06-20T11:00:00' },
      { from: 'customer', name: 'GoldCoast Hotels', text: 'Received. Thank you!', at: '2026-06-22T11:00:00' },
    ],
    internalNotes: ['Set up payment plan with Finance Manager Kwame Asante.'],
  },
  {
    id: 'TKT-2026-0037',
    subject: 'Pickup not collected — driver issue',
    customerId: 'cust-004', customerName: 'Abena Sarpong',
    customerPhone: '+233 27 345 6789', customerEmail: 'abena.s@email.com',
    orderId: 'ORD-2026-06-1003', disputeId: null,
    channel: 'CALL', status: 'RESOLVED', priority: 'HIGH',
    assignee: 'Esi Tetteh', assigneeId: 'staff-cs-001',
    tags: ['delivery', 'pickup', 'driver'],
    createdAt: '2026-06-25T08:00:00', updatedAt: '2026-06-25T12:00:00',
    thread: [
      { from: 'customer', name: 'Abena Sarpong', text: 'The driver never came for my pickup even though it was scheduled for 9am.', at: '2026-06-25T08:00:00' },
      { from: 'agent', name: 'Esi Tetteh', text: 'We sincerely apologise. A driver has been dispatched and will be there within 45 minutes.', at: '2026-06-25T08:30:00' },
    ],
    internalNotes: ['Escalated to Fleet Manager Joseph Darko. Driver Kofi rerouted.'],
  },
];

export const getAllTickets   = () => [...MOCK_TICKETS];
export const getTicket       = id     => MOCK_TICKETS.find(t => t.id === id) ?? null;
export const getOpenTickets  = ()     => MOCK_TICKETS.filter(t => t.status === 'OPEN');
export const getTicketsByStatus = status => MOCK_TICKETS.filter(t => t.status === status);
