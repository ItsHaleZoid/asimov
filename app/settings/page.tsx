"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Gabarito } from "next/font/google";
import { BlurFade } from '@/components/ui/blur-fade';
import Header from '@/components/Header';
import Image from 'next/image';

const gabarito = Gabarito({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [hfToken, setHfToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const handleTokenChange = (value: string) => {
    setHfToken(value);
  };

  const maskToken = (token: string) => {
    if (token.length <= 8) return token;
    return token.slice(0, 4) + '•'.repeat(token.length - 8) + token.slice(-4);
  };

  const isTokenValid = hfToken.startsWith('hf_') && hfToken.length > 20;

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Go Back Arrow */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 z-20 p-2 mt-20 ml-6 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
      >  
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> 
        </svg>
        Go Back
      </button>
        
      <Header />
      
      <div className="container mx-auto px-6 py-24 max-w-4xl relative z-10">
        
        {/* Header */}
        <BlurFade delay={0} className="mb-12">
         
           
          <h1 className={`${gabarito.className} text-4xl md:text-5xl font-bold mb-4 mt-10`}>
            Settings
          </h1>
          <p className="text-white/60 text-lg mb-4">
            Manage your account and model access settings
          </p>
        </BlurFade>

        {/* User Info Section */}
        
        <BlurFade delay={0.1} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 mb-8">
          <h2 className={`${gabarito.className} text-xl font-semibold mb-4`}>Account Information</h2>
          <div className="flex items-center gap-4">
            <img
              src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/default-avatar.png'}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
            />
            <div>
              <p className={`${gabarito.className} text-lg font-medium`}>
                {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
              </p>
              <p className="text-white/60">{user?.email}</p>
            </div>
          </div>
        </BlurFade>

        {/* HuggingFace Token Section */}
        <BlurFade delay={0.2} className="bg-white/5 backdrop-blur-md border border-white/10 p-6">
          <div className="flex items-center  mb-4">
            <div className=" flex items-center justify-center -ml-4">
              <Image src="/huggingface.png" alt="HuggingFace" width={64} height={64} />
            </div>
            <h2 className={`${gabarito.className} text-xl font-semibold`}>HuggingFace Access Token</h2>
             
          </div>

          <p className="text-white/60 mb-6">
            Add your HuggingFace token to download and use private models.
            <a
              href="https://huggingface.co/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline ml-1"
            >
              Get your token here
            </a>
          </p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showToken ? "text" : "password"}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={hfToken}
                onChange={(e) => handleTokenChange(e.target.value)}
                className={`w-full bg-black/40 border rounded-xl py-3 px-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
                  isTokenValid && hfToken ? 'border-green-500/50 focus:ring-green-500/20' :
                  hfToken && !isTokenValid ? 'border-red-500/50 focus:ring-red-500/20' :
                  'border-white/20 focus:ring-white/20'
                }`}
              />

              {hfToken && (
                <button
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showToken ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.172-3.172a4 4 0 015.656 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              )}

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isTokenValid && hfToken && (
                  <div className="text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {hfToken && !isTokenValid && (
                  <div className="text-red-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Token Status */}
            {hfToken && (
              <div className={`text-sm ${isTokenValid ? 'text-green-400' : 'text-red-400'}`}>
                {isTokenValid ? '✓ Token format appears valid' : '✗ Invalid token format (should start with hf_)'}
              </div>
            )}

            {/* Current Token Display */}
            {hfToken && !showToken && (
              <div className="text-sm text-white/60">
                Current token: {maskToken(hfToken)}
              </div>
            )}

            {/* Action Buttons - UI Only */}
            <div className="flex gap-3 pt-2">
              <button
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  hfToken
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/20 text-white/40 cursor-not-allowed'
                }`}
                disabled={!hfToken}
              >
                Save Token
              </button>

              {hfToken && (
                <button
                  onClick={() => setHfToken('')}
                  className="px-6 py-2 rounded-full font-medium border border-white/20 text-white/80 hover:text-white hover:bg-white/5 transition-all"
                >
                  Clear Token
                </button>
              )}
            </div>
          </div>

          {/* Token Info */}
          <div className="mt-6 p-4 bg-black border border-white/20 rounded-xl">
            <h3 className={`${gabarito.className} text-lg font-medium text-white mb-2`}>
              About HuggingFace Tokens
            </h3>
            <ul className="text-md text-white/70 space-y-1">
              <li>• Tokens allow access to private datasets and saving your fine-tuned models on your repo.</li>
              <li>• Your token would be stored locally in your browser and we never store it on our servers</li>
              <li>• Never share your token with others</li>
              <li>• You can revoke tokens anytime from HuggingFace settings</li>
            </ul>
          </div>
        </BlurFade>
      </div>
    </div>
  );
}