import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import Food from '../Food';
import { ionFireEvent } from '@ionic/react-test-utils';
import { fireEvent } from '@testing-library/react';
import { round, SUPPORTED_UNITS_CONVERTER } from '../Food';

const dict = require("../../../../../translate/Translation.json");

let container = null;

let originalDashboard;
let originalLanguage;

beforeAll(() => {
    originalDashboard = localStorage.getItem("dashboard");
    originalLanguage = localStorage.getItem("userLanguage")
});

afterAll(() => {
    localStorage.setItem("dashboard", originalDashboard);
    localStorage.setItem("userLanguage", originalLanguage);
});

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

const setUp = (mock, testFunc) => {
    localStorage.setItem("dashboard", JSON.stringify(mock));
    const categoryKey = "someFoodCategory";

    render(<Food 
                categoryKey = { categoryKey }
                updateFoodConsumptionCallback = { () => { } }
                macroNutrientConsumption = { mock.food.categories[categoryKey].macroNutrientConsumption }
                foodItems = {mock.food.categories[categoryKey].items}
                currentDate = { new Date() }
                foodItemToEdit = { undefined }
                itemContainerDisplayStatus = { false }
                test = { true } 
            />, container);

    testFunc();
    localStorage.removeItem("dashboard");
};

const initDummyDashboard = () => {
    const dummyDashboard = {
        food: {
            globalMacroNutrientConsumption: {
                proteins: 0,
                carbs: 0,
                fibre: 0,
                fats: 0
            },
            categories: {
                someFoodCategory: {
                    macroNutrientConsumption: {
                        proteins: 0,
                        carbs: 0,
                        fibre: 0,
                        fats: 0
                    },
                    items: []
                }
            }
        }
    };
    return dummyDashboard;
};

const setUpNegativeMacroNutrient = (buttonId, targetData, targetTotal) => {
    const updateFunc = (id, initialAmount, targetIncrement) => {
        const button = document.getElementById(buttonId);
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const popup = document.getElementById('foodItemPopup');
        const input = popup.getElementsByClassName('divAddTextNut')[id + 1];
        input.value = initialAmount + targetIncrement;
        ionFireEvent.ionChange(input);
        const currentMacroQty = input.value;
        expect(currentMacroQty).toBe(targetTotal);
    };

    for (let i = 0; i < targetData.length; i++) {
        updateFunc(i, targetData[i].initialAmount, targetData[i].targetIncrement);
    }
};

const populateFoodItems = (start, end, expected, expectationFunc = (e) => {}) => {
    const addButton = document.getElementById("addButton");
    for (let i = start; i < end; i++) {
        addButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        const foodItemPopup = document.getElementById('foodItemPopup');

        const name = foodItemPopup.getElementsByClassName('divAddTextNut')[0];
        const qtyConsumed = foodItemPopup.getElementsByClassName('divAddTextNut')[1];
        const refQty = foodItemPopup.getElementsByClassName('divAddTextNut')[2];
        const unit = foodItemPopup.querySelector('#materialSelectAddHyd');
        const proteins = foodItemPopup.getElementsByClassName('divAddTextNut')[3];
        const carbs = foodItemPopup.getElementsByClassName('divAddTextNut')[4];
        const fibre = foodItemPopup.getElementsByClassName('divAddTextNut')[5];
        const fats = foodItemPopup.getElementsByClassName('divAddTextNut')[6];

        name.value = expected[i].name;
        ionFireEvent.ionChange(name);

        qtyConsumed.value = expected[i].qtyConsumed;    
        ionFireEvent.ionChange(qtyConsumed);

        refQty.value = expected[i].refQty;
        ionFireEvent.ionChange(refQty);

        unit.value = expected[i].unit;
        fireEvent.change(unit);

        proteins.value = expected[i].proteins;
        ionFireEvent.ionChange(proteins);

        carbs.value = expected[i].carbs;
        ionFireEvent.ionChange(carbs);

        fibre.value = expected[i].fibre;
        ionFireEvent.ionChange(fibre);

        fats.value = expected[i].fats;
        ionFireEvent.ionChange(fats);

        const saveButton = foodItemPopup.querySelector("#saveButton");
        saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expectationFunc(i);
    }
};

