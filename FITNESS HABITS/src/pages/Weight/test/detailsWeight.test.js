import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import moment from "moment";
import {act} from "react-dom/test-utils";

import { formatWeight, formatDateShape, calculation_BMI, getPrefDate, getLastWeightInfos} from '../service/weightService';
import DetailsWeight from "../component/detailsWeight";

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

jest.mock("../service/weightService", () => { 
    const originalModule = jest.requireActual('../service/weightService');
    return {
        ...originalModule,
        initProfile: jest.fn().mockResolvedValue(),
        initDailyPoidsList: jest.fn().mockResolvedValue()
    };
});

describe('DetailsWeight', () => {
    const dailyPoids = "77" ;
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const dateFormat = "YYYY-MM-DD";
    const prefUnite = "KG";
    const weightHist = [
        {x: "2022-06-01", y: 88},
        {x: "2022-06-04", y: 86},
        {x: "2022-06-07", y: 84},
        {x: "2022-06-09", y: 82},
        {x: "2022-06-11", y: 80},
        {x: "2022-06-15", y: 85},
        {x: "2022-06-18", y: 96},
        {x: "2022-06-21", y: 82},
        {x: "2022-06-25", y: 79}
    ]

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
        let dailyWeightList = [
            {x: "2022-06-01", y: 88},
            {x: "2022-06-04", y: 86},
            {x: "2022-06-07", y: 84},
            {x: "2022-06-09", y: 82},
            {x: "2022-06-11", y: 80},
            {x: "2022-06-15", y: 85},
            {x: "2022-06-18", y: 96},
            {x: "2022-06-21", y: 82},
            {x: "2022-06-25", y: 79}
        ]

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
        localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });

    test(" Test 0 : Render DetailsWeight avec un localStorage vide", async() => {
        localStorage.clear();
        await act(async () => { render(<DetailsWeight/>);

        })
    });

    test(" Test 1 : Traduction du mot Poids en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>);
            const mot= screen.getAllByText(/Peso/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 2 : Traduction du mot IMC (indice masse corporel) en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/IMC/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 3 : Traduction du mot Cible  en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Objetivo/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 4 : Traduction du mot initial en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/inicial/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 5 : Traduction de la phrase: Dernier poids entré en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Último peso ingresado/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 6 : Traduction de la phrase: Afficher le graphique en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Mostrar gráfico/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 7 : Traduction de la phrase: Fermer le graphique en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<DetailsWeight/>)})
        const open = screen.getByTestId("showgraph");
        act(() => { 
            fireEvent.click(open);
        })
        const mot = screen.getByText(/Cerrar gráfico/i);
        expect(mot).toBeDefined();
        
        
    });

    test(" Test 9 : Traduction du mot Poids en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>);
            const mot = screen.getAllByText(/Weight/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 10 : Traduction du mot IMC (indice masse corporel) en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/BMI/i);
            expect(mot).toBeDefined();
        })
    });
    test(" Test 11 : Traduction du mot Cible en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Target/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 12 : Traduction du mot initial en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Initial/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 13 : Traduction de la phrase: Dernier poids entré en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Last weight entered/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 14 : Traduction de la phrase: Afficher le graphique en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>)
            const mot = screen.getByText(/Show graph/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 15 : Traduction de la phrase: Fermer le graphique en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<DetailsWeight/>)})
        const open = screen.getByTestId("showgraph");
        act(() => { 
            fireEvent.click(open);
        })
        const mot = screen.getByText(/Close graph/i);
        expect(mot).toBeDefined();
    });

    test(" Test 17 : Affichage des valeurs et des dates du dernier poids entré et du poids cible", async() => {
        await act(async () => { render(<DetailsWeight/>);
        })
        const lastWeight = screen.getByTestId("lastWeightValue");
        const lastWeightDate = screen.getByTestId("lastWeightDate");
        const targetDate = screen.getByTestId("targWeightDate");
        const targetWeight = screen.getByTestId("targWeight");
        expect(lastWeight.textContent).toBe(getLastWeightInfos(weightHist)[1].toString());
        expect(lastWeightDate.textContent).toBe(getLastWeightInfos(weightHist)[0]);
        expect(targetWeight.textContent).toBe(formatWeight(poidsCible));
        expect(targetDate.textContent).toBe(formatDateShape(dateCible, dateFormat));

    });

    test(" Test 18 : Affichage du dernier poids et l'unité si l'unité préférée change", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.preferencesPoids.unitePoids = "LBS"
        localStorage.setItem("profile", JSON.stringify(localProfile));
        await act(async () => { render(<DetailsWeight/>);
        })
        const lastWeight = screen.getByTestId("lastWeightValue");
        const favUnit = screen.getByTestId("prefUnit");
        expect(formatWeight(lastWeight.textContent)).toBe(formatWeight(getLastWeightInfos(weightHist)[1]));
        expect(favUnit.textContent.toString().toUpperCase()).toBe("LBS");

    });

    test(" Test 19 : Changement du format de date préférée", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.dateFormat = "DD/MM/YYYY"
        localStorage.setItem("profile", JSON.stringify(localProfile));
        await act(async () => { render(<DetailsWeight/>);
        })
        const targetDate = screen.getByTestId("targWeightDate");
        const lastWeightDate = screen.getByTestId("lastWeightDate");
        const targetDateString= targetDate.textContent.toString();
        const lastWeightDateString = lastWeightDate.textContent.toString();
        var targetDateReceived = moment(targetDateString, ["YYYY-MM-DD", getPrefDate()], true);
        var lastWeightDateReceived = moment(lastWeightDateString, ["YYYY-MM-DD", getPrefDate()], true);
        expect(targetDateReceived.creationData().format).toBe("DD/MM/YYYY");
        expect(lastWeightDateReceived.creationData().format).toBe("DD/MM/YYYY");
    })


    test(" Test 20 : Valeur de l'IMC si le Poids actuel change", async() => {
        let liste = JSON.parse(localStorage.getItem("listeDailyPoids"));
        liste.push({x:"2022-06-28", y: 77})
        localStorage.setItem("listeDailyPoids", JSON.stringify(liste));
        await act(async () => { render(<DetailsWeight/>);
        })
        const bmi = screen.getByTestId("imc");
        expect(bmi.textContent).toBe(calculation_BMI(size, getLastWeightInfos(JSON.parse(localStorage.getItem("listeDailyPoids")))[1]));
    })

    test(" Test 21 : Affichage de la phrase: Afficher le graphique aprés l'avoir fermé", async() => {
        await act(async () => { render(<DetailsWeight/>)})
        const open = screen.getByTestId("showgraph");
        act(() => { 
            fireEvent.click(open);
        })
        const close = screen.getByTestId("closegraph");
        act(() => { 
            fireEvent.click(close);
        })
        const mot = screen.getByText(/Afficher le graphique/i);
        expect(mot).toBeDefined();
    });

    test(" Test 22 : Valeur de l'IMC est NaN avec une taille 0", async() => {
        let profile = JSON.parse(localStorage.getItem("profile"));
        profile.size = 0
        localStorage.setItem("profile", JSON.stringify(profile));
        await act(async () => { render(<DetailsWeight/>);
        })
        const bmi = screen.getByTestId("imc");
        expect(bmi.textContent).toBe("NaN");
    });

});