import { useState, useEffect, useRef } from 'react'
import { Send, MessageSquare, PieChart, Menu, Plus, User, Settings, Bot, Sparkles, Zap, Brain, Music, Coffee, ChevronLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import Dashboard from './components/Dashboard'

function App() {
  const [activeTab, setActiveTab] = useState('chat') // 'chat' | 'dashboard'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "你好！我是 **Mio** 智能助手。\n\n今天感觉怎么样？无论是工作压力还是生活琐事，我都在这里听你说。", 
      sender: 'ai' 
    }
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  const starterPrompts = [
    { icon: <Zap size={18} />, text: "我最近感觉工作压力很大", label: "缓解压力" },
    { icon: <Brain size={18} />, text: "总是感到焦虑无法集中注意力", label: "焦虑疏导" },
    { icon: <Coffee size={18} />, text: "如何改善睡眠质量？", label: "健康睡眠" },
    { icon: <Music size={18} />, text: "推荐一些放松心情的音乐", label: "放松时刻" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, activeTab])

  const handleSend = async (text = input) => {
    if (!text.trim()) return
    
    const userMsg = { id: Date.now(), text: text, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      
      const aiMsg = { 
        id: Date.now() + 1, 
        text: data.reply, 
        sender: 'ai' 
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      console.error("Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        text: "抱歉，连接服务器失败，请稍后再试。",
        sender: 'ai'
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-indigo-100">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Mobile Slide-out & Desktop Static */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-xl md:shadow-none flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Mio
              </h1>
              <p className="text-xs text-slate-500">AI 心理陪伴助手</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="px-4 pb-4">
          <button 
            onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }}
            className="w-full bg-indigo-600 active:bg-indigo-700 text-white p-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 group border border-indigo-500/50 active:scale-95"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-medium">开启新对话</span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 px-3 py-2 uppercase tracking-wider mb-1">功能导航</div>
          
          <button 
            onClick={() => { setActiveTab('chat'); setIsSidebarOpen(false); }}
            className={`w-full text-left p-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 ${
              activeTab === 'chat' 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <MessageSquare size={20} className={activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'} />
            <span>AI 咨询对话</span>
          </button>

          <button 
            onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full text-left p-3.5 rounded-xl flex items-center gap-3 transition-all active:scale-95 ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <PieChart size={20} className={activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'} />
            <span>情绪数据洞察</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button className="flex items-center gap-3 w-full p-2 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all group active:scale-95">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white group-hover:ring-indigo-50 transition-all">
              <User size={18} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-slate-900">访客用户</div>
              <div className="text-xs text-slate-500">基础版</div>
            </div>
            <Settings size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-slate-200/60 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-900">Mio</span>
          <div className="w-10" /> {/* Spacer for balance */}
        </div>

        {activeTab === 'chat' ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-6 pb-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 md:gap-5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* AI Avatar */}
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20 mt-1">
                        <Bot size={18} className="text-white" />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 px-1 font-medium">
                        {msg.sender === 'ai' ? 'Mio' : 'You'}
                      </div>
                      <div 
                        className={`p-3.5 md:p-4 rounded-2xl text-[15px] md:text-base leading-relaxed shadow-sm ${
                          msg.sender === 'user' 
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-500/20' 
                            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.sender === 'ai' ? (
                          <div className="prose prose-sm md:prose-base max-w-none prose-slate">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>

                    {/* User Avatar */}
                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} className="text-slate-500" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 md:gap-5 justify-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20 mt-1">
                      <Bot size={18} className="text-white" />
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none p-4 flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Starter Prompts (Only show if just 1 message) */}
              {messages.length === 1 && !isTyping && (
                <div className="max-w-3xl mx-auto mt-6 grid grid-cols-1 gap-3 animate-fade-in-up px-2">
                  <div className="text-center mb-2">
                    <p className="text-sm text-slate-500">你可以试着问我...</p>
                  </div>
                  {starterPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(prompt.text)}
                      className="p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all shadow-sm group flex items-center gap-3 active:scale-[0.98]"
                    >
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        {prompt.icon}
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 block">{prompt.label}</span>
                        <span className="text-xs text-slate-500">{prompt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-6 bg-white border-t border-slate-100 safe-area-pb">
              <div className="max-w-3xl mx-auto relative">
                <div className="relative bg-slate-50 border border-slate-200 rounded-2xl flex items-center p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all group">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="说点什么..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 px-3 py-2.5 text-base"
                    disabled={isTyping}
                  />
                  <button 
                    onClick={() => handleSend()}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      input.trim() && !isTyping
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 active:scale-90' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
                  </button>
                </div>
                <div className="text-center mt-2">
                  <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Sparkles size={10} />
                    <span>Mio 可能产生不准确的信息，请核实重要内容。</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <Dashboard />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
