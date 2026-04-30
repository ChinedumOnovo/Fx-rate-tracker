import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useFX } from '../context/FXContext'
import CurrencySelector from '../components/CurrencySelector'
import ErrorBanner from '../components/ErrorBanner'

export default function Converter() {
  const location = useLocation()
  const { baseCurrency, setBaseCurrency, rates, loading, error } = useFX()
  const [toCurrency, setToCurrency] = useState(location.state?.toCurrency ?? 'USD')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState({})
  const [converted, setConverted] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  // ── Validation ──
  const validate = () => {
    const newErrors = {}

    if (!amount) {
      newErrors.amount = 'Please enter an amount.'
    } else if (isNaN(amount)) {
      newErrors.amount = 'Amount must be a number.'
    } else if (Number(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero.'
    } else if (Number(amount) > 1000000000) {
      newErrors.amount = 'Amount is too large. Please enter a smaller value.'
    }

    if (baseCurrency === toCurrency) {
      newErrors.toCurrency = 'Please select a different currency to convert to.'
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      const rate = rates[toCurrency]
      if (rate) {
        const result = (Number(amount) * rate).toFixed(2)
        setConverted({
          from: baseCurrency,
          to: toCurrency,
          amount: Number(amount),
          result: Number(result),
          rate,
        })
      }
    }
  }

  const handleReset = () => {
    setAmount('')
    setErrors({})
    setConverted(null)
    setSubmitted(false)
  }

  return (
    <div className="page-container max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Currency Converter</h1>
        <p className="text-gray-500 text-sm">
          Convert between any two currencies using live rates 
          powered by ExchangeRate-API.
        </p>
      </div>

      {/* Form */}
      <div className="card">
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Currency conversion form"
        >
          {/* Amount */}
          <div className="mb-5">
            <label
              htmlFor="amount"
              className="text-sm font-medium text-navy-700 block mb-1"
            >
              Amount <span className="text-red-500" aria-hidden="true">*</span>
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (submitted) {
                  setErrors((prev) => ({ ...prev, amount: undefined }))
                }
              }}
              className={`input-field ${errors.amount ? 'input-error' : ''}`}
              placeholder="Enter amount e.g. 1000"
              aria-required="true"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
            {errors.amount && (
              <p id="amount-error" className="error-message" role="alert">
                {errors.amount}
              </p>
            )}
          </div>

          {/* From Currency */}
          <div className="mb-5">
            <CurrencySelector
              id="from-currency"
              label="From Currency"
              value={baseCurrency}
              onChange={(val) => {
                setBaseCurrency(val)
                setConverted(null)
              }}
            />
          </div>

          {/* Swap Button */}
          <div className="flex justify-center my-4">
            <button
              type="button"
              onClick={() => {
                setBaseCurrency(toCurrency)
                setToCurrency(baseCurrency)
                setConverted(null)
              }}
              className="bg-navy-50 hover:bg-teal-400 hover:text-white 
                         text-teal-400 border-2 border-teal-400 rounded-full 
                         w-10 h-10 flex items-center justify-center text-xl
                         transition-colors duration-200
                         focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Swap currencies"
            >
              ⇄
            </button>
          </div>

          {/* To Currency */}
          <div className="mb-5">
            <CurrencySelector
              id="to-currency"
              label="To Currency"
              value={toCurrency}
              onChange={(val) => {
                setToCurrency(val)
                setConverted(null)
                if (submitted) {
                  setErrors((prev) => ({ ...prev, toCurrency: undefined }))
                }
              }}
              excludeCurrency={baseCurrency}
            />
            {errors.toCurrency && (
              <p className="error-message" role="alert">
                {errors.toCurrency}
              </p>
            )}
          </div>

          {/* API Error */}
          {error && <ErrorBanner message={error} />}

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Loading rates...' : 'Convert'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
              aria-label="Reset form"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Result */}
      {converted && (
        <div
          className="card mt-6 bg-indigo-600 text-white text-center"
          role="region"
          aria-label="Conversion result"
          aria-live="polite"
        >
          <p className="text-gray-100 text-sm mb-2">Conversion Result</p>
          <p className="text-4xl font-bold text-teal-400 mb-2">
            {converted.result.toLocaleString()} {converted.to}
          </p>
          <p className="text-gray-100 text-lg">
            {converted.amount.toLocaleString()} {converted.from}
            {' = '}
            {converted.result.toLocaleString()} {converted.to}
          </p>
          <div className="border-t border-indigo-500 mt-4 pt-4 text-sm text-gray-100">
            <p>Rate: 1 {converted.from} = {converted.rate.toFixed(4)} {converted.to}</p>
            <p className="mt-1">
                Rates from ExchangeRate-API · Updated daily
            </p>
          </div>
        </div>
      )}

      {/* Conversion Tips */}
      <div className="card mt-6 bg-navy-50">
        <h2 className="text-navy-700 font-semibold text-sm mb-3">
          💡 Good to Know
        </h2>
        <ul className="text-sm text-gray-500 space-y-2">
          <li>• Rates are sourced from ExchangeRate-API and updated daily.</li>
          <li>• These rates are indicative only and not suitable for financial transactions.</li>
          <li>• Use the swap button to quickly reverse your conversion.</li>
          <li>• For currency details, visit the Currency Info page.</li>
        </ul>
      </div>
    </div>
  )
}