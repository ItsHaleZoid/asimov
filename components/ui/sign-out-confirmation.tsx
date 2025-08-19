"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gabarito } from "next/font/google";
import Image from "next/image";

const gabarito = Gabarito({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

interface SignOutConfirmationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  user: any;
  className?: string;
}

export function SignOutConfirmation({ isOpen, onConfirm, onCancel, user, className }: SignOutConfirmationProps) {

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center modal-overlay ${className}`}
          data-modal="true"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/70 will-change-transform transform-gpu backdrop-blur-[4px]"
            onClick={onCancel}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative bg-black/90 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl modal-content will-change-transform transform-gpu"
          >
            {/* User Info */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <Image
                  src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/default-avatar.png'}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover mx-auto border-2 border-white/20"
                />
              </div>
              <h2 className={`${gabarito.className} text-xl font-semibold text-white mb-2`}>
                Sign out of your account?
              </h2>
              <p className="text-white/60 text-sm">
                You're currently signed in as{' '}
                <span className="text-white font-medium">
                  {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                </span>
              </p>
              <p className="text-white/40 text-xs mt-1">{user?.email}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className={`${gabarito.className} flex-1 px-4 py-3 rounded-full border border-white/20 text-white/80 hover:text-white hover:bg-white/5 transition-all duration-150 font-medium`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`${gabarito.className} flex-1 px-4 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-150 font-medium`}
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}