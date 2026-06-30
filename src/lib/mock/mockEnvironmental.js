// Mock environmental and compliance data for EP-07 US-0188, US-0191

export const ZONE_NAMES = ['Washing Floor', 'Drying Area', 'Ironing Station', 'Chemical Storage'];

export const MOCK_SENSOR_READINGS = [
  { zone: 'Washing Floor',    tempC: 32,  humidityPct: 78, airQualityPpm: 12, status: 'WARN', readAt: '2026-06-28T10:30:00' },
  { zone: 'Drying Area',      tempC: 45,  humidityPct: 35, airQualityPpm: 8,  status: 'OK',   readAt: '2026-06-28T10:30:00' },
  { zone: 'Ironing Station',  tempC: 38,  humidityPct: 55, airQualityPpm: 6,  status: 'OK',   readAt: '2026-06-28T10:30:00' },
  { zone: 'Chemical Storage', tempC: 27,  humidityPct: 60, airQualityPpm: 85, status: 'ALERT', readAt: '2026-06-28T10:30:00' },
];

export const SENSOR_THRESHOLDS = {
  tempC:          { warn: 40, alert: 50 },
  humidityPct:    { warn: 75, alert: 90 },
  airQualityPpm:  { warn: 20, alert: 50 },
};

export const MOCK_EPA_PERMIT = {
  permitNumber: 'EPA-GH-2024-WS-00451',
  issuedDate: '2024-03-01',
  expiryDate: '2027-03-01',
  category: 'Wastewater Discharge — Category B',
  status: 'VALID',
  lastInspection: '2025-11-15',
  nextInspection: '2026-11-15',
  inspector: 'Ghana EPA, Greater Accra Region',
};

export const MOCK_WASTEWATER_LOG = [
  { id: 'WW-001', date: '2026-06-28', volumeLitres: 520, phLevel: 7.2, tempC: 28, disposalMethod: 'Treatment Plant', compliant: true },
  { id: 'WW-002', date: '2026-06-27', volumeLitres: 680, phLevel: 7.5, tempC: 29, disposalMethod: 'Treatment Plant', compliant: true },
  { id: 'WW-003', date: '2026-06-26', volumeLitres: 610, phLevel: 8.8, tempC: 32, disposalMethod: 'Treatment Plant', compliant: false, nonCompliantReason: 'pH above 8.5 — batch of bleach-heavy items' },
  { id: 'WW-004', date: '2026-06-25', volumeLitres: 490, phLevel: 7.1, tempC: 27, disposalMethod: 'Treatment Plant', compliant: true },
];

export const MOCK_COMPLIANCE_ALERTS = [
  { id: 'CA-001', type: 'SENSOR', zone: 'Chemical Storage', message: 'Air quality 85 ppm — above 50 ppm alert threshold', severity: 'HIGH',  raisedAt: '2026-06-28T10:30:00', resolved: false },
  { id: 'CA-002', type: 'WASTEWATER', zone: 'Treatment', message: 'pH 8.8 on 2026-06-26 — above 8.5 limit', severity: 'MEDIUM', raisedAt: '2026-06-26T18:00:00', resolved: false },
  { id: 'CA-003', type: 'SENSOR', zone: 'Washing Floor', message: 'Humidity 78% — above 75% warn threshold', severity: 'LOW', raisedAt: '2026-06-28T10:30:00', resolved: false },
];

export const getAllSensorReadings = () => [...MOCK_SENSOR_READINGS];
export const getAllWastewaterLog = () => [...MOCK_WASTEWATER_LOG];
export const getComplianceAlerts = () => [...MOCK_COMPLIANCE_ALERTS];
export const getEPAPermit = () => ({ ...MOCK_EPA_PERMIT });
