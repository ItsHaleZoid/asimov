'use client'

import { BlurFade } from '@/components/ui/blur-fade'
import Image from 'next/image'
import Link from 'next/link'
interface SubscriptionLoadingProps {
  message?: string
}

export function SubscriptionLoading({ message = "Checking subscription status..." }: SubscriptionLoadingProps) {
  return (
    <div className="bg-black relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <BlurFade>
          <div className="flex flex-col items-center gap-6">
            {/* Loading Animation */}
            <div className="relative">
              <div className="w-16 h-16 border-2 border-white/20 rounded-full"></div>
              <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            
            {/* Loading Message */}
            <div className="text-center">
              <h2 className="text-xl font-medium text-white mb-2">
                {message}
              </h2>
              <p className="text-white/60 text-sm">
                This will only take a moment...
              </p>
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}

export function SubscriptionRequired({ returnUrl }: { returnUrl: string }) {
  return (
    <div className="bg-black relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-6">
        <BlurFade>
          <div className="max-w-md text-center space-y-6">
            <div className="w-32 mx-auto mb-6 flex items-center justify-center">
            <Image src="/logo-flat-transparent.png" alt="Logo" className=" -my-3 h-32 cursor-pointer" width={400} height={200} />
            </div>
            
            <h1 className="text-2xl font-bold text-white">
              Subscription Required
            </h1>
            
            <p className="text-white/70">
              You need an active subscription to access fine-tuning features. 
              Subscribe now to start training your models on high-performance GPUs.
            </p>
            
            <div className="space-y-3 pt-4">
              <Link
                href={`/pricing?returnUrl=${encodeURIComponent(returnUrl)}`}
                className="block w-full bg-gradient-to-r from-white to-white/90 text-black font-medium py-3 px-6 rounded-lg hover:from-white/90 hover:to-white/80 transition-colors"
              >
                View Pricing Plan
              </Link>
              
              <Link 
                href="/"
                className="block w-full text-white/70 font-medium py-3 px-6 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </BlurFade>
      </div>
    </div>
  )
}