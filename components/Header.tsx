"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Gabarito, Geist, Space_Grotesk, Inter } from "next/font/google";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import { useAuth } from "@/lib/auth-context";


interface HeaderProps {
  className?: string;
}

const geist = Geist({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const gabarito = Gabarito({
  weight: ["400"],
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Profile dropdown component
function ProfileDropdown({ user }: { user: any }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { setShowSignOutConfirmation } = useAuth();
  
  return (
    <div className="relative mr-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors px-4"
      >
        <img
          src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/default-avatar.png'}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className={`${gabarito.className} text-white text-sm font-medium hidden sm:block`}>
          {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
        </span>
        <svg
          className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50 justify-center items-center">
          <div className="p-3 border-b border-white/10">
            <p className={`${gabarito.className} text-white text-sm font-medium`}>
              {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
            </p>
            <p className="text-white/60 text-xs">{user?.email}</p>
          </div>
          <button
            onClick={() => router.push('/settings')}
            className={`${gabarito.className} w-full text-left px-3 py-2 text-white hover:text-white hover:bg-white/5 transition-colors text-sm`}
          >
            Settings
          </button>
          <button
            onClick={() => {
              setShowSignOutConfirmation(true);
              setIsOpen(false);
            }}
            className={`${gabarito.className} w-full text-left px-3 py-2 text-red-500 hover:text-white hover:bg-white/5 transition-colors text-sm`}
          >
            Sign Out
          </button>
        </div>
      )}
      
    </div>
  );
}

// Auth buttons component
function AuthButtons() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
      </div>
    );
  }
  
  if (user) {
    return <ProfileDropdown user={user} />;
  }
  
  return (
    <>
      <button 
        className={`${gabarito.className} hidden sm:block px-4 py-2 text-white/80 hover:text-white transition-colors duration-200 font-medium`} 
        onClick={() => router.push('/signin')}
      >
        Sign In
      </button>
      
      <LiquidButton
        className={`${gabarito.className} px-6 py-2 font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg`}
        size="xl"
        onClick={() => router.push('/get-started')}
        rounded="full"
        style={{
          background: "linear-gradient(135deg, #000dff 0%, #6600ff 100%)",
          color: "white",
        }}
      >
        Get Started
      </LiquidButton>
    </>
  );
}

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  return (
    <header className={`fixed  left-0 right-0 w-full z-500 backdrop-blur-sm border-b border-white/25 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 md:px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          
          <img src="/logo-flat-transparent.png" alt="Logo" className="h-19 -my-3 w-auto cursor-pointer" onClick={() => router.push('/')} />
        
          
        </div>

      

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 ml-21">
          <a 
            href="#" 
            className={`${gabarito.className} text-white/80 hover:text-white transition-colors duration-200 font-medium text-center`}
          >
            Models
          </a>
          <a 
            href="#" 
            className={`${gabarito.className} text-white/80 hover:text-white transition-colors duration-200 font-medium text-center`}
          >
            Pricing
          </a>
          <a 
            href="#" 
            className={`${gabarito.className} text-white/80 hover:text-white transition-colors duration-200 font-medium text-center`}
          >
            How to use it
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <AuthButtons />
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2 text-white/80 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
