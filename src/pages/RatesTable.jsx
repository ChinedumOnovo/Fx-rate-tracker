import { useState, useMemo } from 'react'
import { useFX } from '../context/FXContext'
import CurrencySelector from '../components/CurrencySelector'
import ErrorBanner from '../components/ErrorBanner'

function SortIcon({ col, sortConfig }) {
  if (sortConfig.key !== col) return <span className="text-gray-100 ml-1">↕</span>
  return (
    <span className="text-teal-400 ml-1">
      {sortConfig.direction === 'asc' ? '↑' : '↓'}
    </span>
  )
}

export default function RatesTable() {
  const { baseCurrency, setBaseCurrency, rates, currencies, loading, error } = useFX()
  const [search, setSearch] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'code', direction: 'asc' })

  // Build table rows from rates object
  const tableData = useMemo(() => {
    return Object.entries(rates).map(([code, rate]) => ({
      code,
      name: currencies.find((c) => c.code === code)?.name ?? code,
      rate,
    }))
  }, [rates, currencies])

  // Apply search filter
  const filtered = useMemo(() => {
    const query = search.toLowerCase()
    return tableData.filter(
      (row) =>
        row.code.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query)
    )
  }, [tableData, search])

  // Apply sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortConfig.key]
      let bVal = b[sortConfig.key]
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filtered, sortConfig])

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Exchange Rates</h1>
        <p className="text-gray-500 text-sm">
          Live rates powered by ExchangeRate-API.
          Rates are updated daily and are indicative only.
        </p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex flex-col gap-1 flex-1">
            <label
              htmlFor="search-currency"
              className="text-sm font-medium text-navy-700"
            >
              Search Currency
            </label>
            <input
              id="search-currency"
              type="search"
              placeholder="e.g. Dollar, EUR, Nigerian..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Base Currency */}
          <div className="w-full sm:w-64">
            <CurrencySelector
              id="base-currency"
              label="Base Currency"
              value={baseCurrency}
              onChange={setBaseCurrency}
            />
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSearch('')
              setSortConfig({ key: 'code', direction: 'asc' })
            }}
            className="btn-secondary text-sm px-4 py-2"
            aria-label="Reset filters"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Status */}
      {loading && (
        <p className="text-center text-gray-500 py-8" aria-live="polite">
          Loading rates...
        </p>
      )}

      {error && <ErrorBanner message={error} />}

      {/* Results count */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-3" aria-live="polite">
          Showing {sorted.length} of {tableData.length} currencies
          {search && ` matching "${search}"`}
        </p>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="card overflow-x-auto p-0">
          <table
            className="w-full text-sm"
            aria-label={`Exchange rates with base currency ${baseCurrency}`}
          >
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th scope="col"
                  className="px-6 py-4 text-left font-semibold cursor-pointer
                             hover:text-teal-400 transition-colors"
                  onClick={() => handleSort('code')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (e.key === ' ') e.preventDefault()
                      handleSort('code')
                    }
                  }}
                  tabIndex={0}
                  aria-sort={
                    sortConfig.key === 'code'
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  Code <SortIcon col="code" sortConfig={sortConfig} />
                </th>
                <th scope="col"
                  className="px-6 py-4 text-left font-semibold cursor-pointer
                             hover:text-teal-400 transition-colors"
                  onClick={() => handleSort('name')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (e.key === ' ') e.preventDefault()
                      handleSort('name')
                    }
                  }}
                  tabIndex={0}
                  aria-sort={
                    sortConfig.key === 'name'
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  Currency <SortIcon col="name" sortConfig={sortConfig} />
                </th>
                <th scope="col"
                  className="px-6 py-4 text-right font-semibold cursor-pointer
                             hover:text-teal-400 transition-colors"
                  onClick={() => handleSort('rate')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      if (e.key === ' ') e.preventDefault()
                      handleSort('rate')
                    }
                  }}
                  tabIndex={0}
                  aria-sort={
                    sortConfig.key === 'rate'
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : 'none'
                  }
                >
                  Rate (1 {baseCurrency} =) <SortIcon col="rate" sortConfig={sortConfig} />
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-600"
                  >
                    No currencies found matching your search.
                  </td>
                </tr>
              ) : (
                sorted.map((row, index) => (
                  <tr
                    key={row.code}
                    className={`border-b border-gray-100 hover:bg-navy-50
                                transition-colors duration-150
                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 font-bold text-teal-500">
                      {row.code}
                    </td>
                    <td className="px-6 py-4 text-navy-700">
                      {row.name}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold
                                   text-navy-700">
                      {row.rate.toFixed(4)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}