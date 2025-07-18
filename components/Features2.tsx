import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { BlurFade } from "@/components/ui/blur-fade";
import { cn } from "@/lib/utils";
import { GlowingEffect } from "@/components/ui/glowing-effect";


export default function Features() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-20">   
      <div className="mx-auto max-w-4xl py-20 text-2xl font-bold tracking-tight md:text-5xl text-center flex flex-col items-center justify-center">
        <BlurFade duration={0.5} inView>
          <p className="mb-2 text-center">Choose from various predefined styles and presets {" "}</p>
        </BlurFade>
        
      </div>
      <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto px-4 text-center place-items-center">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 text-center flex flex-col items-center justify-center md:w-[40%]">
          <h3 className="text-xl font-semibold text-white mb-3 text-center">Advanced AI Models</h3>
          <p className="text-gray-300 text-center">State-of-the-art image generation with multiple model options for different styles and use cases.</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700/50 text-center flex flex-col items-center justify-center md:w-[60%]">
          <h3 className="text-xl font-semibold text-white mb-3 text-center">Advanced AI Models</h3>
          <p className="text-gray-300 text-center">State-of-the-art image generation with multiple model options for different styles and use cases.</p>
        </div>
      </div>
    </section>
  );
}
