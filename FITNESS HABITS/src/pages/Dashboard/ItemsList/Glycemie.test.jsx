import React from 'react';
import firebaseConfig from "../../../firebaseConfig";

import { mgToMmol, tauxMmolValid, tauxMgValid } from '../ItemsList/Glycemie';

describe("Test Glycemie", () => {
    test('Ceci est mon premier test', () => {});

    test('Ceci est mon 2e test', () => {
        const expectedValue = 1.998;
        expect(mgToMmol(36)).toBe(expectedValue);
    });

    test("should return 1.998", () => {
        expect(Number(mgToMmol(36))).toBe(1.998);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(120)).toBe(false);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(11)).toBe(true);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(39)).toBe(true);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(2)).toBe(true);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(40)).toBe(true);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(1)).toBe(false);
    });

    test ("Test le taux de glycemie au Mmol " ,()  =>{
        expect(tauxMmolValid(41)).toBe(false);
    });

    test ("Test le taux de glycemie au Mg " ,()  =>{
        expect(tauxMgValid(20)).toBe(false);
    });

    test ("Test le taux de glycemie au Mg " ,()  =>{
        expect(tauxMgValid(37)).toBe(true);
    });

    test ("Test le taux de glycemie au Mg " ,()  =>{
        expect(tauxMgValid(35)).toBe(false);
    });

    test ("Test le taux de glycemie au Mg " ,()  =>{
        expect(tauxMgValid(36)).toBe(true);
    });

    test ("Test le taux de glycemie au Mg " ,()  =>{
        expect(tauxMgValid(218)).toBe(true);
    });

    test ("Test le taux de glycemie au Mg " ,()  =>{
        expect(tauxMgValid(219)).toBe(false);
    });
});
