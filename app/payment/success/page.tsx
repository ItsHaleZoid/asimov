'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Header from '@/components/Header'
import { invalidateSubscriptionCache } from '@/lib/hooks/useSubscriptionStatus'

function PaymentSuccessInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const returnUrl = searchParams.get('returnUrl')
  const [loading, setLoading] = useState(true)
  const [redirectCountdown, setRedirectCountdown] = useState(5)

  useEffect(() => {
    // Invalidate subscription cache so the app refetches the new status
    invalidateSubscriptionCache()
    
    if (sessionId) {
      fetch(`/api/stripe/session/${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching session:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [sessionId])

  // Auto-redirect to returnUrl if provided
  useEffect(() => {
    if (returnUrl && !loading && redirectCountdown > 0) {
      const timer = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push(returnUrl)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [returnUrl, loading, redirectCountdown, router])

  return (
    <div className="bg-black min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-38 blur-[100px]">
        <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#fff1d6] via-[#000000] to-transparent blur-3xl" 
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
        <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ff7e29] via-amber-50/4 to-transparent blur-[80px] rounded-full"
           style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
      </div>
      
      <div className="relative z-10">
        <Header />
        
        <section className="py-16 md:py-32">
          <div className="mx-auto max-w-2xl px-6 text-center mt-30">
            <div className="mb-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white">
                <Check className="h-8 w-8 text-black" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Payment Successful!
              </h1>
              <p className="text-gray-400 text-lg">
                Now you can start fine-tuning your models.
              </p>
              {returnUrl && redirectCountdown > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Redirecting you back in {redirectCountdown} seconds...
                </p>
              )}
            </div>

           

            <div className="space-y-4">
              {returnUrl ? (
                <>
                  <Button 
                    onClick={() => router.push(returnUrl)} 
                    className="w-full bg-gradient-to-b from-white to-white/80 text-black"
                  >
                    Continue to Fine-Tuning
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-none ">
                    <Link href="/settings/billing">View Subscription</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild className="w-full bg-gradient-to-b from-white to-white/80 text-black rounded-none">
                    <Link href="/fine-tune/flux-family">Start Fine-Tuning</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full rounded-none">
                    <Link href="/settings/billing">View Subscription</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" /> }>
      <PaymentSuccessInner />
    </Suspense>
  )
}
