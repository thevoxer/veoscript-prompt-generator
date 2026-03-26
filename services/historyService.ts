
import { VideoPromptData, HistoryItem } from '../types';

const STORAGE_KEY = 'veoscript_history';
const MAX_ITEMS = 20;

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const saveHistoryItem = (userIdea: string, technicalPrompt: VideoPromptData, imageBase64?: string): void => {
  const history = getHistory();
  
  // Create new item
  const newItem: HistoryItem = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(),
    timestamp: Date.now(),
    userIdea,
    technicalPrompt,
    imageBase64
  };

  // Add to beginning, remove duplicates based on idea text to avoid spam, and slice to max
  // Note: If image is different but text is same, we technically consider it different, but for simplicity we filter by text idea.
  // A better approach might be to check both, but keeping it simple:
  const filtered = history.filter(h => h.userIdea !== userIdea);
  const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