it("test negative quantity on macro-nutriments", () => {
    const dummyDashboard = initDummyDashboard();

    const targetData = [
        {
            initialAmount: 2,
            targetIncrement: -20
        },
        {
            initialAmount: 13,
            targetIncrement: -14
        },
        {
            initialAmount: 0,
            targetIncrement: -5
        },
        {
            initialAmount: 44,
            targetIncrement: -44
        }
    ];
    setUp(dummyDashboard, () => { setUpNegativeMacroNutrient('addButton', targetData, 0); });
});

it("test div visibility toggle", () => {
    const dummyDashboard = initDummyDashboard();
    const moduleNames = ["proteinFood", "grainFood", "vegetables", "fruit", "dairyProducts"];

    const getToggledValue = (i) => {
        return i % 2 == 0 ? "block" : "none";
    }

    moduleNames.forEach((moduleName, index) => 
        {
            act(() => {
                render(<Food 
                            categoryKey = { moduleNames[index] }
                            updateFoodConsumptionCallback = { () => {} }
                            macroNutrientConsumption = { dummyDashboard.food.categories.someFoodCategory.macroNutrientConsumption }
                            foodItems = { dummyDashboard.food.categories.someFoodCategory.items }
                            currentDate = { new Date() }
                            foodItemToEdit = { undefined }
                            itemContainerDisplayStatus = { false }
                        />, 
                        container);
            });
            const moduleImage = document.getElementById('moduleImg').src;
            expect(moduleImage).toBe(`http://localhost/assets/${ moduleNames[index] }.jpg`);

        const arrow = document.getElementById("proteinArrow");
        const elem = document.getElementById(moduleName);
        elem.style.display = "none";

        act(() => {
            for (let i = 0; i < 5; i++) {
                arrow.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                expect(elem.style.display).toBe(getToggledValue(i));
            }
        });
    });
});

it("test save item", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            favorite: false, 
            name: 'food item 1', 
            qtyConsumed: 250.16,
            refQty: 100, 
            proteins: 12.34, 
            carbs: 0.04, 
            fibre: 11.23, 
            fats: 965.07, 
            unit: 'g'
        },
        {
            favorite: false, 
            name: 'food item 2', 
            qtyConsumed: 12.34,
            refQty: 1.75, 
            proteins: 120.56, 
            carbs: 0.001, 
            fibre: 456.78, 
            fats: 0.9, 
            unit: 'oz'
        },
        {
            favorite: false, 
            name: 'food item 3', 
            qtyConsumed: 345.17,
            refQty: 110.07, 
            proteins: 34.56, 
            carbs: 0.95, 
            fibre: 11.11, 
            fats: 67.34, 
            unit: 'ml'
        },
        {
            favorite: false, 
            name: 'food item 4', 
            qtyConsumed: 0.79,
            refQty: 10, 
            proteins: 67.56, 
            carbs: 56.67, 
            fibre: 34.45, 
            fats: 78.19, 
            unit: 'lb'
        },
        {
            favorite: false, 
            name: 'food item 5', 
            qtyConsumed: 456.76,
            refQty: 100.75, 
            proteins: 34.14, 
            carbs: 56.76, 
            fibre: 88.88, 
            fats: 99.11, 
            unit: 'g'
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        expect(items.length).toBe(0);
    
        const expectationFunc = (index) => {
            expect(items.length).toBe(index + 1);
            expect(document.getElementById(items[index].id) === undefined && document.getElementById(items[index].id) === null).toBe(false);
            // Vu que chaque nouvel aliment est ajouté au début du tableau <code> items </code> (avec la fonction unshift()), on doit tester les valeurs de l'élément à l'indice 0 à chaque tour de boucle.  
            expect(items[0].name).toBe(expected[index].name);
            expect(items[0].qty).toBe(expected[index].qty);
            expect(items[0].unit).toBe(expected[index].unit);
            expect(items[0].proteins).toBe(expected[index].proteins);
            expect(items[0].carbs).toBe(expected[index].carbs);
            expect(items[0].fibre).toBe(expected[index].fibre);
            expect(items[0].fats).toBe(expected[index].fats);
        };
        
        populateFoodItems(0, expected.length, expected, expectationFunc);

        expect(items.length).toBe(expected.length);

        const localStorageDashboard = JSON.parse(localStorage.getItem("dashboard"));

        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.proteins).toBe(26815.44);
        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.carbs).toBe(2291.31);
        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fibre).toBe(93012.72);
        expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fats).toBe(6056.46);

        expect(document.getElementById('proteinConsumptionPerCategory').innerHTML).toBe('26815.44');
        expect(document.getElementById('carbConsumptionPerCategory').innerHTML).toBe('2291.31');
        expect(document.getElementById('fibreConsumptionPerCategory').innerHTML).toBe('93012.72');
        expect(document.getElementById('fatConsumptionPerCategory').innerHTML).toBe('6056.46');
    };
    setUp(dummyDashboard, testFunc);
});

