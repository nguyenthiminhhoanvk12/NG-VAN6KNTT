import React from 'react';
import { LitNews } from '../types';
import { Sparkles, ImageIcon, BookOpen } from 'lucide-react';

interface NewsCardProps {
  news: LitNews | null;
  loading: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, loading }) => {
  if (loading) {
    return (
      <div className="w-full bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden mb-8 animate-pulse transition-colors">
        <div className="h-48 bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
             <ImageIcon className="w-8 h-8 text-stone-400 dark:text-stone-600" />
        </div>
        <div className="p-6 space-y-3">
          <div className="h-6 bg-stone-200 dark:bg-stone-700 rounded w-3/4"></div>
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-full"></div>
          <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!news) return null;

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-xl border border-orange-100 dark:border-stone-700 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md group">
       <div className="relative h-48 sm:h-64 bg-orange-50 dark:bg-stone-900 overflow-hidden">
         {news.imageUrl ? (
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700 opacity-90 hover:opacity-100"
            />
         ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-orange-300 dark:text-stone-600 bg-orange-50 dark:bg-stone-900">
               <BookOpen className="w-12 h-12 mb-2" />
               <span className="text-sm font-medium">Góc Văn Học</span>
            </div>
         )}
         <div className="absolute top-4 left-4 bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-orange-800 dark:text-orange-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm font-serif">
            <Sparkles className="w-3 h-3" /> Khám phá
         </div>
       </div>
       <div className="p-6">
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2 font-serif">{news.title}</h3>
          <div className="text-stone-600 dark:text-stone-300 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
            {news.content}
          </div>
       </div>
    </div>
  );
};