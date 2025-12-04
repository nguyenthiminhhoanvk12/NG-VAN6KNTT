import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Book } from 'lucide-react';
import { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import { Content } from "@google/genai";
import { MathRenderer } from './MathRenderer'; // Uses generic text renderer

export const ChatSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: 'Chào em! Thầy là trợ lý Ngữ Văn. Em cần gợi ý làm văn, soạn bài hay giải nghĩa từ khó không? 📖',
      sender: 'bot',
      timestamp: Date.now(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen, isTyping]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), text: inputText, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    const history: Content[] = messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await getChatResponse(history, userMsg.text);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: responseText, sender: 'bot', timestamp: Date.now() }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-5 right-5 z-50 p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 ${isOpen ? 'scale-0' : 'scale-100'} bg-orange-600 text-white dark:bg-orange-700`}>
        <MessageCircle className="w-7 h-7" />
      </button>

      <div className={`fixed bottom-5 right-5 z-50 w-[90vw] sm:w-[360px] bg-white dark:bg-stone-800 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-700 transition-all duration-300 flex flex-col overflow-hidden ${isOpen ? 'opacity-100 translate-y-0 h-[500px] pointer-events-auto' : 'opacity-0 translate-y-10 h-0 pointer-events-none'}`}>
        <div className="bg-orange-600 dark:bg-orange-800 p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-full"><Book className="w-5 h-5" /></div>
            <div>
              <h3 className="font-bold text-sm serif">Gia Sư Văn Học</h3>
              <p className="text-xs text-orange-200">Luôn lắng nghe em</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 rounded-full p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-stone-50 dark:bg-stone-900 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-stone-200 dark:bg-stone-700' : 'bg-orange-100 dark:bg-orange-900'}`}>
                  {isUser ? <User className="w-5 h-5 text-stone-600 dark:text-stone-300" /> : <Bot className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm leading-relaxed ${isUser ? 'bg-stone-800 text-white rounded-tr-none dark:bg-stone-600' : 'bg-white text-stone-800 rounded-tl-none border border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700'}`}>
                  <MathRenderer text={msg.text} />
                </div>
              </div>
            );
          })}
          {isTyping && <div className="ml-10 text-xs text-stone-400 italic">Thầy đang viết...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-white dark:bg-stone-800 border-t border-stone-100 dark:border-stone-700 shrink-0 flex gap-2">
           <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Hỏi thầy về bài học..." 
             className="flex-1 bg-stone-100 dark:bg-stone-700 dark:text-white rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
           <button onClick={handleSend} disabled={!inputText.trim() || isTyping} className="p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
        </div>
      </div>
    </>
  );
};