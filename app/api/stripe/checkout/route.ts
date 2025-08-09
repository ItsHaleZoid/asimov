import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export async function POST(req: NextRequest) {
  try {
    const { userId, userEmail, returnUrl } = await req.json()
    
    const priceId = process.env.STRIPE_PRICE_ID
    if (!priceId) {
      return NextResponse.json(
        { error: 'Stripe price ID not configured' },
        { status: 500 }
      )
    }

    const successUrl = returnUrl 
      ? `${req.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&returnUrl=${encodeURIComponent(returnUrl)}`
      : `${req.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: returnUrl ? `${req.nextUrl.origin}/pricing?returnUrl=${encodeURIComponent(returnUrl)}` : `${req.nextUrl.origin}/pricing`,
      metadata: {
        userId: userId || '',
        returnUrl: returnUrl || '',
      },
      subscription_data: {
        metadata: {
          userId: userId || '',
          returnUrl: returnUrl || '',
        },
      },
    }

    // Only add customer_email if userEmail is provided and not empty
    if (userEmail && userEmail.trim() !== '') {
      sessionConfig.customer_email = userEmail
    }

    const session = await getServerStripe().checkout.sessions.create(sessionConfig)

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}