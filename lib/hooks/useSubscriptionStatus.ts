import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'

interface SubscriptionStatus {
  isSubscribed: boolean
  isLoading: boolean
  error: string | null
  status: string | null
  lastBillingDate: string | null
  refetch: () => Promise<void>
}

let cachedData: {
  isSubscribed: boolean
  status: string | null
  lastBillingDate: string | null
  timestamp: number
} | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useSubscriptionStatus(): SubscriptionStatus {
  const { user, session, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [lastBillingDate, setLastBillingDate] = useState<string | null>(null)

  const fetchSubscriptionStatus = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Check if we have valid cached data
      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        setIsSubscribed(cachedData.isSubscribed)
        setStatus(cachedData.status)
        setLastBillingDate(cachedData.lastBillingDate)
        setIsLoading(false)
        return
      }

      if (!session?.access_token) {
        throw new Error('No valid session')
      }

      const response = await fetch('/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }

      const data = await response.json()
      const subscribed = data.status === 'active'
      
      // Update state
      setIsSubscribed(subscribed)
      setStatus(data.status)
      setLastBillingDate(data.lastBillingDate)

      // Cache the result
      cachedData = {
        isSubscribed: subscribed,
        status: data.status,
        lastBillingDate: data.lastBillingDate,
        timestamp: Date.now()
      }

    } catch (err: any) {
      console.error('Error fetching subscription status:', err)
      setError(err.message)
      setIsSubscribed(false)
      setStatus('error')
      setLastBillingDate(null)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    if (!authLoading && user) {
      fetchSubscriptionStatus()
    } else if (!authLoading && !user) {
      // User not authenticated, definitely not subscribed
      setIsSubscribed(false)
      setStatus('not_authenticated')
      setLastBillingDate(null)
      setIsLoading(false)
    }
  }, [authLoading, user, fetchSubscriptionStatus])

  return {
    isSubscribed,
    isLoading,
    error,
    status,
    lastBillingDate,
    refetch: fetchSubscriptionStatus
  }
}

// Utility function to invalidate cache
export function invalidateSubscriptionCache() {
  cachedData = null
}