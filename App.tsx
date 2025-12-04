import React, { useState, useEffect } from 'react';
import { CURRICULUM } from './data/curriculum';
import { generateQuiz, generateLitNews } from './services/geminiService';
import { QuizRunner } from './components/QuizRunner';
import { NewsCard } from './components/NewsCard';
import { ChatSupport } from './components/ChatSupport';
import WritingAssistant from './components/WritingAssistant';
import LessonCard from './components/LessonCard';
import { AppScreen, QuizData, QuizMode, LitNews } from './types';
import { BookOpen, AlertCircle, Loader2, PenTool, Layout, X, Moon, Sun } from 'lucide-react';

const THEME_STORAGE_KEY = 'lit6_theme_preference';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  const [mode, setMode] = useState<QuizMode>('ASSESSMENT');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [news, setNews] = useState<LitNews | null>(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Initialize theme from local storage or system preference
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to html element
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const loadNews = async () => {
      setNewsLoading(true);
      try {
        const data = await generateLitNews();
        setNews(data);
      } catch (e) {
        setNews({ title: "Chào mừng em", content: "Hôm nay em muốn học bài nào?" });
      } finally {
        setNewsLoading(false);
      }
    };
    loadNews();
  }, []);

  const handleLessonSelect = async (lessonId: string, title: string, desc: string = "") => {
    setScreen(AppScreen.LOADING);
    setActiveLessonId(lessonId);
    setError(null);

    try {
      const data = await generateQuiz(title, desc);
      setQuizData(data);
      setScreen(AppScreen.QUIZ);
    } catch (err: any) {
      setError("Hệ thống đang bận. Vui lòng thử lại sau.");
      setScreen(AppScreen.DASHBOARD);
    }
  };

  const renderContent = () => {
    if (screen === AppScreen.LOADING) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
           <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
           <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">Đang soạn giáo án...</h3>
           <p className="text-stone-500 dark:text-stone-400 mt-2">Thầy AI đang chuẩn bị câu hỏi cho em.</p>
        </div>
      );
    }

    if (screen === AppScreen.QUIZ && quizData) {
      return (
         <QuizRunner 
          quizData={quizData} 
          mode={mode}
          onFinish={() => { setScreen(AppScreen.DASHBOARD); setQuizData(null); }} 
          onBack={() => setScreen(AppScreen.DASHBOARD)}
        />
      );
    }

    if (screen === AppScreen.WRITING) {
      return (
         <div className="max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-100px)]">
            <button onClick={() => setScreen(AppScreen.DASHBOARD)} className="mb-4 text-stone-500 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 font-bold text-sm transition-colors">
               ← Quay lại
            </button>
            <WritingAssistant />
         </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32 space-y-10 animate-in fade-in">
        {error && (
          <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200 p-4 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-3">
             <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        <NewsCard news={news} loading={newsLoading} />

        <div className="flex gap-4 mb-6">
           <div 
             onClick={() => setScreen(AppScreen.WRITING)}
             className="flex-1 bg-gradient-to-br from-teal-500 to-emerald-600 dark:from-teal-600 dark:to-emerald-700 rounded-2xl p-6 text-white cursor-pointer shadow-lg shadow-teal-100 dark:shadow-none hover:shadow-teal-200 dark:hover:bg-teal-500 hover:-translate-y-1 transition-all group border border-teal-400/20"
           >
              <PenTool className="w-8 h-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-lg serif">Góc Tập Viết</h3>
              <p className="text-teal-100 text-sm opacity-90">Lập dàn ý & Gợi ý viết văn</p>
           </div>
           <div className="flex-1 bg-gradient-to-br from-orange-400 to-amber-500 dark:from-orange-600 dark:to-amber-700 rounded-2xl p-6 text-white shadow-lg shadow-orange-100 dark:shadow-none border border-orange-400/20">
              <BookOpen className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="font-bold text-lg serif">Kho Bài Học</h3>
              <p className="text-orange-100 text-sm opacity-90">{CURRICULUM.length} Bài học chính</p>
           </div>
        </div>

        <div className="space-y-12">
          {CURRICULUM.map((chapter) => (
            <div key={chapter.id} id={chapter.id} className="scroll-mt-24">
               <div className="flex items-center gap-3 mb-6 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <span className="text-4xl font-black text-stone-200 dark:text-stone-800 serif select-none">{chapter.id.replace('unit','0')}</span>
                  <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">{chapter.title}</h2>
               </div>
               <div className="grid sm:grid-cols-2 gap-4">
                  {chapter.lessons.map(lesson => (
                     <LessonCard 
                        key={lesson.id} 
                        unit={chapter} 
                        lesson={lesson} 
                        isActive={false} 
                        onClick={() => handleLessonSelect(lesson.id, lesson.title, lesson.description)} 
                     />
                  ))}
               </div>
            </div>
          ))}
        </div>
        
        <div className="text-center pt-10 text-stone-400 dark:text-stone-600 text-xs serif italic">
           © 2024 Ngữ Văn 6 KNTT Master
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-stone-800 dark:text-stone-100 font-sans transition-colors duration-300">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800 transition-colors duration-300">
         <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setScreen(AppScreen.DASHBOARD)}>
               <div className="w-10 h-10 bg-orange-600 dark:bg-orange-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 dark:shadow-none">
                  <BookOpen className="w-6 h-6" />
               </div>
               <div>
                  <h1 className="text-lg font-black text-stone-800 dark:text-stone-100 tracking-tight serif">Ngữ Văn 6</h1>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-bold tracking-wider uppercase">Kết nối tri thức</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={toggleTheme} 
                 className="p-2 text-stone-400 hover:text-orange-600 dark:text-stone-500 dark:hover:text-orange-400 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors"
                 title={theme === 'light' ? 'Chuyển chế độ tối' : 'Chuyển chế độ sáng'}
               >
                 {theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
               </button>
               <button onClick={() => setShowTOC(true)} className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-xl transition-colors">
                  <Layout className="w-6 h-6" />
               </button>
            </div>
         </div>
      </header>

      <main>
         {renderContent()}
      </main>

      <ChatSupport />

      {showTOC && (
         <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-stone-900/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setShowTOC(false)} />
            <div className="relative w-80 bg-white dark:bg-stone-900 h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right p-6 border-l border-stone-200 dark:border-stone-800">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-xl serif text-stone-800 dark:text-stone-100">Mục Lục</h3>
                  <button onClick={() => setShowTOC(false)}><X className="w-6 h-6 text-stone-400" /></button>
               </div>
               <div className="space-y-1">
                  {CURRICULUM.map(c => (
                     <a key={c.id} href={`#${c.id}`} onClick={() => setShowTOC(false)} className="block p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-orange-800 dark:hover:text-orange-300 text-sm font-medium transition-colors">
                        {c.title}
                     </a>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
}