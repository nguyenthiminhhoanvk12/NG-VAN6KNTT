import React, { useState } from 'react';
import { suggestWritingIdeas } from '../services/geminiService';
import { PenTool, Lightbulb, Copy, Check } from 'lucide-react';

const WritingAssistant: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('Kể chuyện');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSuggest = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    const result = await suggestWritingIdeas(topic, type);
    setSuggestion(result);
    setIsLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden transition-colors">
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-b border-emerald-100 dark:border-emerald-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg text-emerald-600 dark:text-emerald-400">
            <PenTool size={24} />
          </div>
          <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Góc Tập Làm Văn</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">Đề bài của em</label>
            <input 
              type="text" 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Kể về một kỉ niệm đáng nhớ..."
              className="w-full p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 dark:bg-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">Thể loại</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 dark:bg-stone-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none bg-white transition-colors"
              >
                <option>Kể chuyện (Tự sự)</option>
                <option>Miêu tả</option>
                <option>Biểu cảm</option>
                <option>Thuyết minh (đơn giản)</option>
              </select>
            </div>
            <button 
              onClick={handleSuggest}
              disabled={isLoading || !topic}
              className="mt-6 px-6 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 dark:disabled:bg-emerald-900 text-white rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {isLoading ? 'Đang suy nghĩ...' : <><Lightbulb size={18} /> Gợi ý ý tưởng</>}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 bg-slate-50 dark:bg-stone-900/50 overflow-y-auto">
        {suggestion ? (
          <div className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-slate-200 dark:border-stone-700 shadow-sm relative group">
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 rounded-lg transition-colors"
              title="Sao chép"
            >
              {copied ? <Check size={18} className="text-emerald-600 dark:text-emerald-400" /> : <Copy size={18} />}
            </button>
            <div className="prose prose-emerald dark:prose-invert prose-sm max-w-none">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-4 flex items-center gap-2">
                🌟 Dàn ý tham khảo
              </h3>
              <div className="whitespace-pre-wrap text-slate-700 dark:text-stone-300 leading-relaxed font-medium">
                {suggestion}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-stone-700 text-xs text-slate-400 italic">
              * Lưu ý: Đây chỉ là gợi ý của thầy AI. Em hãy dùng lời văn của mình để viết bài nhé!
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-stone-500 text-center px-8">
            <div className="w-20 h-20 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 text-emerald-300 dark:text-emerald-700">
               <PenTool size={32} />
            </div>
            <p>Nhập đề bài ở trên để thầy giúp em lập dàn ý nhé!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingAssistant;