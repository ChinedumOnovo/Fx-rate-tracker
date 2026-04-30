export default function Privacy() {
  return (
    <div className="page-container max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="section-title">Privacy &amp; Cookie Policy</h1>
        <p className="text-gray-500 text-sm">
          This page explains what data this site stores, why, and how to remove it.
        </p>
      </div>

      <div className="space-y-6">

        <div className="card">
          <h2 className="text-lg font-bold text-navy-700 mb-3">What We Store</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            This site stores two items in your browser's localStorage. Your chosen
            base currency is saved under the key <code className="bg-gray-100 px-1 rounded text-navy-700">fx-base-currency</code>.
            Your cookie consent choice is saved under the key{' '}
            <code className="bg-gray-100 px-1 rounded text-navy-700">fx-cookie-consent</code>.
            No other data is written to your browser.
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-navy-700 mb-3">Why We Store It</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Your base currency preference is stored solely to remember your selection
            between visits, so you do not have to choose it each time you open the site.
            This data is never used for any other purpose.
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-navy-700 mb-3">Third Parties</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            No personal data is collected, sold, or shared with any third party.
            Exchange rates are fetched from ExchangeRate-API, but only your selected
            base currency code is included in that request — no identifying information
            about you is sent to them.
          </p>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-navy-700 mb-3">How to Opt Out</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            You can decline cookies at any time via the cookie banner shown when you
            first visit the site. If you have already accepted, you can clear all stored
            preferences by opening your browser settings, navigating to site data or
            cookies, and clearing the data for this site. This will remove both stored
            values and reset your preferences to the defaults.
          </p>
        </div>

      </div>
    </div>
  )
}
