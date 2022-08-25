import React, {useRef} from "react";
import {cleanup, render, screen} from "@testing-library/react";
import {ionFireEvent as fireEvent, waitForIonicReact} from "@ionic/react-test-utils";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import {act} from "react-dom/test-utils";
import PracticeEditForm from "../PracticeEditForm";
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

describe('PracticeEditForm', () => {
    var practice = {
        'id' : 1,
        'name' : 'Jogging',
        'date' : "2022-06-03",
        'time' :  480,
        'duration' : 120,
        'intensity' : 'INTENSITY_MEDIUM'
    }
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

    test(" Test 1 : Translation of words to modify an activity in English", async() => {
        localStorage.setItem("userLanguage", "en")
        await act(async () => { render(<PracticeEditForm isMounted={{current: 1}} isOpen={true} practice={practice}/>);
            await waitForIonicReact();
            const submit = screen.getByTestId('modifySubmit');
            const duration = screen.getByTestId('modifyDuration');

            expect(submit.textContent.toString()).toBe("Edit");
            expect(duration.textContent.toString()).toBe("Duration");
        })
    });

    test(" Test 2 : Translating words to modify an activity in Spanish", async() => {
        localStorage.setItem("userLanguage", "es")
        await act(async () => { render(<PracticeEditForm isMounted={{current: 1}} isOpen={true} practice={practice}/>);
            await waitForIonicReact();
            const submit = screen.getByTestId('modifySubmit');
            const duration = screen.getByTestId('modifyDuration');

            expect(submit.textContent.toString()).toBe("Editar");
            expect(duration.textContent.toString()).toBe("Duración");
        })
    });

    test(" Test 3 : Displaying practice values in the form", async() => {
        await act(async () => { render(<PracticeEditForm isMounted={{current: 1}} isOpen={true} practice={practice}/>)
            await waitForIonicReact();
            const name = screen.getByTestId('nameValue');
            const date = screen.getByTestId('dateValue');
            const time = screen.getByTestId('timeValue');
            const duration = screen.getByTestId('durationValue');
            const intensity = screen.getByTestId('intensityValue');

            expect(name.value).toBe("Jogging");
            expect(date.value).toBe("2022-06-03");
            expect(time.value).toBe("08:00");
            expect(duration.value).toBe("02:00");
            expect(intensity.value).toBe("INTENSITY_MEDIUM");
        })
    });

    test(" Test 4 : Deleting an activity practice", async() => {
        await act(async () => {
            let deleteTrigger = false
            const modal = render(<PracticeEditForm isMounted={{current: 1}} isOpen={true} practice={practice} onRemovePractice={() => deleteTrigger = true}/>)
            await waitForIonicReact()
            modal.getByTestId("deleteOpen").click()
            modal.getByTestId("deleteConfirm").click()
            expect(deleteTrigger).toBe(true)
        })
    });
});
