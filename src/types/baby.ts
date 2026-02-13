export type Gender = 'male' | 'female';

export type WeightUnit = 'kg' | 'lb';
export type HeightUnit = 'cm' | 'in';
export type Language = 'en' | 'es' | 'fr' | 'de';

export interface GrowthEntry {
  id: string;
  date: string;
  weight: number; // stored in kg
  height: number; // stored in cm
  note?: string;
}

export interface MilkEntry {
  id: string;
  date: string; // ISO date string including time
  amount: number; // measured in ml
  note?: string;
}

export interface Baby {
  id: string;
  name: string;
  gender: Gender;
  birthDate: string;
  entries: GrowthEntry[];
  milkEntries: MilkEntry[];
}

export interface AppSettings {
  weightUnit: WeightUnit;
  heightUnit: HeightUnit;
  language: Language;
}

export interface AppData {
  babies: Baby[];
  activeBabyId: string | null;
  settings: AppSettings;
}
