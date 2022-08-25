import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import DeleteConfirmation from "../component/DeleteConfirmation";
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
});

describe('DeleteConfirmation', () => {
    const dailyPoids = "77" ;
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const dateFormat = "YYYY-MM-DD";
    const prefUnite = "KG";
    var showConfirmation = true
    const weightModify = 77;
    const weightDateModify = "2022-06-07 11:30"
    const item= {x: weightDateModify, y: weightModify}
    var showWeightModify = true;
    const currentDate = "2022-06-07 15:00"

    const dailyWeightList = [
        {x: "2022-06-07 15:00", y: 83},
        {x: "2022-06-04 15:00", y: 86},
        {x: "2022-06-01 15:00", y: 88}
    ]

    const setShowConfirmation = (bool) => {
        showConfirmation = bool;

    }
    
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids:"83",
            datePoids:currentDate,
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
        localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
        localStorage.setItem("currentDate", currentDate);
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });


    test(" Test 1 : Traduction du mot Confirmation en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/Confirmación/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 2 : Traduction du mot Confirmation en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/Confirmation/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 3 : Traduction du mot Annuler en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/Cancelar/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 4 : Traduction du mot Annuler en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/Cancel/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 5 : Traduction du mot Supprimer en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/Borrar/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 6 : Traduction du mot Supprimer en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getAllByText(/Delete/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 7 : Traduction de la phrase de confirmation en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/Está seguro de que desea eliminar/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 8 : Traduction de la phrase de confirmation en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getAllByText(/Are you sure you want to delete/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 9 : Traduction de la phrase de confirmation 2 en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getByText(/esta información de peso ?/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 10 : Traduction de la phrase de confirmation 2 en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render( <DeleteConfirmation showConfirmation = {showConfirmation} />);
            const mot= screen.getAllByText(/this weight information ?/i);
            expect(mot).toBeDefined();
        })
    });

    test(" Test 11 : Annuler la suppression", async() => {
        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);

        // open modify modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        var modalDeleteConfirmation = screen.queryByTestId("modalDeleteConfirmation");
        expect(modalDeleteConfirmation).toBeNull();

        const modalDelete = screen.getByTestId("deleteModal")

        // open delete modal
        act(() => { 
            fireEvent.click(modalDelete);
        })

        modalDeleteConfirmation = screen.queryByTestId("modalDeleteConfirmation");
        expect(modalDeleteConfirmation).not.toBeNull();

        const cancel = screen.getByTestId("cancel")

        // close delete modal (cancel)
        act(() => { 
            fireEvent.click(cancel);
        })

        modalDeleteConfirmation = screen.queryByTestId("modalDeleteConfirmation");
        expect(modalDeleteConfirmation).toBeNull();
    });

    test(" Test 12 : supprimer le premier poids de la liste", async() => {

        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(0);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);

        // open modify modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const modalDelete = screen.getByTestId("deleteModal")

        // open delete modal
        act(() => { 
            fireEvent.click(modalDelete);
        })

        const confirm = screen.getByTestId("confirm")

        // close delete modal (confirm)
        act(() => { 
            fireEvent.click(confirm);
        })

        const firstElement = screen.getByTestId("lastWeightValue")
        expect(firstElement.textContent).toBe((86).toString())
        
        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);

        expect(weightList0.length).toBe(0);
        expect(weightList1.length).toBe(2);
        expect(weightList2.length).toBe(1);
    });

    test(" Test 13 : supprimer le deuxième poids de la liste", async() => {

        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(1);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);

        // open modify modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const modalDelete = screen.getByTestId("deleteModal")

        // open delete modal
        act(() => { 
            fireEvent.click(modalDelete);
        })

        const confirm = screen.getByTestId("confirm")

        // close delete modal (confirm)
        act(() => { 
            fireEvent.click(confirm);
        })

        const firstElement = screen.getByTestId("lastWeightValue")
        expect(firstElement.textContent).toBe((83).toString())
        
        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(0);
        expect(weightList2.length).toBe(1);
    });

    test(" Test 14 : supprimer le dernier poids de la liste", async() => {

        await act(async () => { 
            render(<DetailsWeight/>);
        })

        const modalModify = screen.getAllByTestId("modalModify").at(2);
        var weightList0 = screen.queryAllByText(/83/i);
        var weightList1 = screen.queryAllByText(/86/i);
        var weightList2 = screen.queryAllByText(/88/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(1);

        // open modify modal
        act(() => { 
            fireEvent.click(modalModify);
        })

        const modalDelete = screen.getByTestId("deleteModal")

        // open delete modal
        act(() => { 
            fireEvent.click(modalDelete);
        })

        const confirm = screen.getByTestId("confirm")

        // close delete modal (confirm)
        act(() => { 
            fireEvent.click(confirm);
        })

        const firstElement = screen.getByTestId("lastWeightValue")
        expect(firstElement.textContent).toBe((83).toString())
        
        weightList0 = screen.queryAllByText(/83/i);
        weightList1 = screen.queryAllByText(/86/i);
        weightList2 = screen.queryAllByText(/88/i);

        expect(weightList0.length).toBe(2);
        expect(weightList1.length).toBe(1);
        expect(weightList2.length).toBe(0);
    });


})