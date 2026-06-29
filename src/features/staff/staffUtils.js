import { ROLES } from '../../data/mockStaff.js';

const AVATAR_PALETTE = [
  { background: '#EBF2FD', color: '#0C5FC5' },
  { background: '#F3F0FF', color: '#7C3AED' },
  { background: '#E6F6EE', color: '#13753F' },
  { background: '#FFF4E0', color: '#945800' },
  { background: '#E6FAFB', color: '#0B7C87' },
  { background: '#FDECEA', color: '#A31C12' },
];

export const avatarColor = name =>
  AVATAR_PALETTE[(name?.charCodeAt(0) || 0) % AVATAR_PALETTE.length];

export const initials = name => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
};

export const roleFor = code =>
  ROLES.find(r => r.code === code) || { name: code, color: '#6B7280', bg: '#F3F4F6' };

export const OUTLETS          = ['HQ — Osu', 'Spintex Outlet', 'Tema Factory'];
export const DEPARTMENTS      = ['Management', 'Operations', 'Customer Success', 'Quality Assurance', 'Logistics', 'Finance'];
export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract'];

export const CODE_META = {
  F:    { color: '#1F9D57', bg: '#E6F6EE' },
  'F*': { color: '#0E9AA7', bg: '#E6FAFB' },
  E:    { color: '#0C5FC5', bg: '#EAF2FC' },
  R:    { color: '#C77700', bg: '#FFF4E0' },
  C:    { color: '#7C3AED', bg: '#F3F0FF' },
  A:    { color: '#0C5FC5', bg: '#EAF2FC' },
  O:    { color: '#6B7280', bg: '#F3F4F6' },
  T:    { color: '#6B7280', bg: '#F3F4F6' },
  M:    { color: '#6B7280', bg: '#F3F4F6' },
  N:    { color: '#9CA3AF', bg: '#F9FAFB' },
};
