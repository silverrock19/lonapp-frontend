import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronDown, ChevronUp, UserPlus, LayoutGrid, List } from 'lucide-react';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import PillSelect from '../../components/ui/PillSelect.jsx';
import { MOCK_CUSTOMERS } from '../../data/mockStaff.js';
import { detectSearchType, searchTypeLabel, filterCustomers } from '../../features/staff/customerUtils.js';
import CustomerCard, { SkeletonCard } from '../../features/staff/CustomerCard.jsx';
import CustomerRow, { SkeletonRow } from '../../features/staff/CustomerRow.jsx';
import CustomerDetailPanel from '../../features/staff/CustomerDetailPanel.jsx';

const INIT_FILTERS = { tier: 'All', status: 'All', hasPendingOrders: false, dateFrom: '', dateTo: '' };

const CustomerSearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery]                   = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters]       = useState(false);
  const [isLoading, setIsLoading]           = useState(false);
  const [results, setResults]               = useState(MOCK_CUSTOMERS);
  const [hasSearched, setHasSearched]       = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode]             = useState('list');
  const [filters, setFilters]               = useState(INIT_FILTERS);

  const debounceRef = useRef(null);
  const inputRef    = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setResults(filterCustomers(MOCK_CUSTOMERS, debouncedQuery, filters));
      setIsLoading(false);
      if (debouncedQuery.trim() || Object.values(filters).some(v => v && v !== 'All')) {
        setHasSearched(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [debouncedQuery, filters]);

  const clearSearch  = () => { setQuery(''); setDebouncedQuery(''); setHasSearched(false); inputRef.current?.focus(); };
  const resetFilters = () => setFilters(INIT_FILTERS);

  const searchType     = detectSearchType(query);
  const hasActiveFilters =
    filters.tier !== 'All' || filters.status !== 'All' ||
    filters.hasPendingOrders || filters.dateFrom || filters.dateTo;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <Breadcrumbs items={[{ label: 'Management', to: '/' }, { label: 'Customers' }]} />
          <h1 className="text-[22px] font-bold tracking-tight text-neutral-900">Customers</h1>
          <p className="mt-0.5 text-sm text-neutral-400">Search and manage your customer accounts</p>
        </div>
        <button
          onClick={() => navigate('/customers/walkin')}
          className="flex items-center gap-2 rounded-lg bg-[#0C5FC5] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0A4EA0]"
        >
          <UserPlus className="h-4 w-4" /> Register walk-in
        </button>
      </div>

      {/* Search bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, phone, email, or CUST-XXXXX…"
            className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0C5FC5] focus:ring-2 focus:ring-[#0C5FC5]/20"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 transition-colors hover:bg-neutral-300"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {searchType && (
          <p className="pl-1 text-xs font-medium text-[#0C5FC5]">{searchTypeLabel(searchType)}</p>
        )}

        <button
          onClick={() => setShowFilters(v => !v)}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition-colors hover:text-[#0C5FC5]"
        >
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Advanced filters
          {hasActiveFilters && (
            <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0C5FC5] text-[10px] font-bold text-white">!</span>
          )}
        </button>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="space-y-4 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Customer Tier</p>
            <PillSelect options={['All', 'Bronze', 'Silver', 'Gold', 'VIP']} value={filters.tier} onChange={v => setFilters(f => ({ ...f, tier: v }))} />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Status</p>
            <PillSelect options={['All', 'Active', 'Inactive', 'Suspended']} value={filters.status} onChange={v => setFilters(f => ({ ...f, status: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-neutral-700">Has pending orders</p>
            <button
              onClick={() => setFilters(f => ({ ...f, hasPendingOrders: !f.hasPendingOrders }))}
              className={`relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors ${filters.hasPendingOrders ? 'bg-[#0C5FC5]' : 'bg-neutral-300'}`}
            >
              <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${filters.hasPendingOrders ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Registration Date</p>
            <div className="flex items-center gap-3">
              <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 outline-none transition-all focus:border-[#0C5FC5] focus:ring-2 focus:ring-[#0C5FC5]/20" />
              <span className="flex-shrink-0 text-sm text-neutral-400">to</span>
              <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 outline-none transition-all focus:border-[#0C5FC5] focus:ring-2 focus:ring-[#0C5FC5]/20" />
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={resetFilters} className="text-sm font-medium text-red-600 transition-colors hover:text-red-700">Clear all filters</button>
          )}
        </div>
      )}

      {/* Results toolbar */}
      <div className="flex items-center justify-between">
        {!isLoading ? (
          <p className="text-sm text-neutral-500">
            {hasSearched
              ? <><span className="font-semibold text-neutral-800">{results.length}</span> of <span className="font-semibold text-neutral-800">{MOCK_CUSTOMERS.length}</span> customers</>
              : <>All <span className="font-semibold text-neutral-800">{results.length}</span> customers</>
            }
          </p>
        ) : <span />}

        <div className="flex items-center rounded-lg border border-neutral-200 bg-white p-0.5">
          <button onClick={() => setViewMode('grid')} title="Grid view"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === 'grid' ? 'bg-[#0C5FC5] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-700'}`}>
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setViewMode('list')} title="List view"
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${viewMode === 'list' ? 'bg-[#0C5FC5] text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-700'}`}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {isLoading
              ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
              : results.map(c => <CustomerCard key={c.id} customer={c} onViewProfile={setSelectedCustomer} />)
            }
          </div>
        )}

        {viewMode === 'list' && (
          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b-2 border-neutral-100 bg-neutral-50/80">
                    {['Customer', 'Phone', 'Email', 'Status', 'Tier', 'Last Order', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? [1, 2, 3].map(i => <SkeletonRow key={i} />)
                    : results.map(c => <CustomerRow key={c.id} customer={c} onViewProfile={setSelectedCustomer} />)
                  }
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && results.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-neutral-200 bg-white py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
              <Search className="h-7 w-7 text-neutral-400" />
            </div>
            <h3 className="mb-1 text-base font-semibold text-neutral-800">No customers found</h3>
            <p className="max-w-xs text-sm text-neutral-400">Try a different search term or clear filters</p>
            <div className="mt-4 flex items-center gap-2">
              {query && <button onClick={clearSearch} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">Clear search</button>}
              {hasActiveFilters && <button onClick={resetFilters} className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-[#0C5FC5] hover:text-[#0C5FC5]">Clear filters</button>}
              <button onClick={() => navigate('/customers/walkin')} className="rounded-md bg-[#0C5FC5] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0A4EA0]">
                Register new customer
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCustomer && (
        <CustomerDetailPanel customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
      )}
    </div>
  );
};

export default CustomerSearchPage;
