import {cleanup} from "@testing-library/react";
import "@testing-library/jest-dom"
import "@testing-library/jest-dom/extend-expect";
import * as weightService  from "../service/weightService"

jest.mock("firebase", () => {
    const data = {
        dateFormat:"yyyy-LL-dd",
        preferencesPoids:{
          dateCible:"2022-06-24",
          poidsCible:90,
          poidsInitial:100,
          unitePoids:"LBS"
        },
        pseudo:"Ben",
        size:150
      }

    const empty = {
        dateFormat:null,
        preferencesPoids: null,
        pseudo:null,
        size:null
    };

    const empty2 = {
        dateFormat:null,
        preferencesPoids:{
            dateCible:null,
            poidsCible:null,
            poidsInitial:null,
            unitePoids:null
          },
        pseudo:null,
        size:null
    };

    const dataList = [
        {poids:{
            dailyPoids: 75,
            datePoids: "2022-06-18 13:15"
        }},
        {poids:{
            dailyPoids: 65,
            datePoids: "2022-06-20 13:15"
        }},
        {poids:{
            dailyPoids: 0
        }},
        {poids:{
            dailyPoids: 80,
            datePoids: "2022-06-17 13:15"
        }},
        {poids:{
            dailyPoids: 70,
            datePoids: "2022-06-19 13:15"
        }}
    ];
    const snapshot = { val: () => data };
    const snapshotNull = { val: () => null };
    const snapshotEmpty = { val: () => empty };
    const snapshotEmpty2 = { val: () => empty2 };
    const snapshotList = { val: () => dataList };
    const snapshotListNull = { val: () => null };
    return {
        auth: jest.fn(),
        database: jest.fn().mockReturnValue({
            ref: jest.fn().mockReturnValue({
                update: jest.fn(),
                once: jest.fn().mockResolvedValueOnce(snapshot)
                               .mockResolvedValueOnce(snapshotNull)
                               .mockResolvedValueOnce(snapshotEmpty)
                               .mockResolvedValueOnce(snapshotEmpty2),
                orderByChild: jest.fn().mockReturnValue({
                    once: jest.fn().mockResolvedValueOnce(snapshotList)
                                   .mockResolvedValueOnce(snapshotListNull)
                })
            })
        })
    };
});

