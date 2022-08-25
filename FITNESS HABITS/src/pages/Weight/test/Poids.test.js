import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import moment from "moment";
import {act} from "react-dom/test-utils";
import Poids from "../component/Poids";

import { formatWeight, formatDateShape, calculation_BMI, getPrefDate} from '../service/weightService';

jest.mock("firebase", () => {
    return {
        auth: jest.fn(),
        database: jest.fn().mockReturnValue({
            ref: jest.fn().mockReturnValue({
                update: jest.fn(),
                once: jest.fn().mockReturnValue(new Promise(() => {})),
                orderByChild: jest.fn().mockReturnValue({
                    once: jest.fn().mockReturnValue(new Promise(() => {}))
                })
            })
        })
    };
});

jest.mock("../../Weight/service/weightService", () => { 
    const originalModule = jest.requireActual('../../Weight/service/weightService');
    return {
        ...originalModule,
        initProfile: jest.fn().mockResolvedValue()
    };
});

describe('Poids', () => {
    const dailyPoids = "77" ;
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const dateFormat = "YYYY-MM-DD";
    const prefUnite = "KG";
    var size = 165;
    var poids={
        dailyPoids:"77",
        datePoids:"2022-03-17T15:24:10.792Z",
    }
    var currentDate= {startDate: "2022-06-03 10:30"}
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids:"77",
            datePoids:"2022-03-17T15:24:10.792Z",
        }
        var size="165";
        var dateFormat = "YYYY-MM-DD";
        const pseudo_dashboard = {
            userUID,
            poids,
            size,
            dateFormat,

        };

        let pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: prefUnite
            },
            pseudo:"John Doe",
            size: size
          };
        localStorage.setItem("userUid", userUID);
        localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
        localStorage.setItem("userLanguage", "fr");
        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });

    test(" Test 0 : Render Poids avec un localStorage vide", async() => {
        localStorage.clear();
        await act(async () => { render(<Poids poids currentDate={currentDate}/>);

        })
    });

    test(" Test 1 : Traduction du mot Poids en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>);
            const mot= screen.getAllByText(/Peso/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 2 : Traduction du mot IMC (indice masse corporel) en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>)
            const mot = screen.getByText(/IMC/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 3 : Traduction du mot Cible  en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>)
            const mot = screen.getByText(/Objetivo/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 4 : Traduction du mot initial en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>)
            const mot = screen.getByText(/inicial/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 5 : Traduction du mot Poids en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>);
            const mot = screen.getAllByText(/Weight/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 6 : Traduction du mot IMC (indice masse corporel) en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>)
            const mot = screen.getByText(/BMI/i);
            expect(mot).toBeDefined();
        })
    });
    test(" Test 7 : Traduction du mot Cible en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>)
            const mot = screen.getByText(/Target/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 8 : Traduction du mot initial en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<Poids poids currentDate={currentDate}/>)
            const mot = screen.getByText(/Initial/i);
            expect(mot).toBeDefined();
        })
    });


    test(" Test 9 : Affichage des valeurs initialles dans le dashboard", async() => {
        await act(async () => { render(<Poids poids={poids} currentDate={currentDate}/>);
        })
        const initialWeight = screen.getByTestId("initWeight");
        const targetWeight = screen.getByTestId("targWeight");
        const targetDate = screen.getByTestId("targWeightDate");
        const dailyWeight = screen.getByTestId("dlyPoids");
        const favUnit = screen.getByTestId("prefUnit");
        const bmi = screen.getByTestId("imc");

        expect(initialWeight.textContent).toBe(parseFloat(poidsInitial).toFixed(1));
        expect(targetWeight.textContent).toBe(parseFloat(poidsCible).toFixed(1));
        expect(dailyWeight.textContent).toBe(parseFloat(dailyPoids).toFixed(1));
        expect(targetDate.textContent).toBe(formatDateShape(dateCible, dateFormat));
        expect(favUnit.textContent.toString().toUpperCase()).toBe(prefUnite);
        expect(bmi.textContent).toBe(calculation_BMI(size, dailyPoids));

    });

    test(" Test 10 : Affichage du poids actuel et l'unité si l'unité préférée change", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.preferencesPoids.unitePoids = "LBS"
        localStorage.setItem("profile", JSON.stringify(localProfile));
        await act(async () => { render(<Poids poids={poids} currentDate={currentDate}/>);
        })
        const dailyWeight = screen.getByTestId("dlyPoids");
        const favUnit = screen.getByTestId("prefUnit");
        expect(dailyWeight.textContent).toBe(formatWeight(dailyPoids));
        expect(favUnit.textContent.toString().toUpperCase()).toBe("LBS");

    });

    test(" Test 11 : Changement du format de date préférée", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.dateFormat = "DD/MM/YYYY"
        localStorage.setItem("profile", JSON.stringify(localProfile));
        await act(async () => { render(<Poids poids={poids} currentDate={currentDate}/>);
        })
        const targetDate = await screen.getByTestId("targWeightDate");
        const targetDateString= targetDate.textContent.toString();
        var targetDateReceived = moment(targetDateString, ["YYYY-MM-DD", getPrefDate()], true);
        expect(targetDateReceived.creationData().format).toBe("DD/MM/YYYY");
    })

    test(" Test 12 : changement de l'unité de poids préférée : KG à LBS", async() => {
        await act(async () => { render(<Poids poids={poids} currentDate={currentDate}/>);
        })
        const openModal = screen.getByTestId("openModal");
        // open modal
        act(() => { 
            fireEvent.click(openModal);
        })

        const select = screen.getByTestId("select");
        act(() => { 
            fireEvent.ionChange(select, "LBS");
        })
        
        const favUnit = await screen.getByTestId("prefUnit");
        const initialWeight = await screen.getByTestId("initWeight");
        const targetWeight = await screen.getByTestId("targWeight");
        const dailyWeight = await screen.getByTestId("dlyPoids");
        expect(favUnit.textContent.toString().toUpperCase()).toBe("LBS");
        expect(initialWeight.textContent).toBe(formatWeight(poidsInitial));
        expect(targetWeight.textContent).toBe(formatWeight(poidsCible));
        expect(dailyWeight.textContent).toBe(formatWeight(dailyPoids));
    })

    test(" Test 13 : changement de l'unité de poids préférée : LBS à KG", async() => {
        await act(async () => { render(<Poids poids={poids} currentDate={currentDate}/>);
        })
        const openModal = screen.getByTestId("openModal");
        // open modal
        act(() => { 
            fireEvent.click(openModal);
        })

        const select = screen.getByTestId("select");
        act(() => { 
            fireEvent.ionChange(select, "KG");
        })
        const favUnit = await screen.getByTestId("prefUnit");
        const initialWeight = await screen.getByTestId("initWeight");
        const targetWeight = await screen.getByTestId("targWeight");
        const dailyWeight = await screen.getByTestId("dlyPoids");
        expect(favUnit.textContent.toString().toUpperCase()).toBe("KG");
        expect(initialWeight.textContent).toBe(formatWeight(poidsInitial));
        expect(targetWeight.textContent).toBe(formatWeight(poidsCible));
        expect(dailyWeight.textContent).toBe(formatWeight(dailyPoids));
    })

    test(" Test 14 : Valeur de l'IMC si le Poids actuel change", async() => {
        poids.dailyPoids = 60;
        await act(async () => { render(<Poids poids={poids} currentDate={currentDate}/>);
        })
        const bmi = screen.getByTestId("imc");
        expect(bmi.textContent).toBe(calculation_BMI(size, poids.dailyPoids));
    })

    test(" Test 15 : Valeur de l'IMC si la taille change", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.size = 163
        localStorage.setItem("profile", JSON.stringify(localProfile));
        size = 163;
        await act(async () => { render(<Poids poids={poids}  currentDate={currentDate} />);
        })
        const bmi = screen.getByTestId("imc");
        expect(bmi.textContent).toBe(calculation_BMI(size,poids.dailyPoids));
    })

    test(" Test 16 : Valeur de l'IMC est NaN avec une taille 0", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.size = 0
        localStorage.setItem("profile", JSON.stringify(localProfile));

        await act(async () => { render(<Poids poids={poids}  currentDate={currentDate} />);
        })
        const bmi = screen.getByTestId("imc");
        expect(bmi.textContent).toBe("NaN");
    })
});