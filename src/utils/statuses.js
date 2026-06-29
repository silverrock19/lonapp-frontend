export const ORDER_STATUS = {
  Processing: { dot: '#C77700', bg: '#FFF4E0', text: '#945800' },
  Pickup:     { dot: '#0C5FC5', bg: '#EAF2FC', text: '#093F84' },
  Delivered:  { dot: '#1F9D57', bg: '#E6F6EE', text: '#13753F' },
  Pending:    { dot: '#6B7280', bg: '#F3F4F6', text: '#374151' },
  Cancelled:  { dot: '#D92D20', bg: '#FDECEA', text: '#A31C12' },
};

export const DOC_STATUS = {
  active:   { label: 'Active',        bg: '#E6F6EE', color: '#13753F' },
  expiring: { label: 'Expiring soon', bg: '#FFF4E0', color: '#945800' },
  expired:  { label: 'Expired',       bg: '#FDECEA', color: '#A31C12' },
};
