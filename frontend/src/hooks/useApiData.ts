import { useState, useEffect, useCallback } from 'react'

/**
 * Generic hook for fetching data from the API.
 * Handles loading, error, and auto-refresh states.
 */
export function useApiData<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isRetryableError = (message: string) =>
    /Could not reach backend|API error:\s5\d\d/i.test(message)

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)

    const attemptFetch = async () => {
      const retryDelays = [800, 1800]

      for (let attempt = 0; attempt <= retryDelays.length; attempt += 1) {
        try {
          const result = await fetchFn()
          setData(result)
          return
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to fetch data'
          const shouldRetry = attempt < retryDelays.length && isRetryableError(message)

          if (!shouldRetry) {
            setError(message)
            return
          }

          await wait(retryDelays[attempt])
        }
      }
    }

    attemptFetch()
      .finally(() => setLoading(false))
  }, [fetchFn, ...deps])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}
