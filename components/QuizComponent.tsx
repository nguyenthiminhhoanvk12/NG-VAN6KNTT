import React, { useState, useEffect } from 'react';
import { Lesson, QuizQuestion } from '../types';
import { generateQuizForLesson } from '../services/geminiService';
import { CheckCircle, XCircle, AlertCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizComponentProps {
  lesson: Lesson;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ lesson }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [lesson]);

  const loadQuiz = async () => {
    setLoading(true);
    setQuizComplete(false);
    setCurrentIndex(0);
    setScore(0);
    setQuestions([]);
    const generatedQuestions = await generateQuizForLesson(lesson.title);
    setQuestions(generatedQuestions);
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-medium">Thầy đang soạn câu hỏi trắc nghiệm cho em...</p>
        <p className="text-slate-400 text-sm mt-2">Đợi một chút nhé!</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
       <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <p className="text-slate-600 text-center">Không thể tạo câu hỏi lúc này. Em hãy thử lại sau nhé.</p>
        <button onClick={loadQuiz} className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          Thử lại
        </button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="mb-6 p-6 bg-yellow-50 rounded-full border-4 border-yellow-100">
          <Award size={64} className="text-yellow-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Hoàn thành!</h2>
        <p className="text-slate-600 mb-6">
          Em đã trả lời đúng <span className="font-bold text-orange-600 text-xl">{score}/{questions.length}</span> câu hỏi.
        </p>
        <div className="flex gap-4">
           <button onClick={loadQuiz} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
            <RotateCcw size={20} /> Làm lại
          </button>
           <button onClick={() => {}} className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 shadow-md transition-colors">
            Bài tiếp theo
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Câu hỏi {currentIndex + 1}/{questions.length}</span>
          <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">Điểm: {score}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let stateClass = "border-slate-200 hover:border-orange-300 hover:bg-orange-50";
            let icon = null;

            if (selectedAnswer !== null) {
              if (idx === currentQ.correctAnswer) {
                stateClass = "border-green-500 bg-green-50 ring-1 ring-green-500 text-green-800";
                icon = <CheckCircle size={20} className="text-green-500" />;
              } else if (idx === selectedAnswer) {
                stateClass = "border-red-500 bg-red-50 text-red-800";
                icon = <XCircle size={20} className="text-red-500" />;
              } else {
                stateClass = "border-slate-100 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${stateClass}`}
              >
                <span className="font-medium">{option}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-bottom-4">
            <h4 className="font-bold text-indigo-900 mb-1 flex items-center gap-2">
              <span className="text-xl">💡</span> Giải thích:
            </h4>
            <p className="text-indigo-800 text-sm leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={selectedAnswer === null}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentIndex === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo"} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default QuizComponent;
