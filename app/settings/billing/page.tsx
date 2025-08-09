"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BlurFade } from "@/components/ui/blur-fade";

export default function BillingPage() {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [lastBillingDate, setLastBillingDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [loading, user, router]);

  const fetchSubscriptionData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch('/api/subscription/status', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription data');
      }
      
      const data = await response.json();
      setSubscriptionStatus(data.status || 'No subscription');
      setLastBillingDate(data.lastBillingDate || 'Not available');
    } catch (err) {
      console.error('Error fetching subscription:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSubscriptionStatus('Error loading');
      setLastBillingDate('Error loading');
    } finally {
      setIsLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (!loading && user) {
      fetchSubscriptionData();
    }
  }, [loading, user, fetchSubscriptionData]);

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    setError(null);
    
    try {
      if (!session?.access_token) {
        throw new Error('No valid session');
      }

      const response = await fetch('/api/stripe/customer-portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.details 
          ? `${errorData.error}: ${errorData.details}`
          : errorData.error || 'Failed to create portal session';
        throw new Error(errorMessage);
      }
      
      const { url } = await response.json();
      
      // Redirect to Stripe customer portal
      window.location.href = url;
    } catch (err) {
      console.error('Error creating portal session:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="bg-white/2 backdrop-blur-md border border-white/10 p-6">
      <div className="mb-6">
        <BlurFade>
          <h2 className="text-xl font-semibold">Subscription & Billing</h2>
          <p className="text-white/60">Manage your subscription status.</p>
        </BlurFade>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <BlurFade delay={0.05}>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-sm font-medium text-white/80 mb-3">Subscription Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60 w-20">Status:</span>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse"></div>
                      <div className="h-4 w-16 bg-white/20 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <div className={`w-2 h-2 rounded-full ${
                        subscriptionStatus === 'active' ? 'bg-green-400' : 
                        subscriptionStatus === 'No subscription' ? 'bg-gray-400' : 
                        'bg-red-400'
                      }`}></div>
                      <span className="text-white">{subscriptionStatus}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60 w-20">Last billed:</span>
                {isLoading ? (
                  <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                ) : (
                  <span className="text-white">{lastBillingDate}</span>
                )}
              </div>
            </div>
          </div>
        </BlurFade>
        
        {subscriptionStatus === 'active' && (
          <BlurFade delay={0.1}>
            <Button 
              variant="outline" 
              className="w-fit" 
              onClick={handleCancelSubscription}
              disabled={isLoading || cancelLoading}
            >
              {cancelLoading ? 'Opening Portal...' : 'Manage Subscription'}
            </Button>
          </BlurFade>
        )}
      </div>
    </div>
  );
}
