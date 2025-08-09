import { NextRequest, NextResponse } from 'next/server'
import { getServerStripe } from '@/lib/stripe'

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    const session = await getServerStripe().checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      customer_email: session.customer_email,
      metadata: session.metadata
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    )
  }
}