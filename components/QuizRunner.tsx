import React, { useState, useEffect } from 'react';
import { QuizData, QuizMode } from '../types';
import { CheckCircle, ArrowLeft, Lightbulb, Clock, ListChecks, Trophy, User, Play, BookOpen, PenTool, Quote } from 'lucide-react';
import { MathRenderer } from './MathRenderer'; // Now functions as TextRenderer

interface QuizRunnerProps {
  quizData: QuizData;
  mode: QuizMode;
  onFinish: (score: number) => void;
  onBack: () => void;
}

const ASSESSMENT_DURATION = 45 * 60; // 45 minutes for Lit

export const QuizRunner: React.FC<QuizRunnerProps> = ({ quizData, mode, onFinish, onBack }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [part1Answers, setPart1Answers] = useState<Record<number, number>>({});
  const [part2Answers, setPart2Answers] = useState<Record<string, boolean | null>>({});
  const [part3Answers, setPart3Answers] = useState<Record<number, string>>({});
  const [part3Revealed, setPart3Revealed] = useState<Record<number, boolean>>({}); 
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(mode === 'PRACTICE');
  const [timeLeft, setTimeLeft] = useState(ASSESSMENT_DURATION);

  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');

  useEffect(() => {
    if (mode !== 'ASSESSMENT' || isSubmitted || !quizStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isSubmitted, quizStarted]);

  useEffect(() => {
    if (mode === 'ASSESSMENT' && quizStarted && timeLeft === 0 && !isSubmitted) {
      handleAutoSubmit();
    }
  }, [timeLeft, mode, isSubmitted, quizStarted]);

  const handleStartQuiz = () => {
    if (!studentName.trim() || !className.trim()) {
      alert("Vui lòng điền tên và lớp!");
      return;
    }
    setQuizStarted(true);
  };

  const calculateScore = () => {
    let score = 0;
    quizData.part1.forEach(q => {
      if (part1Answers[q.id] === q.correctAnswerIndex) score += 0.25;
    });
    quizData.part2.forEach(q => {
      q.statements.forEach(s => {
        const key = `${q.id}-${s.id}`;
        if (part2Answers[key] === s.isTrue) score += 0.25;
      });
    });
    quizData.part3.forEach(q => {
      const userAns = part3Answers[q.id]?.trim().toLowerCase() || "";
      const correctAns = String(q.correctAnswer).trim().toLowerCase();
      // Basic fuzzy check
      if (userAns === correctAns || (userAns && correctAns.includes(userAns))) {
        score += 0.5;
      }
    });
    return Math.max(0, Math.min(score, 10));
  };

  const handleAttemptSubmit = () => setShowConfirmModal(true);
  const confirmManualSubmit = () => {
    setShowConfirmModal(false);
    setIsSubmitted(true);
    setShowResultModal(true);
  };
  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    setShowResultModal(true);
  };

  const handleShare = async () => {
    const score = calculateScore();
    const text = `Tôi vừa đạt ${score}/10 điểm bài "${quizData.topic}" - Ngữ Văn 6! 📚`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Kết quả học tập', text: text }); } catch (error) {}
    } else {
      try { await navigator.clipboard.writeText(text); alert('Đã sao chép kết quả!'); } catch (error) {}
    }
  };

  const cleanOptionText = (text: string) => text.replace(/^[A-Da-d0-9]+[.:)]\s*/, '').trim();
  const shouldShowResult = (isAnswered: boolean) => isSubmitted || (mode === 'PRACTICE' && instantFeedback && isAnswered);
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const renderExplanation = (text?: string) => {
    if (!text) return null;
    return (
      <div className="mt-4 mx-2 sm:mx-4 mb-2 p-4 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-900/30 dark:border-orange-800 flex gap-3 animate-in fade-in">
         <div className="bg-white dark:bg-stone-800 p-2 rounded-lg text-orange-500 shadow-sm h-fit shrink-0">
            <Lightbulb className="w-4 h-4" />
         </div>
         <div className="flex-1">
            <h5 className="font-bold text-orange-900 dark:text-orange-200 text-xs uppercase tracking-wider mb-1">Gợi ý / Giải thích</h5>
            <div className="text-stone-700 dark:text-stone-300 text-sm italic serif">
              <MathRenderer text={text} />
            </div>
         </div>
      </div>
    );
  };

  if (!quizStarted) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 animate-in fade-in">
        <button onClick={onBack} className="mb-6 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-bold text-sm flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl shadow-stone-200 dark:shadow-black/50 overflow-hidden border border-stone-100 dark:border-stone-700 p-8 sm:p-10 text-center transition-colors">
             <div className="w-20 h-20 bg-orange-50 dark:bg-stone-700 rounded-full mx-auto flex items-center justify-center mb-6 border border-orange-100 dark:border-stone-600">
               <BookOpen className="w-10 h-10 text-orange-600 dark:text-orange-400" />
             </div>
             <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100 mb-2 serif">Chuẩn bị làm bài</h2>
             <p className="text-stone-500 dark:text-stone-400 mb-8">Hãy điền tên để thầy ghi nhận điểm số nhé!</p>

             <div className="space-y-4 text-left">
                 <div>
                   <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Họ và tên</label>
                   <input 
                      type="text" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="w-full px-5 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900/50 outline-none text-stone-900 dark:text-stone-100"
                   />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Lớp</label>
                    <input 
                        type="text" 
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        placeholder="VD: 6A1"
                        className="w-full px-5 py-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-600 focus:border-orange-500 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-900/50 outline-none text-stone-900 dark:text-stone-100"
                    />
                  </div>
             </div>

             <button 
                onClick={handleStartQuiz}
                className="w-full mt-8 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-none transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
             >
                <Play className="w-5 h-5 fill-current" /> Bắt đầu làm bài
             </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-40 px-3 sm:px-0">
      <div className="sticky top-4 z-30 mb-8 mx-auto max-w-4xl">
         <div className="bg-white/90 dark:bg-stone-800/90 backdrop-blur-md border border-stone-200 dark:border-stone-700 shadow-md rounded-2xl p-3 flex items-center justify-between transition-colors">
             <div className="flex items-center gap-3">
               <button onClick={onBack} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl transition-colors text-stone-500 dark:text-stone-400">
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <h2 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-100 serif truncate max-w-[150px] sm:max-w-[300px]">{quizData.topic}</h2>
             </div>
             <div className="flex items-center gap-3">
                {mode === 'ASSESSMENT' && !isSubmitted && (
                   <div className="flex items-center gap-2 font-mono font-bold text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg text-sm">
                       <Clock className="w-4 h-4" /> {formatTime(timeLeft)}
                   </div>
                )}
                {isSubmitted && (
                    <button onClick={() => setShowResultModal(true)} className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm">
                       <Trophy className="w-4 h-4" /> Kết quả
                    </button>
                )}
             </div>
         </div>
      </div>

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Part 1 */}
        <section className="bg-white dark:bg-stone-800 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-stone-100 dark:border-stone-700 transition-colors">
           <div className="flex items-center gap-3 mb-6">
              <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-lg text-orange-600 dark:text-orange-400"><ListChecks className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">Phần 1: Trắc nghiệm</h3>
           </div>
           <div className="grid gap-8">
              {quizData.part1.map((q, idx) => {
                const userVal = part1Answers[q.id];
                const showResult = shouldShowResult(userVal !== undefined);
                const isCorrect = userVal === q.correctAnswerIndex;
                return (
                  <div key={q.id} className="group">
                    <div className="flex gap-4 mb-4">
                      <span className="shrink-0 w-8 h-8 bg-stone-100 dark:bg-stone-700 rounded-full flex items-center justify-center font-bold text-stone-500 dark:text-stone-400 text-sm">{idx + 1}</span>
                      <p className="font-medium text-stone-800 dark:text-stone-200 text-lg serif leading-relaxed"><MathRenderer text={q.question} /></p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 pl-12">
                      {q.options.map((opt, optIdx) => {
                         const isSelected = userVal === optIdx;
                         const isThisCorrect = q.correctAnswerIndex === optIdx;
                         let base = "p-3 rounded-xl border text-sm transition-all text-left flex items-center gap-3";
                         if (showResult) {
                            if (isThisCorrect) base += " bg-teal-50 border-teal-500 text-teal-800 font-medium dark:bg-teal-900/30 dark:border-teal-600 dark:text-teal-200";
                            else if (isSelected) base += " bg-rose-50 border-rose-500 text-rose-800 dark:bg-rose-900/30 dark:border-rose-600 dark:text-rose-200";
                            else base += " bg-stone-50 border-stone-100 opacity-50 dark:bg-stone-900 dark:border-stone-800";
                         } else {
                            if (isSelected) base += " bg-orange-50 border-orange-500 text-orange-900 shadow-sm dark:bg-orange-900/30 dark:border-orange-500 dark:text-orange-200";
                            else base += " bg-white border-stone-200 hover:border-orange-300 hover:bg-orange-50/50 dark:bg-stone-800 dark:border-stone-600 dark:hover:border-orange-500/50 dark:text-stone-300";
                         }
                         return (
                           <button key={optIdx} onClick={() => setPart1Answers(p => ({...p, [q.id]: optIdx}))} disabled={isSubmitted} className={base}>
                             <span className="w-6 h-6 rounded border flex items-center justify-center text-xs font-bold bg-white dark:bg-stone-700 dark:border-stone-600 dark:text-stone-300">{String.fromCharCode(65+optIdx)}</span>
                             <span className="flex-1"><MathRenderer text={cleanOptionText(opt)} /></span>
                             {showResult && isThisCorrect && <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                           </button>
                         )
                      })}
                    </div>
                    {showResult && renderExplanation(q.explanation)}
                  </div>
                )
              })}
           </div>
        </section>

        {/* Part 2 */}
        <section className="bg-white dark:bg-stone-800 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-stone-100 dark:border-stone-700 transition-colors">
           <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg text-blue-600 dark:text-blue-400"><CheckCircle className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">Phần 2: Đọc hiểu văn bản</h3>
           </div>
           <div className="space-y-10">
              {quizData.part2.map((q, idx) => (
                 <div key={q.id}>
                    <div className="bg-stone-50 dark:bg-stone-900 p-5 rounded-xl border-l-4 border-orange-400 mb-4 italic text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                       <Quote className="w-8 h-8 text-orange-200 dark:text-orange-800 mb-2" />
                       <MathRenderer text={q.stem} />
                    </div>
                    <div className="space-y-2">
                       {q.statements.map((s) => {
                          const key = `${q.id}-${s.id}`;
                          const val = part2Answers[key];
                          const showResult = shouldShowResult(val !== undefined && val !== null);
                          return (
                             <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-stone-100 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                                <span className="text-sm font-medium text-stone-800 dark:text-stone-200 flex-1 mr-4"><MathRenderer text={s.statement} /></span>
                                <div className="flex gap-2 shrink-0">
                                   <button onClick={() => setPart2Answers(p => ({...p, [key]: true}))} disabled={isSubmitted} 
                                      className={`px-3 py-1 rounded text-xs font-bold border ${val === true ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-stone-400 border-stone-200 dark:bg-stone-800 dark:border-stone-600'}`}>Đúng</button>
                                   <button onClick={() => setPart2Answers(p => ({...p, [key]: false}))} disabled={isSubmitted} 
                                      className={`px-3 py-1 rounded text-xs font-bold border ${val === false ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-stone-400 border-stone-200 dark:bg-stone-800 dark:border-stone-600'}`}>Sai</button>
                                </div>
                             </div>
                          )
                       })}
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Part 3 */}
        <section className="bg-white dark:bg-stone-800 rounded-[2rem] p-6 sm:p-8 shadow-sm border border-stone-100 dark:border-stone-700 transition-colors">
           <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg text-purple-600 dark:text-purple-400"><PenTool className="w-6 h-6" /></div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 serif">Phần 3: Điền từ / Ngắn</h3>
           </div>
           <div className="grid md:grid-cols-2 gap-6">
              {quizData.part3.map((q, idx) => {
                 const val = part3Answers[q.id] || "";
                 const revealed = part3Revealed[q.id];
                 const showResult = isSubmitted || revealed;
                 const correctStr = String(q.correctAnswer).trim();
                 const isMatch = val.trim().toLowerCase() === correctStr.toLowerCase();
                 
                 return (
                    <div key={q.id} className="bg-stone-50 dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-700 flex flex-col">
                       <p className="font-medium text-stone-800 dark:text-stone-200 mb-4 serif"><span className="font-bold text-stone-400 dark:text-stone-500 mr-2">Câu {idx+1}.</span> <MathRenderer text={q.question} /></p>
                       <div className="mt-auto relative">
                          <input type="text" value={val} onChange={(e) => setPart3Answers(p => ({...p, [q.id]: e.target.value}))} disabled={isSubmitted} placeholder="Nhập câu trả lời..." 
                             className={`w-full p-3 rounded-lg border outline-none font-medium dark:bg-stone-800 dark:text-white ${showResult ? (isMatch ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-800 dark:text-teal-200' : 'border-rose-400 bg-rose-50 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200') : 'border-stone-300 dark:border-stone-600 focus:border-orange-500 dark:focus:border-orange-500'}`} />
                          {showResult && !isMatch && <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-bold">Đáp án: {q.correctAnswer}</div>}
                       </div>
                    </div>
                 )
              })}
           </div>
        </section>
      </div>

      {!isSubmitted && (
         <div className="fixed bottom-6 left-0 right-0 z-20 flex justify-center px-4 pointer-events-none">
            <button onClick={handleAttemptSubmit} className="pointer-events-auto shadow-xl shadow-orange-900/20 bg-stone-900 dark:bg-orange-600 text-white font-bold py-4 px-10 rounded-full hover:bg-black dark:hover:bg-orange-700 transition-transform active:scale-95 flex items-center gap-2">
               <CheckCircle className="w-5 h-5" /> Nộp bài hoàn thành
            </button>
         </div>
      )}

      {/* Simplified Confirm/Result Modals */}
      {showConfirmModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-stone-800 rounded-2xl p-6 max-w-sm w-full text-center border border-stone-200 dark:border-stone-700">
               <h3 className="text-xl font-bold mb-2 text-stone-900 dark:text-stone-100">Nộp bài ngay?</h3>
               <p className="text-stone-500 dark:text-stone-400 mb-6">Em hãy kiểm tra kỹ các câu trả lời trước khi nộp nhé.</p>
               <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 bg-stone-100 dark:bg-stone-700 rounded-lg font-bold text-stone-600 dark:text-stone-300">Xem lại</button>
                  <button onClick={confirmManualSubmit} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700">Nộp luôn</button>
               </div>
            </div>
         </div>
      )}

      {showResultModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 p-4">
             <div className="bg-white dark:bg-stone-800 rounded-3xl overflow-hidden max-w-md w-full animate-in zoom-in-95 border border-stone-200 dark:border-stone-700">
                <div className={`p-8 text-center text-white ${calculateScore() >= 5 ? 'bg-teal-600' : 'bg-orange-500'}`}>
                   <div className="text-6xl font-black mb-2 serif">{calculateScore()}</div>
                   <div className="font-bold opacity-90 uppercase tracking-widest text-sm">Điểm số</div>
                </div>
                <div className="p-8 space-y-4">
                   <div className="flex items-center gap-3 p-4 bg-stone-50 dark:bg-stone-700 rounded-xl">
                      <div className="bg-stone-200 dark:bg-stone-600 p-2 rounded-full"><User className="w-6 h-6 text-stone-500 dark:text-stone-300" /></div>
                      <div>
                         <div className="font-bold text-stone-800 dark:text-stone-100">{studentName}</div>
                         <div className="text-xs text-stone-500 dark:text-stone-400">Lớp {className}</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => onFinish(calculateScore())} className="col-span-2 py-3 bg-stone-900 dark:bg-stone-700 text-white rounded-xl font-bold hover:bg-black dark:hover:bg-stone-600 transition-colors">Kết thúc</button>
                      <button onClick={() => setShowResultModal(false)} className="py-3 bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl font-bold hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors">Xem lại bài</button>
                      <button onClick={handleShare} className="py-3 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors">Chia sẻ</button>
                   </div>
                </div>
             </div>
         </div>
      )}
    </div>
  );
};