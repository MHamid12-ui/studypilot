import { db } from './storage';
import { getCurrentUser } from './auth';
import type { Subject, Topic } from '../types';

export interface PresetSubject {
  name: string;
  topics: string[];
}

export const PRESET_SUBJECTS: PresetSubject[] = [
  {
    name: 'Mathematics',
    topics: [
      'Algebra',
      'Geometry',
      'Trigonometry',
      'Pre-Calculus',
      'Calculus',
      'Statistics & Probability',
      'Linear Algebra',
      'Discrete Mathematics',
    ],
  },
  {
    name: 'Computer Science',
    topics: [
      'Programming Fundamentals',
      'Data Structures',
      'Algorithms',
      'Web Development',
      'Databases',
      'Operating Systems',
      'Networks',
      'Cybersecurity',
    ],
  },
];

export function seedPresetData(): void {
  const existing = db.query<Subject>('subjects', s => s.isPreset === true);
  if (existing.length > 0) return; // Already seeded

  for (const preset of PRESET_SUBJECTS) {
    const subject = db.create<Subject>('subjects', {
      name: preset.name,
      isPreset: true,
      userId: null,
    } as any);

    for (const topicName of preset.topics) {
      db.create<Topic>('topics', {
        name: topicName,
        subjectId: subject.id,
        isPreset: true,
        userId: null,
      } as any);
    }
  }
}

export function getAllSubjects(): Subject[] {
  return db.getAll<Subject>('subjects');
}

export function getPresetSubjects(): Subject[] {
  return db.query<Subject>('subjects', s => s.isPreset === true);
}

export function getCustomSubjects(): Subject[] {
  const user = getCurrentUser();
  if (!user) return [];
  return db.query<Subject>('subjects', (s: Subject) => s.isPreset === false && s.userId === user.id);
}

export function getTopicsBySubject(subjectId: string): Topic[] {
  return db.query<Topic>('topics', t => t.subjectId === subjectId);
}

export function getPresetTopics(subjectId: string): Topic[] {
  return db.query<Topic>('topics', t => t.subjectId === subjectId && t.isPreset === true);
}

export function getCustomTopics(subjectId: string): Topic[] {
  const user = getCurrentUser();
  if (!user) return [];
  return db.query<Topic>('topics', t => t.subjectId === subjectId && t.isPreset === false && t.userId === user.id);
}

export function addCustomTopic(subjectId: string, name: string): Topic {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return db.create<Topic>('topics', {
    name: name.trim(),
    subjectId,
    isPreset: false,
    userId: user.id,
  } as any);
}

export function addCustomSubject(name: string): Subject {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return db.create<Subject>('subjects', {
    name: name.trim(),
    isPreset: false,
    userId: user.id,
  } as any);
}

export function getSubjectById(id: string): Subject | undefined {
  return db.getById<Subject>('subjects', id);
}

export function getTopicById(id: string): Topic | undefined {
  return db.getById<Topic>('topics', id);
}