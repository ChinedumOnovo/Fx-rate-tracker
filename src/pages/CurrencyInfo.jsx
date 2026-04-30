import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useFX } from '../context/FXContext'
import ErrorBanner from '../components/ErrorBanner'

const CURRENCY_META = {
  // Major / widely traded
  USD: { country: 'United States',        symbol: '$',    flag: '🇺🇸' },
  EUR: { country: 'Eurozone',             symbol: '€',    flag: '🇪🇺' },
  GBP: { country: 'United Kingdom',       symbol: '£',    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  JPY: { country: 'Japan',                symbol: '¥',    flag: '🇯🇵' },
  CHF: { country: 'Switzerland',          symbol: 'Fr',   flag: '🇨🇭' },
  AUD: { country: 'Australia',            symbol: 'A$',   flag: '🇦🇺' },
  CAD: { country: 'Canada',               symbol: 'C$',   flag: '🇨🇦' },
  NZD: { country: 'New Zealand',          symbol: 'NZ$',  flag: '🇳🇿' },
  CNY: { country: 'China',                symbol: '¥',    flag: '🇨🇳' },
  HKD: { country: 'Hong Kong',            symbol: 'HK$',  flag: '🇭🇰' },
  SGD: { country: 'Singapore',            symbol: 'S$',   flag: '🇸🇬' },
  // Asia
  INR: { country: 'India',                symbol: '₹',    flag: '🇮🇳' },
  KRW: { country: 'South Korea',          symbol: '₩',    flag: '🇰🇷' },
  IDR: { country: 'Indonesia',            symbol: 'Rp',   flag: '🇮🇩' },
  MYR: { country: 'Malaysia',             symbol: 'RM',   flag: '🇲🇾' },
  THB: { country: 'Thailand',             symbol: '฿',    flag: '🇹🇭' },
  PHP: { country: 'Philippines',          symbol: '₱',    flag: '🇵🇭' },
  VND: { country: 'Vietnam',              symbol: '₫',    flag: '🇻🇳' },
  TWD: { country: 'Taiwan',               symbol: 'NT$',  flag: '🇹🇼' },
  BDT: { country: 'Bangladesh',           symbol: '৳',    flag: '🇧🇩' },
  PKR: { country: 'Pakistan',             symbol: '₨',    flag: '🇵🇰' },
  LKR: { country: 'Sri Lanka',            symbol: '₨',    flag: '🇱🇰' },
  NPR: { country: 'Nepal',                symbol: '₨',    flag: '🇳🇵' },
  MMK: { country: 'Myanmar',              symbol: 'K',    flag: '🇲🇲' },
  KHR: { country: 'Cambodia',             symbol: '៛',    flag: '🇰🇭' },
  LAK: { country: 'Laos',                 symbol: '₭',    flag: '🇱🇦' },
  MNT: { country: 'Mongolia',             symbol: '₮',    flag: '🇲🇳' },
  BTN: { country: 'Bhutan',               symbol: 'Nu',   flag: '🇧🇹' },
  MOP: { country: 'Macau',                symbol: 'P',    flag: '🇲🇴' },
  BND: { country: 'Brunei',               symbol: '$',    flag: '🇧🇳' },
  // Middle East & Central Asia
  AED: { country: 'UAE',                  symbol: 'د.إ',  flag: '🇦🇪' },
  SAR: { country: 'Saudi Arabia',         symbol: '﷼',    flag: '🇸🇦' },
  QAR: { country: 'Qatar',                symbol: '﷼',    flag: '🇶🇦' },
  KWD: { country: 'Kuwait',               symbol: 'KD',   flag: '🇰🇼' },
  BHD: { country: 'Bahrain',              symbol: 'BD',   flag: '🇧🇭' },
  OMR: { country: 'Oman',                 symbol: '﷼',    flag: '🇴🇲' },
  JOD: { country: 'Jordan',               symbol: 'JD',   flag: '🇯🇴' },
  ILS: { country: 'Israel',               symbol: '₪',    flag: '🇮🇱' },
  LBP: { country: 'Lebanon',              symbol: '£',    flag: '🇱🇧' },
  IRR: { country: 'Iran',                 symbol: '﷼',    flag: '🇮🇷' },
  IQD: { country: 'Iraq',                 symbol: 'ع.د',  flag: '🇮🇶' },
  YER: { country: 'Yemen',                symbol: '﷼',    flag: '🇾🇪' },
  SYP: { country: 'Syria',                symbol: '£',    flag: '🇸🇾' },
  AFN: { country: 'Afghanistan',          symbol: '؋',    flag: '🇦🇫' },
  KZT: { country: 'Kazakhstan',           symbol: '₸',    flag: '🇰🇿' },
  UZS: { country: 'Uzbekistan',           symbol: 'лв',   flag: '🇺🇿' },
  AZN: { country: 'Azerbaijan',           symbol: '₼',    flag: '🇦🇿' },
  AMD: { country: 'Armenia',              symbol: '֏',    flag: '🇦🇲' },
  GEL: { country: 'Georgia',              symbol: '₾',    flag: '🇬🇪' },
  TJS: { country: 'Tajikistan',           symbol: 'SM',   flag: '🇹🇯' },
  KGS: { country: 'Kyrgyzstan',           symbol: 'лв',   flag: '🇰🇬' },
  TMT: { country: 'Turkmenistan',         symbol: 'T',    flag: '🇹🇲' },
  MVR: { country: 'Maldives',             symbol: 'ر',    flag: '🇲🇻' },
  // Europe (non-EUR)
  SEK: { country: 'Sweden',               symbol: 'kr',   flag: '🇸🇪' },
  NOK: { country: 'Norway',               symbol: 'kr',   flag: '🇳🇴' },
  DKK: { country: 'Denmark',              symbol: 'kr',   flag: '🇩🇰' },
  PLN: { country: 'Poland',               symbol: 'zł',   flag: '🇵🇱' },
  CZK: { country: 'Czech Republic',       symbol: 'Kč',   flag: '🇨🇿' },
  HUF: { country: 'Hungary',              symbol: 'Ft',   flag: '🇭🇺' },
  RON: { country: 'Romania',              symbol: 'lei',  flag: '🇷🇴' },
  BGN: { country: 'Bulgaria',             symbol: 'лв',   flag: '🇧🇬' },
  HRK: { country: 'Croatia',              symbol: 'kn',   flag: '🇭🇷' },
  ISK: { country: 'Iceland',              symbol: 'kr',   flag: '🇮🇸' },
  RUB: { country: 'Russia',               symbol: '₽',    flag: '🇷🇺' },
  UAH: { country: 'Ukraine',              symbol: '₴',    flag: '🇺🇦' },
  TRY: { country: 'Turkey',               symbol: '₺',    flag: '🇹🇷' },
  RSD: { country: 'Serbia',               symbol: 'din',  flag: '🇷🇸' },
  MKD: { country: 'North Macedonia',      symbol: 'ден',  flag: '🇲🇰' },
  ALL: { country: 'Albania',              symbol: 'L',    flag: '🇦🇱' },
  BAM: { country: 'Bosnia & Herzegovina', symbol: 'KM',   flag: '🇧🇦' },
  MDL: { country: 'Moldova',              symbol: 'L',    flag: '🇲🇩' },
  BYN: { country: 'Belarus',              symbol: 'Br',   flag: '🇧🇾' },
  // Africa
  NGN: { country: 'Nigeria',              symbol: '₦',    flag: '🇳🇬' },
  GHS: { country: 'Ghana',                symbol: '₵',    flag: '🇬🇭' },
  ZAR: { country: 'South Africa',         symbol: 'R',    flag: '🇿🇦' },
  KES: { country: 'Kenya',                symbol: 'Ksh',  flag: '🇰🇪' },
  EGP: { country: 'Egypt',                symbol: '£',    flag: '🇪🇬' },
  MAD: { country: 'Morocco',              symbol: 'د.م.', flag: '🇲🇦' },
  TND: { country: 'Tunisia',              symbol: 'د.ت',  flag: '🇹🇳' },
  DZD: { country: 'Algeria',              symbol: 'دج',   flag: '🇩🇿' },
  LYD: { country: 'Libya',                symbol: 'LD',   flag: '🇱🇾' },
  ETB: { country: 'Ethiopia',             symbol: 'Br',   flag: '🇪🇹' },
  TZS: { country: 'Tanzania',             symbol: 'Sh',   flag: '🇹🇿' },
  UGX: { country: 'Uganda',               symbol: 'Sh',   flag: '🇺🇬' },
  ZMW: { country: 'Zambia',               symbol: 'ZK',   flag: '🇿🇲' },
  RWF: { country: 'Rwanda',               symbol: 'RF',   flag: '🇷🇼' },
  MUR: { country: 'Mauritius',            symbol: '₨',    flag: '🇲🇺' },
  XOF: { country: 'West Africa (CFA)',    symbol: 'Fr',   flag: '🌍' },
  XAF: { country: 'Central Africa (CFA)', symbol: 'Fr',   flag: '🌍' },
  MZN: { country: 'Mozambique',           symbol: 'MT',   flag: '🇲🇿' },
  AOA: { country: 'Angola',               symbol: 'Kz',   flag: '🇦🇴' },
  MWK: { country: 'Malawi',               symbol: 'MK',   flag: '🇲🇼' },
  ZWL: { country: 'Zimbabwe',             symbol: '$',    flag: '🇿🇼' },
  BWP: { country: 'Botswana',             symbol: 'P',    flag: '🇧🇼' },
  NAD: { country: 'Namibia',              symbol: '$',    flag: '🇳🇦' },
  SZL: { country: 'Eswatini',             symbol: 'L',    flag: '🇸🇿' },
  LSL: { country: 'Lesotho',              symbol: 'L',    flag: '🇱🇸' },
  SDG: { country: 'Sudan',                symbol: '£',    flag: '🇸🇩' },
  SSP: { country: 'South Sudan',          symbol: '£',    flag: '🇸🇸' },
  SOS: { country: 'Somalia',              symbol: 'Sh',   flag: '🇸🇴' },
  DJF: { country: 'Djibouti',             symbol: 'Fr',   flag: '🇩🇯' },
  GMD: { country: 'Gambia',               symbol: 'D',    flag: '🇬🇲' },
  GNF: { country: 'Guinea',               symbol: 'Fr',   flag: '🇬🇳' },
  SLL: { country: 'Sierra Leone',         symbol: 'Le',   flag: '🇸🇱' },
  LRD: { country: 'Liberia',              symbol: '$',    flag: '🇱🇷' },
  CVE: { country: 'Cape Verde',           symbol: '$',    flag: '🇨🇻' },
  SCR: { country: 'Seychelles',           symbol: '₨',    flag: '🇸🇨' },
  MGA: { country: 'Madagascar',           symbol: 'Ar',   flag: '🇲🇬' },
  MRU: { country: 'Mauritania',           symbol: 'UM',   flag: '🇲🇷' },
  BIF: { country: 'Burundi',              symbol: 'Fr',   flag: '🇧🇮' },
  CDF: { country: 'DR Congo',             symbol: 'Fr',   flag: '🇨🇩' },
  KMF: { country: 'Comoros',              symbol: 'Fr',   flag: '🇰🇲' },
  STN: { country: 'São Tomé & Príncipe',  symbol: 'Db',   flag: '🇸🇹' },
  ERN: { country: 'Eritrea',              symbol: 'Nfk',  flag: '🇪🇷' },
  // Americas
  BRL: { country: 'Brazil',               symbol: 'R$',   flag: '🇧🇷' },
  MXN: { country: 'Mexico',               symbol: '$',    flag: '🇲🇽' },
  ARS: { country: 'Argentina',            symbol: '$',    flag: '🇦🇷' },
  CLP: { country: 'Chile',                symbol: '$',    flag: '🇨🇱' },
  COP: { country: 'Colombia',             symbol: '$',    flag: '🇨🇴' },
  PEN: { country: 'Peru',                 symbol: 'S/',   flag: '🇵🇪' },
  VES: { country: 'Venezuela',            symbol: 'Bs.S', flag: '🇻🇪' },
  UYU: { country: 'Uruguay',              symbol: '$U',   flag: '🇺🇾' },
  PYG: { country: 'Paraguay',             symbol: '₲',    flag: '🇵🇾' },
  BOB: { country: 'Bolivia',              symbol: 'Bs.',  flag: '🇧🇴' },
  GTQ: { country: 'Guatemala',            symbol: 'Q',    flag: '🇬🇹' },
  HNL: { country: 'Honduras',             symbol: 'L',    flag: '🇭🇳' },
  CRC: { country: 'Costa Rica',           symbol: '₡',    flag: '🇨🇷' },
  NIO: { country: 'Nicaragua',            symbol: 'C$',   flag: '🇳🇮' },
  PAB: { country: 'Panama',               symbol: 'B/.',  flag: '🇵🇦' },
  DOP: { country: 'Dominican Republic',   symbol: '$',    flag: '🇩🇴' },
  JMD: { country: 'Jamaica',              symbol: '$',    flag: '🇯🇲' },
  TTD: { country: 'Trinidad & Tobago',    symbol: '$',    flag: '🇹🇹' },
  BBD: { country: 'Barbados',             symbol: 'Bds$', flag: '🇧🇧' },
  BSD: { country: 'Bahamas',              symbol: '$',    flag: '🇧🇸' },
  BZD: { country: 'Belize',               symbol: 'BZ$',  flag: '🇧🇿' },
  GYD: { country: 'Guyana',               symbol: '$',    flag: '🇬🇾' },
  SRD: { country: 'Suriname',             symbol: '$',    flag: '🇸🇷' },
  HTG: { country: 'Haiti',                symbol: 'G',    flag: '🇭🇹' },
  CUP: { country: 'Cuba',                 symbol: '$',    flag: '🇨🇺' },
  XCD: { country: 'East Caribbean',       symbol: '$',    flag: '🌎' },
  AWG: { country: 'Aruba',                symbol: 'ƒ',    flag: '🇦🇼' },
  // Oceania
  FJD: { country: 'Fiji',                 symbol: '$',    flag: '🇫🇯' },
  PGK: { country: 'Papua New Guinea',     symbol: 'K',    flag: '🇵🇬' },
  SBD: { country: 'Solomon Islands',      symbol: '$',    flag: '🇸🇧' },
  VUV: { country: 'Vanuatu',              symbol: 'Vt',   flag: '🇻🇺' },
  WST: { country: 'Samoa',                symbol: 'T',    flag: '🇼🇸' },
  TOP: { country: 'Tonga',                symbol: 'T$',   flag: '🇹🇴' },
  XPF: { country: 'French Polynesia',     symbol: 'Fr',   flag: '🌏' },
}

// For any currency not in the table above, fall back to the currency's
// own display name (e.g. "Vietnamese Dong") rather than showing "N/A"
function getMeta(code, fallbackName) {
  return CURRENCY_META[code] || {
    country: fallbackName || code,
    symbol:  code,
    flag:    '🌐',
  }
}


export default function CurrencyInfo() {
  const location = useLocation()
  const { baseCurrency, rates, currencies, loading, error } = useFX()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(location.state?.selected ?? null)

  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(query) ||
        (CURRENCY_META[c.code]?.country || '').toLowerCase().includes(query)
    )
  }, [currencies, search])

  const handleSelect = (code) => {
    setSelected(selected === code ? null : code)
  }

  const getRate = (code) => {
    if (code === baseCurrency) return 1
    return rates[code] || null
  }

  const selectedCurrency = selected ? currencies.find((c) => c.code === selected) : null
  const selectedMeta = selected ? getMeta(selected, selectedCurrency?.name) : null
  const selectedRate = selected ? getRate(selected) : null

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">🌍 Currency Info</h1>
        <p className="text-gray-500 text-sm">
          Search and explore currencies from around the world.
          Live rates powered by ExchangeRate-API.
        </p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1">
            <label
              htmlFor="currency-search"
              className="text-sm font-medium text-navy-700"
            >
              Search Currency by Country
            </label>
            <input
              id="currency-search"
              type="search"
              placeholder="e.g. Nigerian, Dollar, GBP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
              aria-label="Search for a currency"
            />
          </div>
          {search && (
            <button
              onClick={() => {
                setSearch('')
                setSelected(null)
              }}
              className="btn-secondary text-sm px-4 py-2"
            >
              Clear
            </button>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3" aria-live="polite">
          Showing {filtered.length} of {currencies.length} currencies
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Loading / Error */}
      {loading && (
        <p className="text-center text-gray-500 py-8" aria-live="polite">
          Loading currencies...
        </p>
      )}
      {error && <ErrorBanner message={error} />}

      {/* Currency Grid — circles + side panel */}
      {!loading && !error && (
        <div className="lg:flex lg:gap-6 lg:items-start">

          {/* Detail panel — above grid on mobile, sticky right column on lg+ */}
          {selectedCurrency && (
            <div
              className="card mb-6 border-2 border-teal-400
                         lg:mb-0 lg:order-2 lg:w-72 lg:shrink-0 lg:sticky lg:top-6"
              aria-label={`Details for ${selected}`}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl" aria-hidden="true">{selectedMeta.flag}</span>
                <div>
                  <p className="font-bold text-teal-500 text-xl leading-none">
                    {selectedCurrency.code}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">{selectedMeta.country}</p>
                </div>
                <span className="ml-auto text-2xl font-bold text-gray-300">
                  {selectedMeta.symbol}
                </span>
              </div>

              {/* Detail rows */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Code</span>
                  <span className="font-semibold text-navy-700">{selectedCurrency.code}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Country</span>
                  <span className="font-semibold text-navy-700 text-right">
                    {selectedMeta.country}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Symbol</span>
                  <span className="font-semibold text-navy-700">{selectedMeta.symbol}</span>
                </div>

                {selectedRate !== null && (
                  <div className="bg-navy-50 rounded-lg px-3 py-2 text-sm mt-1">
                    <span className="text-gray-500">1 {baseCurrency} =</span>{' '}
                    <span className="font-bold text-navy-700">
                      {selectedRate === 1 ? '1.0000' : selectedRate.toFixed(4)}{' '}
                      {selectedCurrency.code}
                    </span>
                  </div>
                )}

                {selectedRate && selectedRate !== 1 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">100 {baseCurrency} =</span>
                      <span className="font-semibold text-teal-500">
                        {(selectedRate * 100).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{' '}
                        {selectedCurrency.code}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">1 {selectedCurrency.code} =</span>
                      <span className="font-semibold text-teal-500">
                        {(1 / selectedRate).toFixed(6)} {baseCurrency}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="btn-secondary text-sm px-4 py-2 mt-4 w-full"
              >
                Close ✕
              </button>
            </div>
          )}

          {/* Coin grid */}
          <div
            className={`lg:order-1 lg:flex-1 grid gap-4 justify-items-center
                        ${selectedCurrency
                          ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-4'
                          : 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6'}`}
          >
            {filtered.map((currency) => {
              const meta = getMeta(currency.code, currency.name)
              const isSelected = selected === currency.code

              return (
                <div
                  key={currency.code}
                  className={`aspect-square w-full max-w-[120px] rounded-full flex flex-col
                             items-center justify-center text-center cursor-pointer
                             transition-all duration-200 border-2 bg-white
                             ${isSelected
                               ? 'border-teal-400 scale-110 shadow-xl ring-4 ring-teal-400/20'
                               : 'border-gray-200 hover:border-teal-400 hover:scale-105 hover:shadow-md'
                             }`}
                  onClick={() => handleSelect(currency.code)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isSelected}
                  aria-label={`${currency.code} — ${meta.country}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelect(currency.code)
                  }}
                >
                  <span className="text-2xl leading-none" aria-hidden="true">
                    {meta.flag}
                  </span>
                  <p className="text-sm font-bold mt-1 leading-tight text-teal-500">
                    {currency.code}
                  </p>
                  <p className="text-xs leading-tight mt-0.5 px-2 truncate w-full text-center text-gray-500">
                    {meta.country.split(/[\s,]/)[0]}
                  </p>
                </div>
              )
            })}
          </div>

        </div>
      )}

      {/* No results */}
      {!loading && filtered.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-4" aria-hidden="true">🔍</p>
          <p className="text-gray-500">
            No currencies found matching{' '}
            <strong>"{search}"</strong>.
          </p>
          <button
            onClick={() => setSearch('')}
            className="btn-outline mt-4"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  )
}
