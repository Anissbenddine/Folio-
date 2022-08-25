import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AlcoolItem from "./AlcoolItem";

configure({ adapter: new Adapter() });

describe("Dashboard AlcoolItem", () => {
    let dummyAlcool;
    beforeEach(() => {
        dummyAlcool = {
            id: 0,
            favoris: false,
            name: "Vodka à la base de patates",
            qtte: 0,
            proteine: 0,
            glucide: 0,
            fibre: 0,
            gras: 0,
            unit: "",
            consumption: 0,
        };
    });

    test("Les valeurs passés en paramètres sont correctement appliqués", () => {
        let actualAlcoolToSave;
        const component = shallow(<AlcoolItem itemDashAlcool={dummyAlcool} save={(item) => actualAlcoolToSave = item} />);
        component.find("button.buttonOK").simulate("click");

        expect(actualAlcoolToSave).toEqual(dummyAlcool);
    });

    test("Les valeurs sauvegardés sont valides suite aux modifications", () => {
        const expectedAlcool = {
            id: 0,
            favoris: false,
            name: "Champagne",
            qtte: 123,
            proteine: 6,
            glucide: 8,
            fibre: 9,
            gras: 19,
            unit: "ml",
            consumption: 0
        };
        let actualAlcoolToSave;
        const component = shallow(<AlcoolItem itemDashAlcool={dummyAlcool} save={(item) => actualAlcoolToSave = item} />);

        component.find("[name='name']").simulate("ionChange", { target: { value: expectedAlcool.name, name: "name" } });
        component.find("[name='qtte']").simulate("ionChange", { target: { value: expectedAlcool.qtte, name: "qtte" } });
        component.find("[name='unit']").simulate("change", { target: { value: expectedAlcool.unit, name: "unit" } });
        component.find("[name='proteine']").simulate("ionChange", { target: { value: expectedAlcool.proteine, name: "proteine" } });
        component.find("[name='glucide']").simulate("ionChange", { target: { value: expectedAlcool.glucide, name: "glucide" } });
        component.find("[name='fibre']").simulate("ionChange", { target: { value: expectedAlcool.fibre, name: "fibre" } });
        component.find("[name='gras']").simulate("ionChange", { target: { value: expectedAlcool.gras, name: "gras" } });
        component.find("button.buttonOK").simulate("click");

        expect(actualAlcoolToSave).toEqual(expectedAlcool);
    });

    test("Demande la fermeture si on clique sur le bouton de fermeture", () => {
        let closeCalled = false;
        const component = shallow(<AlcoolItem itemDashAlcool={dummyAlcool} close={() => closeCalled = true} />);
        component.find(".buttonCloseEdit").simulate("click");

        expect(closeCalled).toBeTruthy();
    });


    test("Les valeurs par défaut sont valides", () => {
        const expectedAlcool = {
            id: 0,
            favoris: false,
            name: "",
            qtte: 0,
            proteine: 0,
            glucide: 0,
            fibre: 0,
            gras: 0,
            unit: "",
            consumption: 0
        };
        let actualAlcoolToSave;
        const component = shallow(<AlcoolItem save={(item) => actualAlcoolToSave = item} />);
        component.find("button.buttonOK").simulate("click");

        expect(actualAlcoolToSave.id).not.toBeUndefined();
        expect(actualAlcoolToSave.id).not.toBeNull();
        expect(actualAlcoolToSave.id).not.toEqual("");
        // Si l"id n"est pas vide, on a généré un nouvel id, 
        // ce qui est le comportement valide.
        expectedAlcool.id = actualAlcoolToSave.id;
        expect(actualAlcoolToSave).toEqual(expectedAlcool);
    });
});