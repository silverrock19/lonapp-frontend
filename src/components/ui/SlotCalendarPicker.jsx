import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { getAvailableDates, getSlotsForDate } from '../../lib/mock/timeSlots.js';
import { cn } from '../../utils/classNames.js';

const SlotCalendarPicker = ({
  minDate,
  selectedDate,
  selectedSlot,
  onDateChange,
  onSlotChange,
  label = 'Select date & time',
}) => {
  const [startIdx, setStartIdx] = useState(0);
  const dates   = getAvailableDates(minDate);
  const visible = dates.slice(startIdx, startIdx + 7);
  const slots   = selectedDate ? getSlotsForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      <p className="text-small font-semibold text-neutral-700">{label}</p>

      {/* Date strip */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setStartIdx(Math.max(0, startIdx - 7))}
          disabled={startIdx === 0}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-400 disabled:opacity-30 hover:bg-neutral-100 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 gap-1 overflow-hidden">
          {visible.map(d => (
            <button
              key={d.dateStr}
              onClick={() => {
                if (d.available) {
                  onDateChange(d.dateStr);
                  onSlotChange(null);
                }
              }}
              disabled={!d.available}
              className={cn(
                'flex flex-1 flex-col items-center py-2.5 rounded-xl border text-center transition-all duration-150',
                !d.available && 'opacity-30 cursor-not-allowed bg-neutral-50 border-neutral-100',
                d.available && selectedDate === d.dateStr
                  ? 'bg-accent-500 border-accent-500 text-white shadow-sm'
                  : d.available
                  ? 'border-neutral-200 bg-white hover:border-accent-300 hover:bg-accent-50'
                  : '',
              )}
            >
              <span className={cn('text-[10px] font-medium', selectedDate === d.dateStr ? 'text-white/80' : 'text-neutral-400')}>
                {d.dayLabel}
              </span>
              <span className={cn('text-body font-bold mt-0.5', selectedDate === d.dateStr ? 'text-white' : 'text-neutral-800')}>
                {d.dayNum}
              </span>
              <span className={cn('text-[10px]', selectedDate === d.dateStr ? 'text-white/70' : 'text-neutral-400')}>
                {d.monthLabel}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setStartIdx(Math.min(dates.length - 7, startIdx + 7))}
          disabled={startIdx + 7 >= dates.length}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-neutral-400 disabled:opacity-30 hover:bg-neutral-100 transition-colors"
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Time slot grid */}
      {selectedDate ? (
        slots.length === 0 ? (
          <p className="text-center text-small text-neutral-400 py-4 rounded-xl bg-neutral-50 border border-neutral-100">
            No slots available on this day
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {slots.map(slot => (
              <button
                key={slot.id}
                onClick={() => onSlotChange(slot)}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-all duration-150',
                  selectedSlot?.id === slot.id
                    ? 'bg-accent-500 border-accent-500 text-white shadow-sm'
                    : 'border-neutral-200 bg-white hover:border-accent-300 hover:bg-accent-50',
                )}
              >
                <Clock className={cn('h-3.5 w-3.5 flex-shrink-0', selectedSlot?.id === slot.id ? 'text-white' : 'text-neutral-400')} />
                <span className={cn('text-small font-medium', selectedSlot?.id === slot.id ? 'text-white' : 'text-neutral-700')}>
                  {slot.label}
                </span>
              </button>
            ))}
          </div>
        )
      ) : (
        <div className="rounded-xl bg-neutral-50 border border-neutral-100 py-8 text-center">
          <p className="text-small text-neutral-400">Select a date above to see available slots</p>
        </div>
      )}
    </div>
  );
};

export default SlotCalendarPicker;
