import React from "react";
import { act } from "react-dom/test-utils"
import { configure, shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Alcool from "./Alcool";

configure({ adapter: new Adapter() });

describe("Settings Alcool Section Test", () => {
    let dummyAlcool;
    beforeEach(() => {
        dummyAlcool = {
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

    test("Définition d'un favoris", () => {
        const expectedFavoriIconColor = "#d18a17";
        const currentDate = { startDate: new Date(2020, 3, 1) };
        const dateSpy = jest
            .spyOn(global, "Date")
            .mockImplementation(() => currentDate.startDate)
        const mockAlcoolService = {
            dashboard: {
                addAlcool: (alcool, date) => {
                    expect(alcool).toEqual(dummyAlcool.alcool.alcools[0]);
                    expect(date).toEqual(currentDate);
                }
            },
            settings: {
                updateAlcools: (alcools) => {
                    expect(alcools).toEqual(dummyAlcool.alcool.alcools);
                }
            }
        };
        jest.spyOn(mockAlcoolService.dashboard, "addAlcool");
        jest.spyOn(mockAlcoolService.settings, "updateAlcools");
        const eventData = { stopPropagation: () => { }, target: { style: { color: null } } };

        act(() => {
            const component = shallow(<Alcool
                alcools={dummyAlcool.alcool.alcools}
                alcoolService={mockAlcoolService} />);

            component.find(".starFavoris").simulate(
                "click",
                eventData
            );
        });

        expect(eventData.target.style.color).toEqual(expectedFavoriIconColor);
        expect(dummyAlcool.alcool.alcools[0].favoris).toBeTruthy();
        expect(mockAlcoolService.dashboard.addAlcool).toBeCalledTimes(1);
        expect(mockAlcoolService.settings.updateAlcools).toBeCalledTimes(1);

        dateSpy.mockRestore();
    });

    test("Enlèvement d'un favoris", () => {
        dummyAlcool.alcool.alcools[0].favoris = true;
        const expectedFavoriIconColor = "";
        const mockAlcoolService = {
            dashboard: {
                addAlcool: () => { }
            },
            settings: {
                updateAlcools: (alcools) => {
                    expect(alcools).toEqual(dummyAlcool.alcool.alcools);
                }
            }
        };
        jest.spyOn(mockAlcoolService.dashboard, "addAlcool");
        jest.spyOn(mockAlcoolService.settings, "updateAlcools");
        const eventData = { stopPropagation: () => { }, target: { style: { color: null } } };

        act(() => {
            const component = shallow(<Alcool
                alcools={dummyAlcool.alcool.alcools}
                alcoolService={mockAlcoolService} />);
            component.find(".starFavoris").simulate(
                "click",
                eventData
            );
        });

        expect(eventData.target.style.color).toEqual(expectedFavoriIconColor);
        expect(dummyAlcool.alcool.alcools[0].favoris).toBeFalsy();
        expect(mockAlcoolService.dashboard.addAlcool).toBeCalledTimes(0);
        expect(mockAlcoolService.settings.updateAlcools).toBeCalledTimes(1);
    });

    test("Enlèvement d'un alcool", () => {
        const mockAlcoolService = {
            settings: {
                updateAlcools: (alcools) => {
                    expect(alcools.length).toEqual(0);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateAlcools");
        
        act(() => {
            const component = shallow(<Alcool
                alcools={dummyAlcool.alcool.alcools}
                alcoolService={mockAlcoolService} />);
            component.find(".trashButton").simulate("click");
        });

        expect(mockAlcoolService.settings.updateAlcools).toBeCalledTimes(1);
    });

    test("Ajout d'un alcool", async () => {
        const newAlcoolName = "Sangrila";
        const mockAlcoolService = {
            settings: {
                updateAlcools: (alcools) => {
                    expect(alcools.length).toEqual(2);
                    expect(alcools[0].name).toEqual(newAlcoolName);
                    expect(alcools[1]).toEqual(dummyAlcool.alcool.alcools[0]);
                }
            }
        };
        jest.spyOn(mockAlcoolService.settings, "updateAlcools");

        await act(async () => {
            const component = mount(<Alcool
                alcools={dummyAlcool.alcool.alcools}
                alcoolService={mockAlcoolService} />);
            await new Promise(res => setTimeout(res, 0));
            component.find(".ajoutBotton IonButton.ajoutbreuvage1").simulate("click");
            component.find("AlcoolItem IonInput[name='name']").get(0).props.onIonChange({ target: { value: newAlcoolName, name: "name" } });
            component.find("AlcoolItem button.buttonOK").simulate("click");
        });

        expect(mockAlcoolService.settings.updateAlcools).toBeCalledTimes(1);
    });
});