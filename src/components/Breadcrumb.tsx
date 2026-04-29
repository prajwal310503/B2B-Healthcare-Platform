import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export interface Crumb {
  label: string
  href?: string
}

interface BreadcrumbProps {
  crumbs: Crumb[]
}

export default function Breadcrumb({ crumbs }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs mb-4 flex-wrap">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-gray-400 hover:text-[#6c47ff] transition-colors font-medium"
      >
        <Home size={12} />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
          {crumb.href && i < crumbs.length - 1 ? (
            <Link
              to={crumb.href}
              className="text-gray-400 hover:text-[#6c47ff] transition-colors font-medium"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
