import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import growthReferences from './growthReferences.json';

const DATA_DIR = path.resolve(__dirname, '../../src/data');

function parseCsv(filename: string) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const header = lines[0].split(';');

    const colIdx = {
        month: header.indexOf('Month'),
        p3: header.indexOf('P3'),
        p15: header.indexOf('P15'),
        p50: header.indexOf('P50'),
        p85: header.indexOf('P85'),
        p97: header.indexOf('P97')
    };

    const data: Record<number, any> = {};

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(';');
        const month = parseInt(cols[colIdx.month]);

        data[month] = {
            p3: parseFloat(cols[colIdx.p3].replace(',', '.')),
            p15: parseFloat(cols[colIdx.p15].replace(',', '.')),
            p50: parseFloat(cols[colIdx.p50].replace(',', '.')),
            p85: parseFloat(cols[colIdx.p85].replace(',', '.')),
            p97: parseFloat(cols[colIdx.p97].replace(',', '.'))
        };
    }
    return data;
}

describe('WHO Growth Reference Data Validation', () => {
    const percentiles = ['p3', 'p15', 'p50', 'p85', 'p97'] as const;

    describe('Male Data', () => {
        it('should match Weight-for-age (0-60m) CSV data', () => {
            const csvData = parseCsv('tab_wfa_boys_p_0_5(tab_wfa_boys_p_0_5).csv');
            const jsonRef = growthReferences.male.weight;

            jsonRef.months.forEach((month, index) => {
                const csvVals = csvData[month];
                percentiles.forEach(p => {
                    expect(jsonRef[p][index]).toBeCloseTo(csvVals[p], 1);
                });
            });
        });

        it('should match Length/Height-for-age (0-24m and 24-60m) CSV data', () => {
            const csvData02 = parseCsv('tab_lhfa_boys_p_0_2(tab_lhfa_boys_p_0_2).csv');
            const csvData25 = parseCsv('tab_lhfa_boys_p_2_5(tab_lhfa_boys_p_2_5).csv');
            const jsonRef = growthReferences.male.height;

            jsonRef.months.forEach((month, index) => {
                // At month 24, WHO has two values: Length (0-2) and Height (2-5).
                // Our JSON preserves the 0-2 value (Length) for month 24 during merge.
                const csvVals = month <= 24 ? csvData02[month] : csvData25[month];
                expect(csvVals).toBeDefined();
                percentiles.forEach(p => {
                    expect(jsonRef[p][index]).toBeCloseTo(csvVals[p], 1);
                });
            });
        });
    });

    describe('Female Data', () => {
        it('should match Weight-for-age (0-60m) CSV data', () => {
            const csvData = parseCsv('tab_wfa_girls_p_0_5(tab_wfa_girls_p_0_5).csv');
            const jsonRef = growthReferences.female.weight;

            jsonRef.months.forEach((month, index) => {
                const csvVals = csvData[month];
                percentiles.forEach(p => {
                    expect(jsonRef[p][index]).toBeCloseTo(csvVals[p], 1);
                });
            });
        });

        it('should match Length/Height-for-age (0-24m and 24-60m) CSV data', () => {
            const csvData02 = parseCsv('tab_lhfa_girls_p_0_2(tab_lhfa_girls_p_0_2).csv');
            const csvData25 = parseCsv('tab_lhfa_girls_p_2_5(tab_lhfa_girls_p_2_5).csv');
            const jsonRef = growthReferences.female.height;

            jsonRef.months.forEach((month, index) => {
                // At month 24, WHO has two values: Length (0-2) and Height (2-5).
                // Our JSON preserves the 0-2 value (Length) for month 24 during merge.
                const csvVals = month <= 24 ? csvData02[month] : csvData25[month];
                expect(csvVals).toBeDefined();
                percentiles.forEach(p => {
                    expect(jsonRef[p][index]).toBeCloseTo(csvVals[p], 1);
                });
            });
        });
    });
});
