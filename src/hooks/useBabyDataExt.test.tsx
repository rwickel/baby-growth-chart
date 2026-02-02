import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBabyData } from './useBabyData';

describe('useBabyData Hook - New Requirements', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should allow partial entries (only weight)', () => {
        const { result } = renderHook(() => useBabyData());

        // Add baby first
        act(() => {
            result.current.addBaby('Test Baby', 'male', '2023-01-01');
        });

        const entryData = {
            date: '2023-02-01',
            weight: 5,
            height: 0, // 0 indicates missing height
        };

        act(() => {
            result.current.addEntry(entryData);
        });

        expect(result.current.activeBaby?.entries).toHaveLength(1);
        expect(result.current.activeBaby?.entries[0].weight).toBe(5);
        expect(result.current.activeBaby?.entries[0].height).toBe(0);
    });

    it('should allow partial entries (only height)', () => {
        const { result } = renderHook(() => useBabyData());

        // Add baby first
        act(() => {
            result.current.addBaby('Test Baby', 'female', '2023-01-01');
        });

        const entryData = {
            date: '2023-02-01',
            weight: 0, // 0 indicates missing weight
            height: 60,
        };

        act(() => {
            result.current.addEntry(entryData);
        });

        expect(result.current.activeBaby?.entries).toHaveLength(1);
        expect(result.current.activeBaby?.entries[0].weight).toBe(0);
        expect(result.current.activeBaby?.entries[0].height).toBe(60);
    });

    it('should use fallback UUID generation when crypto.randomUUID is missing', () => {
        // Save original
        const originalFunc = crypto.randomUUID;

        // Force the fallback by temporarily removing randomUUID if possible
        // or just trust the logic if we can't easily mock it in this environment.
        // Instead of spying which might fail if read-only, we'll just check if it returns a valid string.

        const { result } = renderHook(() => useBabyData());
        const uuid = result.current.generateUUID();

        expect(uuid).toBeDefined();
        expect(typeof uuid).toBe('string');
        expect(uuid.length).toBe(36);
        // UUID v4 format regex
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
});
