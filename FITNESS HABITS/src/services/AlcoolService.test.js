import AlcoolService from "./AlcoolService";
import firebase from "firebase";

describe("AlcoolService", () => {
    test("updateAlcools", () => {
        const expectedUserId = "awesomeUser007";
        const expectedDashboard = {
            alcool: {
                alcools: ["patate"]
            }
        };
        const expectedCurrentDate = null;
        localStorage.setItem("userUid", expectedUserId);
        localStorage.setItem("dashboard", JSON.stringify({
            alcool: {
                alcools: []
            }
        }));
        firebase.database = () => (
            {
                ref: (url) => {
                    expect(url).toEqual(`dashboard/${expectedUserId}`);
                    return {
                        update: (dashboard) => dashboard
                    };
                }
            }
        );
        const actualDashboard = AlcoolService.dashboard.updateAlcools(expectedDashboard.alcool.alcools, expectedCurrentDate);
        const actualLocalStorageDashboard = JSON.parse(localStorage.getItem("dashboard"));

        expect(actualDashboard).toEqual(expectedDashboard);
        expect(actualLocalStorageDashboard).toEqual(expectedDashboard);
    });

    test("addAlcool", () => {
        const expectedUserId = "awesomeUser007";
        const newAlcool = "tomate";
        const expectedDashboard = {
            alcool: {
                alcools: [newAlcool, "patate"]
            }
        };
        const expectedCurrentDate = null;
        localStorage.setItem("userUid", expectedUserId);
        localStorage.setItem("dashboard", JSON.stringify({
            alcool: {
                alcools: ["patate"]
            }
        }));
        firebase.database = () => (
            {
                ref: (url) => {
                    expect(url).toEqual(`dashboard/${expectedUserId}`);
                    return {
                        update: (dashboard) => dashboard
                    };
                }
            }
        );
        const actualDashboard = AlcoolService.dashboard.addAlcool(newAlcool, expectedCurrentDate);
        const actualLocalStorageDashboard = JSON.parse(localStorage.getItem("dashboard"));

        expect(actualDashboard).toEqual(expectedDashboard);
        expect(actualLocalStorageDashboard).toEqual(expectedDashboard);
    });

    test("updateGlobalConsumption", () => {
        const expectedUserId = "awesomeUser007";
        const expectedGlobalConsumption = 13;
        const expectedDashboard = {
            alcool: {
                dailyTarget: {
                    globalConsumption: expectedGlobalConsumption
                }
            }
        };
        const expectedCurrentDate = null;
        localStorage.setItem("userUid", expectedUserId);
        localStorage.setItem("dashboard", JSON.stringify({
            alcool: {
                dailyTarget: {
                    globalConsumption: 0
                }
            }
        }));
        firebase.database = () => (
            {
                ref: (url) => {
                    expect(url).toEqual(`dashboard/${expectedUserId}`);
                    return {
                        update: (dashboard) => dashboard
                    };
                }
            }
        );
        const actualDashboard = AlcoolService.dashboard.updateGlobalConsumption(expectedGlobalConsumption, expectedCurrentDate);
        const actualLocalStorageDashboard = JSON.parse(localStorage.getItem("dashboard"));

        expect(actualDashboard).toEqual(expectedDashboard);
        expect(actualLocalStorageDashboard).toEqual(expectedDashboard);
    });
});