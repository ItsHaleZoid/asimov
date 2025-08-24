import { PromptInput } from "@/components/ui/chat/prompt_input";
import Sidebar from "@/components/ui/chat/sidebar";
import Image from "next/image";

export default function Manim() {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col justify-center items-center">
        <Image src="/asimov-full.png" alt="Manim" width={250} height={250} className="mb-8"/>
        <div className="w-full justify-center items-center flex">
          <PromptInput />
        </div>
      </div>
    </div>
  );
}