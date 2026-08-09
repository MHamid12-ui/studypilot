export type EducationLevel = 'high_school' | 'undergraduate';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  educationLevel: EducationLevel;
  subjects: string[];
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  isPreset: boolean;
  userId: string | null;
  createdAt: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  isPreset: boolean;
  userId: string | null;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  topicId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: MessageContent;
  createdAt: string;
}

export type MessageContent =
  | { type: 'text'; text: string }
  | { type: 'quiz'; question: QuizQuestionData };

export interface QuizQuestionData {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  generatedBy: string;
  createdAt: string;
}

export interface QuizResponse {
  id: string;
  userId: string;
  questionId: string;
  sessionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  createdAt: string;
}

export type TabId = 'sessions' | 'quizzes';

export interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}