describe("weightService", () => {
    const dailyWeight = "77";
    const dateFormat = "YYYY/MM/DD"
    const currentDate = {startDate: new Date("2022-06-03 10:30")}
    const unitWeight = "KG"
    const poidsInitial = "85";
    const poidsCible = "56";
    const dateCible = "2022-10-25";
    const size = "160";

    beforeEach(() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids: dailyWeight,
            datePoids:"2022-03-17T15:24:10.792Z"
        }
        
        const pseudo_dashboard = {
            userUID,
            poids,
            size
        };

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

        let dailyWeightList = [
            {x: "2022-06-07", y:70},
            {x: "2022-06-08", y:65},
            {x: "2022-06-09", y:60},
            {x: "2022-06-10", y:55}
        ];

        localStorage.setItem("userUid", userUID);
        localStorage.setItem("dashboard", JSON.stringify(pseudo_dashboard));
        localStorage.setItem("userLanguage", "fr");
        localStorage.setItem("profile", JSON.stringify(pseudoProfile));
        localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
    });

    afterEach(() => {
        localStorage.clear();
        cleanup();
        jest.clearAllMocks()
    });

    test("Test fonction initProfile", async() => {
        const dataDefault = {
            dateFormat:"dd-LL-yyyy",
            preferencesPoids:{
              dateCible:null,
              poidsCible:null,
              poidsInitial:null,
              unitePoids:"KG"
            },
            pseudo:"",
            size:0
          }

        const dataMock = {
            dateFormat:"yyyy-LL-dd",
            preferencesPoids:{
              dateCible:"2022-06-24",
              poidsCible:90,
              poidsInitial:100,
              unitePoids:"LBS"
            },
            pseudo:"Ben",
            size:150
          }

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataMock);
        });

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataDefault);
        });

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataDefault);
        });

        await weightService.initProfile().then(() => {
            expect(JSON.parse(localStorage.getItem("profile"))).toStrictEqual(dataDefault);
        });

        
    });

    test("Test fonction getProfile", async() => {
        const pseudoProfile = {
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

        let result = weightService.getProfile();
        expect(result).toStrictEqual(pseudoProfile);

        localStorage.setItem("profile", null);

        result = weightService.getProfile();
        expect(result).toStrictEqual(null);

        localStorage.setItem("profile", undefined);
        
        result = weightService.getProfile();
        expect(result).toStrictEqual({
            dateFormat:"dd-LL-yyyy",
            preferencesPoids:{
              dateCible:NaN,
              poidsCible:NaN,
              poidsInitial:NaN,
              unitePoids:"KG"
            },
            pseudo:"",
            size:0
          });
    });

    test("Test fonction getPrefDate", async() => {
        let result = weightService.getPrefDate();
        expect(result).toStrictEqual(dateFormat);

        localStorage.setItem("profile", null);

        result = weightService.getPrefDate();
        expect(result).toStrictEqual("dd-LL-yyyy");
    });

    test("Test fonction getTargetWeightDate", async() => {
        let result = weightService.getTargetWeightDate();
        expect(result).toStrictEqual(dateCible);

        localStorage.setItem("profile", null);

        result = weightService.getTargetWeightDate();
        expect(result).toStrictEqual(NaN);
    });

    test("Test fonction getTargetWeight", async() => {
        let result = weightService.getTargetWeight();
        expect(result).toStrictEqual(poidsCible);

        localStorage.setItem("profile", null);

        result = weightService.getTargetWeight();
        expect(result).toStrictEqual(NaN);
    });

    test("Test fonction getInitialWeight", async() => {
        let result = weightService.getInitialWeight();
        expect(result).toStrictEqual(poidsInitial);

        localStorage.setItem("profile", null);

        result = weightService.getInitialWeight();
        expect(result).toStrictEqual(NaN);
    });

    test("Test fonction getPrefUnitWeight", async() => {
        let result = weightService.getPrefUnitWeight();
        expect(result).toStrictEqual(unitWeight);

        localStorage.setItem("profile", null);

        result = weightService.getPrefUnitWeight();
        expect(result).toStrictEqual("KG");
    });

    test("Test fonction getSize", async() => {
        let result = weightService.getSize();
        expect(result).toStrictEqual(size);

        localStorage.setItem("profile", null);

        result = weightService.getSize();
        expect(result).toStrictEqual(0);
    });

    test("Test fonction setPrefUnitWeight", async() => {
        weightService.setPrefUnitWeight("LBS")
        expect(JSON.parse(localStorage.getItem("profile")).preferencesPoids.unitePoids).toStrictEqual("LBS");
    });

    test("Test fonction formatWeight", async() => {
        let result = weightService.formatWeight(100)
        expect(result).toStrictEqual("100.0");

        const pseudoProfile = {
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
        result = weightService.formatWeight(100)
        expect(result).toStrictEqual("220.0");
    });

    test("Test fonction formatToKG", async() => {
        let result = weightService.formatToKG(220)
        expect(result).toStrictEqual(220);

        const pseudoProfile = {
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
        result = weightService.formatToKG(220)
        expect(result).toStrictEqual("100.00");
    });

    test("Test fonction calculation_BMI", async() => {
        let result = weightService.calculation_BMI(size, dailyWeight)
        expect(result).toStrictEqual("30.08");
    });

    test("Test fonction find_new_category", async() => {
        let result = weightService.find_new_category(15)
        expect(result).toStrictEqual("SKIN_CATEGORY");

        result = weightService.find_new_category(20)
        expect(result).toStrictEqual("IDEAL_CATEGORY");

        result = weightService.find_new_category(28)
        expect(result).toStrictEqual("OVERWEIGHT_CATEGORY");

        result = weightService.find_new_category(32)
        expect(result).toStrictEqual("CATEGORY_OB_CLASS_1");

        result = weightService.find_new_category(36)
        expect(result).toStrictEqual("CATEGORY_OB_CLASS_2");

        result = weightService.find_new_category(45)
        expect(result).toStrictEqual("CATEGORY_OB_CLASS_3");
    });

    test("Test fonction check_BMI_change", async() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        
        weightService.check_BMI_change(15); // localstorage is null
        weightService.check_BMI_change(16); // localstorage is not null but same category
        weightService.check_BMI_change(20); // localstorage is not null and different category
        expect(window.alert).toBeCalledWith("Poids idéal");
        weightService.check_BMI_change(15); // localstorage is not null and different category
        expect(window.alert).toBeCalledWith("Trop maigre");
    });

    test("Test fonction formatDate", async() => {
        let result = weightService.formatDate("2022-03-17T15:24:10.792")
        expect(result).toStrictEqual("2022-03-17 15:24");
    });

    test("Test fonction toDate", async() => {
        let result = weightService.toDate("2022-03-17 15:24")
        expect(result).toStrictEqual(new Date("2022-03-17T15:24"));
    });

    test("Test fonction formatDateShape", async() => {
        let result = weightService.formatDateShape("2022-05-17T15:24:10.792", "yyyy-LLLL-dd")
        expect(result).toStrictEqual("2022-mai-17");

        localStorage.setItem("userLanguage", "en");
        result = weightService.formatDateShape("2022-05-17T15:24:10.792", "yyyy-LLLL-dd")
        expect(result).toStrictEqual("2022-May-17");

        localStorage.setItem("userLanguage", "es");
        result = weightService.formatDateShape("2022-05-17T15:24:10.792", "yyyy-LLLL-dd")
        expect(result).toStrictEqual("2022-mayo-17");
    });

    test("Test 1 fonction updateWeightDashboard", async() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids: dailyWeight,
            datePoids: "2022-03-17T15:24:10.792Z"
        }
        
        const pseudo_dashboard1 = {
            userUID,
            poids,
            size
        };
        
        poids={
            dailyPoids: 90,
            datePoids: weightService.toDate("2022-07-01 15:00")
        }
        
        const pseudo_dashboard2 = {
            userUID,
            poids,
            size
        };
        
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard1));

        weightService.updateWeightDashboard(90, "2022-07-01 15:00", "2022-07-01 18:00");
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard2));
    });

    test("Test 1 fonction updateWeightDashboard", async() => {
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids: dailyWeight,
            datePoids: "2022-03-17T15:24:10.792Z"
        }
        
        const pseudo_dashboard1 = {
            userUID,
            poids,
            size
        };
        
        poids={
            dailyPoids: 90,
            datePoids: weightService.toDate("2022-07-01 15:00")
        }
        
        const pseudo_dashboard2 = {
            userUID,
            poids,
            size
        };
        
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard1));

        weightService.updateWeightDashboard(90, "2022-07-01 15:00", "2022-07-01 18:00");
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard2));
    });

    
    test("Test fonction deleteWeightDashboard", async() => {
        let result = weightService.deleteWeightDashboard("2022-06-10")
        expect(result).toStrictEqual();
        var userUID = "TVy9qbYQkaSNH1sdBuBLeW4m1Qh2";
        var poids={
            dailyPoids: dailyWeight,
            datePoids: "2022-03-17T15:24:10.792Z"
        }
        
        const pseudo_dashboard1 = {
            userUID,
            poids,
            size
        };
        
        poids={
            dailyPoids: parseFloat(0).toFixed(1),
            datePoids: null
        }
        
        const pseudo_dashboard2 = {
            userUID,
            poids,
            size
        };
        
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard1));

        weightService.deleteWeightDashboard("2022-07-01 15:00", "2022-07-01 18:00");
        expect(localStorage.getItem("dashboard")).toStrictEqual(JSON.stringify(pseudo_dashboard2));
    });
    

    test("Test fonction initDailyPoidsList", async() => {
        const dataList = [
            {x: "2022-06-20 13:15", y:"65.0"},
            {x: "2022-06-19 13:15", y:"70.0"},
            {x: "2022-06-18 13:15", y:"75.0"},
            {x: "2022-06-17 13:15", y:"80.0"}
        ];
        
        await weightService.initDailyPoidsList().then(() => {
            expect(JSON.parse(localStorage.getItem("listeDailyPoids"))).toStrictEqual(dataList);
        });

        await weightService.initDailyPoidsList().then(() => {
            expect(JSON.parse(localStorage.getItem("listeDailyPoids"))).toStrictEqual([]);
        });
    });

    test("Test fonction getDailyWeightList", async() => {
        const dailyWeightList = [
            {x: "2022-06-07", y:70},
            {x: "2022-06-08", y:65},
            {x: "2022-06-09", y:60},
            {x: "2022-06-10", y:55}
        ];
        
        let result = weightService.getDailyWeightList()
        expect(result).toStrictEqual(dailyWeightList);

        localStorage.clear()
        result = weightService.getDailyWeightList()
        expect(result).toStrictEqual([]);
    });

    test("Test 1 fonction getLastWeightInfos", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:55},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];
        
        let result = weightService.getLastWeightInfos(dailyWeightList)
        expect(result).toStrictEqual(["2022-06-10", 55]);
    });

    test("Test 2 fonction getLastWeightInfos, liste vide", async() => {
        const dailyWeightList = [];
        
        let result = weightService.getLastWeightInfos(dailyWeightList)
        expect(result).toStrictEqual([NaN, "NaN"]);
    });

    test("Test fonction getTime", async() => {
        let result = weightService.getTime("2022-05-17T15:24:10.792")
        expect(result).toStrictEqual("15:24");
    });

    test("Test 1 fonction updateDailyWeightListPrefUnit, KG à LBS", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:55},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];

        const expectedResult = [
            {x: "2022-06-10", y:"121.0"},
            {x: "2022-06-09", y:"132.0"},
            {x: "2022-06-08", y:"143.0"},
            {x: "2022-06-07", y:"154.0"}
        ];
        
        let result = weightService.updateDailyWeightListPrefUnit(dailyWeightList, "KG", "LBS")
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test 2 fonction updateDailyWeightListPrefUnit, LBS à KG", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:121},
            {x: "2022-06-09", y:132},
            {x: "2022-06-08", y:143},
            {x: "2022-06-07", y:154}
        ];

        const expectedResult = [
            {x: "2022-06-10", y:"55.0"},
            {x: "2022-06-09", y:"60.0"},
            {x: "2022-06-08", y:"65.0"},
            {x: "2022-06-07", y:"70.0"}
        ];
        
        let result = weightService.updateDailyWeightListPrefUnit(dailyWeightList, "LBS", "KG")
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test 1: fonction updateDailyWeightListDelete", async() => {
        const dailyWeightList = [2,5,10,3];

        const expectedResult = [5,10,3]

        const item = 2;
        
        let result = weightService.updateDailyWeightListDelete(dailyWeightList, item)
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test 2: fonction updateDailyWeightListDelete", async() => {
        const dailyWeightList = [2,5,10,3];

        const item = 1;
        
        let result = weightService.updateDailyWeightListDelete(dailyWeightList, item)
        expect(result).toStrictEqual(dailyWeightList);
    });

    test("Test 3 fonction updateDailyWeightListPrefUnit, KG à KG", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:55},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];

        const expectedResult = [
            {x: "2022-06-10", y:"55.0"},
            {x: "2022-06-09", y:"60.0"},
            {x: "2022-06-08", y:"65.0"},
            {x: "2022-06-07", y:"70.0"}
        ];
        
        let result = weightService.updateDailyWeightListPrefUnit(dailyWeightList, "KG", "KG")
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test 1 fonction updateDailyWeightList", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:55},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];

        const expectedResult = [
            {x: "2022-06-11", y:"100.0"},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];
        
        let result = weightService.updateDailyWeightList(dailyWeightList, 100, "2022-06-11", "2022-06-10")
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test 2 fonction updateDailyWeightList", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:55},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];

        const expectedResult = [
            {x: "2022-06-10", y:"100.0"},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];
        
        let result = weightService.updateDailyWeightList(dailyWeightList, 100, "2022-06-10", "2022-06-09")
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test :  fonction updateDailyWeightList", async() => {
        const dailyWeightList = [
            {x: "2022-06-10", y:55},
            {x: "2022-06-09", y:60},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];

        const expectedResult = [
            {x: "2022-06-10", y:"100.0"},
            {x: "2022-06-08", y:65},
            {x: "2022-06-07", y:70}
        ];
        
        let result = weightService.updateDailyWeightList(dailyWeightList, 100, "2022-06-10", "2022-06-09")
        expect(result).toStrictEqual(expectedResult);
    });

    test("Test :  fonction updateTargetWeight", async() => {
        const newTargetWeight = 70
        const newTargetWeightDate = "2022-07-10"

        const expectedResult = {
            dateFormat: dateFormat,
            preferencesPoids:{
              dateCible: newTargetWeightDate,
              poidsCible: newTargetWeight,
              poidsInitial: poidsInitial,
              unitePoids: unitWeight
            },
            pseudo:"John Doe",
            size: size
        };
        
        weightService.updateTargetWeight(newTargetWeight, newTargetWeightDate)
        expect(localStorage.getItem("profile")).toStrictEqual(JSON.stringify(expectedResult));
    });
});