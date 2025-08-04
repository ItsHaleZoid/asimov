"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { SignOutConfirmation } from '@/components/ui/sign-out-confirmation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  showSignOutConfirmation: boolean;
  setShowSignOutConfirmation: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  showSignOutConfirmation: false,
  setShowSignOutConfirmation: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    showSignOutConfirmation,
    setShowSignOutConfirmation,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SignOutConfirmation
        isOpen={showSignOutConfirmation}
        onConfirm={() => {
          signOut();
          setShowSignOutConfirmation(false);
        }}
        onCancel={() => setShowSignOutConfirmation(false)}
        user={user}
      />
    </AuthContext.Provider>
  );
};