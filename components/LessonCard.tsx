import React from 'react';
import { Lesson, Chapter } from '../types';
import { Feather } from 'lucide-react';

interface LessonCardProps {
  unit: Chapter;
  lesson: Lesson;
  onClick: (unit: Chapter, lesson: Lesson) => void;
  isActive: boolean;
}

const LessonCard: React.FC<LessonCardProps> = ({ unit, lesson, onClick, isActive }) => {
  return (
    <button 
      onClick={() => onClick(unit, lesson)}
      className={`group relative w-full text-left p-5 rounded-xl border transition-all duration-300 overflow-hidden flex flex-col h-full
        ${isActive 
          ? 'bg-orange-50 border-orange-300 shadow-md ring-1 ring-orange-200 dark:bg-orange-900/20 dark:border-orange-700 dark:ring-orange-800' 
          : 'bg-white border-stone-100 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1 dark:bg-stone-800 dark:border-stone-700 dark:hover:border-orange-500/50'
        }`}
    >
      <div className="flex justify-between items-start mb-2 w-full">
         <div className={`p-2 rounded-lg ${isActive ? 'bg-orange-100 text-orange-600 dark:bg-orange-800/50 dark:text-orange-400' : 'bg-stone-100 text-stone-400 group-hover:bg-orange-50 group-hover:text-orange-500 dark:bg-stone-700 dark:text-stone-500 dark:group-hover:bg-stone-700 dark:group-hover:text-orange-400 transition-colors'}`}>
            <Feather className="w-5 h-5" />
         </div>
      </div>
      
      <div className="relative z-10">
         <h3 className={`font-bold text-base serif leading-tight mb-1 ${isActive ? 'text-orange-900 dark:text-orange-100' : 'text-stone-800 group-hover:text-orange-800 dark:text-stone-200 dark:group-hover:text-orange-200'}`}>
            {lesson.title}
         </h3>
         {lesson.description && (
           <p className="text-xs text-stone-500 line-clamp-2 italic font-serif mt-1 dark:text-stone-400">
              {lesson.description}
           </p>
         )}
      </div>
    </button>
  );
};

export default LessonCard;