it("test delete item", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            favorite: false, 
            name: 'food item 1', 
            qtyConsumed: 16.799,
            refQty: 5, 
            proteins: 0.01, 
            carbs: 0.9, 
            fibre: 1.23, 
            fats: 34.59, 
            unit: 'g'
        },
        {
            favorite: false, 
            name: 'food item 2', 
            qtyConsumed: 11.33,
            refQty: 10.75, 
            proteins: 0.001, 
            carbs: 4.567, 
            fibre: 56.78, 
            fats: 0.09, 
            unit: 'oz'
        },
        {
            favorite: false, 
            name: 'food item 3', 
            qtyConsumed: 45.45,
            refQty: 1.17, 
            proteins: 4.44, 
            carbs: 56.56, 
            fibre: 6.6, 
            fats: 0.21, 
            unit: 'ml'
        },
        {
            favorite: false, 
            name: 'food item 4', 
            qtyConsumed: 0.05,
            refQty: 1.25, 
            proteins: 34.45, 
            carbs: 44.5, 
            fibre: 67.17, 
            fats: 55.125, 
            unit: 'lb'
        },
        {
            favorite: false, 
            name: 'food item 5', 
            qtyConsumed: 34.18,
            refQty: 1000, 
            proteins: 3.75, 
            carbs: 1.11, 
            fibre: 33.05, 
            fats: 16.17, 
            unit: 'g'
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const proteinQtyConsumedInGrams = [0.03, 0.03, 172.48, 625.05, 0.13];
    const carbQtyConsumedInGrams = [3.02, 136.46, 2197.14, 807.39, 0.04];
    const fibreQtyConsumedInGrams = [4.13, 1696.53, 256.38, 1218.71, 1.13];
    const fatQtyConsumedInGrams = [116.22, 2.69, 8.16, 1000.17, 0.55];

    const testFunc = () => {
        populateFoodItems(0, expected.length, expected);

        expect(items.length).toBe(expected.length);

        let proteinConsumptionPerCategory = round(proteinQtyConsumedInGrams.reduce((x, y) => x + y, 0));
        let carbConsumptionPerCategory = round(carbQtyConsumedInGrams.reduce((x, y) => x + y, 0));
        let fibreConsumptionPerCategory = round(fibreQtyConsumedInGrams.reduce((x, y) => x + y, 0));
        let fatConsumptionPerCategory = round(fatQtyConsumedInGrams.reduce((x, y) => x + y, 0));

        let nbItems = items.length;

        for (let i = 0; i < expected.length; i++) {
            const localStorageDashboard = JSON.parse(localStorage.getItem('dashboard'));
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.proteins).toBe(proteinConsumptionPerCategory);
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.carbs).toBe(carbConsumptionPerCategory);
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fibre).toBe(fibreConsumptionPerCategory);
            expect(localStorageDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fats).toBe(fatConsumptionPerCategory);
            // La fonction <code> splice </code> utilisée dans <code> deleteItem </code> du module Nourriture modifie le tableau <code> items </code> 'in place' 
            // et décale les éléments à chaque fois après en avoir enlevé un. Donc, l'indice de l'élément courant va demeurer 0 à chaque fois.
            const currentFoodItem = items[0];   
            const currentFoodItemHDOM = document.getElementById(items[0].id);

            const showButton = currentFoodItemHDOM.querySelector("#showButton");
            showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const foodItemPopup = document.getElementById('foodItemPopup');
            // Il est nécessaire de déclencher la fermeture du popup ici afin de ne pas avoir le même popup s'ouvrir à la prochaine itération.
            const closeButton = foodItemPopup.querySelector("#closeButton");
            closeButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const deleteButton = document.getElementById("deleteButton");
            deleteButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            expect(items.includes(currentFoodItem)).toBe(false);
            expect(items.length).toBe(--nbItems);
            // Vu que les items sont ajoutés de la manière LIFO, le premier élément à enlever correspond au dernier élément ajouté dans <code> proteinQty </code>.
            proteinConsumptionPerCategory = round(proteinConsumptionPerCategory - proteinQtyConsumedInGrams[nbItems]);
            carbConsumptionPerCategory = round(carbConsumptionPerCategory - carbQtyConsumedInGrams[nbItems]);
            fibreConsumptionPerCategory = round(fibreConsumptionPerCategory - fibreQtyConsumedInGrams[nbItems]);
            fatConsumptionPerCategory = round(fatConsumptionPerCategory - fatQtyConsumedInGrams[nbItems]);
        }
        expect(items.length).toBe(0);
    }; 
    setUp(dummyDashboard, testFunc);
});

