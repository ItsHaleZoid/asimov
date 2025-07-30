import ModelBox from "./ui/model-box"
import { IoIosArrowForward } from "react-icons/io"
import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { Gabarito } from "next/font/google"

const gabarito = Gabarito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function ModelsList() {
  return (
    <div className="w-full bg-black">
      <div className="w-full flex flex-col items-center justify-center mb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent my-8 shadow-[0_0_20px_rgba(255,255,255,0.3)] blur-[0.5px]"></div>
        <h1 className="text-white text-5xl">Run and Fine-Tune AI Models</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto px-30 mb-7">
        <ModelBox 
          modelName="Gemma 3"
          modelCompany="Google"
          modelImage="/gemma.png"
          companyLogo="/google.png"
          buttonText="Run Model"
          modelImageClass="grayscale"
        />    

        <ModelBox 
          modelName="Llama 4"
          modelCompany="Meta"
          modelImage="/llama.png"
          companyLogo="/meta.png"
          buttonText="Run Model"
          modelImageClass="mt-18"
          gradientFill="bg-gradient-to-br from-white/70 via-white/70 via-white/80 to-[#171717]"
          companyLogoSize={50}
                    
        />    

        <ModelBox 
          modelName="Flux.1 "
          modelCompany="Black-Forest-Labs"
          modelImage="/flux.png"
          companyLogo="/flux.png"
          buttonText="Run Model"
          modelImageSize={265}
          modelImageClass="ml-58 -mt-20"
          gradientFill="bg-gradient-to-br from-white/70 via-white/70 via-white/80 to-[#171717]"
          companyLogoSize={30}
          companyLogoClass="invert brightness-100 saturate-100"
         
                    
        />    
         <ModelBox 
          modelName="Kimi K2"
          modelCompany="Meta"
          modelImage="/kimi.png"
          companyLogo="/moonshot.png"
          buttonText="Run Model"
          modelImageSize={185}
          modelImageClass="grayscale -ml-10 pr-10 mt-8"
          
          companyLogoSize={50}
          
          modelNameClass="ml-24"
         
                    
        />    

          <ModelBox 
          modelName="DeepSeek R1"
          modelCompany="DeepSeek"
          modelImage="/deepseek.png"
          companyLogo="/deepseek.png"
          buttonText="Run Model"
          modelImageSize={185}
          modelImageClass=" ml-16 grayscale opacity-0"
          gradientFill="bg-gradient-to-br from-white/70 via-white/70 via-white/80 to-[#171717] ml-16"
          companyLogoSize={35}
          modelNameClass="ml-15"
                    
          />   

<ModelBox 
          modelName="Mistral "
          modelCompany="Meta"
          modelImage="/mistral.png"
          companyLogo="/mistral.png"
          buttonText="Run Model"
          modelImageSize={190}
          modelImageClass="grayscale opacity-0 ml-30"
          gradientFill="bg-gradient-to-br from-white/70 via-white/70 via-white/80 to-[#171717]"
          companyLogoSize={30}
          companyLogoClass=" brightness-100 saturate-100"
         
                    
        />   
        </div>
        <div className="flex flex-col items-center justify-center mb-15 mt-10">
        <h1 className="text-white/70 text-md flex items-center gap-1 hover:text-white transition-all duration-200 cursor-pointer">See all Models <IoIosArrowForward className="w-4 h-4" /></h1>
      </div>
      <div className="overflow-hidden rounded-full flex items-center justify-center">
          
          </div>
    </div>  
  )
}