import { useState, useEffect, useCallback } from 'react'

/**
 * Generic hook for fetching data from the API.
 * Handles loading, error, and auto-refresh states.
 */
export function useApiData<T>(fetchFn: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then(setData)
      .catch((err) => setError(err.message || 'Failed to fetch data'))
      .finally(() => setLoading(false))
  }, [fetchFn, ...deps])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}
