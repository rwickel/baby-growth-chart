import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EntryForm } from './EntryForm';
import { AppSettings } from '@/types/baby';

describe('EntryForm Component', () => {
    const mockSettings: AppSettings = {
        weightUnit: 'kg',
        heightUnit: 'cm',
        language: 'en',
    };

    const mockSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should submit weight in kg when unit is kg', () => {
        render(<EntryForm onSubmit={mockSubmit} settings={mockSettings} />);

        const weightInput = screen.getByLabelText(/weight/i);
        fireEvent.change(weightInput, { target: { value: '5.5' } });

        const submitBtn = screen.getByRole('button', { name: /add entry/i });
        fireEvent.click(submitBtn);

        expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
            weight: 5.5
        }));
    });

    it('should convert weight to kg when unit is lb', () => {
        const lbSettings: AppSettings = { ...mockSettings, weightUnit: 'lb' };
        render(<EntryForm onSubmit={mockSubmit} settings={lbSettings} />);

        // Use getByLabelText with regex to handle the unit suffix
        const weightInput = screen.getByLabelText(/weight/i);
        fireEvent.change(weightInput, { target: { value: '2.20462' } });

        const form = screen.getByRole('form', { name: /growth entry form/i });
        fireEvent.submit(form);

        expect(mockSubmit).toHaveBeenCalled();
        const submittedData = mockSubmit.mock.calls[0][0];
        expect(submittedData.weight).toBeCloseTo(1);
    });

    it('should initialize with correct weight in lb when editing', () => {
        const lbSettings: AppSettings = { ...mockSettings, weightUnit: 'lb' };
        const initialValues = {
            id: '1',
            date: '2023-01-01',
            weight: 1, // 1kg stored
            height: 50,
        };

        render(<EntryForm onSubmit={mockSubmit} settings={lbSettings} initialValues={initialValues} isEditing={true} />);

        const weightInput = screen.getByLabelText(/weight/i) as HTMLInputElement;
        // Should show 2.20 (kgToLb(1))
        expect(weightInput.value).toBe('2.20');
    });
});
