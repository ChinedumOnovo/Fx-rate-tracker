import { useFX } from '../context/FXContext'

export default function CurrencySelector({
  value,
  onChange,
  label,
  id,
  excludeCurrency = null,
}) {
  const { currencies } = useFX()

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-navy-700"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        aria-label={label || 'Select currency'}
      >
        {currencies
          .filter((c) => c.code !== excludeCurrency)
          .map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
      </select>
    </div>
  )
}
