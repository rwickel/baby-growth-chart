import { useState, useEffect } from 'react';
import { BabyData, Gender, GrowthEntry } from '@/types/baby';

const STORAGE_KEY = 'baby-growth-tracker';

const defaultData: BabyData = {
  gender: 'male',
  entries: [],
};

export function useBabyData() {
  const [data, setData] = useState<BabyData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultData;
      }
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setGender = (gender: Gender) => {
    setData(prev => ({ ...prev, gender }));
  };

  const addEntry = (entry: Omit<GrowthEntry, 'id'>) => {
    const newEntry: GrowthEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setData(prev => ({
      ...prev,
      entries: [...prev.entries, newEntry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    }));
  };

  const updateEntry = (id: string, updates: Partial<Omit<GrowthEntry, 'id'>>) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries
        .map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    }));
  };

  const deleteEntry = (id: string) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id),
    }));
  };

  return {
    gender: data.gender,
    entries: data.entries,
    setGender,
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
