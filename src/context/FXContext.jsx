import { createContext, useContext, useState, useEffect, useRef } from 'react'

const FXContext = createContext()

const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`

const displayNames = new Intl.DisplayNames(['en'], { type: 'currency' })

function getCurrencyName(code) {
  try {
    return displayNames.of(code) ?? code
  } catch {
    return code
  }
}

function friendlyError(err) {
  const msg = err.message || ''
  if (msg === 'invalid-key') return 'Configuration error — the API key is invalid. Please contact support.'
  if (msg === 'quota-reached') return 'Rate limit reached. Please try again in a few minutes.'
  if (msg === 'inactive-account') return 'The exchange rate service account is currently inactive.'
  if (msg === 'unsupported-code') return 'That currency code is not supported by the exchange rate service.'
  return 'Could not load exchange rates. Please check your connection and try again.'
}

export function FXProvider({ children }) {
  const [baseCurrency, setBaseCurrencyState] = useState(
    () => {
      const consent = localStorage.getItem('fx-cookie-consent')
      return consent === 'accepted'
        ? (localStorage.getItem('fx-base-currency') || 'GBP')
        : 'GBP'
    }
  )
  const [rates, setRates] = useState({})
  const [currencies, setCurrencies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const currenciesLoaded = useRef(false)

  const setBaseCurrency = (val) => {
    if (localStorage.getItem('fx-cookie-consent') === 'accepted') {
      localStorage.setItem('fx-base-currency', val)
    }
    setBaseCurrencyState(val)
  }

  // Fetch rates whenever base currency changes; seed currency list on first call
  useEffect(() => {
    const controller = new AbortController()

    async function fetchRates() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${BASE_URL}/latest/${baseCurrency}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('Failed to fetch rates')
        const data = await res.json()
        if (data.result !== 'success') throw new Error(data['error-type'])

        if (!currenciesLoaded.current) {
          currenciesLoaded.current = true
          const currencyList = Object.keys(data.conversion_rates).map((code) => ({
            code,
            name: getCurrencyName(code),
          }))
          setCurrencies(currencyList)
        }

        const { [baseCurrency]: _, ...filteredRates } = data.conversion_rates
        setRates(filteredRates)
      } catch (err) {
        if (err.name !== 'AbortError') setError(friendlyError(err))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    fetchRates()
    return () => controller.abort()
  }, [baseCurrency])

  return (
    <FXContext.Provider
      value={{
        baseCurrency,
        setBaseCurrency,
        rates,
        currencies,
        loading,
        error,
      }}
    >
      {children}
    </FXContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFX() {
  const context = useContext(FXContext)
  if (!context) {
    throw new Error('useFX must be used within an FXProvider')
  }
  return context
}