it("test edit and save", () => {
    const dummyDashboard = initDummyDashboard();

    
    const expected = [
        {
            favorite: false, 
            name: 'food item 1', 
            qtyConsumed: 16.799,
            refQty: 5, 
            proteins: 0.01, 
            carbs: 0.9, 
            fibre: 1.23, 
            fats: 34.59, 
            unit: 'g'
        },
        {
            favorite: false, 
            name: 'food item 2', 
            qtyConsumed: 11.33,
            refQty: 10.75, 
            proteins: 0.001, 
            carbs: 4.567, 
            fibre: 56.78, 
            fats: 0.09, 
            unit: 'oz'
        },
        {
            favorite: false, 
            name: 'food item 3', 
            qtyConsumed: 45.45,
            refQty: 1.17, 
            proteins: 4.44, 
            carbs: 56.56, 
            fibre: 6.6, 
            fats: 0.21, 
            unit: 'ml'
        },
        {
            favorite: false, 
            name: 'food item 4', 
            qtyConsumed: 0.05,
            refQty: 1.25, 
            proteins: 34.45, 
            carbs: 44.5, 
            fibre: 67.17, 
            fats: 55.125, 
            unit: 'lb'
        },
        {
            favorite: false, 
            name: 'food item 5', 
            qtyConsumed: 34.18,
            refQty: 1000, 
            proteins: 3.75, 
            carbs: 1.11, 
            fibre: 33.05, 
            fats: 16.17, 
            unit: 'g'
        }
    ];

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const proteinQtyConsumedInGrams = [0.03, 0.03, 172.48, 625.05, 0.13];
    const carbQtyConsumedInGrams = [3.02, 136.46, 2197.14, 807.39, 0.04];
    const fibreQtyConsumedInGrams = [4.13, 1696.53, 256.38, 1218.71, 1.13];
    const fatQtyConsumedInGrams = [116.22, 2.69, 8.16, 1000.17, 0.55];

    const testFunc = () => {
        populateFoodItems(0, expected.length, expected);

        expect(items.length).toBe(expected.length);

        let proteinConsumptionPerCategory = round(proteinQtyConsumedInGrams.reduce((x, y) => x + y, 0));
        let carbConsumptionPerCategory = round(carbQtyConsumedInGrams.reduce((x, y) => x + y, 0));
        let fibreConsumptionPerCategory = round(fibreQtyConsumedInGrams.reduce((x, y) => x + y, 0));
        let fatConsumptionPerCategory = round(fatQtyConsumedInGrams.reduce((x, y) => x + y, 0));

        const newUnits = ['lb', 'oz', 'ml', 'g', 'oz'];

        const consumptionUpdateFunc = (oldMacroNutrientConsumptionPerCategory, oldConsumption, newMacroNutrientQtyPerRefQty, qtyConsumed, refQty, unit) => {
            const newConsumption = round((newMacroNutrientQtyPerRefQty * qtyConsumed / refQty) * SUPPORTED_UNITS_CONVERTER[unit].gramQtyPerUnit);
            return round(oldMacroNutrientConsumptionPerCategory - oldConsumption + newConsumption);
        };

        let nbItems = items.length;

        for (let i = 0; i < items.length; i++) {
            const currentFoodItemHDOM = document.getElementById(items[i].id);
            const showButton = currentFoodItemHDOM.querySelector("#showButton");
            
            showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const foodItemPopup = document.getElementById('foodItemPopup');

            const name = foodItemPopup.getElementsByClassName('divAddTextNut')[0];
            const qtyConsumed = foodItemPopup.getElementsByClassName('divAddTextNut')[1];
            const refQty = foodItemPopup.getElementsByClassName('divAddTextNut')[2];
            const unit = foodItemPopup.querySelector('#materialSelectAddHyd');
            const proteins = foodItemPopup.getElementsByClassName('divAddTextNut')[3];
            const carbs = foodItemPopup.getElementsByClassName('divAddTextNut')[4];
            const fibre = foodItemPopup.getElementsByClassName('divAddTextNut')[5];
            const fats = foodItemPopup.getElementsByClassName('divAddTextNut')[6];

            name.value = `new name ${i}`;
            ionFireEvent.ionChange(name);

            qtyConsumed.value = (i + 1) * 10.0;
            ionFireEvent.ionChange(qtyConsumed);

            refQty.value = (i + 2) * 20.0;
            ionFireEvent.ionChange(refQty);

            unit.value = newUnits[i];
            fireEvent.change(unit);

            proteins.value = (i + 3) * 30.0;
            ionFireEvent.ionChange(proteins);

            carbs.value = (i + 4) * 40.0;
            ionFireEvent.ionChange(carbs);

            fibre.value = (i + 5) * 50.0;
            ionFireEvent.ionChange(fibre);

            fats.value = (i + 6) * 60.0;
            ionFireEvent.ionChange(fats);

            const saveButton = foodItemPopup.querySelector("#saveButton");
            saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const cachedDashboard = JSON.parse(localStorage.getItem('dashboard'));

            expect(cachedDashboard.food.categories.someFoodCategory.items[i].name).toBe(`new name ${i}`);
            expect(cachedDashboard.food.categories.someFoodCategory.items[i].qtyConsumed).toBe((i + 1) * 10.0);
            expect(cachedDashboard.food.categories.someFoodCategory.items[i].refQty).toBe((i + 2) * 20.0);
            expect(cachedDashboard.food.categories.someFoodCategory.items[i].unit).toBe(newUnits[i]);

            nbItems--;

            proteinConsumptionPerCategory = consumptionUpdateFunc(proteinConsumptionPerCategory, proteinQtyConsumedInGrams[nbItems], proteins.value, qtyConsumed.value, refQty.value, unit.value);
            carbConsumptionPerCategory = consumptionUpdateFunc(carbConsumptionPerCategory, carbQtyConsumedInGrams[nbItems], carbs.value, qtyConsumed.value, refQty.value, unit.value);
            fibreConsumptionPerCategory = consumptionUpdateFunc(fibreConsumptionPerCategory, fibreQtyConsumedInGrams[nbItems], fibre.value, qtyConsumed.value, refQty.value, unit.value);
            fatConsumptionPerCategory = consumptionUpdateFunc(fatConsumptionPerCategory, fatQtyConsumedInGrams[nbItems], fats.value, qtyConsumed.value, refQty.value, unit.value);


            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.proteins).toBe(proteinConsumptionPerCategory);
            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.carbs).toBe(carbConsumptionPerCategory);
            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fibre).toBe(fibreConsumptionPerCategory);
            expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fats).toBe(fatConsumptionPerCategory);
        }
        const cachedDashboard = JSON.parse(localStorage.getItem('dashboard'));
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.proteins).toBe(13948.63);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.carbs).toBe(24015.58);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fibre).toBe(36791.23);
        expect(cachedDashboard.food.categories.someFoodCategory.macroNutrientConsumption.fats).toBe(52275.59);

        expect(items.length).toBe(5);
    };

    setUp(dummyDashboard, testFunc);
});

