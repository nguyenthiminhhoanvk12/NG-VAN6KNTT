import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCcw } from 'lucide-react';
import { ChatMessage, Lesson } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  activeLesson: Lesson | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeLesson }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: activeLesson 
        ? `Chào em! Hôm nay chúng ta sẽ tìm hiểu về "${activeLesson.title}". Em có thắc mắc gì về văn bản này không?`
        : "Chào em! Hãy chọn một bài học để thầy có thể hỗ trợ tốt nhất nhé.",
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset or update welcome message when lesson changes
    if (activeLesson) {
       setMessages(prev => [
        ...prev,
        {
          id: `intro-${activeLesson.id}-${Date.now()}`,
          sender: 'bot',
          text: `Chúng ta đã chuyển sang bài "${activeLesson.title}". Em cần thầy tóm tắt hay phân tích nhân vật nào?`,
          timestamp: Date.now()
        }
       ]);
    }
  }, [activeLesson]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const context = activeLesson 
        ? `Bài học hiện tại: ${activeLesson.title} (${activeLesson.topic || ''}). Mô tả: ${activeLesson.description || ''}.`
        : undefined;

      // Pass only last 10 messages for context window management
      // Map ChatMessage to {role, text} for the service
      const history = messages.slice(-10).map(m => ({ 
          role: m.sender === 'user' ? 'user' : 'model', 
          text: m.text 
      }));
      
      const responseText = await sendMessageToGemini(userMsg.text, history, context);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Xin lỗi em, thầy đang gặp chút trục trặc kết nối. Em thử lại nhé.",
        timestamp: Date.now(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-orange-50 p-4 border-b border-orange-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full border border-orange-200 shadow-sm">
            <Bot className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Trợ lý Văn học</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Sẵn sàng hỗ trợ
            </p>
          </div>
        </div>
        {activeLesson && (
          <div className="text-xs bg-white px-3 py-1 rounded-full border border-orange-200 text-orange-700 font-medium hidden sm:block">
            Đang học: {activeLesson.title}
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 
              ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'}`}>
              {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-sm
              ${msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              } ${msg.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
               <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={activeLesson ? `Hỏi về bài ${activeLesson.title}...` : "Hỏi thầy bất cứ điều gì về Ngữ Văn..."}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 text-white rounded-lg transition-colors shadow-sm"
          >
            {isLoading ? <RefreshCcw size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setInput("Tóm tắt nội dung chính giúp em")} className="whitespace-nowrap px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200 transition-colors flex items-center gap-1">
            <Sparkles size={12} /> Tóm tắt bài
          </button>
          <button onClick={() => setInput("Phân tích ý nghĩa chi tiết này")} className="whitespace-nowrap px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200 transition-colors">
            Phân tích chi tiết
          </button>
          <button onClick={() => setInput("Đặc sắc nghệ thuật của bài là gì?")} className="whitespace-nowrap px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200 transition-colors">
            Đặc sắc nghệ thuật
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
