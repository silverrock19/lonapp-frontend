export function AuthCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-[20px] px-8 py-10 ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(15,20,27,.10), 0 2px 8px rgba(15,20,27,.06)' }}
    >
      {children}
    </div>
  );
}