it("test no edit and save", () => {
    const dummyDashboard = initDummyDashboard();

    const expected = [
        {
            favorite: false, 
            name: 'food item', 
            qtyConsumed: 34.18,
            refQty: 1000, 
            proteins: 3.75, 
            carbs: 1.11, 
            fibre: 33.05, 
            fats: 16.17, 
            unit: 'g'
        }
    ];

    const proteinsConsumed = 0.13;
    const carbsConsumed = 0.04;
    const fibreConsumed = 1.13;
    const fatsConsumed = 0.55;

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        populateFoodItems(0, expected.length, expected);

        expect(items.length).toBe(expected.length);

        const checkQtyConsumed = (dashboard) => {
            expect(dashboard.food.categories.someFoodCategory.macroNutrientConsumption.proteins).toBe(proteinsConsumed);
            expect(dashboard.food.categories.someFoodCategory.macroNutrientConsumption.carbs).toBe(carbsConsumed);
            expect(dashboard.food.categories.someFoodCategory.macroNutrientConsumption.fibre).toBe(fibreConsumed);
            expect(dashboard.food.categories.someFoodCategory.macroNutrientConsumption.fats).toBe(fatsConsumed);
        };

        checkQtyConsumed(JSON.parse(localStorage.getItem('dashboard')));

        const currentFoodItemHDOM = document.getElementById(items[0].id);
        const showButton = currentFoodItemHDOM.querySelector("#showButton");    
        showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        // Aucune modification n'a lieu - on ne fait que visualiser l'item et appuyer sur le bouton de sauvegarde pour fermer le popup.
        const foodItemPopup = document.getElementById('foodItemPopup');
        const saveButton = foodItemPopup.querySelector('#saveButton');
        saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        // À ce moment-ci, on ne s'attend à aucun changement.
        checkQtyConsumed(JSON.parse(localStorage.getItem('dashboard')));

        expect(items.length).toBe(expected.length);
    };
    setUp(dummyDashboard, testFunc);
});

