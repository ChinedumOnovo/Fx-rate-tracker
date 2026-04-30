import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-indigo-600 text-gray-100 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-teal-400 font-bold text-lg mb-3" aria-label="FX Tracker">
              <span aria-hidden="true">₹ ₦ ₵ ₩ ¥ £</span> FX Tracker
            </h2>
            <p className="text-sm text-gray-100 leading-relaxed">
              A real-time foreign exchange rate tracker built with React and
              ExchangeRate-API. Rates are indicative only and not financial advice.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Navigation
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {[
                  { path: '/',               label: 'Home' },
                  { path: '/rates',          label: 'Rates Table' },
                  { path: '/converter',      label: 'Currency Converter' },
                  { path: '/currency-info',  label: 'Currency Info' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-100 hover:text-teal-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Legal
            </h3>
            <div className="space-y-2 text-sm text-gray-100">
              <p>Data sourced from ExchangeRate-API</p>
              <p>Rates updated daily — not for financial transactions</p>
              <p>Rates are indicative only and not financial advice</p>
              <p className="text-xs pt-2">
                This site uses cookies to improve your experience.{' '}
                <Link to="/privacy" className="underline hover:text-teal-400 transition-colors duration-200">
                  See our cookie policy for details.
                </Link>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-indigo-500 mt-8 pt-6 flex flex-col sm:flex-row 
                        justify-between items-center gap-4 text-sm text-gray-300">
          <p>© {currentYear} FX Tracker. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Accessibility: WCAG 2.1 AA</span>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  )
}