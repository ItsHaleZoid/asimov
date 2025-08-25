"use client"

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/ui/chat/sidebar";
import { PromptInput } from "@/components/ui/chat/prompt_input";
import { Download, Loader2 } from "lucide-react";
import ShinyText from "@/components/ui/ShinyText";


interface Message {
  id: string;
  conversation_id: string;
  message_type: 'user' | 'system' | 'video' | 'status';
  content?: string;
  video_url?: string;
  video_title?: string;
  status?: 'pending' | 'processing' | 'completed' | 'error' | 'cancelled';
  error_message?: string;
  created_at: string;
  updated_at: string;
}

interface Conversation {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export default function Manim() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [processingMessageId, setProcessingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  const cancelAnimation = async (messageId?: string) => {
    try {
      const idToCancel = messageId || processingMessageId;
      if (!idToCancel) return;
      
      const response = await fetch(`http://localhost:8000/chat/cancel/${idToCancel}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        setProcessingMessageId(null);
        await loadMessages(); // Refresh messages to show updated status
      }
    } catch (error) {
      console.error('Failed to cancel animation:', error);
    }
  };

  const downloadVideo = async (videoUrl: string, fileName: string = 'animation.mp4') => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download video:', error);
    }
  };



  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (currentConversationId && user) {
      loadMessages();
      startPolling();
    }
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, [currentConversationId, user]);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:8000/chat/conversations?user_id=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations);
        if (data.conversations.length > 0 && !currentConversationId) {
          setCurrentConversationId(data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async () => {
    if (!currentConversationId || !user) return;
    
    try {
      const response = await fetch(
        `http://localhost:8000/chat/conversations/${currentConversationId}/messages?user_id=${user.id}`
      );
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
        
        // Check if there's still a processing message
        const processingMessage = data.messages.find((msg: Message) => 
          msg.message_type === 'status' && msg.status === 'processing'
        );
        
        if (processingMessage) {
          setProcessingMessageId(processingMessage.id);
        } else {
          setProcessingMessageId(null);
        }
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const startPolling = () => {
    if (pollInterval.current) {
      clearInterval(pollInterval.current);
    }
    
    pollInterval.current = setInterval(() => {
      loadMessages();
    }, 2000); // Poll every 2 seconds for updates
  };

  const createNewConversation = async () => {
    if (!user) return null;
    
    try {
      const response = await fetch('http://localhost:8000/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `New Animation Chat`,
          user_id: user.id
        })
      });
      
      const data = await response.json();
      if (data.success) {
        await loadConversations();
        return data.conversation_id;
      }
    } catch (error) {
      console.error('Failed to create conversation:', error);
    }
    return null;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !user || isLoading) return;
    
    setIsLoading(true);
    
    try {
      let conversationId = currentConversationId;
      
      // Create new conversation if none exists
      if (!conversationId) {
        conversationId = await createNewConversation();
        if (!conversationId) {
          throw new Error('Failed to create conversation');
        }
        setCurrentConversationId(conversationId);
      }
      
      const response = await fetch('http://localhost:8000/chat/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          user_id: user.id,
          conversation_id: conversationId
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setInputValue("");
        setProcessingMessageId(data.status_message_id);
        // Reload messages to show the new user message and status
        await loadMessages();
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const renderMessage = (message: Message) => {
    const isUser = message.message_type === 'user';
    const isShortMessage = message.content && message.content.length <= 80;
    const userRounding = isUser ? (isShortMessage ? 'rounded-full' : 'rounded-2xl') : '';
    
    return (
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 mt-3`}>
        <div className={`max-w-3xl ${isUser ? `bg-white/15 mr-2 max-w-xl text-white ${userRounding}` : ''} p-4 text-md`}>
          {message.message_type === 'video' && message.video_url ? (
            <div className=" w-150 space-y-3 outline-1 outline-white/20 rounded-lg p-4">
              <video 
                controls 
                className="w-150 rounded-lg outline-1 outline-white/15"
                style={{ 
                  maxHeight: '350px',
                  colorScheme: 'dark'
                }}
              >
                <source src={message.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadVideo(message.video_url!, message.video_title || 'animation.mp4')}
                  className="flex items-center gap-1 text-white/80 hover:text-white text-sm cursor-pointer"
                >
                  <Download size={14} /> Download
                </button>
              </div>
              {message.content && (
                <p className="text-white/70 text-sm">{message.content}</p>
              )}
            </div>
          ) : message.message_type === 'status' && (message.status === 'processing' || message.status === 'completed' || message.status === 'cancelled') ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {message.status === 'processing' && <Loader2 size={16} className="animate-spin text-white" />}
                {message.status === 'processing' ? (
                  <ShinyText text={message.content || 'Processing your animation request...'} speed={2} />
                ) : message.status === 'cancelled' ? (
                  <span className="text-white/80 text-md italic">Cancelled.</span>
                ) : (
                  <span className="text-white/80 text-md italic">Animation Completed!</span>
                )}
              </div>

            </div>
          ) : (
            isUser ? (
              <span className="text-white">{message.content}</span>
            ) : (
              <ShinyText text={message.content || ''} disabled={false} speed={1} />
            )
          )}
          
          {message.error_message && (
            <div className="mt-2 p-2 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm">
              Error: {message.error_message}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex h-screen bg-black items-center justify-center">
        <p className="text-white">Please sign in to use Manim chat</p>
      </div>
    );
  }

  return (  
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col items-center" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}} data-scrollbar-hide>
          <div className="w-full max-w-4xl space-y-4">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Area */}
        <div className="p-4 flex justify-center">
          <PromptInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={sendMessage}
            onCancel={() => cancelAnimation()}
            placeholder="Create an animation with Voiceover..."
            disabled={isLoading}
            isLoading={isLoading}
            isProcessing={!!processingMessageId}
            className="w-full max-w-4xl"
          />
        </div>
      </div>
    </div>
  )
}