"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BsGoogle } from "react-icons/bs";
import { BlurFade } from "@/components/ui/blur-fade";

interface GetStartedPageProps {
  className?: string;
}

export default function GetStartedPage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("code");
    }
  };

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
      
      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          // Transition to success screen after animation
          setTimeout(() => {
            setStep("success");
          }, 2000);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
  };

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
   
      <div className={cn("flex w-[100%] flex-col min-h-screen relative bg-white/2 backdrop-blur-sm")}>
        <div className="absolute inset-0 z-0">
        </div>
        
        {/* Content Layer */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Main content container */}
          <div className="flex flex-1 flex-col lg:flex-row ">
            {/* Left side (form) */}
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="">
                {step === "email" ? (
                  <div className="space-y-6 text-center">
                    <BlurFade delay={0.1} inView>
                      <div className="space-y-1 ">
                        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">Get Started with AsimovAI</h1>
                        <p className="text-[1.2rem] text-white/70 font-light">Create your account</p>
                      </div>
                    </BlurFade>
                    
                    
                    <div className="space-y-4">
                      <BlurFade delay={0.2} inView>
                        <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors">
                          <BsGoogle className="text-lg" />
                          <span>Sign up with Google</span>
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
                        <form onSubmit={handleEmailSubmit}>
                          <div className="relative">
                            <input 
                              type="email" 
                              placeholder="info@gmail.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full backdrop-blur-[1px] text-white border-1 border-white/30 rounded-full py-3 px-4 focus:outline-none focus:border focus:border-white/30 text-center"
                              required
                            />
                            <button 
                              type="submit"
                              className="absolute right-1.5 top-1.5 text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden"
                            >
                              <span className="relative w-full h-full block overflow-hidden">
                                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">
                                  →
                                </span>
                                <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">
                                  →
                                </span>
                              </span>
                            </button>
                          </div>
                        </form>
                      </BlurFade>
                    </div>
                    
                    <BlurFade delay={0.5} inView>
                      <p className="text-xs text-white/80 pt-10">
                        By creating an account, you agree to the <Link href="#" className="underline text-white/60 hover:text-white/60 transition-colors">Terms of Service</Link>, <Link href="#" className="underline text-white/60 hover:text-white/60 transition-colors">Privacy Policy</Link>.
                      </p>
                    </BlurFade>
                  </div>
                ) : step === "code" ? (
                  <div className="space-y-6 text-center">
                    <BlurFade delay={0.1} inView>
                      <div className="space-y-1">
                        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">We sent you a code</h1>
                        <p className="text-[1.25rem] text-white/50 font-light">Please enter it</p>
                      </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.2} inView>
                      <div className="w-full">
                        <div className="relative rounded-full py-4 px-5 border border-white/10 bg-transparent">
                          <div className="flex items-center justify-center">
                            {code.map((digit, i) => (
                              <div key={i} className="flex items-center">
                                <div className="relative">
                                  <input
                                    ref={(el) => {
                                      codeInputRefs.current[i] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleCodeChange(i, e.target.value)}
                                    onKeyDown={e => handleKeyDown(i, e)}
                                    className="w-8 text-center text-xl bg-transparent text-white border-none focus:outline-none focus:ring-0 appearance-none"
                                    style={{ caretColor: 'transparent' }}
                                  />
                                  {!digit && (
                                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                      <span className="text-xl text-white">0</span>
                                    </div>
                                  )}
                                </div>
                                {i < 5 && <span className="text-white/20 text-xl">|</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.3} inView>
                      <div>
                        <p className="text-white/50 hover:text-white/70 transition-colors cursor-pointer text-sm">
                          Resend code
                        </p>
                      </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.4} inView>
                      <div className="flex w-full gap-3">
                        <button 
                          onClick={handleBackClick}
                          className="rounded-full bg-white text-black font-medium px-8 py-3 hover:bg-white/90 transition-colors w-[30%]"
                        >
                          Back
                        </button>
                        <button 
                          className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 ${
                            code.every(d => d !== "") 
                            ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer" 
                            : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                          }`}
                          disabled={!code.every(d => d !== "")}
                        >
                          Continue
                        </button>
                      </div>
                    </BlurFade>
                    
                    <BlurFade delay={0.5} inView>
                      <div className="pt-16">
                        <p className="text-xs text-white/40">
                          By creating an account, you agree to the <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">MSA</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Product Terms</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Policies</Link>, <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Privacy Notice</Link>, and <Link href="#" className="underline text-white/40 hover:text-white/60 transition-colors">Cookie Notice</Link>.
                        </p>
                      </div>
                    </BlurFade>
                  </div>
                ) : (
                  <div className="space-y-6 text-center">
                    <BlurFade delay={0.1} inView>
                      <div className="space-y-1">
                        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">You're in!</h1>
                        <p className="text-[1.25rem] text-white/50 font-light">Welcome</p>
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
                      <button className="w-full rounded-full bg-white text-black font-medium py-3 hover:bg-white/90 transition-colors">
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
