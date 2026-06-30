const SLOT_WINDOWS = [
  { id: 'morning',   label: '8 AM – 10 AM',  time: '08:00' },
  { id: 'midmorn',   label: '10 AM – 12 PM', time: '10:00' },
  { id: 'afternoon', label: '12 PM – 2 PM',  time: '12:00' },
  { id: 'midaft',    label: '2 PM – 4 PM',   time: '14:00' },
  { id: 'evening',   label: '4 PM – 6 PM',   time: '16:00' },
];

export function getSlotsForDate(dateStr) {
  const d = new Date(dateStr);
  const dow = d.getDay(); // 0=Sun, 6=Sat
  if (dow === 0) return [];
  if (dow === 6) return SLOT_WINDOWS.slice(0, 3);
  return SLOT_WINDOWS;
}

export function getAvailableDates(minDateStr) {
  const base = minDateStr ? new Date(minDateStr) : new Date();
  const start = new Date(base);
  start.setDate(start.getDate() + 1);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const results = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay();
    results.push({
      dateStr:    d.toISOString().split('T')[0],
      dayLabel:   days[dow],
      dayNum:     d.getDate(),
      monthLabel: months[d.getMonth()],
      available:  dow !== 0,
    });
  }
  return results;
}
