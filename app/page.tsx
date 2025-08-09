import MainPage from "@/components/MainPage"
import Header from "@/components/Header"


export default function Home() {
  return (
    <div className="bg-black min-h-screen flex flex-col relative overflow-hidden" style={{ scrollBehavior: 'smooth', scrollPaddingTop: '0rem' }}>
     
     
      <Header />
      <MainPage />
    </div>
  )
}