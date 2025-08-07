import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Gabarito, Readex_Pro} from "next/font/google";
import Header from '@/components/Header'

const readexPro = Readex_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Pricing() {
    return (
      <div className="bg-black min-h-screen flex flex-col relative overflow-hidden" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '0rem' }}>
            {/* Top lighting effects - subtle warm glow */}
            <div className="absolute top-0 left-0 w-full h-full rotate-180 mt-38">
                <div className="relative -top-300 left-1/2 transform -translate-x-1/2 rotate-180 w-[2300px] h-[1500px] bg-gradient-to-b from-[#4900f5] via-[#000000] to-transparent blur-3xl" 
                   style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
                <div className="absolute -top-100 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#b78dff] via-amber-50/4 to-transparent blur-[80px] rounded-full"
                   style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%", mixBlendMode: "screen"}}></div>
                <div className="absolute -top-50 left-1/2 transform -translate-x-1/2 w-[1300px] rotate-180 h-[600px] bg-gradient-to-b from-[#5a3dff] via-transparent to-transparent blur-[500px] rounded-full -z-10"
                   style={{borderRadius: "50% 50% 50% 50% / 80% 80% 20% 20%"}}></div>
            </div>
            
            <div className="relative z-10 bg-black/50">
                <Header />
                
                <section className={`py-16 md:py-32 ${readexPro.className}`}>
                  
                    <div className="mx-auto max-w-5xl px-6 mt-10">
                        <div className="mx-auto max-w-2xl space-y-6 text-center">
                            <h1 className="text-center text-4xl lg:text-5xl tracking-tight bg-gradient-to-b from-white via-gray-200 to-[#88809a] bg-clip-text text-transparent leading-tight">Pricing that suits your needs</h1>
                            <p className="tracking-tight -mb-6">We offer a flexible pricing to finetune your models on GPUs for every type of users, carefully tailored to their needs</p>
                        </div>

                        <div className="mt-8 flex justify-center md:mt-20">
                            <div className="max-w-160 w-full rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 lg:p-10 bg-black">
                                <div className="space-y-4">
                                  
                                    <div>
                                      
                                        <h2 className="font-medium">All-in-one</h2>
                                        <span className="my-3 block text-2xl font-semibold">$2.5/hr</span>
                                        <p className="text-muted-foreground text-sm">Per GPU hour</p>
                                    </div>
                                    

                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full">
                                        <Link href="">Get Started</Link>
                                    </Button>

                                    <hr className="border-dashed" />

                                    <ul className="list-outside space-y-3 text-sm">
                                        {['High-performance GPU access', 'Access to available models', 'Priority support', 'Custom Datasets'].map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2">
                                                <Check className="size-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                               
                            </div>
                            
                            
                        </div>
                        
                        
                    </div>
                     
                    
                </section>
            </div>
            
        </div>
        
    )
}