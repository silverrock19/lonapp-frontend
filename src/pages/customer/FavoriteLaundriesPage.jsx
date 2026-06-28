import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Star, WashingMachine, X } from 'lucide-react';
import { MOCK_FAVORITE_LAUNDRIES } from '../../data/mockCustomer.js';

const FavoriteLaundriesPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(MOCK_FAVORITE_LAUNDRIES);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUnfavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    setConfirmId(null);
    showToast('Removed from favourites');
  };

  const filtered = favorites.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-neutral-100 bg-white px-4">
        <button onClick={() => navigate(-1)} className="flex items-center justify-center h-10 w-10 -ml-2">
          <ChevronLeft className="h-5 w-5 text-neutral-600" />
        </button>
        <h1 className="flex-1 text-[17px] font-semibold text-neutral-900">My Favourite Laundries</h1>
        <button
          onClick={() => {
            setSearchOpen((prev) => !prev);
            setSearchQuery('');
          }}
          className="flex items-center justify-center h-10 w-10 -mr-2"
        >
          <Search className="h-5 w-5 text-neutral-600" />
        </button>
      </header>

      {/* Collapsible Search Bar */}
      {searchOpen && (
        <div className="bg-white border-b border-neutral-100 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search favourites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 pl-9 pr-10 py-3 text-[15px] outline-none focus:border-[#0E9AA7] focus:ring-2 focus:ring-[#0E9AA7]/20 transition-all"
            />
            {searchQuery.length > 0 && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5"
              >
                <X className="h-4 w-4 text-neutral-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="mx-4 mt-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-[14px] text-green-700">
          {toast.message}
        </div>
      )}

      {/* Content */}
      <div className="px-4 pt-4">
        {filtered.length === 0 && favorites.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center pt-20 px-6 text-center">
            <div
              className="flex items-center justify-center h-24 w-24 rounded-full mb-6"
              style={{ background: '#E8F9FA' }}
            >
              <WashingMachine className="h-12 w-12" style={{ color: '#0E9AA7' }} />
            </div>
            <h2 className="text-[17px] font-semibold text-neutral-900 mb-2">No favourite laundries yet</h2>
            <p className="text-[15px] text-neutral-500 mb-8">
              Browse laundries and tap ♥ to save them here
            </p>
            <button
              onClick={() => navigate('/customer/laundries')}
              className="h-12 rounded-full bg-[#0E9AA7] text-white text-[15px] font-semibold px-8"
            >
              Browse Laundries
            </button>
          </div>
        ) : filtered.length === 0 ? (
          /* No search results */
          <div className="flex flex-col items-center justify-center pt-20 text-center">
            <p className="text-[15px] text-neutral-500">No results for "{searchQuery}"</p>
          </div>
        ) : (
          /* Favorites List */
          <div>
            {filtered.map((outlet) => (
              <div key={outlet.id}>
                {/* Confirm Inline Panel */}
                {confirmId === outlet.id && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-2 flex items-center justify-between">
                    <p className="text-[14px] text-neutral-700 font-medium">Remove from favourites?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmId(null)}
                        className="h-9 px-4 rounded-full border border-neutral-300 text-[13px] font-semibold text-neutral-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUnfavorite(outlet.id)}
                        className="h-9 px-4 rounded-full bg-red-500 text-white text-[13px] font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-3">
                  <div className="flex items-start justify-between mb-2">
                    {/* Left: name + address */}
                    <div className="flex-1 pr-3">
                      <p className="text-[15px] font-bold text-neutral-900">{outlet.name}</p>
                      <p className="text-[13px] text-neutral-500 mt-0.5">{outlet.address}</p>
                    </div>
                    {/* Right: star icon */}
                    <button
                      onClick={() => setConfirmId(confirmId === outlet.id ? null : outlet.id)}
                      className="flex items-center justify-center h-10 w-10 -mt-1 -mr-1"
                    >
                      <Star className="h-5 w-5 fill-[#0E9AA7] text-[#0E9AA7]" />
                    </button>
                  </div>

                  {/* Status + Rating row */}
                  <div className="flex items-center gap-3 mb-3">
                    {/* Status pill */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
                        outlet.open
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${outlet.open ? 'bg-green-500' : 'bg-red-500'}`}
                      />
                      {outlet.open ? 'Open' : 'Closed'}
                    </span>

                    {/* Rating */}
                    <span className="text-[13px] text-neutral-500 flex items-center gap-1">
                      <span>⭐</span>
                      <span className="font-semibold text-neutral-700">{outlet.rating}</span>
                      <span>·</span>
                      <span>{outlet.orders} orders</span>
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      className="flex-1 h-10 rounded-full bg-[#0E9AA7] text-white text-[14px] font-semibold"
                      onClick={() => navigate('/customer/order-new')}
                    >
                      Order Now
                    </button>
                    <button
                      className="flex-1 h-10 rounded-full border border-[#0E9AA7] text-[#0E9AA7] text-[14px] font-semibold"
                      onClick={() => navigate(`/customer/laundry/${outlet.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteLaundriesPage;
