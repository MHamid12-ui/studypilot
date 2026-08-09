import { db } from './storage';
import { getCurrentUser } from './auth';
import type { QuizQuestion, QuizResponse } from '../types';

export function saveQuizQuestion(
  topicId: string,
  questionText: string,
  options: string[],
  correctIndex: number,
  explanation: string
): QuizQuestion {
  return db.create<QuizQuestion>('quiz_questions', {
    topicId,
    questionText,
    options,
    correctIndex,
    explanation,
    generatedBy: 'ai',
  } as any);
}

export function getQuizQuestion(id: string): QuizQuestion | undefined {
  return db.getById<QuizQuestion>('quiz_questions', id);
}

export function saveQuizResponse(
  questionId: string,
  sessionId: string,
  selectedIndex: number,
  isCorrect: boolean
): QuizResponse {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  return db.create<QuizResponse>('quiz_responses', {
    userId: user.id,
    questionId,
    sessionId,
    selectedIndex,
    isCorrect,
  } as any);
}

export function getUserQuizResponses(): (QuizResponse & { question?: QuizQuestion })[] {
  const user = getCurrentUser();
  if (!user) return [];
  const responses = db.query<QuizResponse>('quiz_responses', r => r.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return responses.map(r => ({
    ...r,
    question: db.getById<QuizQuestion>('quiz_questions', r.questionId),
  }));
}

export function getSessionQuizResponses(sessionId: string): (QuizResponse & { question?: QuizQuestion })[] {
  const responses = db.query<QuizResponse>('quiz_responses', r => r.sessionId === sessionId);
  return responses.map(r => ({
    ...r,
    question: db.getById<QuizQuestion>('quiz_questions', r.questionId),
  }));
}