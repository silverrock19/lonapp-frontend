import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-5 py-14 overflow-hidden bg-white">

      {/* Primary-blue glow — top-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-15%',
          left: '-12%',
          width: 680,
          height: 680,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #5C99E6 0%, #2E79D6 40%, transparent 70%)',
          opacity: 0.13,
          filter: 'blur(72px)',
        }}
      />

      {/* Secondary primary glow — upper-center-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          left: '8%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #99C0F0 0%, transparent 70%)',
          opacity: 0.18,
          filter: 'blur(60px)',
        }}
      />

      {/* Teal-accent glow — bottom-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          right: '-10%',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #4FCFD6 0%, #1FB6BF 40%, transparent 70%)',
          opacity: 0.11,
          filter: 'blur(80px)',
        }}
      />

      {/* Teal wash — right edge */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '20%',
          right: '2%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #8AE3E8 0%, transparent 70%)',
          opacity: 0.14,
          filter: 'blur(50px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[400px]">
        <Outlet />
      </div>
    </div>
  );
}
