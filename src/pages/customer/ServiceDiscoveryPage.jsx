import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Search, MapPin, X } from 'lucide-react';
import OUTLETS from '../../lib/mock/outlets.js';
import OutletCard from '../../components/ui/OutletCard.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { startDraft } from '../../store/slices/orderSlice.js';

const SERVICE_FILTERS = [
  { id: 'all',          label: 'All'          },
  { id: 'washing',      label: 'Washing'      },
  { id: 'ironing',      label: 'Ironing'      },
  { id: 'dry-cleaning', label: 'Dry Cleaning' },
  { id: 'specialist',   label: 'Specialist'   },
];

const SORT_OPTIONS = [
  { id: 'distance', label: 'Nearest'    },
  { id: 'rating',   label: 'Top Rated'  },
  { id: 'price',    label: 'Lowest Fee' },
];

export default function ServiceDiscoveryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState('all');
  const [sort,    setSort]    = useState('distance');
  const [openNow, setOpenNow] = useState(false);

  const results = useMemo(() => {
    let list = [...OUTLETS];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(o =>
        o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q)
      );
    }
    if (filter !== 'all') list = list.filter(o => o.services.includes(filter));
    if (openNow)          list = list.filter(o => o.openNow);
    if (sort === 'distance') list.sort((a, b) => a.distance - b.distance);
    if (sort === 'rating')   list.sort((a, b) => b.rating - a.rating);
    if (sort === 'price')    list.sort((a, b) => a.pickupFee - b.pickupFee);
    return list;
  }, [query, filter, sort, openNow]);

  function handleSelect(outlet) {
    dispatch(startDraft(outlet));
    navigate('/app/outlet/' + outlet.id);
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: '#FAFAF8' }}>

      {/* Sticky header */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 shadow-sm">
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-h3 font-bold text-neutral-900">Find a Laundry</h1>
          <p className="text-caption text-neutral-400 mt-0.5">Showing results near Osu, Accra</p>

          {/* Search */}
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 focus-within:border-accent-400 focus-within:ring-2 focus-within:ring-accent-100 transition-all">
            <Search className="h-4 w-4 flex-shrink-0 text-neutral-400" />
            <input
              type="search"
              placeholder="Search outlet or area…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-small text-neutral-700 outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Location + open now */}
          <div className="flex items-center gap-2 mt-2.5">
            <button className="flex items-center gap-1.5 rounded-full bg-accent-50 px-3 py-1 text-caption font-medium text-accent-600">
              <MapPin className="h-3 w-3" />
              Osu · within 10 km
            </button>
            <button
              onClick={() => setOpenNow(v => !v)}
              className={`rounded-full px-3 py-1 text-caption font-medium transition-colors ${
                openNow ? 'bg-success-bg text-success-text' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              Open now
            </button>
          </div>
        </div>

        {/* Service filter chips */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          {SERVICE_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-small font-medium transition-all duration-150 ${
                filter === f.id
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-caption text-neutral-500">
          {results.length} outlet{results.length !== 1 ? 's' : ''} found
        </p>
        <div className="flex gap-1">
          {SORT_OPTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`rounded-full px-2.5 py-1 text-caption font-medium transition-all ${
                sort === s.id ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Outlet list */}
      <div className="px-4 space-y-3">
        {results.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No outlets found"
            description="Try adjusting your search or removing filters."
          />
        ) : (
          results.map(outlet => (
            <OutletCard key={outlet.id} outlet={outlet} onSelect={handleSelect} />
          ))
        )}
      </div>
    </div>
  );
}
