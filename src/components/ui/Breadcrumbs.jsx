import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm mb-1">
    {items.map((item, i) => {
      const isLast = i === items.length - 1;
      return (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-300 flex-shrink-0" />}
          {isLast ? (
            <span className="font-medium text-neutral-800">{item.label}</span>
          ) : (
            <Link
              to={item.to}
              className="text-neutral-400 hover:text-[#0C5FC5] transition-colors"
            >
              {item.label}
            </Link>
          )}
        </span>
      );
    })}
  </nav>
);

export default Breadcrumbs;