it("test module translation", () => {
    const testFunc = () => {
        ["en", "es", "fr"].forEach(lang => {
            localStorage.setItem("userLanguage", lang); 
            
            ["proteinFood", "grainFood", "vegetables", "fruit", "dairyProducts"].forEach(category => {
    
                act(() => {
                    render(<Food 
                                categoryKey = { category }
                                updateFoodConsumptionCallback = { () => { } }
                                macroNutrientConsumption = { {} }
                                foodItems = { [] }
                                currentDate = { new Date() }
                                macroNutrientToEdit = { undefined }
                                itemContainerDisplayStatus = { false }
                            />, 
                            container);
        
                        
                });   
                const moduleName = document.getElementById('moduleName').innerHTML;
                expect(moduleName).toBe(dict['FOOD_MODULE']['foodCategories'][category][lang]);
                const addFoodItem = document.getElementById('addFoodItem').innerHTML;
                expect(addFoodItem).toBe(dict['FOOD_MODULE']['functions']['addFoodItem'][lang]);
                const addButton = document.getElementById('addButton');
                addButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                const foodItemPopup = document.getElementById('foodItemPopup');

                const refQty = foodItemPopup.getElementsByClassName('divAddTextNut')[2];
                refQty.value = 10.75;
                ionFireEvent.ionChange(refQty);

                const unit = foodItemPopup.querySelector('#materialSelectAddHyd');

                unit.value = 'oz';
                fireEvent.change(unit);

                ['name', 'qtyConsumed', 'refQty', 'unit', 'macroNutrients'].forEach((key, index) => {
                    const label = foodItemPopup.getElementsByClassName('addFoodItemPopupLabels')[index];
                    let expected = dict['FOOD_MODULE']['functions']['addLabel'][key][lang] + ':';

                    if (key === 'macroNutrients') {
                        expected += ' (oz/10.75oz)';
                    }
                    expect(label.innerHTML).toBe(expected);
                });
                
                for (const [key, value] of Object.entries({'#proteinLabel': 'proteins', '#carbLabel': 'carbs', '#fibreLabel': 'fibre', '#fatLabel': 'fats'})) {
                    const label = foodItemPopup.querySelector(key);
                    expect(label.innerHTML).toBe(dict['FOOD_MODULE']['macroNutrients'][value][lang] + ':');
                }
            });
        });
    };
    testFunc();
});

