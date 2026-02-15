import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useBabyData } from './useBabyData';

describe('useBabyData Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default data', () => {
    const { result } = renderHook(() => useBabyData());

    expect(result.current.babies).toEqual([]);
    expect(result.current.activeBaby).toBeNull();
    expect(result.current.settings).toEqual({
      weightUnit: 'kg',
      heightUnit: 'cm',
      language: 'en',
    });
  });

  it('should add a baby and set as active', () => {
    const { result } = renderHook(() => useBabyData());

    act(() => {
      result.current.addBaby('Test Baby', 'male', '2023-01-01');
    });

    expect(result.current.babies).toHaveLength(1);
    expect(result.current.babies[0].name).toBe('Test Baby');
    expect(result.current.babies[0].gender).toBe('male');
    expect(result.current.activeBaby).toBeDefined();
    expect(result.current.activeBaby?.id).toBe(result.current.babies[0].id);
  });

  it('should update settings', () => {
    const { result } = renderHook(() => useBabyData());

    act(() => {
      result.current.setLanguage('de');
      result.current.setWeightUnit('lb');
      result.current.setHeightUnit('in');
    });

    expect(result.current.settings.language).toBe('de');
    expect(result.current.settings.weightUnit).toBe('lb');
    expect(result.current.settings.heightUnit).toBe('in');
  });

  it('should add an entry to the active baby', () => {
    const { result } = renderHook(() => useBabyData());

    // Add baby first
    act(() => {
      result.current.addBaby('Test Baby', 'female', '2023-01-01');
    });

    // Add entry
    const entryData = {
      date: '2023-02-01',
      weight: 5,
      height: 60,
      headCircumference: 40,
    };

    act(() => {
      result.current.addEntry(entryData);
    });

    expect(result.current.activeBaby?.entries).toHaveLength(1);
    expect(result.current.activeBaby?.entries[0]).toMatchObject(entryData);
  });

  it('should delete a baby', () => {
    const { result } = renderHook(() => useBabyData());

    act(() => {
      result.current.addBaby('Baby 1', 'male', '2023-01-01');
      result.current.addBaby('Baby 2', 'female', '2023-02-01');
    });

    expect(result.current.babies).toHaveLength(2);
    const baby1Id = result.current.babies[0].id;

    act(() => {
      result.current.deleteBaby(baby1Id);
    });

    expect(result.current.babies).toHaveLength(1);
    expect(result.current.babies[0].name).toBe('Baby 2');
  });

  it('should update an entry', () => {
    const { result } = renderHook(() => useBabyData());

    act(() => {
      result.current.addBaby('Test Baby', 'male', '2023-01-01');
    });

    act(() => {
      result.current.addEntry({
        date: '2023-02-01',
        weight: 5,
        height: 60,
      });
    });

    const entryId = result.current.activeBaby!.entries[0].id;

    act(() => {
      result.current.updateEntry(entryId, { weight: 5.5 });
    });

    expect(result.current.activeBaby?.entries[0].weight).toBe(5.5);
    expect(result.current.activeBaby?.entries[0].height).toBe(60);
  });

  it('should delete an entry', () => {
    const { result } = renderHook(() => useBabyData());

    act(() => {
      result.current.addBaby('Test Baby', 'male', '2023-01-01');
    });

    act(() => {
      result.current.addEntry({
        date: '2023-02-01',
        weight: 5,
        height: 60,
      });
    });

    const entryId = result.current.activeBaby!.entries[0].id;

    act(() => {
      result.current.deleteEntry(entryId);
    });

    expect(result.current.activeBaby?.entries).toHaveLength(0);
  });

  it('should handle weight unit conversions across settings', () => {
    const { result } = renderHook(() => useBabyData());

    act(() => {
      result.current.addBaby('Unit Test Baby', 'male', '2023-01-01');
    });

    act(() => {
      result.current.addEntry({
        date: '2023-01-01',
        weight: 5, // 5kg
        height: 50,
      });
    });

    expect(result.current.activeBaby?.entries[0].weight).toBe(5);

    act(() => {
      result.current.setWeightUnit('lb');
    });

    expect(result.current.settings.weightUnit).toBe('lb');
    expect(result.current.activeBaby?.entries[0].weight).toBe(5);
  });
});
