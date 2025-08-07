"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL params first
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          console.error('Auth error from URL:', errorParam, errorDescription);
          setError(errorDescription || errorParam);
          setTimeout(() => router.push('/auth/auth-code-error'), 2000);
          return;
        }

        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setTimeout(() => router.push('/auth/auth-code-error'), 2000);
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log('Authentication successful, redirecting to home...');
          router.push('/');
        } else {
          // Try to exchange code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.search);
          
          if (exchangeError) {
            console.error('Code exchange error:', exchangeError);
            setError(exchangeError.message);
            setTimeout(() => router.push('/auth/auth-code-error'), 2000);
          } else {
            // Check session again after exchange
            const { data: newSession } = await supabase.auth.getSession();
            if (newSession.session) {
              console.log('Authentication successful after code exchange, redirecting...');
              router.push('/');
            } else {
              console.error('No session found after code exchange');
              setError('Failed to establish session');
              setTimeout(() => router.push('/auth/auth-code-error'), 2000);
            }
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setTimeout(() => router.push('/auth/auth-code-error'), 2000);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="text-red-400 text-xl font-semibold">Authentication Error</div>
            <p className="text-white/70 max-w-md">{error}</p>
            <p className="text-white/50 text-sm">Redirecting to error page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white/70">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
}