it("test translation for non-existent key", () => {
    const testFunc = () => {
        ["en", "es", "fr"].forEach(lang => {
            localStorage.setItem("userLanguage", lang);

            act(() => {
                render(<Food 
                            categoryKey = { 'UnsupportedKey' }
                            updateFoodConsumptionCallback = { () => { } }
                            macroNutrientConsumption = { {} }
                            foodItems = { [] }
                            currentDate = { new Date() }
                            macroNutrientToEdit = { undefined }
                            itemContainerDisplayStatus = { false }
                        />, 
                        container);         
            });    
            const moduleName = document.getElementById("moduleName").innerHTML;
            expect(moduleName).toBe("Node with key UnsupportedKey is undefined");
        });
    };
    testFunc();
});

it("test translation for non-supported language", () => {
    localStorage.setItem("userLanguage", "it");
    const testFunc = () => {
        act(() => {
            render(<Food 
                        categoryKey = 'proteinFood'
                        updateFoodConsumptionCallback = { () => { } }
                        macroNutrientConsumption = { {} }
                        foodItems = { [] }
                        currentDate = { new Date() }
                        macroNutrientToEdit = { undefined }
                        itemContainerDisplayStatus = { false }
                    />, 
                    container);         
        });  
        const moduleName = document.getElementById("moduleName").innerHTML;
        expect(moduleName).toBe(`Translation into it for node ${JSON.stringify(dict["FOOD_MODULE"]["foodCategories"]["proteinFood"])} is currently not supported`);  
    };
    testFunc();
});

it("test favorites button and favorites sorted", () => {
    const dummyDashboard = initDummyDashboard();
    let expected = [];
    const iteration = 7;

    for (let i = 0; i < iteration; i++) {
        const foodItem =  {
            favorite: false, 
            name: 'some name', 
            qtyConsumed: 456.76,
            refQty: 100.75, 
            proteins: 34.14, 
            carbs: 56.76, 
            fibre: 88.88, 
            fats: 99.11, 
            unit: 'g'
        }
        expected.push(foodItem);
    }

    const items = dummyDashboard.food.categories.someFoodCategory.items;

    const testFunc = () => {
        populateFoodItems(0, 7, expected);
        expect(items.length).toBe(iteration);
        
        for (let i = 0; i < items.length; i++) {
            const currentFoodItemHDOM = document.getElementById(items[i].id);
            const showButton = currentFoodItemHDOM.querySelector("#showButton");   

            showButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            const foodItemPopup = document.getElementById('foodItemPopup');

            const favButton = foodItemPopup.querySelector("#favoriteButton");
            const saveButton = foodItemPopup.querySelector("#saveButton");
            if (i % 2) {
                favButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
            // Test toggle button
            else if (i === (iteration - 1)) {
                favButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                favButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
            saveButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        }
        // Test favorites button
        items.forEach((item, i) => {
            if (i < (iteration >> 1)) {
                expect(item.favorite).toBeTruthy();
            }
            else {
                expect(item.favorite).toBeFalsy();
            }
        });

        // Test if list is sorted
        expect(items).toBe(items.sort((a, b) => a.favorite - b.favorite));
    }

    setUp(dummyDashboard, testFunc);
})