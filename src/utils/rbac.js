// Role constants
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  CUSTOMER_SERVICE: 'customer_service',
  FACTORY_PROCESSOR: 'factory_processor',
  DRIVER: 'driver',
  QUALITY_CHECKER: 'quality_checker',
};

// Permission strings (expand as epics are built)
export const PERM = {
  VIEW_DASHBOARD: 'view_dashboard',
  MANAGE_STAFF: 'manage_staff',
  MANAGE_ORDERS: 'manage_orders',
  VIEW_ORDERS: 'view_orders',
  MANAGE_CUSTOMERS: 'manage_customers',
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_PAYMENTS: 'manage_payments',
  VIEW_PAYMENTS: 'view_payments',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_AUDIT_LOG: 'view_audit_log',
  PROCESS_ORDERS: 'process_orders',
  MANAGE_DELIVERIES: 'manage_deliveries',
  QUALITY_CHECK: 'quality_check',
};

export const PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: ['*'],
  [ROLES.MANAGER]: [
    PERM.VIEW_DASHBOARD, PERM.MANAGE_STAFF, PERM.MANAGE_ORDERS, PERM.VIEW_ORDERS,
    PERM.MANAGE_CUSTOMERS, PERM.VIEW_CUSTOMERS, PERM.VIEW_PAYMENTS, PERM.VIEW_AUDIT_LOG,
  ],
  [ROLES.CUSTOMER_SERVICE]: [
    PERM.VIEW_CUSTOMERS, PERM.VIEW_ORDERS,
  ],
  [ROLES.FACTORY_PROCESSOR]: [
    PERM.PROCESS_ORDERS, PERM.VIEW_ORDERS,
  ],
  [ROLES.DRIVER]: [
    PERM.MANAGE_DELIVERIES, PERM.VIEW_ORDERS,
  ],
  [ROLES.QUALITY_CHECKER]: [
    PERM.QUALITY_CHECK, PERM.VIEW_ORDERS,
  ],
};
