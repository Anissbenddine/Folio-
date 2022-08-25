import React from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeAddForm from "../PracticeAddForm";

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

describe('PracticeAddForm', () => {
    var currentDate = new Date()
    var offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - (offset * 60 * 1000))
    currentDate = currentDate.toISOString().split('T')[0]
    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var dateFormat = "YYYY-MM-DD";
        const pseudo_dashboard = {
            userUID,
            dateFormat,

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

    test(" Test 1 : Translation of words to add an activity in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeAddForm isOpen={true}/>);
            await waitForIonicReact();
            const submit = screen.getByTestId('addSubmit');
            const duration = screen.getByTestId('addDuration');

            expect(submit.textContent.toString()).toBe("Add");
            expect(duration.textContent.toString()).toBe("Duration");
        })
    });

    test(" Test 2 : Translating words to add an activity in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeAddForm isOpen={true}/>);
            await waitForIonicReact();
            const submit = screen.getByTestId('addSubmit');
            const duration = screen.getByTestId('addDuration');

            expect(submit.textContent.toString()).toBe("Añadir");
            expect(duration.textContent.toString()).toBe("Duración");
        })
    });

    test(" Test 3 : Displaying default values in the form", async() => {
        await act(async () => { render(<PracticeAddForm isOpen={true}/>)
            await waitForIonicReact();
            const name = screen.getByTestId('nameValue');
            const date = screen.getByTestId('dateValue');
            const time = screen.getByTestId('timeValue');
            const duration = screen.getByTestId('durationValue');

            expect(name.value).toBe("");
            expect(date.value).toBe(currentDate);
            expect(time.value).toBe("00:00");
            expect(duration.value).toBe("00:00");
        })
    });
});
