import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../lib/mock/orderServices.js';
import { useDispatch, useSelector } from 'react-redux';
import { setItem, selectDraftItems } from '../../store/slices/orderSlice.js';
import { cn } from '../../utils/classNames.js';

const ServiceItemPicker = ({ availableServices }) => {
  const dispatch    = useDispatch();
  const draftItems  = useSelector(selectDraftItems);

  const categories = availableServices
    ? SERVICE_CATEGORIES.filter(c => availableServices.includes(c.id))
    : SERVICE_CATEGORIES;

  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? null);
  const selectedCat = categories.find(c => c.id === activeCategory) ?? categories[0];

  const getQty = (itemId) => draftItems.find(i => i.id === itemId)?.qty ?? 0;

  const changeQty = (item, delta) => {
    const current = getQty(item.id);
    dispatch(setItem({ ...item, qty: Math.max(0, current + delta) }));
  };

  if (categories.length === 0) {
    return <p className="text-small text-neutral-400 text-center py-4">No services available</p>;
  }

  return (
    <div className="space-y-3">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={cn(
              'flex-shrink-0 rounded-full px-3.5 py-1.5 text-small font-medium transition-all duration-150',
              activeCategory === c.id
                ? 'bg-accent-500 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
            )}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {selectedCat && (
        <div className="space-y-2">
          {selectedCat.items.map(item => {
            const qty = getQty(item.id);
            return (
              <div
                key={item.id}
                className={cn(
                  'flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-150',
                  qty > 0 ? 'border-accent-200 bg-accent-50' : 'border-neutral-100 bg-white',
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-small font-medium text-neutral-800">{item.name}</p>
                  <p className="text-caption text-neutral-400">GH₵ {item.unitPrice} {item.unit}</p>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 ml-3">
                  {qty > 0 && (
                    <>
                      <button
                        onClick={() => changeQty(item, -1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-neutral-200 text-neutral-600 active:scale-90 transition-transform"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center text-body font-bold text-accent-600 tabular-nums">{qty}</span>
                    </>
                  )}
                  <button
                    onClick={() => changeQty(item, 1)}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-150 active:scale-90',
                      qty > 0
                        ? 'bg-accent-500 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
                    )}
                    aria-label={`Add ${item.name}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServiceItemPicker;
