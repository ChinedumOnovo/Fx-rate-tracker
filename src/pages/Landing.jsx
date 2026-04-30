import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useFX } from '../context/FXContext'
import CurrencySelector from '../components/CurrencySelector'
import ErrorBanner from '../components/ErrorBanner'

const TOP_PAIRS = ['USD', 'INR', 'NGN', 'GHS', 'KRW', 'CNY', 'JPY']

const HERO_CURRENCIES = [
  { sym: '₹ INR', code: 'INR' },
  { sym: '₦ NGN', code: 'NGN' },
  { sym: '₵ GHS', code: 'GHS' },
  { sym: '₩ KRW', code: 'KRW' },
]

const PAIR_COLORS = [
  { bg: 'bg-gold-400', text: 'text-navy-700', sub: 'text-navy-700/70' },
  { bg: 'bg-teal-400', text: 'text-navy-700', sub: 'text-navy-700/70' },
]

// Stagger delay classes — must be string literals so Tailwind JIT generates them
const STAGGER = [
  '[animation-delay:0ms]',
  '[animation-delay:80ms]',
  '[animation-delay:160ms]',
  '[animation-delay:240ms]',
  '[animation-delay:320ms]',
  '[animation-delay:400ms]',
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function Landing() {
  const { baseCurrency, setBaseCurrency, rates, loading, error } = useFX()
  const [toCurrency, setToCurrency] = useState('USD')
  const [amount, setAmount] = useState(1000)
  const [pairsRef, pairsInView] = useInView()
  const [featuresRef, featuresInView] = useInView()

  const convertedAmount =
    rates[toCurrency] ? (amount * rates[toCurrency]).toFixed(2) : null

  const topPairRates = TOP_PAIRS.filter(
    (code) => code !== baseCurrency && rates[code]
  ).slice(0, 6)

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden bg-indigo-600 text-white py-20 px-4"
        aria-labelledby="hero-heading"
      >
        {/* Sparkle decorations */}
        <span aria-hidden="true" className="absolute top-8 left-[12%] text-white animate-twinkle select-none pointer-events-none text-2xl">✦</span>
        <span aria-hidden="true" className="absolute top-[18%] right-[20%] text-white animate-twinkle-alt select-none pointer-events-none text-3xl">✦</span>
        <span aria-hidden="true" className="absolute top-[42%] left-[6%] text-white animate-twinkle select-none pointer-events-none text-xl">✦</span>
        <span aria-hidden="true" className="absolute bottom-14 left-[38%] text-white animate-twinkle-alt select-none pointer-events-none text-2xl">✦</span>
        <span aria-hidden="true" className="absolute bottom-8 right-[14%] text-white animate-twinkle select-none pointer-events-none text-xl">✦</span>
        <span aria-hidden="true" className="absolute top-[55%] right-[7%] text-white animate-twinkle-alt select-none pointer-events-none text-3xl">✦</span>
        <span aria-hidden="true" className="absolute top-[28%] left-[48%] text-white animate-twinkle select-none pointer-events-none text-lg">✦</span>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2
                        gap-12 items-center">

          {/* Left — each element staggers in independently */}
          <div>
            <p className="text-teal-400 font-semibold tracking-widest
                          text-sm uppercase mb-3
                          animate-fade-in-up">
              Real-Time Exchange Rates
            </p>
            <h1
              id="hero-heading"
              className="text-4xl md:text-5xl font-bold leading-tight mb-4
                         animate-fade-in-up [animation-delay:100ms]"
            >
              Track FX Rates <br />
              <span className="text-teal-400">Instantly</span>
            </h1>
            <p className="text-gray-100 text-lg mb-8 leading-relaxed
                          animate-fade-in-up [animation-delay:200ms]">
              Real-time exchange rates powered by ExchangeRate-API.
              Convert currencies, explore currency info, and track the pairs
              that matter to you — ₹ ₦ ₵ ₩ ¥ £
            </p>
            <div className="flex flex-wrap gap-4
                            animate-fade-in-up [animation-delay:300ms]">
              <Link to="/rates" className="btn-primary">
                View All Rates
              </Link>
              <Link to="/converter" className="btn-secondary
                border-white text-white hover:bg-white hover:text-navy-700">
                Convert Currency
              </Link>
            </div>
          </div>

          {/* Right — clickable currency circles */}
          <div
            className="hidden md:grid grid-cols-2 gap-6
                       animate-fade-in-up [animation-delay:400ms]"
          >
            {HERO_CURRENCIES.map(({ sym, code }) => (
              <Link
                key={code}
                to="/converter"
                state={{ toCurrency: code }}
                aria-label={`Open converter for ${code}`}
                className="aspect-square rounded-full flex items-center justify-center
                           text-3xl font-bold text-teal-400
                           bg-indigo-700/50 border border-teal-400/30
                           hover:bg-indigo-600 hover:border-teal-400
                           hover:scale-105 transition-all duration-200"
              >
                {sym}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK CONVERTER ── */}
      <section
        className="bg-white shadow-md py-8 px-4"
        aria-labelledby="converter-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="converter-heading"
            className="text-center text-navy-700 font-bold text-xl mb-6"
          >
            Quick Converter
          </h2>

          <div className="flex flex-col md:flex-row items-end gap-4
                          justify-center flex-wrap">
            {/* Amount */}
            <div className="flex flex-col gap-1 w-full md:w-40">
              <label
                htmlFor="quick-amount"
                className="text-sm font-medium text-navy-700"
              >
                Amount
              </label>
              <input
                id="quick-amount"
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-field"
              />
            </div>

            {/* From */}
            <div className="w-full md:w-48">
              <CurrencySelector
                id="quick-from"
                label="From"
                value={baseCurrency}
                onChange={setBaseCurrency}
                excludeCurrency={toCurrency}
              />
            </div>

            {/* Swap arrow */}
            <div className="text-2xl text-teal-400 font-bold pb-1"
                 aria-hidden="true">
              ⇄
            </div>

            {/* To */}
            <div className="w-full md:w-48">
              <CurrencySelector
                id="quick-to"
                label="To"
                value={toCurrency}
                onChange={setToCurrency}
                excludeCurrency={baseCurrency}
              />
            </div>

            {/* Result */}
            <div className="w-full md:w-auto">
              <p className="text-sm font-medium text-navy-700 mb-1">Result</p>
              <div
                className="input-field bg-navy-50 font-semibold
                           text-teal-500 min-w-[160px]"
                aria-live="polite"
                aria-label="Conversion result"
              >
                {loading
                  ? 'Loading...'
                  : error
                  ? 'Error'
                  : convertedAmount
                  ? `${Number(convertedAmount).toLocaleString()} ${toCurrency}`
                  : '—'}
              </div>
            </div>
          </div>

          {/* Rate info */}
          {!loading && !error && rates[toCurrency] && (
            <p className="text-center text-sm text-gray-500 mt-4">
              1 {baseCurrency} = {rates[toCurrency]} {toCurrency} ·
              Rates from ExchangeRate-API · Updated daily
            </p>
          )}
        </div>
      </section>

      {/* ── TOP CURRENCY PAIRS ── */}
      <section
        ref={pairsRef}
        className="page-container"
        aria-labelledby="top-pairs-heading"
      >
        <h2
          id="top-pairs-heading"
          className={`section-title text-center transition-all duration-700
                      ${pairsInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
          Top Currency Pairs
        </h2>

        {loading && (
          <p className="text-center text-gray-500" aria-live="polite">
            Loading rates...
          </p>
        )}
        {error && <ErrorBanner message={error} />}

        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-6 justify-items-center">
          {topPairRates.map((code, i) => {
            const c = PAIR_COLORS[i % PAIR_COLORS.length]
            return (
              <Link
                key={code}
                to="/currency-info"
                state={{ selected: code }}
                aria-label={`View info for ${code}`}
                className={`aspect-square w-full max-w-[140px] rounded-full ${c.bg}
                           flex flex-col items-center justify-center text-center
                           hover:animate-coin-hover hover:shadow-xl transition-all duration-200
                           ${pairsInView
                             ? `animate-fade-in-up ${STAGGER[i]}`
                             : 'opacity-0'}`}
              >
                <p className={`text-xl font-bold ${c.text} leading-tight`}>
                  {code}
                </p>
                <p className={`${c.sub} font-semibold text-sm mt-1 leading-tight`}>
                  {rates[code]?.toFixed(4)}
                </p>
                <p className={`text-xs ${c.sub} mt-1`}>
                  1 {baseCurrency} =
                </p>
              </Link>
            )
          })}
        </div>

        <div className={`text-center mt-8 ${pairsInView ? 'animate-fade-in-up [animation-delay:480ms]' : 'opacity-0'}`}>
          <Link to="/rates" className="btn-outline">
            View Full Rates Table →
          </Link>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section
        ref={featuresRef}
        className="bg-indigo-600 text-white py-16 px-4"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            id="features-heading"
            className={`text-center text-3xl font-bold mb-12
                        ${featuresInView ? 'animate-fade-in-up' : 'opacity-0'}`}
          >
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📈',
                title: 'Live Rates',
                desc: 'Real-time exchange rates powered by ExchangeRate-API, updated daily.',
                to: '/rates',
              },
              {
                icon: '🔄',
                title: 'Easy Conversion',
                desc: 'Convert between any two currencies instantly with our simple converter tool.',
                to: '/converter',
              },
              {
                icon: '🌍',
                title: 'Currency Info',
                desc: 'Search and explore detailed information about currencies from around the world.',
                to: '/currency-info',
              },
            ].map((feature, i) => (
              <Link
                key={feature.title}
                to={feature.to}
                className={`bg-indigo-700 rounded-xl p-6 text-center
                           border border-teal-400/20
                           hover:bg-indigo-600 hover:border-teal-400/50
                           hover:scale-105 transition-all duration-200
                           ${featuresInView
                             ? `animate-fade-in-up ${STAGGER[i]}`
                             : 'opacity-0'}`}
              >
                <div className="text-4xl mb-4" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="text-teal-400 font-bold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-100 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
