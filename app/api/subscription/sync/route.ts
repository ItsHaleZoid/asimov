import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerStripe } from '@/lib/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABSE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(req: NextRequest) {
  try {
    const { customerId, force = false } = await req.json()

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      )
    }

    console.log('Manual sync requested for customer:', customerId)

    const stripe = getServerStripe()
    
    // Get customer from Stripe
    const customer = await stripe.customers.retrieve(customerId)
    
    if (!customer || customer.deleted) {
      return NextResponse.json(
        { error: 'Customer not found in Stripe' },
        { status: 404 }
      )
    }

    console.log('Found Stripe customer:', customer.email)

    // Find user by email in Supabase using admin auth
    const { data, error: userError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (userError) {
      return NextResponse.json(
        { error: `Error accessing users: ${userError.message}` },
        { status: 500 }
      )
    }

    const user = data.users.find(u => u.email === customer.email)
    
    if (!user) {
      return NextResponse.json(
        { error: `User with email ${customer.email} not found in Supabase` },
        { status: 404 }
      )
    }

    console.log('Found Supabase user:', user.id)

    // Get subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({ customer: customerId })
    
    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found for customer' },
        { status: 404 }
      )
    }

    const results = []

    for (const subscription of subscriptions.data) {
      console.log('Processing subscription:', subscription.id, subscription.status)

      // Check if already exists in database
      const { data: existing } = await supabaseAdmin
        .from('user_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscription.id)
        .single()

      if (existing && !force) {
        results.push({ 
          subscriptionId: subscription.id, 
          status: 'skipped', 
          reason: 'already exists' 
        })
        continue
      }

      // Insert or update subscription
      const { data, error } = await supabaseAdmin
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: subscription.current_period_start ? new Date(subscription.current_period_start * 1000).toISOString() : null,
          current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'stripe_subscription_id'
        })

      if (error) {
        console.error('Database error for subscription:', subscription.id, error)
        results.push({ 
          subscriptionId: subscription.id, 
          status: 'error', 
          error: error.message 
        })
      } else {
        console.log('Successfully synced subscription:', subscription.id)
        results.push({ 
          subscriptionId: subscription.id, 
          status: 'synced' 
        })
      }
    }

    return NextResponse.json({
      message: 'Sync completed',
      customer: {
        id: customerId,
        email: customer.email,
        userId: user.id
      },
      results
    })

  } catch (error) {
    console.error('Error syncing subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}