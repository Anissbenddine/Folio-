import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import TargetWeightInput from "../component/TargetWeightInput";
import DetailsWeight from "../component/detailsWeight"
import { formatDateShape, formatWeight } from "../service/weightService";

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

describe('TargetWeightInput', () => {
    const dailyPoids = "77" ;
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const dateFormat = "YYYY-MM-DD";
    const prefUnite = "KG";
    var showInputTargetWeight= true
    
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids:"77",
            datePoids:"2022-03-17T15:24:10.792Z",
        }
        var size="165";
        const pseudo_dashboard = {
            userUID,
            poids,
            size,

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


    test(" Test 1 : Traduction du mot Enregistrer en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<TargetWeightInput
             dateFormat={dateFormat}
             showInputTargetWeight={showInputTargetWeight}
        />);
            const mot= screen.getByText(/Guardar/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 2 : Traduction du mot Enregistrer en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}/>)
            const mot = screen.getByText(/Save/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 3 : Traduction de la phrase Entrez votre cible en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}/>);

            const mot= screen.getByText(/Introduce tu objetivo/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 4 : Traduction de la phrase Entrez votre cible en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}/>)
            const mot = screen.getByText(/Enter your target/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 5 : Affichage des valeurs initiales du poids cible, la date cible et l'unité préférée dans le modal  ", async() => {
        await act(async () => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}
            targetWeight={poidsCible}
            targetDate={dateCible}
            unitWeight={prefUnite}
            />)
        const targetWeight = screen.getByTestId("targetInput");
        const targetDate = screen.getByTestId("targetDate");
        const unite = screen.getByTestId("select");
        expect(unite.value).toBe(prefUnite);
        expect(targetWeight.value).toBe(poidsCible);
        expect(targetDate.textContent).toBe(dateCible);
        })
    });

    test("Test 6 : Affichage du poids cible, l'unité préférée dans le modal si l'unité préférée change de KG à LBS", async() => {
        act(() => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}
            targetWeight={poidsCible}
            targetDate={dateCible}
            unitWeight={prefUnite}
            updatePrefUnit={jest.fn()}
            />)
        })

        const targetWeight = screen.getByTestId("targetInput");
        const unite = screen.getByTestId("select");

        act(() => { 
            fireEvent.ionChange(unite, "LBS");
        })

        expect(unite.value).toBe("LBS");
        expect(targetWeight.value).toBe(parseFloat(poidsCible * 2.2).toFixed(1));
        
    });

    test("Test 7 : Affichage du poids cible, l'unité préférée dans le modal si l'unité préférée change de LBS à KG", async() => {
        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.preferencesPoids.unitePoids = "LBS"
        localStorage.setItem("profile", JSON.stringify(localProfile));
        act(() => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}
            targetWeight={poidsCible * 2.2}
            targetDate={dateCible}
            unitWeight={"LBS"}
            updatePrefUnit={jest.fn()}
            />)
        })

        const targetWeight = screen.getByTestId("targetInput");
        const unite = screen.getByTestId("select");

        act(() => { 
            fireEvent.ionChange(unite, "KG");
        })

        expect(unite.value).toBe("KG");
        expect(targetWeight.value).toBe(parseFloat(poidsCible).toFixed(1).toString());
        
    });

    test("Test 8 : Affichage du poids cible, l'unité préférée dans le modal si l'unité préférée change de KG à KG", async() => {
        act(() => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}
            targetWeight={poidsCible}
            targetDate={dateCible}
            unitWeight={prefUnite}
            updatePrefUnit={jest.fn()}
            />)
        })

        const targetWeight = screen.getByTestId("targetInput");
        const unite = screen.getByTestId("select");

        act(() => { 
            fireEvent.ionChange(unite, "KG");
        })

        expect(unite.value).toBe("KG");
        expect(targetWeight.value).toBe(parseFloat(poidsCible).toFixed(1).toString());
        
    });

    test("Test 9 : Affichage du poids cible apres l'avoir changé", async() => {
        act(() => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}
            targetWeight={poidsCible}
            targetDate={dateCible}
            unitWeight={prefUnite}
            updatePrefUnit={jest.fn()}
            />)
        })

        const targetWeight = screen.getByTestId("targetInput");
        act(() => { 
            fireEvent.ionChange(targetWeight, 50);
        })

        expect(targetWeight.value).toBe(50);
        
    });

    test("Test 10 : Affichage de la date cible aprés l'avoir changé", async() => {
        act(() => { render(<TargetWeightInput 
            dateFormat={dateFormat}
            showInputTargetWeight={showInputTargetWeight}
            targetWeight={poidsCible}
            targetDate={dateCible}
            unitWeight={prefUnite}
            updatePrefUnit={jest.fn()}
            />)
        })

        const targetDate = screen.getByTestId("targetDate");
        const date = screen.getByTestId("date")
        act(() => { 
            fireEvent.ionChange(date, "2022-12-20");
        })
        expect(targetDate.textContent).toBe("2022-12-20");
        expect(date.getAttribute('display-format')).toBe("YYYY-MM-DD");
        
    });

    test("Test 11 : Affichage de la date cible, le poids cible dans -DetailsWeight aprés les avoir changé dans le modal", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })
        
        const modalTarget = screen.getByTestId("modalTarget");


        const targetWeight = screen.getByTestId("targWeight")
        const targetWeightDate = screen.getByTestId("targWeightDate")

        expect(targetWeight.textContent).toBe(formatWeight(poidsCible))
        expect(targetWeightDate.textContent).toBe(formatDateShape(dateCible, dateFormat))


        act(() => { 
            fireEvent.click(modalTarget);
        })

        const weightCible = screen.getByTestId("targetInput");
        act(() => { 
            fireEvent.ionChange(weightCible, 52);
        })

        const add = screen.getByTestId("add")

        act(() => { 
            fireEvent.click(add);  
        })

        const weight = screen.getByTestId("targWeight")
        expect(weight.textContent).toBe(parseFloat(52).toFixed(1))
    });
})