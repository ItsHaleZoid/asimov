import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABSE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing webhook secret' },
      { status: 500 }
    )
  }

  let event

  try {
    const stripe = getServerStripe()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: Error | unknown) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : String(err))
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  console.log('Processing webhook event:', event.type)
  console.log('Event data:', JSON.stringify(event.data.object, null, 2))

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const { 
    id: subscriptionId, 
    customer: customerRaw, 
    status, 
    metadata 
  } = subscription

  // Some Stripe TypeScript definitions may not include these fields; read defensively
  const periodStart = (subscription as Stripe.Subscription & { current_period_start?: number }).current_period_start;
  const periodEnd = (subscription as Stripe.Subscription & { current_period_end?: number }).current_period_end;

  const customerId = typeof customerRaw === 'string' ? customerRaw : customerRaw.id;

  console.log('Processing subscription update:', {
    subscriptionId,
    customerId,
    status,
    metadata
  })

  const userId = metadata?.userId
  if (!userId) {
    console.error('No userId found in subscription metadata:', metadata)
    return
  }

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    })

  if (error) {
    console.error('Error updating user subscription:', error)
    throw error
  }

  console.log(`Updated subscription for user ${userId}: ${status}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error('No userId found in subscription metadata')
    return
  }

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({ 
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId)

  if (error) {
    console.error('Error marking subscription as canceled:', error)
    throw error
  }

  console.log(`Canceled subscription for user ${userId}`)
}
