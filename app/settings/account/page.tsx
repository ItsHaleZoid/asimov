"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Gabarito } from "next/font/google";
import { BlurFade } from '@/components/ui/blur-fade';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const gabarito = Gabarito({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export default function AccountSettingsPage() {
  const { user, loading: authLoading, signOut } = useAuth();

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="relative z-10">
      {/* User Info Section */}
      <BlurFade delay={0} className="bg-white/2 backdrop-blur-md border border-white/10 p-6 mb-8">
        <h2 className={`${gabarito.className} text-xl font-semibold mb-4`}>Account Information</h2>
        <div className="flex items-center gap-4">
          <Image
            src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/default-avatar.png'}
            alt="Profile"
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
          />
          <div>
            <p className={`${gabarito.className} text-lg font-medium`}>
              {user?.user_metadata?.full_name || user?.user_metadata?.name || 'User'}
            </p>
            <p className="text-white/60">{user?.email}</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <Button
            className={`${gabarito.className} font-medium transition-all duration-200 hover:scale-95 rounded-full`}
            size="lg"
            variant="destructive"
            onClick={handleLogout}
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
              color: "white",
            }}
          >
            Sign Out
          </Button>
        </div>
      </BlurFade>
    </div>
  );
}
