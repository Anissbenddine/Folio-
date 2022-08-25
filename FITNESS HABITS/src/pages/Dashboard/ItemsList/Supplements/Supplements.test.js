import React from "react";
import { render, cleanup } from "@testing-library/react";
import firebase from "firebase";
import "firebase/auth";
import Supplements from "../Supplements.jsx";
import { ionFireEvent } from "@ionic/react-test-utils";

const testProfile = {
    pseudo: "testUser",
    email: "testUser@fitnesshabit.com",
    size: "999",
    gender: "N",
    dateFormat: "dd-LLL-yyyy",
};

jest.mock("firebase", () => {
    const mockListeMedSupp = [{
        dateDebutChoisie: "2022-07-11",
        formatDoseChoisi: "Gélule",
        heuresChoisies: [{
            heure: "2022-07-11T11:05:20.521-04:00"
        }],
        joursSemaineChoisis: ["Jeudi"],
        nomChoisi: "TestAjout",
        nombreDosesChoisi: "1",
        restrictionsChoisies: ["Doit être prise en mangeant"],
        statutActifChoisi: true,
        typeChoisi: "supplement"
    }];

    const donneesSupplements = {
        listeMedSup: mockListeMedSupp
    };

    const dataSnapshot = { 
        val: () => donneesSupplements,
        exists: () => true
    };

    return {
        auth: jest.fn(),
        database: jest.fn().mockReturnValue({
            ref: jest.fn().mockReturnValue({
                update: jest.fn(),
                once: jest.fn().mockResolvedValue(dataSnapshot)
            })
        })
    };
});

