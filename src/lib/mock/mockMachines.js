// Mock machine data for EP-07 US-0167, US-0178, US-0186

export const MACHINE_TYPES = {
  WASHER:     { label: 'Washing Machine', icon: 'wind',      unit: 'kg',   color: 'text-primary-600' },
  DRYER:      { label: 'Dryer',           icon: 'thermometer', unit: 'kg',  color: 'text-warning-text' },
  DC:         { label: 'Dry Cleaning',    icon: 'droplets',  unit: 'items', color: 'text-accent-600' },
  IRON:       { label: 'Iron Press',      icon: 'zap',       unit: 'items', color: 'text-neutral-600' },
};

export const MACHINE_STATUSES = {
  RUNNING:     { label: 'Running',     color: 'text-success-text', bg: 'bg-success-bg',  dot: 'bg-success'   },
  IDLE:        { label: 'Idle',        color: 'text-neutral-500',  bg: 'bg-neutral-100', dot: 'bg-neutral-400'},
  FAULT:       { label: 'Fault',       color: 'text-error',        bg: 'bg-error-bg',    dot: 'bg-error'     },
  MAINTENANCE: { label: 'Maintenance', color: 'text-warning-text', bg: 'bg-warning-bg',  dot: 'bg-warning'   },
  LOADING:     { label: 'Loading',     color: 'text-accent-600',   bg: 'bg-accent-50',   dot: 'bg-accent-500'},
};

export const MOCK_MACHINES = [
  { id: 'WM-01', name: 'Washer A', type: 'WASHER', location: 'Osu Branch', capacityKg: 15, status: 'RUNNING', currentLoadKg: 12, cycleMinutesRemaining: 23, utilizationRate: 80, lastService: '2026-05-15', nextService: '2026-08-15', totalCycles: 1842, faultLog: [] },
  { id: 'WM-02', name: 'Washer B', type: 'WASHER', location: 'Osu Branch', capacityKg: 20, status: 'IDLE', currentLoadKg: 0, cycleMinutesRemaining: 0, utilizationRate: 55, lastService: '2026-04-01', nextService: '2026-07-01', totalCycles: 2110, faultLog: [] },
  { id: 'WM-03', name: 'Washer C', type: 'WASHER', location: 'Spintex Branch', capacityKg: 15, status: 'FAULT', currentLoadKg: 0, cycleMinutesRemaining: 0, utilizationRate: 0, lastService: '2026-03-01', nextService: '2026-06-01', totalCycles: 3250, faultLog: ['2026-06-28: Belt snapped — awaiting part'] },
  { id: 'DR-01', name: 'Dryer A', type: 'DRYER', location: 'Osu Branch', capacityKg: 20, status: 'RUNNING', currentLoadKg: 15, cycleMinutesRemaining: 35, utilizationRate: 75, lastService: '2026-05-20', nextService: '2026-08-20', totalCycles: 1422, faultLog: [] },
  { id: 'DR-02', name: 'Dryer B', type: 'DRYER', location: 'Spintex Branch', capacityKg: 15, status: 'IDLE', currentLoadKg: 0, cycleMinutesRemaining: 0, utilizationRate: 45, lastService: '2026-04-10', nextService: '2026-07-10', totalCycles: 980, faultLog: [] },
  { id: 'DC-01', name: 'DC Unit 1', type: 'DC', location: 'Osu Branch', capacityKg: 10, status: 'MAINTENANCE', currentLoadKg: 0, cycleMinutesRemaining: 0, utilizationRate: 0, lastService: '2026-06-28', nextService: '2026-09-28', totalCycles: 540, faultLog: [] },
  { id: 'IP-01', name: 'Iron Press 1', type: 'IRON', location: 'Osu Branch', capacityKg: null, status: 'RUNNING', currentLoadKg: null, cycleMinutesRemaining: null, utilizationRate: 88, lastService: '2026-06-01', nextService: '2026-09-01', totalCycles: 5200, faultLog: [] },
  { id: 'IP-02', name: 'Iron Press 2', type: 'IRON', location: 'Spintex Branch', capacityKg: null, status: 'IDLE', currentLoadKg: null, cycleMinutesRemaining: null, utilizationRate: 60, lastService: '2026-05-01', nextService: '2026-08-01', totalCycles: 3900, faultLog: [] },
];

export const MOCK_MAINTENANCE_SCHEDULE = [
  { id: 'MS-001', machineId: 'WM-03', machineName: 'Washer C', type: 'CORRECTIVE', description: 'Belt replacement — snapped on shift 2026-06-28', scheduledDate: '2026-06-29', status: 'PENDING', technicianName: 'Kwame Mensah', estimatedHours: 3 },
  { id: 'MS-002', machineId: 'WM-02', machineName: 'Washer B', type: 'PREVENTIVE', description: 'Quarterly service — bearings, filters, drum clean', scheduledDate: '2026-07-01', status: 'SCHEDULED', technicianName: 'Kwame Mensah', estimatedHours: 2 },
  { id: 'MS-003', machineId: 'DR-02', machineName: 'Dryer B', type: 'PREVENTIVE', description: 'Quarterly service — lint filter deep clean, belt check', scheduledDate: '2026-07-10', status: 'SCHEDULED', technicianName: 'External — TechCool Ltd', estimatedHours: 2 },
  { id: 'MS-004', machineId: 'DC-01', machineName: 'DC Unit 1', type: 'PREVENTIVE', description: 'Solvent recovery system inspection + seal replacement', scheduledDate: '2026-06-28', status: 'IN_PROGRESS', technicianName: 'External — DC Specialist', estimatedHours: 4 },
  { id: 'MS-005', machineId: 'WM-01', machineName: 'Washer A', type: 'PREVENTIVE', description: 'Full service — seals, pump, control board check', scheduledDate: '2026-08-15', status: 'SCHEDULED', technicianName: 'Kwame Mensah', estimatedHours: 3 },
];

export const getMachine = id => MOCK_MACHINES.find(m => m.id === id) ?? null;
export const getAllMachines = () => [...MOCK_MACHINES];
export const getMachinesByLocation = loc => MOCK_MACHINES.filter(m => m.location === loc);
export const getMaintenanceSchedule = () => [...MOCK_MAINTENANCE_SCHEDULE];
export const getMachineDowntime = () => MOCK_MACHINES.filter(m => m.status === 'FAULT' || m.status === 'MAINTENANCE');
