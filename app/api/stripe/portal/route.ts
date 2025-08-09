import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'

// In a real app, you would look up the Stripe customer ID by the authenticated user
// For now, we try to infer from the latest subscription checkout session or expect STRIPE_TEST_CUSTOMER_ID
export async function POST(req: NextRequest) {
  try {
    const stripe = getServerStripe()

    // Try to accept a provided customerId (future extension)
    const { customerId } = await req.json().catch(() => ({ customerId: null }))

    let customer: string | null = customerId || null

    if (!customer) {
      const fallbackCustomer = process.env.STRIPE_TEST_CUSTOMER_ID
      if (!fallbackCustomer) {
        return NextResponse.json(
          { error: 'No Stripe customer available. Configure STRIPE_TEST_CUSTOMER_ID or pass customerId.' },
          { status: 400 }
        )
      }
      customer = fallbackCustomer
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${req.nextUrl.origin}/settings/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
