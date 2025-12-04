export interface Lesson {
  id: string;
  title: string;
  chapterId?: string;
  description?: string; // Add description for literary texts
  topic?: string;
  texts?: string[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  theme: string;
  lessons: Lesson[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

// Quiz Data Structures
export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface MultipleChoiceQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  explanation?: string;
}

export interface TrueFalseStatement {
  id: number;
  statement: string;
  isTrue: boolean;
  explanation?: string;
}

export interface TrueFalseQuestion {
  id: number;
  stem: string; // The main context of the question (e.g., a passage)
  statements: TrueFalseStatement[]; // Always 4 statements
}

export interface ShortAnswerQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  explanation?: string;
}

export interface QuizData {
  topic: string;
  part1: MultipleChoiceQuestion[];
  part2: TrueFalseQuestion[];
  part3: ShortAnswerQuestion[];
}

export interface UserProgress {
  scores: Record<string, number>; // lessonId -> maxScore
}

export interface LitNews {
  title: string;
  content: string;
  imageUrl?: string;
}

export enum AppScreen {
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  WRITING = 'WRITING', // Added writing screen
}

export type QuizMode = 'ASSESSMENT' | 'PRACTICE';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  isError?: boolean;
}
