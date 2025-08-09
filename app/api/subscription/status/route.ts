import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerStripe } from '@/lib/stripe'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABSE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function GET(req: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    
    // Verify the user session
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Look up user subscription
    const { data: subscription, error: subscriptionError } = await supabaseAdmin
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Database error:', subscriptionError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    // If no subscription found in database
    if (!subscription) {
      return NextResponse.json({
        status: 'No subscription',
        lastBillingDate: 'Not available'
      })
    }

    // Fetch latest data from Stripe
    const stripe = getServerStripe()
    
    try {
      const stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripe_subscription_id
      )

      // Get the latest invoice to find last billing date
      let lastBillingDate = 'Not available'
      
      if (stripeSubscription.latest_invoice) {
        const invoice = await stripe.invoices.retrieve(
          stripeSubscription.latest_invoice as string
        )
        
        if (invoice.created) {
          lastBillingDate = new Date(invoice.created * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
          })
        }
      }

      // Update local database with latest status
      await supabaseAdmin
        .from('user_subscriptions')
        .update({
          status: stripeSubscription.status,
          // @ts-expect-error - Stripe timestamps are numbers but TS shows them as potentially undefined
          current_period_start: new Date(stripeSubscription.current_period_start   * 1000).toISOString(),
          // @ts-expect-error - Stripe timestamps are numbers but TS shows them as potentially undefined
          current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', subscription.id)

      return NextResponse.json({
        status: stripeSubscription.status,
        lastBillingDate
      })

    } catch (stripeError: unknown) {
      console.error('Stripe API error:', stripeError)
      
      // Fall back to database data if Stripe API fails
      return NextResponse.json({
        status: subscription.status || 'Unknown',
        lastBillingDate: subscription.current_period_start 
          ? new Date(subscription.current_period_start).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : 'Not available'
      })
    }

  } catch (error) {
    console.error('Error fetching subscription status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}