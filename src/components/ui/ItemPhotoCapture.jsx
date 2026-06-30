import { useState } from 'react';
import { Camera, X, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/classNames.js';
import { PHOTO_TYPES } from '../../lib/mock/mockIntake.js';

// Gradient colors for mock photo placeholders
const MOCK_GRADIENTS = [
  ['#DBEAFE', '#BFDBFE'],
  ['#D1FAE5', '#A7F3D0'],
  ['#FEF3C7', '#FDE68A'],
  ['#FCE7F3', '#FBCFE8'],
  ['#EDE9FE', '#DDD6FE'],
  ['#CFFAFE', '#A5F3FC'],
];

function MockPhotoThumbnail({ photo, onRemove }) {
  const [a, b] = MOCK_GRADIENTS[photo.mockIndex % MOCK_GRADIENTS.length];
  const typeLabel = PHOTO_TYPES.find(t => t.id === photo.type)?.label ?? photo.type;

  return (
    <div className="relative rounded-lg overflow-hidden group aspect-[4/3]">
      <div
        className="w-full h-full flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}
      >
        <Camera className="h-6 w-6 text-neutral-400 mb-1" />
        <p className="text-[9px] text-neutral-500 font-medium">{typeLabel}</p>
      </div>

      {/* Remove overlay */}
      {onRemove && (
        <button
          onClick={() => onRemove(photo.id)}
          className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition-opacity"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export default function ItemPhotoCapture({ photos = [], onCapture, onRemove, readOnly = false }) {
  const [capturing, setCapturing] = useState(false);
  const [selectedType, setSelectedType] = useState('intake_front');
  const [mockProgress, setMockProgress] = useState(0); // 0 | 1(loading) | 2(done)

  function startCapture() {
    setCapturing(true);
    setMockProgress(0);
  }

  function triggerCapture() {
    setMockProgress(1);
    setTimeout(() => {
      onCapture?.({ type: selectedType, caption: '' });
      setMockProgress(2);
      setTimeout(() => {
        setCapturing(false);
        setMockProgress(0);
      }, 600);
    }, 1200);
  }

  return (
    <div className="space-y-4">
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map(photo => (
            <MockPhotoThumbnail key={photo.id} photo={photo} onRemove={readOnly ? undefined : onRemove} />
          ))}
        </div>
      )}

      {/* Capture UI */}
      {!readOnly && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden">
          {/* Camera viewfinder mock */}
          <div
            className="relative h-32 bg-neutral-800 flex flex-col items-center justify-center gap-2 cursor-pointer"
            onClick={!capturing ? startCapture : undefined}
          >
            {!capturing ? (
              <>
                <Camera className="h-8 w-8 text-neutral-500" />
                <p className="text-[11px] text-neutral-400">Tap to open camera</p>
              </>
            ) : mockProgress === 0 ? (
              <div className="flex flex-col items-center gap-3 w-full px-6">
                {/* Type selector inside viewfinder */}
                <div className="flex gap-1 flex-wrap justify-center">
                  {PHOTO_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={e => { e.stopPropagation(); setSelectedType(t.id); }}
                      className={cn(
                        'rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors',
                        selectedType === t.id
                          ? 'bg-white text-neutral-900'
                          : 'bg-white/20 text-white hover:bg-white/30',
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Shutter button */}
                <button
                  onClick={e => { e.stopPropagation(); triggerCapture(); }}
                  className="h-12 w-12 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <span className="h-8 w-8 rounded-full bg-white" />
                </button>
              </div>
            ) : mockProgress === 1 ? (
              <div className="flex flex-col items-center gap-2">
                <div className="h-6 w-6 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                <p className="text-[10px] text-white/80">Capturing…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="text-2xl">✓</div>
                <p className="text-[10px] text-green-400 font-semibold">Photo saved</p>
              </div>
            )}

            {/* Close button */}
            {capturing && mockProgress === 0 && (
              <button
                onClick={e => { e.stopPropagation(); setCapturing(false); }}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Bottom bar */}
          <div className="px-3 py-2 flex items-center justify-between">
            <p className="text-[10px] text-neutral-500">
              {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
            </p>
            {!capturing && (
              <button
                onClick={startCapture}
                className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-[10px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
              >
                <Camera className="h-3 w-3" /> Add photo
              </button>
            )}
          </div>
        </div>
      )}

      {photos.length === 0 && readOnly && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 py-8 text-center">
          <Camera className="h-7 w-7 text-neutral-300 mb-2" />
          <p className="text-caption text-neutral-400">No photos captured</p>
        </div>
      )}
    </div>
  );
}
