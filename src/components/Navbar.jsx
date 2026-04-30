import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { path: '/',          label: 'Home' },
  { path: '/rates',     label: 'Rates' },
  { path: '/converter', label: 'Converter' },
  { path: '/currency-info', label: 'Currency Info' },
]
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2
                   focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-navy-700
                   focus:rounded focus:shadow"
      >
        Skip to main content
      </a>
      <nav className="bg-indigo-600 text-white shadow-lg" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-teal-400">
            <span aria-hidden="true">₹ ₦ ₩ ¥ £</span>
            <span>FX Tracker</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 hover:text-teal-400
                  ${isActive(link.path)
                    ? 'text-teal-400 border-b-2 border-teal-400 pb-0.5'
                    : 'text-gray-100'
                  }`}
                aria-current={isActive(link.path) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-100 hover:text-teal-400 
                       focus:outline-none focus:ring-2 focus:ring-teal-400"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-indigo-900 px-4 pb-4 pt-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-sm font-medium transition-colors duration-200
                hover:text-teal-400
                ${isActive(link.path) ? 'text-teal-400' : 'text-gray-100'}`}
              aria-current={isActive(link.path) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
    </>
  )
}