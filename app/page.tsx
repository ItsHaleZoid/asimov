"use client"

import Hero from "@/components/Hero"
import { StarsBackground } from "@/components/ui/stars"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import GPUList from "@/components/GPUList"
import ModelsList from "@/components/ModelsList"
import FAQ from "@/components/FAQ"
export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col relative overflow-hidden" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '0rem' }}>
      <StarsBackground className="absolute inset-0 z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center transform-gpu">
          <Hero />
         
          <GPUList />  
          <ModelsList />
          <FAQ />
        
          <Footer />
          

        
        
      
        </div>
      </div>
 
    </div>
  )
}