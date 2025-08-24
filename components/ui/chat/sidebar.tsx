"use client"
import { cn } from "@/lib/utils"
import { MessageSquare, Plus, Settings, User, History, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function Sidebar() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  const models = [
    { id: 'manim', name: 'Manim', image: '/models/gpt4.png' , onClick: () => {
      router.push('chat/manim')
    }},
    { id: 'create-own', name: 'Create your own', image: null, isComingSoon: true },
  ]

  return (
    <div className={cn(
      "flex flex-col h-full bg-black/50 border-r border-white/20 backdrop-blur-sm transition-all duration-300",
      isMinimized ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20 min-h-[72px]">
        <div className="overflow-hidden">
          {!isMinimized && <h2 className="text-lg font-semibold text-white whitespace-nowrap">Asimov</h2>}
        </div>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-auto shrink-0"
        >
          {isMinimized ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          <button className={cn(
            "flex items-center w-full p-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[48px]",
            isMinimized ? "justify-center" : "gap-3"
          )}>
            <Plus className="h-5 w-5 shrink-0" />
            <div className="overflow-hidden">
              {!isMinimized && <span className="whitespace-nowrap">New Chat</span>}
            </div>
          </button>
          <button className={cn(
            "flex items-center w-full p-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[48px]",
            isMinimized ? "justify-center" : "gap-3"
          )}>
            <MessageSquare className="h-5 w-5 shrink-0" />
            <div className="overflow-hidden">
              {!isMinimized && <span className="whitespace-nowrap">New Chat</span>}
            </div>
          </button>
          <button className={cn(
            "flex items-center w-full p-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[48px]",
            isMinimized ? "justify-center" : "gap-3"
          )}>
            <History className="h-5 w-5 shrink-0" />
            <div className="overflow-hidden">
              {!isMinimized && <span className="whitespace-nowrap">Chat History</span>}
            </div>
          </button>
        </nav>

        {/* Models */}
        <div className="mt-6 overflow-hidden">
          {!isMinimized && (
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3 whitespace-nowrap">Models</h3>
              <div className="space-y-2">
                {models.map((model) => (
                  <button 
                    key={model.id}
                    className="flex items-center gap-3 w-full p-2 text-left text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm min-h-[36px]"
                    onMouseEnter={() => setHoveredModel(model.id)}
                    onMouseLeave={() => setHoveredModel(null)}
                    onClick={model.onClick}
                  >
                    {model.image ? (
                      <img
                        src={model.image}
                        alt={model.name}
                        className="w-6 h-6 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/12 p-1 flex items-center justify-center shrink-0">
                        <Plus className="h-6 w-6 text-white/90" />
                      </div>
                    )}
                    <span className="truncate">
                      {model.isComingSoon && hoveredModel === model.id ? 'Coming soon' : model.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {isMinimized && (
            <div className="space-y-2">
              {models.map((model) => (
                <button 
                  key={model.id}
                  className="flex items-center justify-center w-full p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[36px]"
                  title={model.isComingSoon ? 'Coming soon' : model.name}
                  onClick={model.onClick}
            >
                  {model.image ? (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Plus className="h-4 w-4 text-white/60" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Chats */}
        <div className="mt-6 overflow-hidden">
          {!isMinimized && (
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3 whitespace-nowrap">Recent</h3>
              <div className="space-y-1">
                <button className="flex items-center gap-3 w-full p-2 text-left text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm min-h-[36px]">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">Previous conversation...</span>
                </button>
                <button className="flex items-center gap-3 w-full p-2 text-left text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm min-h-[36px]">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">Another chat...</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        
          <button className={cn(
            "flex items-center w-full p-3 text-left text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[48px]",
            isMinimized ? "justify-center" : "gap-3"
          )}>
            {isMinimized ? (
              <img
                src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover outline-1 outline-white/90"
              />
            ) : (
              <>
                <img
                  src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover shrink-0 outline-1 outline-white/90"
                />
                <div className="overflow-hidden">
                  <span className="whitespace-nowrap">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Profile'}
                  </span>
                </div>
              </>
            )}
          </button>
        </div>
      </div>
    
  )
}