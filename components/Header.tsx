"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Gabarito, Space_Grotesk } from "next/font/google";
import { LiquidButton } from "@/components/ui/liquid-glass-button";

interface HeaderProps {
  className?: string;
}

const gabarito = Gabarito({
  weight: ["400"],
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Header({ className }: HeaderProps) {
  const router = useRouter();
  return (
    <header className={`fixed  left-0 right-0 w-full z-500 backdrop-blur-sm border-b border-white/25 bg-gradient-to-b from-[#451cff]/30 via-violet-700/0 to-black/9 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4 md:px-8 lg:px-12">
        {/* Logo */}
        <div className="flex items-center">
          <img src="/logo-flat-transparent.png" alt="Logo" className="h-20 w-auto absolute" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center justify-center space-x-8 ml-18">
          <a 
            href="#" 
            className={`${gabarito.className} text-white/80 hover:text-white transition-colors duration-200 font-medium text-center`}
          >
            Gallery
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
            About
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button className={`${gabarito.className} hidden sm:block px-4 py-2 text-white/80 hover:text-white transition-colors duration-200 font-medium`} onClick={() => router.push('/signin')}>
            Sign In
          </button>
          <div className="overflow-hidden rounded-full">
            <LiquidButton
              className={`${gabarito.className} px-6 py-2 rounded-100px font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              size="xl"
              style={{
                background: "linear-gradient(135deg, #000dff 0%, #6600ff 100%)",
                color: "white",
                borderRadius: "100px"
              }}
             
            >
              Get Started
            </LiquidButton>
          </div>
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
