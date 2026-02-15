import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EntriesList } from './EntriesList';
import { AppSettings, GrowthEntry } from '@/types/baby';

// Mock translation hook
vi.mock('@/hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe('EntriesList Component', () => {
    const mockSettings: AppSettings = {
        weightUnit: 'kg',
        heightUnit: 'cm',
        language: 'en',
    };

    const mockEntries: GrowthEntry[] = [
        {
            id: '1',
            date: '2023-01-01',
            weight: 5, // 5kg
            height: 50,
        },
    ];

    const mockUpdate = vi.fn();
    const mockDelete = vi.fn();

    it('should display weight in kg when settings unit is kg', () => {
        render(
            <EntriesList
                entries={mockEntries}
                settings={mockSettings}
                onUpdate={mockUpdate}
                onDelete={mockDelete}
            />
        );

        // displayWeight(5, 'kg') should be '5.00'
        expect(screen.getByText('5.00')).toBeDefined();
        expect(screen.getByText('kg')).toBeDefined();
    });

    it('should display converted weight when settings unit is lb', () => {
        const lbSettings: AppSettings = { ...mockSettings, weightUnit: 'lb' };
        render(
            <EntriesList
                entries={mockEntries}
                settings={lbSettings}
                onUpdate={mockUpdate}
                onDelete={mockDelete}
            />
        );

        // displayWeight(5, 'lb') should be '11.02' (5 * 2.20462 ≈ 11.0231)
        expect(screen.getByText('11.02')).toBeDefined();
        expect(screen.getByText('lb')).toBeDefined();
    });

    it('should display height in cm when settings unit is cm', () => {
        render(
            <EntriesList
                entries={mockEntries}
                settings={mockSettings}
                onUpdate={mockUpdate}
                onDelete={mockDelete}
            />
        );

        // displayHeight(50, 'cm') should be '50.0'
        expect(screen.getByText('50.0')).toBeDefined();
        expect(screen.getByText('cm')).toBeDefined();
    });

    it('should display converted height when settings unit is in', () => {
        const inSettings: AppSettings = { ...mockSettings, heightUnit: 'in' };
        render(
            <EntriesList
                entries={mockEntries}
                settings={inSettings}
                onUpdate={mockUpdate}
                onDelete={mockDelete}
            />
        );

        // displayHeight(50, 'in') should be '19.7' (50 / 2.54 ≈ 19.685)
        expect(screen.getByText('19.7')).toBeDefined();
        expect(screen.getByText('in')).toBeDefined();
    });
});
