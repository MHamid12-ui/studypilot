// LocalStorage-backed data store — mimics Supabase tables

const STORAGE_PREFIX = 'studypilot_';

function getCollection<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setCollection<T>(key: string, data: T[]): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

function generateId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

// Generic CRUD
function create<T extends { id: string }>(collection: string, item: Record<string, any>): T {
  const items = getCollection<T>(collection);
  const newItem = {
    ...item,
    id: item.id || generateId(),
    createdAt: (item as any).createdAt || now(),
  } as unknown as T;
  items.push(newItem);
  setCollection(collection, items);
  return newItem;
}

function getAll<T extends { id: string }>(collection: string): T[] {
  return getCollection<T>(collection);
}

function getById<T extends { id: string }>(collection: string, id: string): T | undefined {
  return getCollection<T>(collection).find(item => item.id === id);
}

function update<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | undefined {
  const items = getCollection<T>(collection);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  items[index] = { ...items[index], ...updates };
  setCollection(collection, items);
  return items[index];
}

function remove(collection: string, id: string): boolean {
  const items = getCollection(collection);
  const filtered = items.filter(item => (item as any).id !== id);
  if (filtered.length === items.length) return false;
  setCollection(collection, filtered);
  return true;
}

function query<T extends Record<string, any>>(collection: string, predicate: (item: T) => boolean): T[] {
  return getCollection<T>(collection).filter(predicate);
}

function clearCollection(collection: string): void {
  localStorage.removeItem(STORAGE_PREFIX + collection);
}

export const db = {
  create,
  getAll,
  getById,
  update,
  remove,
  query,
  clearCollection,
  generateId,
  now,
};