"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/ui/blur-fade";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

interface SignInPageProps {
  className?: string;
}

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"auth" | "success">("auth");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Email/Password Sign In
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        setError(error.message);
      } else {
        setStep("success");
        setTimeout(() => router.push('/'), 2000);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        console.error('Error signing in with Google:', error.message);
        alert('Error signing in with Google. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError("");
    setStep("auth");
  };

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

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
    {/* Top lighting effects - subtle warm glow */}
    <div className="absolute top-0 left-0 w-full h-full rotate-180">
      <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#451cff] via-[#000000] to-transparent blur-3xl" 
         style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
      <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#ac99ff] via-amber-50/4 to-transparent blur-[80px] rounded-full"
         style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
      <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#2c00c7] via-transparent to-transparent blur-[500px] rounded-full -z-10"
         style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
    </div>
   
      <div className={cn("flex w-[100%] flex-col min-h-screen relative bg-white/2 backdrop-blur-sm", className)}>
        <div className="absolute inset-0 z-0">
        </div>
        
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Main content container */}
          <div className="flex flex-1 flex-col lg:flex-row ">
            {/* Left side (form) */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="">
                {step === "auth" ? (
                  <div className="space-y-6 text-center">
                    <BlurFade delay={0.1} inView>
                      <div className="space-y-1">
                        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                          Welcome Back!
                        </h1>
                        <p className="text-[1.2rem] text-white/70 font-light">
                          Sign in to your account
                        </p>
                      </div>
                    </BlurFade>

                    <div className="space-y-4">
                      <BlurFade delay={0.2} inView>
                        <button 
                          onClick={handleGoogleSignIn}
                          disabled={loading}
                          className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <span className="text-lg">G</span>
                          <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                        </button>
                      </BlurFade>
                      
                      <BlurFade delay={0.3} inView>
                        <div className="flex items-center gap-4">
                          <div className="h-px bg-white/10 flex-1" />
                          <span className="text-white/40 text-sm">or</span>
                          <div className="h-px bg-white/10 flex-1" />
                        </div>
                      </BlurFade>
                      
                      <BlurFade delay={0.4} inView>
                        <form onSubmit={handleAuthSubmit} className="space-y-3">
                          <input 
                            type="email" 
                            placeholder="info@gmail.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError("");
                            }}
                            className="w-full backdrop-blur-[1px] text-white border border-white/30 rounded-full py-3 px-4 focus:outline-none focus:border-white/50 text-center"
                            required
                            disabled={loading}
                          />
                          
                          <input 
                            type="password" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setError("");
                            }}
                            className="w-full backdrop-blur-[1px] text-white border border-white/30 rounded-full py-3 px-4 focus:outline-none focus:border-white/50 text-center"
                            required
                            disabled={loading}
                            autoComplete="new-password"
                          />
                          
                          <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-medium py-3 px-4 rounded-full hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Processing...' : "Sign In"}
                          </button>
                        </form>
                        
                        {error && (
                          <div className={`mt-4 p-3 rounded-lg ${
                            error.includes('confirmation email sent') 
                              ? 'bg-green-500/10 border border-green-400/20' 
                              : 'bg-red-500/10 border border-red-400/20'
                          }`}>
                            <p className={`text-sm text-center ${
                              error.includes('confirmation email sent') 
                                ? 'text-green-300' 
                                : 'text-red-300'
                            }`}>
                              {error}
                            </p>
                          </div>
                        )}

                        {/* Link to sign up */}
                        <div className="mt-6 text-center">
                          <p className="text-white/60 text-sm">
                            Don't have an account?{' '}
                            <Link href="/get-started" className="text-white underline hover:text-white/80 transition-colors">
                              Sign up here
                            </Link>
                          </p>
                        </div>
                      </BlurFade>
                    </div>
                    
                    <BlurFade delay={0.5} inView>
                                              <p className="text-xs text-white/80 pt-10">
                        By signing in, you agree to the{' '}
                        <Link href="#" className="underline text-white/60 hover:text-white/60 transition-colors">
                          Terms of Service
                        </Link>{', '}
                        <Link href="#" className="underline text-white/60 hover:text-white/60 transition-colors">
                          Privacy Policy
                        </Link>.
                      </p>
                    </BlurFade>
                  </div>

                ) : (
                  <div className="space-y-6 text-center">
                    <BlurFade delay={0.1} inView>
                      <div className="space-y-1">
                        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                          You're in!
                        </h1>
                        <p className="text-[1.25rem] text-white/50 font-light">
                          Welcome back
                        </p>
                      </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.2} inView>
                      <div className="py-10">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-white to-white/70 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.3} inView>
                      <button 
                        onClick={() => router.push('/')}
                        className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors"
                      >
                        Continue to Dashboard
                      </button>
                    </BlurFade>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default SignInPage;
