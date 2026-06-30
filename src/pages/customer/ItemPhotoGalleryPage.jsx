import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';
import { getAllItems } from '../../lib/mock/mockItems.js';
import { getAllIntakeData } from '../../lib/mock/mockIntake.js';

const PHOTO_GRADIENTS = [
  'from-slate-400 to-slate-600',
  'from-teal-400 to-teal-600',
  'from-blue-400 to-blue-600',
  'from-indigo-400 to-indigo-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
];

const PHOTO_TYPE_LABELS = {
  front:    'Front View',
  back:     'Back View',
  closeup:  'Close-up',
  damage:   'Damage',
  finished: 'Finished',
};

const PHOTO_STAGE = {
  intake_front: 'INTAKE', intake_back: 'INTAKE', intake_detail: 'INTAKE', intake_damage: 'INTAKE',
  front: 'INTAKE', back: 'INTAKE', closeup: 'INTAKE', damage: 'INTAKE',
  finished: 'QC',
};

function PhotoThumb({ photo, gradient, capturedAt, onClick }) {
  const stage = PHOTO_STAGE[photo.type] ?? 'INTAKE';
  return (
    <button
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
    >
      <div className={`h-full w-full bg-gradient-to-br ${gradient} flex flex-col items-center justify-center`}>
        <Camera className="h-5 w-5 text-white/70 mb-1" />
        <p className="text-[9px] font-medium text-white/80">
          {PHOTO_TYPE_LABELS[photo.type] ?? photo.type}
        </p>
      </div>
      {/* Stage chip */}
      <div className="absolute top-1 left-1 rounded-full bg-black/50 px-1.5 py-0.5">
        <p className="text-[8px] font-bold text-white tracking-wider">{stage}</p>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </button>
  );
}

function Lightbox({ photo, gradient, label, capturedAt, onClose, onPrev, onNext, hasPrev, hasNext }) {
  const stage = PHOTO_STAGE[photo.type] ?? 'INTAKE';
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-small font-semibold text-white">{label}</p>
          <p className="text-[10px] text-white/50">{stage} {capturedAt ? '· ' + capturedAt.slice(0, 10) : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Download (mock) — real implementation would trigger file download')}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            title="Download photo"
          >
            ↓
          </button>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
            ✕
          </button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-8 gap-4">
        <button onClick={onPrev} disabled={!hasPrev} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30">
          ‹
        </button>
        <div className={`flex-1 max-w-xs aspect-square rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center shadow-lg`}>
          <Camera className="h-12 w-12 text-white/60 mb-2" />
          <p className="text-small font-semibold text-white/80">{PHOTO_TYPE_LABELS[photo.type] ?? photo.type}</p>
        </div>
        <button onClick={onNext} disabled={!hasNext} className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white disabled:opacity-30">
          ›
        </button>
      </div>
      <div className="px-4 pb-6 text-center">
        <p className="text-[11px] text-white/50">{PHOTO_TYPE_LABELS[photo.type] ?? photo.type} · {stage}</p>
      </div>
    </div>
  );
}

export default function ItemPhotoGalleryPage() {
  const { id: orderId } = useParams();
  const allItems     = getAllItems();
  const allIntake    = getAllIntakeData();

  // get all items for this order
  const orderItems = allItems.filter(item => item.orderId === orderId || !orderId);

  // build photo entries: { item, photo, gradient }
  const allPhotos = [];
  orderItems.forEach(item => {
    const intake = allIntake[item.id];
    if (intake?.photos?.length) {
      intake.photos.forEach((ph, pi) => {
        allPhotos.push({ item, photo: ph, gradient: PHOTO_GRADIENTS[(allPhotos.length + pi) % PHOTO_GRADIENTS.length] });
      });
    } else {
      // placeholder if no photos yet
      allPhotos.push({
        item,
        photo: { type: 'front', id: `${item.id}-ph0` },
        gradient: PHOTO_GRADIENTS[allPhotos.length % PHOTO_GRADIENTS.length],
        placeholder: true,
      });
    }
  });

  const [lightbox, setLightbox] = useState(null); // index into allPhotos

  const grouped = orderItems.map(item => ({
    item,
    photos: allPhotos.filter(p => p.item.id === item.id),
  }));

  return (
    <div data-theme="customer" className="min-h-screen bg-white">

      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-100 bg-white px-4 py-3">
        <Link to={`/app/orders/${orderId}`} className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-small font-bold text-neutral-900">Item Photos</h1>
          <p className="text-[10px] text-neutral-500">{orderId}</p>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {orderItems.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Camera className="h-10 w-10 text-neutral-300 mb-3" />
            <p className="text-small font-medium text-neutral-600">No items found for this order</p>
          </div>
        ) : (
          grouped.map(({ item, photos }) => (
            <div key={item.id}>
              <div className="mb-2 flex items-baseline justify-between">
                <p className="text-small font-semibold text-neutral-800">{item.typeName} × {item.qty}</p>
                <span className="font-mono text-[10px] text-neutral-400">{item.barcode}</span>
              </div>
              {photos.length === 0 || photos[0]?.placeholder ? (
                <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-neutral-200 py-8 text-center">
                  <Camera className="h-5 w-5 text-neutral-300 mb-1" />
                  <p className="text-caption text-neutral-400">No photos yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {photos.map((p, pi) => {
                    const globalIdx = allPhotos.indexOf(p);
                    return (
                      <PhotoThumb
                        key={pi}
                        photo={p.photo}
                        gradient={p.gradient}
                        capturedAt={p.photo.capturedAt ?? ''}
                        onClick={() => setLightbox(globalIdx)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}

        {allPhotos.length > 0 && !allPhotos[0]?.placeholder && (
          <p className="text-center text-caption text-neutral-400">
            {allPhotos.filter(p => !p.placeholder).length} photo{allPhotos.filter(p => !p.placeholder).length !== 1 ? 's' : ''} captured during processing
          </p>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && allPhotos[lightbox] && !allPhotos[lightbox].placeholder && (
        <Lightbox
          photo={allPhotos[lightbox].photo}
          gradient={allPhotos[lightbox].gradient}
          label={`${allPhotos[lightbox].item.typeName} — ${PHOTO_TYPE_LABELS[allPhotos[lightbox].photo.type] ?? allPhotos[lightbox].photo.type}`}
          capturedAt={allPhotos[lightbox].photo.capturedAt ?? ''}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox(i => Math.max(0, i - 1))}
          onNext={() => setLightbox(i => Math.min(allPhotos.length - 1, i + 1))}
          hasPrev={lightbox > 0}
          hasNext={lightbox < allPhotos.length - 1}
        />
      )}
    </div>
  );
}
