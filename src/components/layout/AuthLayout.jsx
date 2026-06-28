import { Outlet } from 'react-router-dom';

// Blurred organic gradient background with centered white card shell.
export default function AuthLayout() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-14 overflow-hidden">

      {/* ── Base warm cream ── */}
      <div className="absolute inset-0" style={{ background: '#F6F4EF' }} />

      {/* ── Organic blobs ── */}
      <div className="absolute pointer-events-none" style={{
        top: '-10%', left: '-8%',
        width: 560, height: 560, borderRadius: '50%',
        background: '#9ECFB0', opacity: 0.28, filter: 'blur(80px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: '12%', right: '-10%',
        width: 480, height: 480, borderRadius: '50%',
        background: '#A8BFE0', opacity: 0.22, filter: 'blur(72px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: '-6%', left: '14%',
        width: 520, height: 520, borderRadius: '50%',
        background: '#F2C4A8', opacity: 0.26, filter: 'blur(78px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: '48%', left: '52%',
        width: 340, height: 340, borderRadius: '50%',
        background: '#E8D0BC', opacity: 0.18, filter: 'blur(56px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: '6%', right: '2%',
        width: 400, height: 400, borderRadius: '50%',
        background: '#B4CCAA', opacity: 0.20, filter: 'blur(68px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: '30%', left: '5%',
        width: 280, height: 280, borderRadius: '50%',
        background: '#F0C4D8', opacity: 0.15, filter: 'blur(50px)',
      }} />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-[430px]">
        <Outlet />
      </div>
    </div>
  );
}
