'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Something went wrong!</h2>
        <div className="bg-white p-4 rounded-xl border border-red-100 overflow-x-auto text-sm text-red-900 font-mono mb-4">
          <p><strong>Message:</strong> {error.message}</p>
          {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
          {error.stack && (
            <pre className="mt-4 pt-4 border-t border-red-100 whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
        </div>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
