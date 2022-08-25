import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import ActivityList from "../ActivityList";

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

describe('ActivityList', () => {
    var activity = {
        'id' : 1,
        'name' : 'Jogging',
        'time' :  480,
        'duration' :  120,
        'intensity' : 'INTENSITY_LOW'
    }
    const currentDate = new Date()
    var practices= []
    var activities= [activity]
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

    test(" Test 1 : Translating the word Usual Activities in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<ActivityList currentDate={currentDate} practices={practices}
                                                     activities={activities} showActivityList={true}
                                                     modifyActivity={() => {return false;}}/>);
            const mot = screen.getByTestId('activityTitle')
            expect(mot.textContent.toString()).toBe("Usual activities");
        })
    });

    test(" Test 2 : Translating the word Usual Activities in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<ActivityList currentDate={currentDate} practices={practices}
                                                     activities={activities} showActivityList={true}
                                                     modifyActivity={() => {return false;}}/>);
            const mot = screen.getByTestId('activityTitle')
            expect(mot.textContent.toString()).toBe("Actividades habituales");
        })
    });

    test(" Test 3 : Viewing the new activity form", async() => {
        await act(async () => {
            render(<ActivityList currentDate={currentDate} practices={practices}
                                               activities={activities} showActivityList={true}
                                               modifyActivity={() => {return false;}}/>);
            await waitForIonicReact();
            screen.getByTestId("addActivity").click()
            const add = screen.getByTestId('addForm')
            expect(add).toBeDefined();
        })
    });
});
