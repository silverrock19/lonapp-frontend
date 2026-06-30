import { Factory, GitBranch, Store, Building2 } from 'lucide-react';

export const REG_TYPES = ['Sole Proprietor', 'Partnership', 'Limited Liability', 'Unregistered'];

export const RETAIL_SERVICES     = ['Washing', 'Ironing', 'Dry Cleaning', 'Wash & Iron', 'Wash & Fold'];
export const COMMERCIAL_SERVICES = ['Bulk Washing', 'Linen Service', 'Uniform Cleaning', 'Industrial Laundry'];
export const DURATION_DAYS       = ['1', '2', '3', '4', '5', '6', '7'];
export const DURATION_HOURS      = ['6', '8', '12', '18', '24', '36', '48'];

export const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
export const ADMIN_ROLES = ['Owner', 'Manager', 'Operations Head'];

export const NETWORK_MODELS = [
  {
    tag: 'CENTRALIZED_NETWORK',
    name: 'Centralized (Hub-and-Spoke)',
    desc: 'One processing factory serves multiple customer drop-off outlets.',
    icon: Factory,
    color: '#C77700', bg: '#FFF4E0',
    rules: ['1 processing factory', 'One or more outlets', 'Outlets route to the single factory'],
  },
  {
    tag: 'HYBRID_NETWORK',
    name: 'Hybrid Network',
    desc: 'Two or more factories, each serving their own group of outlets.',
    icon: GitBranch,
    color: '#7C3AED', bg: '#F3F0FF',
    rules: ['2+ processing factories', 'Each outlet linked to one factory', 'Multiple hub-and-spoke clusters'],
  },
  {
    tag: 'ASSET_LIGHT_NETWORK',
    name: 'Asset-Light Network',
    desc: 'Outlets only — processing outsourced to third-party partner factories.',
    icon: Store,
    color: '#1F9D57', bg: '#E6F6EE',
    rules: ['No owned factory', 'One or more outlets', 'Partner factories handle processing'],
  },
  {
    tag: 'STANDALONE_UNIT',
    name: 'Standalone Unit',
    desc: 'A single location that handles customer intake and processing in-house.',
    icon: Building2,
    color: '#0C5FC5', bg: '#EAF2FC',
    rules: ['Single combined location', 'No outlet / factory separation', 'Minimal logistics overhead'],
  },
];
