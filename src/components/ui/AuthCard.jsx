export function AuthCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-[16px] px-10 py-12 ${className}`}
      style={{ boxShadow: '0 4px 24px rgba(15,20,27,.07), 0 1px 4px rgba(15,20,27,.04)' }}
    >
      {children}
    </div>
  );
}
