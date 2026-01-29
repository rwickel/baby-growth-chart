export type Gender = 'male' | 'female';

export interface GrowthEntry {
  id: string;
  date: string;
  weight: number; // in kg
  height: number; // in cm
}

export interface BabyData {
  gender: Gender;
  entries: GrowthEntry[];
}
