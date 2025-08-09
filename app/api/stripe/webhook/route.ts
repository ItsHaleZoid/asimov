import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerStripe } from '@/lib/stripe'

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
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
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

async function handleSubscriptionUpdate(subscription: any) {
  const { 
    id: subscriptionId, 
    customer: customerId, 
    status, 
    current_period_start, 
    current_period_end,
    metadata 
  } = subscription

  console.log('Processing subscription update:', {
    subscriptionId,
    customerId,
    status,
    metadata
  })

  const userId = metadata?.userId
  if (!userId) {
    console.error('No userId found in subscription metadata:', metadata)
    
    // Try to find user by customer email if available
    // This is a fallback approach
    console.log('Attempting to find user by customer ID in Stripe...')
    
    try {
      const stripe = getServerStripe()
      const customer = await stripe.customers.retrieve(customerId)
      
      if (customer && !customer.deleted && customer.email) {
        console.log('Found customer email:', customer.email)
        
        // Look up user by email in Supabase
        const { data: user, error } = await supabaseAdmin.auth.admin.getUserByEmail(customer.email)
        
        if (user && user.user) {
          console.log('Found user by email:', user.user.id)
          return handleSubscriptionUpdate({
            ...subscription,
            metadata: { ...metadata, userId: user.user.id }
          })
        } else {
          console.error('Could not find user by email:', customer.email, error)
        }
      }
    } catch (err) {
      console.error('Error looking up customer:', err)
    }
    
    return
  }

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status,
      current_period_start: current_period_start ? new Date(current_period_start * 1000).toISOString() : null,
      current_period_end: current_period_end ? new Date(current_period_end * 1000).toISOString() : null,
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

async function handleSubscriptionDeleted(subscription: any) {
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