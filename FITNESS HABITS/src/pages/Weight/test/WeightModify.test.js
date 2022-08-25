import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import WeightModify from "../component/WeightModify";
import DetailsWeight from "../component/detailsWeight"

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
})

describe("WeightModify", () => {
    const weightModify = 77;
    const weightDateModify = "2022-06-07 11:30"
    const item= {x: weightDateModify, y: weightModify}
    var showWeightModify = true;
    const dateFormat = "YYYY/MM/DD"
    const currentDate = {startDate: "2022-06-03 10:30"}
    const unitWeight = "KG"
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const dailyWeightList = [
        {x: "2022-06-07 15:00", y: 83},
        {x: "2022-06-04 15:00", y: 86},
        {x: "2022-06-01 15:00", y: 88}
    ]

    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids:"77",
            datePoids:"2022-03-17T15:24:10.792Z"
        }
        var size="160";
        const pseudo_dashboard = {
            userUID,
            poids,
            size
        };

        let pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: unitWeight
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

    test("Render WeightModify avec un localStorage vide", async() => {
        localStorage.clear();
        act(() => { render(<WeightModify
                                showWeightModify={showWeightModify}
                                weightElement = {item}
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })
    });

    test("Afficher Poids et Modifier si en francais", async() => {
        act(() => { render(<WeightModify 
                                showWeightModify={showWeightModify}
                                weightElement = {item}
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })

        const mot1 = screen.getByText(/Poids/i);
        const mot2 = screen.getByText(/Modifier/i);
        expect(mot1).toBeDefined();
        expect(mot2).toBeDefined();
    });

    test("Traduction des mots Poids et Modifier en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        act(() => { render(<WeightModify  
                                showWeightModify={showWeightModify}
                                weightElement = {item}  
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })

        const mot1 = screen.getByText(/Peso/i);
        const mot2 = screen.getByText(/Editar/i);
        expect(mot1).toBeDefined();
        expect(mot2).toBeDefined();
    });

    test("Traduction des mots Poids et Modifier en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        act(() => { render(<WeightModify 
                                showWeightModify={showWeightModify}
                                weightElement={item}  
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })

        const mot1 = screen.getByText(/Weight/i);
        const mot2 = screen.getByText(/Edit/i);
        expect(mot1).toBeDefined();
        expect(mot2).toBeDefined();
    });

    test("Valeurs initiales", async() => {
        act(() => { render(<WeightModify  
                                showWeightModify={showWeightModify}
                                weightElement={item}
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })

        const weight = screen.getByTestId("weight");
        const select = screen.getByTestId("select");
        const date = screen.getByTestId("date");
        const time = screen.getByTestId("time");

        expect(weight.value).toBe(parseFloat(item.y).toFixed(1).toString());
        expect(select.value).toBe("KG");
        expect(date.value).toBe(weightDateModify);
        expect(time.value).toBe(weightDateModify);
    });

    test("Changement de KG a LBS", async() => {
        act(() => { render(<WeightModify 
                                showWeightModify={showWeightModify}
                                weightElement={item}  
                                dateFormat={dateFormat} 
                                updatePrefUnit={jest.fn()} 
                                unitWeight = {unitWeight}/>);
        })

        const select = screen.getByTestId("select");
        const weight = screen.getByTestId("weight");  

        act(() => { 
            fireEvent.ionChange(select, "LBS");
        })

        expect(weight.value).toBe((item.y * 2.2).toString());
        expect(select.value).toBe("LBS");
        
    });

    test("Changement de LBS a KG", async() => {

        const item= {x: weightDateModify, y: weightModify * 2.2}

        let localProfile = JSON.parse(localStorage.getItem("profile"));
        localProfile.preferencesPoids.unitePoids = "LBS"
        localStorage.setItem("profile", JSON.stringify(localProfile));
        act(() => { render(<WeightModify
                                showWeightModify={showWeightModify}
                                weightElement={item}  
                                dateFormat={dateFormat} 
                                updatePrefUnit={jest.fn()}  
                                unitWeight = {"LBS"}/>);
        })
        const weight = screen.getByTestId("weight");
        const select = screen.getByTestId("select");

        act(() => { 
            fireEvent.ionChange(select, "KG");
        })

        expect(weight.value).toBe(parseFloat(item.y/2.2).toFixed(1).toString());
        expect(select.value).toBe("KG");
    });

    test("Changement de valeur pour le poids", async() => {
        act(() => { render(<WeightModify 
                                showWeightModify={showWeightModify}
                                weightElement={item}
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })

        const weight = screen.getByTestId("weight");

        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 

        expect(weight.value).toBe(100);
    });

    test("Changement de valeur pour la date", async() => {
        act(() => { render(<WeightModify 
                                showWeightModify={showWeightModify}
                                weightElement={item}
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
        })

        const date = screen.getByTestId("date");

        act(() => { 
            fireEvent.ionChange(date, "2021-06-04")
        }) 

        expect(date.value).toBe("2021-06-04");
        expect(date.getAttribute('display-format')).toBe("YYYY/MM/DD");
    });

    test("Changement de valeur pour l'heure", async() => {
        act(() => { render(<WeightModify  
                                showWeightModify={showWeightModify}
                                weightElement={item}
                                dateFormat={dateFormat}
                                unitWeight = {unitWeight}/>);
    })

        const time = screen.getByTestId("time");

        act(() => { 
        fireEvent.ionChange(time, "06:30")
        }) 
        
        expect(time.value).toBe("06:30");
        expect(time.getAttribute('display-format')).toBe("HH:mm");
    });

    test("Ouvrir et fermer le modal", async() => {
        await act( async () => { 
            render(<DetailsWeight/>);
        })

        var modal = screen.queryByTestId("modal");
        expect(modal).toBeNull();

        const modalModify = screen.getAllByTestId("modalModify").at(0);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })


        const weight = screen.getByTestId("weight");
        const date = screen.getByTestId("date");
        const time = screen.getByTestId("time");

        expect(weight.value).toBe(parseFloat(83).toFixed(1).toString());
        expect(date.value).toBe("2022-06-07 15:00");
        expect(time.value).toBe("2022-06-07 15:00");

        modal = screen.queryByTestId("modal");
        expect(modal).not.toBeNull();

        const edit = screen.getByTestId("edit");
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        modal = screen.queryByTestId("modal");
        expect(modal).toBeNull();
    });

    test("Modifier le poids 86 à 100", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(1);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        var weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        var weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const weight = screen.getByTestId("weight");
        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        var newWeightList = screen.queryAllByText(/100/i);
        weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(1);
        expect(newWeightList.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);
    })

    test("Modifier le poids 86 et la date 2022-06-04 à 100 et 2022-06-05", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(1);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        var weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        var weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const weight = screen.getByTestId("weight");
        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 

        const date = screen.getByTestId("date");
        act(() => { 
            fireEvent.ionChange(date, "2022-06-05 15:00")
        }) 
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        var newWeightList = screen.queryAllByText(/100/i);
        weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var newWeightDate = screen.queryAllByText(/2022\/06\/05/i);
        weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(1);
        expect(newWeightList.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(0);
        expect(weightDate2.length).toBe(1);
        expect(newWeightDate.length).toBe(1);
        expect(weightTime.length).toBe(3);
    })

    test("Modifier le poids 86 et l'heure 15:00 à 100 et 15:30", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(1);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        var weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        var weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const weight = screen.getByTestId("weight");
        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 

        const date = screen.getByTestId("date");
        act(() => { 
            fireEvent.ionChange(date, "2022-06-04 15:30")
        }) 
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        var newWeightList = screen.queryAllByText(/100/i);
        weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        weightTime = screen.queryAllByText(/15:00/i);
        var newWeightTime = screen.queryAllByText(/15:30/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(1);
        expect(newWeightList.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(2);
        expect(newWeightTime.length).toBe(1);
    })

    test("Modifier le poids 86 et la date 2022-06-04 à 100 et 2022-06-01", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(1);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        var weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        var weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const weight = screen.getByTestId("weight");
        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 

        const date = screen.getByTestId("date");
        act(() => { 
            fireEvent.ionChange(date, "2022-06-01 15:00")
        }) 
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        var newWeightList = screen.queryAllByText(/100/i);
        weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(0);
        expect(newWeightList.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(0);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(2);
    })

    test("Modifier le poids 83 à 100", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        var weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        var weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var weightTime = screen.queryAllByText(/15:00/i);
        var BMI = screen.queryAllByText(/32.42/i)

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);
        expect(BMI.length).toBe(1);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const weight = screen.getByTestId("weight");
        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        var newWeightList = screen.queryAllByText(/100/i);
        weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        weightTime = screen.queryAllByText(/15:00/i);
        BMI = screen.queryAllByText(/32.42/i)
        var newBMI = screen.queryAllByText(/39.06/i);

        expect(weightList0.length).toBe(0);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(newWeightList.length).toBe(2);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);
        expect(BMI.length).toBe(0);
        expect(newBMI.length).toBe(1);
    })

    test("Modifier le poids 83 et la date 2022-06-07 à 100 et 2022-06-02", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        var weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        var weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        var weightTime = screen.queryAllByText(/15:00/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightDate0.length).toBe(2);
        expect(weightDate1.length).toBe(1);
        expect(weightDate2.length).toBe(1);
        expect(weightTime.length).toBe(3);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const weight = screen.getByTestId("weight");
        act(() => { 
            fireEvent.ionChange(weight, 100)
        }) 

        const date = screen.getByTestId("date");
        act(() => { 
            fireEvent.ionChange(date, "2022-06-02 15:00")
        })
        
        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        var newWeightList = screen.queryAllByText(/100/i);
        weightDate0 = screen.queryAllByText(/2022\/06\/07/i);
        weightDate1 = screen.queryAllByText(/2022\/06\/04/i);
        weightDate2 = screen.queryAllByText(/2022\/06\/01/i);
        weightTime = screen.queryAllByText(/15:00/i);
        var newWeightDate = screen.queryAllByText(/2022\/06\/02/i);

        expect(weightList0.length).toBe(0);
        expect(weightList1.length).toBe(2);
        expect(weightList2.length).toBe(1);
        expect(newWeightList.length).toBe(1);
        expect(weightDate0.length).toBe(0);
        expect(weightDate1.length).toBe(2);
        expect(weightDate2.length).toBe(1);
        expect(newWeightDate.length).toBe(1);
        expect(weightTime.length).toBe(3);
    })

    test("Changement de KG à KG, la liste des poids n'est pas changée", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightInit = screen.queryAllByText(/85/i);
        var weightTarget = screen.queryAllByText(/56/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightInit.length).toBe(1);
        expect(weightTarget.length).toBe(1);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const select = screen.getByTestId("select");
        act(() => { 
            fireEvent.ionChange(select, "KG")
        }) 

        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        weightInit = screen.queryAllByText(/85/i);
        weightTarget = screen.queryAllByText(/56/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightInit.length).toBe(1);
        expect(weightTarget.length).toBe(1);
    })

    test("Changement de KG à LBS, la liste des poids est changée", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);
        var weightInit = screen.queryAllByText(/85/i);
        var weightTarget = screen.queryAllByText(/56/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightInit.length).toBe(1);
        expect(weightTarget.length).toBe(1);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const select = screen.getByTestId("select");
        act(() => { 
            fireEvent.ionChange(select, "LBS")
        }) 

        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);
        weightInit = screen.queryAllByText(/85/i);
        weightTarget = screen.queryAllByText(/56/i);
        var newWeightList0 = screen.queryAllByText(/182.6/i);
        var newWeightList1 = screen.queryAllByText(/189.2/i);
        var newWeightList2 = screen.queryAllByText(/193.6/i);
        var newWeightInit = screen.queryAllByText(/187/i);
        var newWeightTarget = screen.queryAllByText(/123.2/i);

        expect(weightList0.length).toBe(0);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(0);
        expect(weightInit.length).toBe(0);
        expect(weightTarget.length).toBe(0);
        expect(newWeightList0.length).toBe(2);
        expect(newWeightList1.length).toBe(1);
        expect(newWeightList2.length).toBe(1);
        expect(newWeightInit.length).toBe(1);
        expect(newWeightTarget.length).toBe(1);

    })

    test("Changement de LBS à KG, la liste des poids est changée", async() => {
        const pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: "LBS"
            },
            pseudo:"John Doe",
            size: 160
          };

        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
        
        const dailyWeightListLBS = [
            {x: "2022-06-07 15:00", y: 182.6},
            {x: "2022-06-04 15:00", y: 189.2},
            {x: "2022-06-01 15:00", y: 193.6}
        ]

        localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightListLBS));
        
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);
        var weightList0 = screen.queryAllByText(/182.6/i);
        var weightList1 = screen.queryAllByText(/189.2/i);
        var weightList2 = screen.queryAllByText(/193.6/i);
        var weightInit = screen.queryAllByText(/187/i);
        var weightTarget = screen.queryAllByText(/123.2/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);
        expect(weightInit.length).toBe(1);
        expect(weightTarget.length).toBe(1);

        // open modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const edit = screen.getByTestId("edit");

        const select = screen.getByTestId("select");
        act(() => { 
            fireEvent.ionChange(select, "KG")
        }) 

        // close modal
        act(() => { 
            fireEvent.click(edit);  
        })

        weightList0 = screen.queryAllByText(/182.6/i);
        weightList1 = screen.queryAllByText(/189.2/i);
        weightList2 = screen.queryAllByText(/193.6/i);
        weightInit = screen.queryAllByText(/187/i);
        weightTarget = screen.queryAllByText(/123.2/i);
        var newWeightList0 = screen.queryAllByText(/83/i);
        var newWeightList1 = screen.queryAllByText(/86/i);
        var newWeightList2 = screen.queryAllByText(/88/i);
        var newWeightInit = screen.queryAllByText(/85/i);
        var newWeightTarget = screen.queryAllByText(/56/i);

        expect(weightList0.length).toBe(0);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(0);
        expect(weightInit.length).toBe(0);
        expect(weightTarget.length).toBe(0);
        expect(newWeightList0.length).toBe(2);
        expect(newWeightList1.length).toBe(1);
        expect(newWeightList2.length).toBe(1);
        expect(newWeightInit.length).toBe(1);
        expect(newWeightTarget.length).toBe(1);

    })
});