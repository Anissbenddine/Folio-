import React from "react";
import {render } from "@testing-library/react";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import TableWeight from "../component/TableWeight";
import { toDate} from "../service/weightService"
import { mount } from "enzyme";

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

describe("TableWeight", () => {
    const dateFormat = "YYYY/MM/DD"
    const unitWeight = "KG"
    const poidsInitial = "90";
    const poidsCible = "70";
    const dateCible = "2022-07-30";
    const size="160";
    const dailyWeightList = [
        {x: "2022-06-25", y: 79},
        {x: "2022-06-21", y: 82},
        {x: "2022-06-18", y: 96},
        {x: "2022-06-15", y: 85},
        {x: "2022-06-11", y: 80},
        {x: "2022-06-09", y: 82},
        {x: "2022-06-07", y: 84},
        {x: "2022-06-04", y: 86},
        {x: "2022-06-01", y: 88}
    ]

    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        
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
        localStorage.setItem("userLanguage", "fr");
        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
    });

    afterEach(() => {
        localStorage.clear();
    });

    test("Render TableWeight avec un localStorage vide", async() => {
        localStorage.clear();
        act(() => { render(<TableWeight graphData={dailyWeightList}
                                    initialWeight={poidsInitial} 
                                    targetWeight={poidsCible}
                                    targetWeightDate={dateCible}/>)
        })
    });

    test("Afficher les mots en francais", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
                                    initialWeight={poidsInitial} 
                                    targetWeight={poidsCible}
                                    targetWeightDate={dateCible}/>);

        const chart = component.find("Line");
        const chartData = chart.prop("data");
        const chartOptions = chart.prop("options");
        const labels = component.find("ion-label");

        expect(chartData.datasets[0].label).toBe("Poids initial");
        expect(chartData.datasets[1].label).toBe("Poids");
        expect(chartData.datasets[2].label).toBe("Poids cible");
        expect(chartOptions.title.text).toBe("Évolution du poids")
        expect(chartOptions.scales.yAxes[0].scaleLabel.labelString).toBe("Poids (KG)")

        expect(labels.get(0).props.children).toBe("Semaine");
        expect(labels.get(1).props.children).toBe("Mois");
        expect(labels.get(2).props.children).toBe("Trimestre");
        expect(labels.get(3).props.children).toBe("Semestre");
        expect(labels.get(4).props.children).toBe("Année");
        expect(labels.get(5).props.children).toBe("Cible");

    });

    test("Traduction des mots en espagnol", async() => {
        localStorage.setItem("userLanguage", "es")
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);

        const chart = component.find("Line");
        const chartData = chart.prop("data");
        const chartOptions = chart.prop("options");
        const labels = component.find("ion-label");

        expect(chartData.datasets[0].label).toBe("Peso inicial");
        expect(chartData.datasets[1].label).toBe("Peso");
        expect(chartData.datasets[2].label).toBe("Peso objetivo");
        expect(chartOptions.title.text).toBe("Evolución del peso")
        expect(chartOptions.scales.yAxes[0].scaleLabel.labelString).toBe("Peso (KG)")

        expect(labels.get(0).props.children).toBe("Semana");
        expect(labels.get(1).props.children).toBe("Mes");
        expect(labels.get(2).props.children).toBe("Trimestre");
        expect(labels.get(3).props.children).toBe("Semestre");
        expect(labels.get(4).props.children).toBe("Año");
        expect(labels.get(5).props.children).toBe("Objetivo");

    });

    test("Traduction des mots en anglais", async() => {
        localStorage.setItem("userLanguage", "en")
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);

        const chart = component.find("Line");
        const chartData = chart.prop("data");
        const chartOptions = chart.prop("options");
        const labels = component.find("ion-label");

        expect(chartData.datasets[0].label).toBe("Initial weight");
        expect(chartData.datasets[1].label).toBe("Weight");
        expect(chartData.datasets[2].label).toBe("Weight target");
        expect(chartOptions.title.text).toBe("Weight evolution")
        expect(chartOptions.scales.yAxes[0].scaleLabel.labelString).toBe("Weight (KG)")

        expect(labels.get(0).props.children).toBe("Week");
        expect(labels.get(1).props.children).toBe("Month");
        expect(labels.get(2).props.children).toBe("Quarter");
        expect(labels.get(3).props.children).toBe("Semester");
        expect(labels.get(4).props.children).toBe("Year");
        expect(labels.get(5).props.children).toBe("Target");
    });

    test("Affiche LBS", async() => {
        let pseudoProfile = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: dateCible,
              poidsCible: poidsCible,
              poidsInitial: poidsInitial,
              unitePoids: "LBS"
            },
            pseudo:"John Doe",
            size: size
          };

        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
        
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);

        const chart = component.find("Line");
        const chartOptions = chart.prop("options");

        expect(chartOptions.scales.yAxes[0].scaleLabel.labelString).toBe("Poids (LBS)")
    });

    test("Valeurs initiales", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        const dateFilter = component.find("IonSegment");
        const chartData = component.find("Line").prop("data");

        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date() 
        endDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("7");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[1].data).toStrictEqual(dailyWeightList);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });

    test("Appuie sur le bouton Semaine", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        let dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const buttonValue = component.find("IonSegmentButton").at(0).prop("value");

        act(() => { 
            dateFilter.props().onIonChange({detail: {value: buttonValue}});
        })

        component.update();
        dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const chartData = component.find("Line").prop("data");

        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 7)
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date() 
        endDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("7");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });

    test("Appuie sur le bouton Mois", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        let dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const buttonValue = component.find("IonSegmentButton").at(1).prop("value");

        act(() => { 
            dateFilter.props().onIonChange({detail: {value: buttonValue}});
        })

        component.update();
        dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const chartData = component.find("Line").prop("data");

        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date() 
        endDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("30");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });

    test("Appuie sur le bouton Trimestre", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        let dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const buttonValue = component.find("IonSegmentButton").at(2).prop("value");

        act(() => { 
            dateFilter.props().onIonChange({detail: {value: buttonValue}});
        })

        component.update();
        dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const chartData = component.find("Line").prop("data");

        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 90)
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date() 
        endDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("90");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });

    test("Appuie sur le bouton Semestre", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        let dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const buttonValue = component.find("IonSegmentButton").at(3).prop("value");
        
        act(() => { 
            dateFilter.props().onIonChange({detail: {value: buttonValue}});
        })

        component.update();
        dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const chartData = component.find("Line").prop("data");

        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 182)
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date() 
        endDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("182");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });

    test("Appuie sur le bouton Année", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        let dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const buttonValue = component.find("IonSegmentButton").at(4).prop("value");
        
        act(() => { 
            dateFilter.props().onIonChange({detail: {value: buttonValue}});
        })

        component.update();
        dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const chartData = component.find("Line").prop("data");

        let startDate = new Date()
        startDate.setDate(startDate.getDate() - 365)
        startDate.setHours(0, 0, 0, 0);

        let endDate = new Date() 
        endDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("365");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });

    test("Appuie sur le bouton Cible", async() => {
        const component = mount(<TableWeight graphData={dailyWeightList}
            initialWeight={poidsInitial} 
            targetWeight={poidsCible}
            targetWeightDate={dateCible}/>);
        

        let dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const buttonValue = component.find("IonSegmentButton").at(5).prop("value");
        
        act(() => { 
            dateFilter.props().onIonChange({detail: {value: buttonValue}});
        })

        component.update();
        dateFilter = component.find("[data-testid='dateFilter']").at(0);
        const chartData = component.find("Line").prop("data");

        let endDate = new Date(toDate(dateCible)); 
        endDate.setMonth(endDate.getMonth()+1);
        endDate.setHours(0, 0, 0, 0);

        let startDate = new Date(endDate)
        startDate.setDate(startDate.getDate() - 90)
        startDate.setHours(0, 0, 0, 0);

        expect(dateFilter.prop("value")).toBe("-90");
        expect(chartData.datasets[0].data).toStrictEqual([{x: startDate, y: "90.0"},{x: endDate, y: "90.0"}]);
        expect(chartData.datasets[2].data).toStrictEqual([{x: startDate, y: "70"},{x: endDate, y: "70"}]);
    });
});