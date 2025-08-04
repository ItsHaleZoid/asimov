"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth/auth-code-error');
          return;
        }

        if (data.session) {
          // Successfully authenticated
          router.push('/');
        } else {
          // No session found, try to handle the URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              console.error('Session error:', sessionError);
              router.push('/auth/auth-code-error');
            } else {
              router.push('/');
            }
          } else {
            router.push('/auth/auth-code-error');
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        router.push('/auth/auth-code-error');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="text-white/70">Completing sign in...</p>
      </div>
    </div>
  );
}