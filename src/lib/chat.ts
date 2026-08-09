import { db } from './storage';
import { getCurrentUser } from './auth';
import type { ChatSession, ChatMessage, MessageContent } from '../types';

export function createSession(topicId: string, topicName: string): ChatSession {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const session = db.create<ChatSession>('chat_sessions', {
    userId: user.id,
    topicId,
    title: `${topicName} Session`,
    updatedAt: db.now(),
  } as any);

  return session;
}

export function getSession(id: string): ChatSession | undefined {
  return db.getById<ChatSession>('chat_sessions', id);
}

export function getUserSessions(): ChatSession[] {
  const user = getCurrentUser();
  if (!user) return [];
  const sessions = db.query<ChatSession>('chat_sessions', s => s.userId === user.id);
  return sessions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getSessionMessages(sessionId: string): ChatMessage[] {
  return db.query<ChatMessage>('chat_messages', m => m.sessionId === sessionId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: MessageContent
): ChatMessage {
  return db.create<ChatMessage>('chat_messages', {
    sessionId,
    role,
    content,
  } as any);
}

export function updateSessionTitle(sessionId: string, title: string): void {
  db.update<ChatSession>('chat_sessions', sessionId, {
    title,
    updatedAt: db.now(),
  } as any);
}

export function deleteSession(sessionId: string): void {
  // Delete all messages first
  const messages = db.query<ChatMessage>('chat_messages', m => m.sessionId === sessionId);
  for (const msg of messages) {
    db.remove('chat_messages', msg.id);
  }
  db.remove('chat_sessions', sessionId);
}