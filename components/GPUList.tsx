import { Gabarito } from "next/font/google";
import { BlurFade } from "@/components/ui/blur-fade";
import GpuSelectBox from "@/components/ui/gpu-select-box";
import { IoIosArrowForward } from "react-icons/io";


const gabarito = Gabarito({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function GPUList() {
  return (
    <div className="w-full bg-black border-t border-white/25 py-16">
      <div className={`${gabarito.className} text-white text-5xl flex flex-col items-start ml-30 justify-center mb-12`}>
   
        <h1>Get the highest quality compute.</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 mb-7">
          <GpuSelectBox gpuModel="B200" vram="180 GB" socket="SXM6" cloudPrice="$6.02" />
          <GpuSelectBox gpuModel="H200" vram="141 GB" socket="SXM5" cloudPrice="$2.66" />
          <GpuSelectBox gpuModel="H100" vram="80 GB" socket="PCIe, SXM5" cloudPrice="$6.02" />
          <GpuSelectBox gpuModel="A100" vram="80 GB" socket="PCIe, SXM4" cloudPrice="$6.02" />
          <GpuSelectBox gpuModel="A100" vram="40 GB" socket="PCIe, SXM4" cloudPrice="$6.02" />
          <GpuSelectBox gpuModel="RTX 5090" vram="32 GB" socket="PCIe" cloudPrice="$6.02" />

        
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-white/70 text-md flex items-center gap-1 hover:text-white transition-all duration-200 cursor-pointer">See all GPUs <IoIosArrowForward className="w-4 h-4" /></h1>
      </div>
    </div>
  );
}