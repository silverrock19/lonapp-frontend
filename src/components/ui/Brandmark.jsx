export function Brandmark({ className = '' }) {
  return (
    <div
      className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full text-white text-2xl font-extrabold shadow-md ${className}`}
      style={{ background: 'linear-gradient(150deg, var(--color-primary-500), var(--color-primary-700))' }}
      aria-hidden="true"
    >
      L
    </div>
  );
}
