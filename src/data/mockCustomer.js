export const MOCK_CUSTOMER = {
  id: 'CUST-20241203-001',
  firstName: 'Adwoa', lastName: 'Mensah',
  email: 'adwoa.mensah@gmail.com', emailVerified: true,
  phone: '+233 24 456 7890', phoneVerified: true,
  photo: null, tier: 'Silver', tierColor: '#6B7280',
  since: '2024-06-15',
  language: 'en',
  preferredOutlet: 'CleanPro Osu',
};
export const MOCK_PREFERENCES = {
  fabricCare: ['Cotton', 'Denim'],
  waterTemperature: 'Cold',
  detergent: 'Unscented / Hypoallergenic',
  dryingMethod: 'Air dry preferred',
  instructions: 'Please handle silk items with extra care. No bleach on dark clothes.',
  separateColors: true,
  starching: false,
  ironingLevel: 'Light',
};
export const MOCK_PAYMENT_METHODS = [
  { id: 1, type: 'momo', provider: 'MTN Mobile Money', phone: '+233 24 456 7890', isDefault: true },
  { id: 2, type: 'momo', provider: 'Vodafone Cash', phone: '+233 20 111 2233', isDefault: false },
  { id: 3, type: 'card', last4: '4567', brand: 'Visa', expiry: '09/27', isDefault: false },
];
export const MOCK_FAVORITE_LAUNDRIES = [
  { id: 1, name: 'CleanPro Osu', address: 'Osu, Accra', rating: 4.8, orders: 23, open: true },
  { id: 2, name: 'FreshPress Cantonments', address: 'Cantonments, Accra', rating: 4.6, orders: 11, open: true },
  { id: 3, name: 'SpinCycle Airport City', address: 'Airport City, Accra', rating: 4.3, orders: 5, open: false },
];
export const MOCK_ADDRESSES = [
  {
    id: 1, label: 'Home', type: 'home',
    street: '14 Cantonments Road', suburb: 'Cantonments', city: 'Accra',
    gps: 'GA-045-3721', isDefault: true,
  },
  {
    id: 2, label: 'Office', type: 'office',
    street: 'Airport City Mall, 2nd Floor', suburb: 'Airport Residential', city: 'Accra',
    gps: 'GA-184-7623', isDefault: false,
  },
  {
    id: 3, label: "Mum's place", type: 'other',
    street: '5 Adenta Highway', suburb: 'Adenta', city: 'Accra',
    gps: '', isDefault: false,
  },
];
export const MOCK_SOCIAL = {
  google:   { firstName: 'Adwoa',  lastName: 'Mensah',  email: 'adwoa.mensah@gmail.com',   provider: 'Google',   color: '#4285F4' },
  facebook: { firstName: 'Kofi',   lastName: 'Asante',  email: 'kofi.asante@outlook.com',  provider: 'Facebook', color: '#1877F2' },
  apple:    { firstName: 'Ama',    lastName: 'Boateng', email: 'ama.boateng@icloud.com',   provider: 'Apple',    color: '#1D1D1F' },
  whatsapp: { firstName: '',       lastName: '',          email: '',                          provider: 'WhatsApp', color: '#25D366' },
};
export const MOCK_PHONE_HINT = '+233 24 *** 7890';
export const MOCK_ACTIVITIES = [
  { id: 1, type: 'LOGIN_SUCCESS', label: 'Signed in', desc: 'Signed in from Chrome on iPhone', time: '2 hours ago', device: 'iPhone · Chrome', location: 'Accra, Ghana', status: 'success', icon: 'LogIn' },
  { id: 2, type: 'ORDER_CREATED', label: 'Order placed', desc: 'Order #ORD-2024-1247 placed at CleanPro Osu', time: 'Yesterday 2:34 PM', device: 'iPhone · LonApp', location: 'Accra, Ghana', status: 'success', icon: 'ShoppingBag' },
  { id: 3, type: 'PROFILE_UPDATED', label: 'Profile updated', desc: 'Phone number updated', time: '3 days ago', device: 'iPhone · Chrome', location: 'Accra, Ghana', status: 'success', icon: 'UserCheck' },
  { id: 4, type: 'LOGIN_FAILED', label: 'Failed login attempt', desc: 'Incorrect password entered', time: '5 days ago', device: 'Android · Chrome', location: 'Kumasi, Ghana', status: 'failed', icon: 'ShieldAlert' },
  { id: 5, type: 'PAYMENT_COMPLETED', label: 'Payment made', desc: 'GH₵ 85.00 paid via MTN MoMo for order #ORD-2024-1198', time: '1 week ago', device: 'iPhone · LonApp', location: 'Accra, Ghana', status: 'success', icon: 'CreditCard' },
];
