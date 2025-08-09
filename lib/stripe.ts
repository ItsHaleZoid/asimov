import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
let stripe: Stripe | null = null

export const getServerStripe = () => {
  if (!stripe) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is required')
    }
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-07-30.basil',
      typescript: true,
    })
  }
  return stripe
}

// Client-side Stripe instance
export const getStripe = () => {
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripePublishableKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required')
  }
  return loadStripe(stripePublishableKey)
}