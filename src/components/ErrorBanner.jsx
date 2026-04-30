export default function ErrorBanner({ message }) {
  return (
    <div
      className="rounded-xl border border-orange-200 bg-orange-50 p-4 flex gap-3 items-start"
      role="alert"
    >
      <span className="text-2xl leading-none mt-0.5" aria-hidden="true">⚠️</span>
      <div>
        <p className="font-semibold text-orange-700">Something went wrong</p>
        <p className="text-sm text-orange-600 mt-1">{message}</p>
      </div>
    </div>
  )
}
