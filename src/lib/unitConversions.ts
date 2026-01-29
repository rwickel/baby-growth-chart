import { WeightUnit, HeightUnit } from '@/types/baby';

// Weight conversions
export function kgToLb(kg: number): number {
  return kg * 2.20462;
}

export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

// Height conversions
export function cmToIn(cm: number): number {
  return cm / 2.54;
}

export function inToCm(inches: number): number {
  return inches * 2.54;
}

// Display conversions
export function displayWeight(kg: number, unit: WeightUnit): string {
  if (unit === 'lb') {
    return kgToLb(kg).toFixed(2);
  }
  return kg.toFixed(2);
}

export function displayHeight(cm: number, unit: HeightUnit): string {
  if (unit === 'in') {
    return cmToIn(cm).toFixed(1);
  }
  return cm.toFixed(1);
}

// Parse from display unit to storage unit
export function parseWeight(value: number, unit: WeightUnit): number {
  if (unit === 'lb') {
    return lbToKg(value);
  }
  return value;
}

export function parseHeight(value: number, unit: HeightUnit): number {
  if (unit === 'in') {
    return inToCm(value);
  }
  return value;
}

// Get unit labels
export function getWeightLabel(unit: WeightUnit): string {
  return unit === 'lb' ? 'lb' : 'kg';
}

export function getHeightLabel(unit: HeightUnit): string {
  return unit === 'in' ? 'in' : 'cm';
}
