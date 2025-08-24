import Sidebar from "@/components/ui/chat/sidebar";
import { PromptInput } from "@/components/ui/chat/prompt_input";
import Image from "next/image";

export default function Manim() {
  return (  
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="w-full justify-center items-center flex h-full flex-col mt-170">
          <PromptInput />
          <p className="text-white/60 text-sm mt-6 text-center">
            Model Selection: Manim
          </p>
        </div>
      </div>
    </div>
  )
}