describe("How <Supplements> is rendered", () => {
    const currentDate = {
        startDate: new Date()
    };

    beforeAll(() => {
        localStorage.setItem("profile", JSON.stringify(testProfile));
    });

    afterAll(() => { localStorage.removeItem("profile") });

    afterEach(() => {
        cleanup();
    });

    it("Main menu should not crash", () => {
        const { baseElement } = render(<Supplements currentDate={currentDate}/>);
        expect(baseElement).toBeDefined();
    });

    it("Main menu should be closed by default", () => {
        const { queryByTestId } = render(<Supplements currentDate={currentDate}/>);
        const menuModal = queryByTestId("menu");
        expect(menuModal).toBeNull();
    });

    
    it("Main menu should open as expected", () => {
        const { getByTestId } = render(<Supplements currentDate={currentDate}/>);

        const btnOpen = getByTestId("btn-open");
        btnOpen.click();
        const menuModal = getByTestId("menu");

        expect(menuModal).toBeDefined();
    });

    it("Main menu should close as expected", () => {
        const { getByTestId , queryByTestId} = render(<Supplements currentDate={currentDate}/>);

        const btnOpen = getByTestId("btn-open");
        btnOpen.click();
        const btnClose = getByTestId("iconeRetourMenu");
        btnClose.click();
        
        const menuModal = queryByTestId("menu");
        expect(menuModal).toBeNull();
    });

    it("add supplement form should open as expected", () => {
        const { getByTestId } = render(<Supplements currentDate={currentDate}/>);

        const boutonAfficherMenu = getByTestId("btn-open");
        boutonAfficherMenu.click();

        const boutonAjouterSupplement = getByTestId("boutonAjouterSupplement");
        boutonAjouterSupplement.click();

        const formulaireAjouterSupplement = getByTestId("formulaireAjouterSupplement");

        expect(formulaireAjouterSupplement).toBeDefined();
    });

    it("add supplement form should close as expected", () => {
        const { getByTestId, queryByTestId } = render(<Supplements currentDate={currentDate}/>);

        const boutonAfficherMenu = getByTestId("btn-open");
        boutonAfficherMenu.click();

        const boutonAjouterSupplement = getByTestId("boutonAjouterSupplement");
        boutonAjouterSupplement.click();
        boutonAjouterSupplement.click();

        const formulaireAjouterSupplement = queryByTestId("formulaireAjouterSupplement");

        expect(formulaireAjouterSupplement).toBeNull();
    });

    it("dateFin should appear when it is toggled on", async () => {
        const moduleSupplements = render(<Supplements currentDate={currentDate}/>);

        moduleSupplements.getByTestId("btn-open").click();
        moduleSupplements.getByTestId("boutonAjouterSupplement").click();
        moduleSupplements.getByTestId("toggleDateFin").click();

        const dateFin = moduleSupplements.getByTestId("dateFin");

        expect(dateFin).toBeDefined();
    });

    it("dateFin should disappear when it is toggled off", async () => {
        const moduleSupplements = render(<Supplements currentDate={currentDate}/>);

        moduleSupplements.getByTestId("btn-open").click();
        moduleSupplements.getByTestId("boutonAjouterSupplement").click();
        moduleSupplements.getByTestId("toggleDateFin").click();
        moduleSupplements.getByTestId("toggleDateFin").click();

        const dateFin = moduleSupplements.queryByTestId("dateFin");

        expect(dateFin).toBeNull();
    });

    it("joursMois should appear when it is toggled on", async () => {
        const moduleSupplements = render(<Supplements currentDate={currentDate}/>);

        moduleSupplements.getByTestId("btn-open").click();
        moduleSupplements.getByTestId("boutonAjouterSupplement").click();
        moduleSupplements.getByTestId("toggleJoursMois").click();

        const joursMois = moduleSupplements.getByTestId("joursMois");

        expect(joursMois).toBeDefined();
    });

    it("joursMois should disappear when it is toggled off", async () => {
        const moduleSupplements = render(<Supplements currentDate={currentDate}/>);

        moduleSupplements.getByTestId("btn-open").click();
        moduleSupplements.getByTestId("boutonAjouterSupplement").click();
        moduleSupplements.getByTestId("toggleJoursMois").click();
        moduleSupplements.getByTestId("toggleJoursMois").click();

        const joursMois = moduleSupplements.queryByTestId("joursMois");

        expect(joursMois).toBeNull();
    });

    it("joursSemaine should disappear when joursMois is toggled on", async () => {
        const moduleSupplements = render(<Supplements currentDate={currentDate}/>);

        moduleSupplements.getByTestId("btn-open").click();
        moduleSupplements.getByTestId("boutonAjouterSupplement").click();
        moduleSupplements.getByTestId("toggleJoursMois").click();

        const joursSemaine = moduleSupplements.queryByTestId("joursSemaine");

        expect(joursSemaine).toBeNull();
    });

    it("joursSemaine should appear when it joursMois toggled off", async () => {
        const moduleSupplements = render(<Supplements currentDate={currentDate}/>);

        moduleSupplements.getByTestId("btn-open").click();
        moduleSupplements.getByTestId("boutonAjouterSupplement").click();
        moduleSupplements.getByTestId("toggleJoursMois").click();
        moduleSupplements.getByTestId("toggleJoursMois").click();

        const joursSemaine = moduleSupplements.getByTestId("joursSemaine");

        expect(joursSemaine).toBeDefined();
    });

    it("show supplements list should open as expected", () => {
        const { getByTestId } = render(<Supplements currentDate={currentDate}/>);

        const boutonAfficherMenu = getByTestId("btn-open");
        boutonAfficherMenu.click();

        const boutonAfficherListeMedSup = getByTestId("boutonAfficherListeMedSup");
        boutonAfficherListeMedSup.click();

        const listeMedSup = getByTestId("listeMedSup");

        expect(listeMedSup).toBeDefined();
    });

    it("show supplements list should close as expected", () => {
        const { getByTestId, queryByTestId } = render(<Supplements currentDate={currentDate}/>);

        const boutonAfficherMenu = getByTestId("btn-open");
        boutonAfficherMenu.click();

        const boutonAfficherListeMedSup = getByTestId("boutonAfficherListeMedSup");
        boutonAfficherListeMedSup.click();
        boutonAfficherListeMedSup.click();

        const listeMedSup = queryByTestId("listeMedSup");

        expect(listeMedSup).toBeNull();
    });

    /*

    it("should display profile information", () => {
        const { getByTestId } = render(<Sidebar pictureDisabled={true} />);
        const usernameElement = getByTestId("username");
        const heightElement = getByTestId("height");
        const genderElement = getByTestId("gender");
        const emailElement = getByTestId("email");
        const dateFormatElement = getByTestId("dateFormat");

        expect(usernameElement.textContent).toEqual(testProfile.pseudo);
        expect((heightElement.value*100).toString()).toEqual(testProfile.size);
        expect(genderElement.value).toEqual(testProfile.gender);
        expect(emailElement.value).toEqual(testProfile.email);
        expect(dateFormatElement.value).toEqual(testProfile.dateFormat);
    });
    */
});

/*describe("How <Sidebar> behaves", () => {

    beforeEach(() => {
        localStorage.setItem("profile", JSON.stringify(testProfile));
    });

    afterAll(() => { localStorage.removeItem("profile") });

    it("should save a new supplement on pressing save button with valid values", () => {
        const mockSaveHandler = jest.mock().fn();
        const mockDonneesAjoutSontValides = jest.mock().fn();

        const { getByTestId } = render(
            <Supplements
                testFunctions={{
                    handleSave: mockSaveHandler,
                    donneesAjoutSontValides: mockDonneesAjoutSontValides,
                }}
            />
        );
        const btnSave = getByTestId("btn-save");
        btnSave.click();

        // Check que le toast de data saved existe et qu'il est defined
        // Check que les données ont été sauvegardé dans Firebase

        expect(mockSaveHandler).toBeCalledTimes(1);
        expect(mockDonneesAjoutSontValides).toBeCalledTimes(1);
    });

    it("should display an error when trying to save with invalid values", () => {
        const { getByTestId } = render(<Supplements />);

        const btnSave = getByTestId("btn-save");
        btnSave.click();

        // Check que le toast d'erreur existe et qu'il est defined
        // Check que rien n'a été sauvegardé dans Firebase
    });
}); */

jest.clearAllMocks();
