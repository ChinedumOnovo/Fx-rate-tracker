import { useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem('fx-cookie-consent'))

  const handleAccept = () => {
    localStorage.setItem('fx-cookie-consent', 'accepted')
    setVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem('fx-cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      aria-describedby="cookie-description"
      className="fixed bottom-0 left-0 right-0 z-50 bg-navy-700 text-white 
                 shadow-2xl border-t-2 border-teal-400"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center 
                        justify-between gap-4">

          {/* Message */}
          <div className="flex-1">
            <p className="font-semibold text-teal-400 mb-1">
              🍪 Cookie Notice
            </p>
            <p
              id="cookie-description"
              className="text-sm text-gray-300 leading-relaxed"
            >
              We use cookies to remember your preferences (such as your base 
              currency) and to analyse how the site is used. No personal data 
              is collected or shared with third parties. You can opt out at any time.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="btn-outline text-sm px-4 py-2"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary text-sm px-4 py-2"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}