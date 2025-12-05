import React, { useState, useEffect, useRef } from 'react';
import { Lesson, LessonContent } from '../types';
import { generateSpeech } from '../services/geminiService';
import { Play, Square, ArrowLeft, BookOpen, CheckCircle, Loader2, Volume2 } from 'lucide-react';
import { MathRenderer } from './MathRenderer';

interface LessonViewProps {
  lesson: Lesson;
  content: LessonContent;
  onStartQuiz: () => void;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ lesson, content, onStartQuiz, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Cleanup audio on unmount
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleToggleAudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsLoadingAudio(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Generate speech for the summary
      const textToSpeak = `Bài học: ${content.title}. ${content.summary}`;
      const base64Audio = await generateSpeech(textToSpeak);
      
      const audioData = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(audioData, ctx, 24000, 1);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => setIsPlaying(false);
      source.start();
      
      sourceNodeRef.current = source;
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to play audio:", error);
      alert("Không thể phát âm thanh lúc này. Em hãy thử lại sau nhé.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 px-4 animate-in fade-in slide-in-from-bottom-4">
      <button onClick={onBack} className="mb-6 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-bold text-sm flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl shadow-stone-200 dark:shadow-black/50 overflow-hidden border border-stone-100 dark:border-stone-700 transition-colors">
        {/* Header */}
        <div className="bg-orange-50 dark:bg-stone-900 p-8 border-b border-orange-100 dark:border-stone-700">
           <div className="flex justify-between items-start gap-4">
             <div>
                <h1 className="text-3xl font-black text-stone-800 dark:text-stone-100 serif mb-2">{content.title}</h1>
                <p className="text-stone-600 dark:text-stone-400 font-medium italic">{lesson.description}</p>
             </div>
             <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl shadow-sm">
                <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
             </div>
           </div>
        </div>

        <div className="p-8">
           {/* Audio Control */}
           <div className="flex justify-center mb-8">
              <button 
                onClick={handleToggleAudio}
                disabled={isLoadingAudio}
                className={`
                  flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all shadow-md
                  ${isPlaying 
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/30 dark:text-rose-300' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300'
                  }
                `}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isPlaying ? (
                  <Square className="w-5 h-5 fill-current" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
                {isLoadingAudio ? "Đang tải giọng đọc..." : isPlaying ? "Dừng đọc" : "Nghe bài giảng"}
              </button>
           </div>

           {/* Content */}
           <div className="prose prose-stone dark:prose-invert max-w-none mb-10">
              <h3 className="text-xl font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2 mb-4">
                 <span className="text-2xl">📝</span> Tóm tắt nội dung
              </h3>
              <div className="bg-stone-50 dark:bg-stone-900/50 p-6 rounded-2xl border border-stone-100 dark:border-stone-700 text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                 <MathRenderer text={content.summary} />
              </div>

              <h3 className="text-xl font-bold text-teal-700 dark:text-teal-400 flex items-center gap-2 mb-4 mt-8">
                 <span className="text-2xl">💡</span> Kiến thức trọng tâm
              </h3>
              <ul className="space-y-3">
                 {content.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-100 dark:border-teal-800">
                       <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                       <span className="text-stone-700 dark:text-stone-300 font-medium">{point}</span>
                    </li>
                 ))}
              </ul>
           </div>

           {/* Action */}
           <div className="flex justify-center pt-6 border-t border-stone-100 dark:border-stone-700">
              <button 
                onClick={onStartQuiz}
                className="group flex items-center gap-3 bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 text-white font-bold text-lg py-4 px-12 rounded-2xl shadow-lg shadow-orange-200 dark:shadow-none transition-all hover:-translate-y-1"
              >
                 <span>Làm bài trắc nghiệm</span>
                 <Play className="w-5 h-5 fill-current group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Audio Utilities ---

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export default LessonView;