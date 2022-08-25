import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import Activities from "../Activities";

describe('PracticeList', () => {
    let currentDate = {startDate: new Date("2022-06-03")}
    let jogging = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : currentDate.startDate.toISOString(),
        'time' :  480,
        'duration' :  120,
        'intensity' : 'INTENSITY_MEDIUM'
    }
    let karate = {
        'id' : 2,
        'name' : 'Karate',
        'date' : currentDate.startDate.toISOString(),
        'time' :  600,
        'duration' :  60,
        'intensity' : 'INTENSITY_HIGH'
    }
    let practices = [jogging, karate]
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var dateFormat = "YYYY-MM-DD";
        const pseudo_dashboard = {
            userUID,
            dateFormat
        };
        localStorage.setItem("userUid", userUID);
        localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
        localStorage.setItem("prefUnitePoids", "KG");
        localStorage.setItem("userLanguage", "fr");
        localStorage.setItem("prefDateFormat", dateFormat);
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });

    test(" Test 1 : Translating the word Activities in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<Activities currentDate={currentDate} practices={practices} activities={[]}/>);
            const title = screen.getByTestId('moduleTitle');
            const target = screen.getByTestId('targetTitle');
            const weekly = screen.getByTestId('weeklyTitle');
            expect(title.textContent.toString()).toBe("Activities");
            expect(target.textContent.toString()).toBe("Target | ");
            expect(weekly.textContent.toString()).toBe("For 7 days | ");
        })
    });

    test(" Test 2 : Translating the word Activities in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<Activities currentDate={currentDate} practices={[]} activities={[]}/>);
            const title = screen.getByTestId('moduleTitle')
            const target = screen.getByTestId('targetTitle')
            const weekly = screen.getByTestId('weeklyTitle');
            expect(title.textContent.toString()).toBe("Ocupaciones");
            expect(target.textContent.toString()).toBe("Objetivo | ");
            expect(weekly.textContent.toString()).toBe("Durante 7 días | ");
        })
    });

    test(" Test 3 : Viewing the activity practices list", async() => {
        await act(async () => {
            const modal = render(<Activities currentDate={currentDate} practices={[]} activities={[]}/>);
            await waitForIonicReact();
            modal.getByTestId("openPractice").click();
            const list = screen.getByTestId('practiceList');
            expect(list).toBeDefined();
        })
    });

    test(" Test 4 : Viewing the usual activities list", async() => {
        await act(async () => {
            const modal = render(<Activities currentDate={currentDate} practices={[]} activities={[]}/>);
            await waitForIonicReact();
            modal.getByTestId("openActivity").click();
            const list = screen.getByTestId('activityList');
            expect(list).toBeDefined();
        })
    });

    test(" Test 5 : Viewing the activity values", async() => {
        await act(async () => { render(<Activities currentDate={currentDate} practices={practices} activities={[]}/>);
            const dailyDuration = screen.getByTestId('dailyDuration');
            const dailyIntensity = screen.getByTestId('dailyIntensity');
            const weeklyDuration = screen.getByTestId('weeklyDuration');
            const weeklyIntensity = screen.getByTestId('weeklyIntensity');
            const targetDuration = screen.getByTestId('targetDuration');
            const targetIntensity = screen.getByTestId('targetIntensity');
            expect(dailyDuration.textContent.toString()).toBe("03:00");
            expect(dailyIntensity.textContent.toString()).toBe("Moyenne");
            expect(weeklyDuration.textContent.toString()).toBe("03:00, ");
            expect(weeklyIntensity.textContent.toString()).toBe("Moyenne");
            expect(targetDuration.textContent.toString()).toBe("00:00, ");
            expect(targetIntensity.textContent.toString()).toBe("Basse");
        })
    });
});
