import { useEffect, useState } from 'react';

function removeBgIfNeeded(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // Check corner alpha — if already transparent, skip processing
  const corner = ctx.getImageData(0, 0, 1, 1).data;
  if (corner[3] === 0) return null; // already transparent PNG

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const bgR = corner[0], bgG = corner[1], bgB = corner[2];
  const threshold = 28;

  const visited = new Uint8Array(width * height);
  const queue = [0, width - 1, (height - 1) * width, (height - 1) * width + (width - 1)];
  let head = 0;
  while (head < queue.length) {
    const idx = queue[head++];
    if (visited[idx]) continue;
    visited[idx] = 1;
    const p = idx * 4;
    const diff = Math.abs(data[p] - bgR) + Math.abs(data[p + 1] - bgG) + Math.abs(data[p + 2] - bgB);
    if (diff > threshold) continue;
    data[p + 3] = 0;
    const x = idx % width, y = (idx / width) | 0;
    if (x > 0)          queue.push(idx - 1);
    if (x < width - 1)  queue.push(idx + 1);
    if (y > 0)          queue.push(idx - width);
    if (y < height - 1) queue.push(idx + width);
  }

  const clean = document.createElement('canvas');
  clean.width = width;
  clean.height = height;
  clean.getContext('2d').putImageData(new ImageData(data, width, height), 0, 0);
  return clean.toDataURL('image/png');
}

const Brandmark = ({ className = '' }) => {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const processed = removeBgIfNeeded(img);
      setSrc(processed ?? '/logo.png');
    };
    img.src = '/logo.png';
  }, []);

  if (!src) return <div className={`flex justify-center mb-6 ${className}`} style={{ height: 52 }} />;

  return (
    <div className={`flex justify-center mb-6 ${className}`}>
      <img src={src} alt="LonApp" className="h-[100px] w-auto object-contain" />
    </div>
  );
};

export default Brandmark;
