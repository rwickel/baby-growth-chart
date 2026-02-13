import { useState, useEffect, useCallback } from 'react';
import { AppData, Baby, GrowthEntry, MilkEntry, AppSettings, Gender, Language, WeightUnit, HeightUnit } from '@/types/baby';
import { generateUUID } from '@/lib/utils';

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
          id: generateUUID(),
          name: 'Baby',
          gender: parsed.gender,
          birthDate: '',
          entries: parsed.entries,
          milkEntries: [],
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
        // Ensure all babies have milkEntries
        const babiesWithMilk = (parsed.babies || []).map((b: any) => ({
          ...b,
          milkEntries: b.milkEntries || []
        }));
        return {
          ...defaultData,
          ...parsed,
          babies: babiesWithMilk,
          settings: { ...defaultSettings, ...parsed.settings }
        };
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
  const addBaby = useCallback((name: string, gender: Gender, birthDate: string, weight?: number, height?: number) => {
    const entries: GrowthEntry[] = [];

    if (weight !== undefined || height !== undefined) {
      entries.push({
        id: generateUUID(),
        date: birthDate,
        weight: weight || 0,
        height: height || 0,
        note: 'Birth record',
      });
    }

    const newBaby: Baby = {
      id: generateUUID(),
      name,
      gender,
      birthDate,
      entries,
      milkEntries: [],
    };
    setData(prev => ({
      ...prev,
      babies: [...prev.babies, newBaby],
      activeBabyId: newBaby.id,
    }));
    return newBaby.id;
  }, []);

  const updateBaby = useCallback((id: string, updates: Partial<Omit<Baby, 'id' | 'entries' | 'milkEntries'>>) => {
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
      id: generateUUID(),
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

  // Milk Entry management
  const addMilkEntry = useCallback((entry: Omit<MilkEntry, 'id'>) => {
    if (!data.activeBabyId) return;

    const newEntry: MilkEntry = {
      ...entry,
      id: generateUUID(),
    };

    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === prev.activeBabyId
          ? {
            ...baby,
            milkEntries: [...(baby.milkEntries || []), newEntry].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          }
          : baby
      ),
    }));
  }, [data.activeBabyId]);

  const updateMilkEntry = useCallback((id: string, updates: Partial<Omit<MilkEntry, 'id'>>) => {
    if (!data.activeBabyId) return;

    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === prev.activeBabyId
          ? {
            ...baby,
            milkEntries: (baby.milkEntries || [])
              .map(entry => (entry.id === id ? { ...entry, ...updates } : entry))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          }
          : baby
      ),
    }));
  }, [data.activeBabyId]);

  const deleteMilkEntry = useCallback((id: string) => {
    if (!data.activeBabyId) return;

    setData(prev => ({
      ...prev,
      babies: prev.babies.map(baby =>
        baby.id === prev.activeBabyId
          ? {
            ...baby,
            milkEntries: (baby.milkEntries || []).filter(entry => entry.id !== id),
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

    // Milk Entry actions
    addMilkEntry,
    updateMilkEntry,
    deleteMilkEntry,

    // Utilities (exposed for testing)
    generateUUID,
  };
}
