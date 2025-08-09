'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { Readex_Pro } from "next/font/google";
import Header from '@/components/Header'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getStripe } from '@/lib/stripe'
import { useSubscriptionStatus } from '@/lib/hooks/useSubscriptionStatus'

const readexPro = Readex_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function PricingInner() {
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const returnUrl = searchParams?.get('returnUrl')
    const { isSubscribed, isLoading: subscriptionLoading } = useSubscriptionStatus()

    const handleButtonClick = async () => {
        // If user is subscribed, redirect to billing page
        if (isSubscribed) {
            router.push('/settings/billing')
            return
        }

        // Otherwise proceed with checkout
        handleCheckout()
    }

    const handleCheckout = async () => {
        setLoading(true)
        
        try {
            const checkoutResponse = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id || null,
                    userEmail: user?.email || null,
                    returnUrl: returnUrl || null,
                }),
            })
            
            if (!checkoutResponse.ok) {
                const errorData = await checkoutResponse.json()
                throw new Error(errorData.error || 'Failed to create checkout session')
            }
            
            const { sessionId } = await checkoutResponse.json()
            
            if (!sessionId) {
                throw new Error('No session ID returned from checkout API')
            }
            
            // Redirect to Stripe Checkout
            const stripe = await getStripe()
            if (!stripe) {
                throw new Error('Stripe failed to load')
            }
            
            await stripe.redirectToCheckout({ sessionId })
        } catch (error) {
            console.error('Checkout error:', error)
            alert(`Something went wrong: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
        } finally {
            setLoading(false)
        }
    }

    return (
      <div className="bg-black min-h-screen flex flex-col relative overflow-hidden" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '0rem' }}>
        
        
        
            {/* Top lighting effects - subtle warm glow */}
            <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-38 blur-[100px]">
                <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#fff1d6] via-[#000000] to-transparent blur-3xl" 
                   style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
                <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ff7e29] via-amber-50/4 to-transparent blur-[80px] rounded-full"
                   style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
                <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ff7700] via-transparent to-transparent blur-[500px] rounded-full -z-10"
                   style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
            </div>
            
            <div className="relative z-10">
                <Header />
                
                <section className={`py-16 md:py-32 ${readexPro.className}`}>
                  
                    <div className="mx-auto max-w-5xl px-6 mt-10">
                        <div className="mx-auto max-w-2xl space-y-6 text-center">
                            <h1 className="text-center text-4xl lg:text-5xl tracking-tight bg-gradient-to-b from-white via-gray-200 to-[#88809a] bg-clip-text text-transparent leading-tight">Pricing that suits your needs</h1>
                            <p className="tracking-tight -mb-6">We offer a flexible pricing to finetune your models on GPUs for every type of users, carefully tailored to their needs</p>
                        </div>

                        <div className="mt-8 flex justify-center md:mt-20">
                            <div className="max-w-160 w-full flex flex-col justify-between space-y-8 border p-6 lg:p-10 bg-gradient-to-b from-black via-black/50 to-[#ff7328]/10">
                                <div className="space-y-4">
                                  
                                    <div>
                                      
                                        <h2 className="font-medium">All-in-one</h2>
                                        <span className="my-3 block text-2xl font-semibold">$30/month</span>
                                        <p className="text-muted-foreground text-sm">Per 12 GPU hours</p>
                                    </div>
                                    

                                    <Button
                                        onClick={handleButtonClick}
                                        disabled={loading || subscriptionLoading}
                                        variant="default"
                                        className="w-full bg-gradient-to-b from-white to-white/80 text-black rounded-none">
                                        {loading ? 'Processing...' : 
                                         subscriptionLoading ? 'Checking...' :
                                         isSubscribed ? 'Currently Selected' : 'Get Started'}
                                    </Button>

                                    <hr className="border-dashed" />

                                    <ul className="list-outside space-y-3 text-sm">
                                        {['High-performance GPU access', 'Access to all available models', 'Priority support', 'Custom Datasets', ].map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2">
                                                <Check className="size-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                               
                            </div>
                            
                            
                        </div>
                        
                        
                    </div>
                     
                    
                </section>
            </div>
            
        </div>
        
    )
}

export default function Pricing() {
    return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}> 
        <PricingInner />
      </Suspense>
    )
}
