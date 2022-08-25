import React from "react";
import {configure, shallow } from "enzyme"
import Adapter from "enzyme-adapter-react-16";
import BoissonAlcool from "./BoissonAlcool";
import firebase from "firebase";

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.

configure({adapter: new Adapter()});

firebase.database = jest.fn(() => {
    return {
        ref: jest.fn(() => {
            return {
                update: jest.fn(),
            }
        }),
    };
});

const dummyAlcool = {
    alcool: {
        notifications: {
            active: false,
        },
        dailyTarget:
        {
            value: 0
        },
        limitConsom: {
            dailyTarget: 0,
            weeklyTarget: 0,
            educAlcool: false,
            sobrietyDays: 4,
            notificationMessage: "Good job"
        },
        alcools: [
            {
                id: 0,
                favoris: false,
                name: "",
                qtte: 0,
                proteine: 0,
                glucide: 0,
                fibre: 0,
                gras: 0,
                unit: "",
                consumption: 0,
            }
        ],
    }
};

describe("BoissonAlcool Test", () => {

    test("change educ alcool setting as Female", () => {
        const mockAlcoolService = {
            settings: {
                updateLimitConsom: (updatedLimitConsom) => {
                    expect(updatedLimitConsom.dailyTarget).toEqual(2);
                    expect(updatedLimitConsom.weeklyTarget).toEqual(10);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateLimitConsom");
        const mockEvent = { detail: { checked: true } };
        const component = shallow(<BoissonAlcool 
            alcool = { dummyAlcool.alcool }
            alcoolService = {mockAlcoolService} 
            gender = {"F"} />);

        component.find("#educAlcoolToggle").simulate("ionChange", mockEvent);
        expect(mockAlcoolService.settings.updateLimitConsom).toBeCalledTimes(1);
    });

    test("change educ alcool setting as Male", () => {
        const mockProfileSercice = {
            get: () => Promise.resolve({
                gender: "H"
            })
        };
        const mockAlcoolService = {
            settings: {
                updateLimitConsom: (updatedLimitConsom) => {
                    expect(updatedLimitConsom.dailyTarget).toEqual(3);
                    expect(updatedLimitConsom.weeklyTarget).toEqual(15);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateLimitConsom");
        const mockEvent = { detail: { checked: true } };
        const component = shallow(<BoissonAlcool 
            alcool = { dummyAlcool.alcool }
            alcoolService={mockAlcoolService}
            profileService = {mockProfileSercice} />);

        component.find("#educAlcoolToggle").simulate("ionChange", mockEvent);

        expect(mockAlcoolService.settings.updateLimitConsom).toBeCalledTimes(1);
    });

    test("change notification setting", () => {
        let expectedNotificationsActiveValue = true;
        const mockAlcoolService = {
            settings: {
                updateNotifications: (updatedNotifications) => {
                    expect(updatedNotifications.active).toEqual(expectedNotificationsActiveValue);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateNotifications");
        let mockEvent = { detail: { checked: expectedNotificationsActiveValue } };
        const component = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } alcoolService={mockAlcoolService} />);

        // Act.
        component.find("#notificationToggle").simulate("ionChange", mockEvent);
        
        expect(mockAlcoolService.settings.updateNotifications).toBeCalledTimes(1);

        // Act.
        expectedNotificationsActiveValue = false;
        mockEvent.detail.checked = expectedNotificationsActiveValue;
        component.find("#notificationToggle").simulate("ionChange", mockEvent);

        expect(mockAlcoolService.settings.updateNotifications).toBeCalledTimes(2);

    });

    test("change daily target", () => {
        const expectedCibleQqte = 89;
        const mockAlcoolService = {
            settings: {
                updateDailyTarget: (updatedDailyTarget) => {
                    expect(updatedDailyTarget.value).toEqual(expectedCibleQqte);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateDailyTarget");
        const mockEvent = { target: { value: expectedCibleQqte, name: "value" } };
        const component = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } alcoolService={mockAlcoolService} />);
        
        component.find("#cibleQtte").simulate("ionChange", mockEvent);
        
        expect(mockAlcoolService.settings.updateDailyTarget).toBeCalledTimes(1);
    });

    test("change limit consommation daily target", () => {
        const expectedDailyTarget = 89;
        const mockAlcoolService = {
            settings: {
                updateLimitConsom: (updatedLimitConsom) => {
                    expect(updatedLimitConsom.dailyTarget).toEqual(expectedDailyTarget);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateLimitConsom");
        const mockEvent = { target: { value: expectedDailyTarget, name: "dailyTarget" } };
        const component = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } alcoolService={mockAlcoolService} />);
        
        component.find("#dailyTargetToggle").simulate("ionChange", mockEvent);
        
        expect(mockAlcoolService.settings.updateLimitConsom).toBeCalledTimes(1);
    });

    test("change limit consommation weekly target", () => {
        const expectedWeeklyTarget = 89;
        const mockAlcoolService = {
            settings: {
                updateLimitConsom: (updatedLimitConsom) => {
                    expect(updatedLimitConsom.weeklyTarget).toEqual(expectedWeeklyTarget);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateLimitConsom");
        const mockEvent = { target: { value: expectedWeeklyTarget, name: "weeklyTarget" } };
        const component = shallow(<BoissonAlcool alcool = { dummyAlcool.alcool } alcoolService={mockAlcoolService} />);
        
        component.find("#weeklyTargetToggle").simulate("ionChange", mockEvent);
        
        expect(mockAlcoolService.settings.updateLimitConsom).toBeCalledTimes(1);
    });
});