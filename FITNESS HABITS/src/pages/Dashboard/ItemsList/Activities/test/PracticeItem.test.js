import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeItem from "../PracticeItem";

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

describe('PracticeItem', () => {
    var practice = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : "2022-06-03",
        'time' :  480,
        'duration' :  120,
        'intensity' : 'INTENSITY_LOW'
    }
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

    test(" Test 1 : Translating the words in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeItem practice={practice}/>);
            await waitForIonicReact();
            const mot = screen.getByTestId('practiceIntensity');
            expect(mot.textContent.toString()).toBe("Low");
        })
    });

    test(" Test 2 : Translating the words in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeItem practice={practice}/>);
            await waitForIonicReact();
            const mot = screen.getByTestId('practiceIntensity');
            expect(mot.textContent.toString()).toBe("Abajo");
        })
    });

    test(" Test 3 : Displaying the values ​​of an activity practice", async() => {
        await act(async () => { render(<PracticeItem practice={practice}/>);
            const name = screen.getByTestId("practiceName");
            const date = screen.getByTestId("practiceDate");
            const duration = screen.getByTestId("practiceDuration");
            const intensity = screen.getByTestId("practiceIntensity");
            
            expect(name.textContent.toString()).toBe("Jogging");
            // expect(date.textContent).toBe("06-03-2022")
            expect(duration.textContent).toBe("02:00");
            expect(intensity.textContent.toString()).toBe("Basse");
        })
    });
});
