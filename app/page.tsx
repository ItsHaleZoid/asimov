import MainPage from "@/components/MainPage"
import Header from "@/components/Header"
import { StarsBackground } from "@/components/ui/stars"


export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col relative overflow-hidden" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '0rem' }}>
      <StarsBackground className="absolute inset-0 z-0" />
      <Header />
      <MainPage />
    </div>
  )
}