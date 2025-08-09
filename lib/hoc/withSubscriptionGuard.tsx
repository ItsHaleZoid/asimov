'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSubscriptionStatus } from '@/lib/hooks/useSubscriptionStatus'
import { SubscriptionLoading, SubscriptionRequired } from '@/components/ui/subscription-loading'

interface WithSubscriptionGuardOptions {
  redirectTo?: string
  loadingMessage?: string
}

export function withSubscriptionGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithSubscriptionGuardOptions = {}
) {
  const {
    redirectTo = '/pricing',
    loadingMessage = "Checking subscription status..."
  } = options

  return function SubscriptionGuardedComponent(props: P) {
    const { isSubscribed, isLoading, error } = useSubscriptionStatus()
    const pathname = usePathname()
    const router = useRouter()

    // Show loading while checking subscription status
    if (isLoading) {
      return <SubscriptionLoading message={loadingMessage} />
    }

    // Handle subscription check errors
    if (error && !isSubscribed) {
      console.error('Subscription check failed:', error)
      // On error, redirect to pricing as a safe default
      const returnUrl = encodeURIComponent(pathname)
      router.push(`${redirectTo}?returnUrl=${returnUrl}`)
      return <SubscriptionLoading message="Redirecting to pricing..." />
    }

    // User is not subscribed - show subscription required page
    if (!isSubscribed) {
      return <SubscriptionRequired returnUrl={pathname} />
    }

    // User is subscribed - render the protected component
    return <WrappedComponent {...props} />
  }
}

// Helper function for easier usage
export const requireSubscription = withSubscriptionGuard