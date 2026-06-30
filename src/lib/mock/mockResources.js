// Mock resource usage data for EP-07 US-0179 (chemicals), US-0180 (energy), US-0185 (cost)

export const MOCK_CHEMICAL_USAGE = [
  { id: 'CU-001', shiftDate: '2026-06-28', shift: 'Morning', chemical: 'Persil Detergent', machineId: 'WM-01', qtyKg: 2.1, unitCostGhs: 17.00, totalCostGhs: 35.70 },
  { id: 'CU-002', shiftDate: '2026-06-28', shift: 'Morning', chemical: 'Fabric Softener', machineId: 'WM-01', qtyKg: 0.8, unitCostGhs: 9.00, totalCostGhs: 7.20 },
  { id: 'CU-003', shiftDate: '2026-06-28', shift: 'Morning', chemical: 'Stain Remover', machineId: null, qtyKg: 0.3, unitCostGhs: 44.00, totalCostGhs: 13.20 },
  { id: 'CU-004', shiftDate: '2026-06-28', shift: 'Morning', chemical: 'DC Solvent', machineId: 'DC-01', qtyKg: 0.5, unitCostGhs: 21.00, totalCostGhs: 10.50 },
  { id: 'CU-005', shiftDate: '2026-06-27', shift: 'Morning', chemical: 'Persil Detergent', machineId: 'WM-01', qtyKg: 1.8, unitCostGhs: 17.00, totalCostGhs: 30.60 },
  { id: 'CU-006', shiftDate: '2026-06-27', shift: 'Afternoon', chemical: 'Persil Detergent', machineId: 'WM-02', qtyKg: 2.4, unitCostGhs: 17.00, totalCostGhs: 40.80 },
  { id: 'CU-007', shiftDate: '2026-06-27', shift: 'Afternoon', chemical: 'Fabric Softener', machineId: 'WM-02', qtyKg: 0.6, unitCostGhs: 9.00, totalCostGhs: 5.40 },
  { id: 'CU-008', shiftDate: '2026-06-26', shift: 'Morning', chemical: 'Bleach — Jik', machineId: 'WM-03', qtyKg: 0.4, unitCostGhs: 4.50, totalCostGhs: 1.80 },
];

export const MOCK_ENERGY_LOG = [
  { id: 'EN-001', shiftDate: '2026-06-28', shift: 'Morning', machineId: 'WM-01', machineName: 'Washer A', kWh: 4.2, powerSource: 'ECG', dieselLitres: 0, costGhs: 7.56 },
  { id: 'EN-002', shiftDate: '2026-06-28', shift: 'Morning', machineId: 'DR-01', machineName: 'Dryer A', kWh: 6.8, powerSource: 'ECG', dieselLitres: 0, costGhs: 12.24 },
  { id: 'EN-003', shiftDate: '2026-06-28', shift: 'Morning', machineId: 'IP-01', machineName: 'Iron Press 1', kWh: 2.1, powerSource: 'ECG', dieselLitres: 0, costGhs: 3.78 },
  { id: 'EN-004', shiftDate: '2026-06-27', shift: 'Morning', machineId: 'WM-01', machineName: 'Washer A', kWh: 4.5, powerSource: 'GENERATOR', dieselLitres: 1.2, costGhs: 16.20 },
  { id: 'EN-005', shiftDate: '2026-06-27', shift: 'Morning', machineId: 'WM-02', machineName: 'Washer B', kWh: 5.1, powerSource: 'GENERATOR', dieselLitres: 1.4, costGhs: 18.36 },
  { id: 'EN-006', shiftDate: '2026-06-27', shift: 'Afternoon', machineId: 'DR-01', machineName: 'Dryer A', kWh: 7.2, powerSource: 'ECG', dieselLitres: 0, costGhs: 12.96 },
];

export const MOCK_DUMSOR_EVENTS = [
  { id: 'DS-001', date: '2026-06-27', outageStart: '09:00', outageEnd: '12:30', durationHours: 3.5, machinesAffected: ['WM-01','WM-02','DR-01'], switchedToGenerator: true, dieselUsedLitres: 8.4, dieselCostGhs: 168.00 },
  { id: 'DS-002', date: '2026-06-25', outageStart: '14:00', outageEnd: '16:00', durationHours: 2.0, machinesAffected: ['WM-01','DR-01','IP-01'], switchedToGenerator: true, dieselUsedLitres: 5.0, dieselCostGhs: 100.00 },
];

// Processing cost per order/batch (US-0185)
export const MOCK_PROCESSING_COSTS = [
  { id: 'PC-001', orderId: 'ORD-2026-06-1001', batchId: 'BATCH-2026-06-001', chemicals: 28.40, energy: 18.20, labour: 35.00, packaging: 5.50, totalCost: 87.10, revenue: 110.45, margin: 23.35 },
  { id: 'PC-002', orderId: 'ORD-2026-06-1002', batchId: 'BATCH-2026-06-001', chemicals: 180.00, energy: 95.50, labour: 250.00, packaging: 42.00, totalCost: 567.50, revenue: 1332.45, margin: 764.95 },
  { id: 'PC-003', orderId: 'ORD-2026-06-1003', batchId: 'BATCH-2026-06-002', chemicals: 15.20, energy: 12.80, labour: 20.00, packaging: 3.00, totalCost: 51.00, revenue: 45.00, margin: -6.00 },
  { id: 'PC-004', orderId: 'ORD-2026-06-1004', batchId: 'BATCH-2026-06-002', chemicals: 62.00, energy: 45.00, labour: 80.00, packaging: 12.00, totalCost: 199.00, revenue: 320.50, margin: 121.50 },
];

export const SHIFT_BUDGET = { chemicals: 250, energy: 200, labour: 500, packaging: 80, total: 1030 };

export const getAllChemicalUsage = () => [...MOCK_CHEMICAL_USAGE];
export const getAllEnergyLog = () => [...MOCK_ENERGY_LOG];
export const getAllDumsorEvents = () => [...MOCK_DUMSOR_EVENTS];
export const getAllProcessingCosts = () => [...MOCK_PROCESSING_COSTS];
