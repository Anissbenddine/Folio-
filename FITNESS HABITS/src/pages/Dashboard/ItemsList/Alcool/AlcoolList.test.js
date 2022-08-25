import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import AlcoolList from "./AlcoolList";

configure({ adapter: new Adapter() });

describe("Dashboard AlcoolList", () => {
    let dummyAlcool;
    beforeEach(() => {
        dummyAlcool = {
            alcool: {
                dailyTarget:
                {
                    globalConsumption: 0,
                    unit: "",
                    value: 0
                },
                alcools: [
                    {
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
                    }
                ],
            }
        };
    });

    test("Augmentation de la consomption quotidienne", () => {
        const today = new Date();
        const expectedCurrentDate = { startDate: today };
        const expectedTotalConsumption = 1;
        const mockAlcoolService = {
            dashboard: {
                updateGlobalConsumption: (totalConsumption, currentDate) => {
                    expect(totalConsumption).toEqual(expectedTotalConsumption);
                    expect(currentDate).toEqual(expectedCurrentDate);
                },
                updateAlcools: (alcools, currentDate) => {
                    expect(alcools.length).toEqual(1);
                    expect(alcools[0].consumption).toEqual(expectedTotalConsumption);
                    expect(currentDate).toEqual(expectedCurrentDate);
                    return Promise.resolve();
                },
                getConsommations: () => {
                    return Promise.resolve({});
                }
            },
            settings: {
                getAlcool: () => {
                    return Promise.resolve({
                        limitConsom: { dailyTarget: 2 },
                        notifications: {
                            active: false
                        }
                    });
                }
            },
            getNotificationMsg: () => "Message"
        };
        jest.spyOn(mockAlcoolService.dashboard, "updateGlobalConsumption");
        jest.spyOn(mockAlcoolService.dashboard, "updateAlcools");
        const component = shallow(<AlcoolList
            alcoolService={mockAlcoolService}
            alcool={dummyAlcool.alcool}
            alcools={dummyAlcool.alcool.alcools}
            globalConsumption={dummyAlcool.alcool.dailyTarget.globalConsumption}
            currentDate={today}
        />);
        component.find(".AddButtonHydr").simulate("click");

        expect(mockAlcoolService.dashboard.updateGlobalConsumption).toBeCalledTimes(1);
        expect(mockAlcoolService.dashboard.updateAlcools).toBeCalledTimes(1);
    });

    test("Diminution de la consomption quotidienne", () => {
        dummyAlcool.alcool.alcools[0].consumption = 1;
        const today = new Date();
        const expectedCurrentDate = { startDate: today };
        const expectedTotalConsumption = 0;
        const mockAlcoolService = {
            dashboard: {
                updateGlobalConsumption: (totalConsumption, currentDate) => {
                    expect(totalConsumption).toEqual(expectedTotalConsumption);
                    expect(currentDate).toEqual(expectedCurrentDate);
                },
                updateAlcools: (alcools, currentDate) => {
                    expect(alcools.length).toEqual(1);
                    expect(alcools[0].consumption).toEqual(expectedTotalConsumption);
                    expect(currentDate).toEqual(expectedCurrentDate);
                    return Promise.resolve();
                },
                getConsommations: () => {
                    return Promise.resolve({});
                }
            },
            settings: {
                getAlcool: () => {
                    return Promise.resolve({
                        limitConsom: { dailyTarget: 2 },
                        notifications: {
                            active: false
                        }
                    });
                }
            },
            getNotificationMsg: () => "Message"
        };
        jest.spyOn(mockAlcoolService.dashboard, "updateGlobalConsumption");
        jest.spyOn(mockAlcoolService.dashboard, "updateAlcools");
        const component = shallow(<AlcoolList
            alcoolService={mockAlcoolService}
            alcool={dummyAlcool.alcool}
            alcools={dummyAlcool.alcool.alcools}
            globalConsumption={dummyAlcool.alcool.dailyTarget.globalConsumption}
            currentDate={today}
        />);
        component.find(".trashButton").first().simulate("click");

        expect(mockAlcoolService.dashboard.updateGlobalConsumption).toBeCalledTimes(1);
        expect(mockAlcoolService.dashboard.updateAlcools).toBeCalledTimes(1);
    });

    test("Suppression d'un alcool", () => {
        dummyAlcool.alcool.alcools[0].consumption = 1;
        const today = new Date();
        const expectedCurrentDate = { startDate: today };
        const expectedTotalConsumption = 0;
        const mockAlcoolService = {
            dashboard: {
                updateGlobalConsumption: (totalConsumption, currentDate) => {
                    expect(totalConsumption).toEqual(expectedTotalConsumption);
                    expect(currentDate).toEqual(expectedCurrentDate);
                },
                updateAlcools: (alcools, currentDate) => {
                    expect(alcools.length).toEqual(0);
                    expect(currentDate).toEqual(expectedCurrentDate);
                    return Promise.resolve();
                },
                getConsommations: () => {
                    return Promise.resolve({});
                }
            },
            settings: {
                getAlcool: () => {
                    return Promise.resolve({
                        limitConsom: { dailyTarget: 2 },
                        notifications: {
                            active: false
                        }
                    });
                }
            },
            getNotificationMsg: () => "Message"
        };
        jest.spyOn(mockAlcoolService.dashboard, "updateGlobalConsumption");
        jest.spyOn(mockAlcoolService.dashboard, "updateAlcools");
        const component = shallow(<AlcoolList
            alcoolService={mockAlcoolService}
            alcool={dummyAlcool.alcool}
            alcools={dummyAlcool.alcool.alcools}
            globalConsumption={dummyAlcool.alcool.dailyTarget.globalConsumption}
            currentDate={today}
        />);
        component.find(".trashButton").last().simulate("click");

        expect(mockAlcoolService.dashboard.updateGlobalConsumption).toBeCalledTimes(1);
        expect(mockAlcoolService.dashboard.updateAlcools).toBeCalledTimes(1);
    });
});