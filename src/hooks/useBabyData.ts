import { useState, useEffect, useCallback } from 'react';
import { AppData, Baby, GrowthEntry, AppSettings, Gender, Language, WeightUnit, HeightUnit } from '@/types/baby';

const STORAGE_KEY = 'baby-growth-tracker-v2';

const defaultSettings: AppSettings = {
  weightUnit: 'kg',
  heightUnit: 'cm',
  language: 'en',
};

const defaultData: AppData = {
  babies: [],
  activeBabyId: null,
  settings: defaultSettings,
};

// Migration from old format
function migrateFromV1(): AppData | null {
  const oldData = localStorage.getItem('baby-growth-tracker');
  if (oldData) {
    try {
      const parsed = JSON.parse(oldData);
      if (parsed.gender && Array.isArray(parsed.entries)) {
        // Old format detected, migrate
        const newBaby: Baby = {
          id: crypto.randomUUID(),
          name: 'Baby',
          gender: parsed.gender,
          birthDate: '',
          entries: parsed.entries,
        };
        return {
          babies: [newBaby],
          activeBabyId: newBaby.id,
          settings: defaultSettings,
        };
      }
    } catch {
      // Ignore parse errors
    }
  }
  return null;
}

export function useBabyData() {
  const [data, setData] = useState<AppData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultData, ...parsed, settings: { ...defaultSettings, ...parsed.settings } };
      } catch {
        return defaultData;
      }
    }
    // Try migration from v1
    const migrated = migrateFromV1();
    if (migrated) {
      return migrated;
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const activeBaby = data.babies.find(b => b.id === data.activeBabyId) || null;

  // Settings
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  }, []);

  const setLanguage = useCallback((language: Language) => {
    updateSettings({ language });
  }, [updateSettings]);

  const setWeightUnit = useCallback((weightUnit: WeightUnit) => {
    updateSettings({ weightUnit });
  }, [updateSettings]);

  const setHeightUnit = useCallback((heightUnit: HeightUnit) => {
    updateSettings({ heightUnit });
  }, [updateSettings]);

  // Baby management
  const addBaby = useCallback((name: string, gender: Gender, birthDate: string) => {
    const newBaby: Baby = {
      id: crypto.randomUUID(),
      name,
      gender,
      birthDate,
      entries: [],
    };
    setData(prev => ({
      ...prev,
      babies: [...prev.babies, newBaby],
      activeBabyId: newBaby.id,
    }));
    return newBaby.id;
  }, []);

  const updateBaby = useCallback((id: string, updates: Partial<Omit<Baby, 'id' | 'entries'>>) => {
    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === id ? { ...baby, ...updates } : baby
      ),
    }));
  }, []);

  const deleteBaby = useCallback((id: string) => {
    setData(prev => {
      const newBabies = prev.babies.filter(b => b.id !== id);
      return {
        ...prev,
        babies: newBabies,
        activeBabyId: prev.activeBabyId === id 
          ? (newBabies.length > 0 ? newBabies[0].id : null)
          : prev.activeBabyId,
      };
    });
  }, []);

  const setActiveBaby = useCallback((id: string) => {
    setData(prev => ({ ...prev, activeBabyId: id }));
  }, []);

  // Entry management (for active baby)
  const addEntry = useCallback((entry: Omit<GrowthEntry, 'id'>) => {
    if (!data.activeBabyId) return;
    
    const newEntry: GrowthEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    
    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === prev.activeBabyId
          ? {
              ...baby,
              entries: [...baby.entries, newEntry].sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
              ),
            }
          : baby
      ),
    }));
  }, [data.activeBabyId]);

  const updateEntry = useCallback((id: string, updates: Partial<Omit<GrowthEntry, 'id'>>) => {
    if (!data.activeBabyId) return;
    
    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === prev.activeBabyId
          ? {
              ...baby,
              entries: baby.entries
                .map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            }
          : baby
      ),
    }));
  }, [data.activeBabyId]);

  const deleteEntry = useCallback((id: string) => {
    if (!data.activeBabyId) return;
    
    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === prev.activeBabyId
          ? {
              ...baby,
              entries: baby.entries.filter(entry => entry.id !== id),
            }
          : baby
      ),
    }));
  }, [data.activeBabyId]);

  return {
    // Data
    babies: data.babies,
    activeBaby,
    settings: data.settings,
    
    // Settings actions
    setLanguage,
    setWeightUnit,
    setHeightUnit,
    
    // Baby actions
    addBaby,
    updateBaby,
    deleteBaby,
    setActiveBaby,
    
    // Entry actions
    addEntry,
    updateEntry,
    deleteEntry,
  };
}
