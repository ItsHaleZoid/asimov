import NvidiaIcon from "./icons/nvidia-icon";
import { AiFillDatabase } from "react-icons/ai";
import { IoIosFlash } from "react-icons/io";
import { IoIosCloudDone } from "react-icons/io";

interface GpuSelectBoxProps {
  gpuModel: string;
  vram: string;
  socket: string;
  cloudPrice: string;
}

export default function GpuSelectBox({ gpuModel, vram, socket, cloudPrice }: GpuSelectBoxProps) {
  return (
    <div className="relative overflow-hidden shadow-xl hover:border-white/30 border border-white/20 aspect-[4/3] w-full max-w-sm p-6 hover:bg-gradient-to-b hover:from-black hover:to-[#171717] transition duration-300">
      {/* Corner boxes */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-white z-10"></div>
      <div className="absolute top-0 right-0 w-1 h-1 bg-white z-10"></div>
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-white z-10"></div>
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-white z-10"></div>
      
      <div className="flex flex-col h-full">
        {/* GPU Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className=" ">
              <NvidiaIcon className="w-8 h-8" color="url(#nvidia-gradient)" />
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="nvidia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b3b3b3" />
                    <stop offset="100%" stopColor="#878787" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="bg-gradient-to-t from-white to-[#b3b3b3] bg-clip-text text-transparent text-2xl font-semibold">{gpuModel}</span>
          </div>
          
        </div>

        {/* Specs */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <AiFillDatabase className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">VRAM</span>
            <span className="text-white font-medium">{vram}</span>
          </div>
          
          <div className="flex items-center gap-3">
          <IoIosFlash className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Socket</span>
            <span className="text-white font-medium">{socket}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols gap-3 mt-6">
         
          
          <button className="px-4 py-2 bg-gradient-to-t from-black to-[#212121] text-gray-300 border border-gray-600 hover:bg-gray-600/50 transition-colors text-sm flex items-center justify-center gap-2">
            <IoIosCloudDone className="w-4 h-4" />
            Secure Cloud {cloudPrice}
          </button>
        </div>

        {/* Select GPU Button */}
        <button className="w-full mt-4 px-4 py-3  text-white border border-white/30 transition-all duration-200 font-medium hover:border-white/50 hover:bg-white active:scale-95 active:transform cursor-pointer hover:text-black">
          Select GPU
        </button>
      </div>
    </div>
  )
}