import firebase from "firebase"

let arrayWeights = [];
let arraySleeps = [];
let arrayActivities = [];
let arrayHydratations = [];
let arrayNourriture = [];
let arrayAlcohol = [];
let arrayToilets = [];
let arrayGlycemia = [];

let mapAggWeights = new Map();
let mapAggSleeps = new Map();
let mapAggActivities = new Map();
const userUID = localStorage.getItem("userUid");

/**
 * @param dataSelected: Categories selected by the user
 * @param d1: Start date to generate report
 * @param d2: End date to generate report
 * @public
 */
export async function compilerBilan(dataSelected, d1, d2) {
    arrayWeights = [];
    arraySleeps = [];
    arrayActivities = [];
    arrayHydratations = [];
    arrayNourriture = [];
    arrayAlcohol = [];
    arrayToilets = [];
    arrayGlycemia = [];
    mapAggWeights = new Map();
    mapAggSleeps = new Map();
    mapAggActivities = new Map();
    d1.setHours(0, 0, 0, 0)
    //*Array to contain all BD's data*/
    let dataFormat = [];

    /* if offline, fetches from local storage of the user*/
    if (!window.navigator.onLine) {
        let localStorageData = JSON.parse(localStorage.getItem("dashboard"));
        fetchData(localStorageData, formatTodayDate(), dataSelected)

    } else {
        formatTodayDate();
        // Fetch all datas in BD for the current user and set the date from Firebase (like: 2044, 2046, 2022022
        // dataFormat = Array of all datas in the BD with date as mm-jj-aaaa
        // dataSelected = Checkbox selected by user
        dataFormat = await getDataFromFirebase(dataFormat);

        // With the new array(with the good date format), filter the datas with date selected by user in the datepicker
        dataFormat = filterDataByDate(dataFormat, d1, d2);

        // With the filtered datas, make a dictionnary for each parameters
        // so the front end can easily fetch datas with keys and show parameters selected by activity/date.
        for (const element of dataFormat) {
            let formatedDate = formatDate(element.date);
            fetchData(element, formatedDate, dataSelected);
        }
    }
}

/**
 * @param dataFormat:
 * @private
 * @return: array (dataFormat) with all the datas from the user
 */
async function getDataFromFirebase(dataFormat) {
    let ref = firebase.database().ref("dashboard/" + userUID + "/");
    await ref.once("value", (snap) => {
        snap.forEach((data) => {
            let annee = data.key.slice(-4);
            let dayAndMonth = data.key.slice(0, -4);
            let mois;
            let jour;
            /**  if there's only 2 char for the day and month, then day and month are 1 char each*/
            if (dayAndMonth.length === 2) {
                jour = '0' + data.key[0] + '-';
                mois = '0' + data.key[1] + '-';
                /**  if dayAndMonth has length of 4, then day and month have 2 chars each*/
            } else if (dayAndMonth.length === 4) {
                jour = data.key.slice(0, 2) + '-';
                mois = data.key.slice(2, 4) + '-';
                /**  if dayAndMonth has a length of 3, 2 options:*/
            } else if (dayAndMonth.length === 3) {
                /**  day 2 chars, month 1 char*/
                if ([...Array(32).keys()].includes(parseInt(dayAndMonth.slice(0, 2)))
                    && !([...Array(12).keys()].includes(parseInt(dayAndMonth.slice(1, 3))))) {
                    jour = data.key.slice(0, 2) + '-';
                    mois = '0' + data.key[2] + '-';
                    /**  day 1 char, month 1 char*/
                } else {
                    jour = '0' + data.key[0] + '-';
                    mois = data.key.slice(1, 3) + '-';
                }
            }
            let date = jour + mois + annee;
            let obj = data.val();
            obj.date = date;
            dataFormat.push(obj);
        });
    });
    return dataFormat;
}

/**
 * Filter the array of data by date between start date and end date
 * @param dataSelected: Categories selected by the user
 * @param d1: Start date to generate report
 * @param d2: End date to generate report
 * @private
 * @return: Datas between date selected bu the user
 */
function filterDataByDate(dataFormat, d1, d2) {
    let datePickerDates = getDates(d1, d2);
    dataFormat = dataFormat.filter((data) => {
        return !!datePickerDates.find((item) => {
            return (item.getTime() === new Date(data.date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).getTime()
            );
        });
    });
    return dataFormat;
}

/**
 * Return an array containing all the possible dates between startDate and stopDate
 */
function getDates(startDate, stopDate) {
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

/**
 * Fetches all the data for the selected categories. Categories are pushed
 * in the properMap/Array of this class.
 */
function fetchData(data, formatedDate, categorySelected) {
    for (const category of categorySelected) {
        switch (category) {
            case "hydratation":
                // eslint-disable-next-line no-case-declarations
                let hydratations = data.hydratation.hydrates
                fetchDrinks("hydratation", hydratations, formatedDate);
                break;
            case "nourriture":
                // eslint-disable-next-line no-case-declarations
                let cereales = data.food.categories.grainFood;
                // eslint-disable-next-line no-case-declarations
                let legumes = data.food.categories.vegetables;
                // eslint-disable-next-line no-case-declarations
                let fruits = data.food.categories.fruit;
                // eslint-disable-next-line no-case-declarations
                let proteines = data.food.categories.proteinFood;
                // eslint-disable-next-line no-case-declarations
                let gras = data.food.categories.dairyProducts;
                fetchNourriture(cereales, formatedDate);
                fetchNourriture(legumes, formatedDate);
                fetchNourriture(fruits, formatedDate);
                fetchNourriture(proteines, formatedDate);
                fetchNourriture(gras, formatedDate);
                break;
            case "toilettes":
                // eslint-disable-next-line no-case-declarations
                let toilets = data.toilettes;
                fetchToilets(toilets, formatedDate);
                break;
            case "alcool":
                // eslint-disable-next-line no-case-declarations
                let alcools = data.alcool.alcools;
                fetchDrinks("alcool", alcools, formatedDate);
                break;
            case "glycémie":
                // eslint-disable-next-line no-case-declarations
                let glycemie = data.glycemie.dailyGlycemie;
                fetchGlycemia(glycemie, formatedDate);
                break;
            case "supplements":/* must be done once implementation of this module done
                    var supplement = dataFormat[i].supplement;
                    if (!supplement)
                        retour[i][data] =
                            translate.getText("SUPP_NOT_YET_IMPLEMENTED") + "\n";
                    else retour[i][data] = supplement;
                    */
                break;
            case "poids":
                // eslint-disable-next-line no-case-declarations
                let weight;
                weight = data.poids.dailyPoids;
                fetchWeights(weight, formatedDate);
                break;
            case "activities":
                if (data.activities) {
                    const activity = data.activities;
                    if (parseInt(activity.hour) + parseInt(activity.minute) !== 0) {
                        fetchActivities(activity, formatedDate);
                    }
                }
                break;
            case "sommeil":
                // eslint-disable-next-line no-case-declarations
                let sommeil = data.sommeil;
                fetchSleeps(sommeil, formatedDate);
                break;
            default:
                break;
        }
    }
}

/**
 * Fetches datas for hydratation and alcohol.
 * @param: "hydratation" or "alcool"
 */
function fetchDrinks(typeOfDrink, drinks, formatedDate) {
    if (drinks) {
        for (const drink of drinks) {
            if (drink.consumption === 0) {
                continue;
            }
            let mapHydratation = new Map();
            mapHydratation.set("Date", formatedDate);
            mapHydratation.set("Nom", drink.name);
            mapHydratation.set("Quantité", drink.qtte);
            mapHydratation.set("Unité", drink.unit);
            mapHydratation.set("Protéine", parseInt(drink.proteine) * drink.consumption);
            mapHydratation.set("Glucide", parseInt(drink.glucide) * drink.consumption);
            mapHydratation.set("Fibre", parseInt(drink.fibre) * drink.consumption);
            mapHydratation.set("Gras", parseInt(drink.gras) * drink.consumption);

            if (typeOfDrink === "hydratation") {
                arrayHydratations.push(mapHydratation);
            } else {
                arrayAlcohol.push(mapHydratation);
            }
        }
    }
}

/**
 *
 */
function fetchNourriture(foods, formatedDate) {
    if (foods.items) {
        for (const element of foods.items) {
            let mapResult = new Map();
            mapResult.set("Date", formatedDate);
            mapResult.set("Nom", element.name);
            mapResult.set("Quantité", element.qty);
            mapResult.set("Unité", element.unit);
            mapResult.set("Protéine", element.proteins);
            mapResult.set("Glucide", element.glucides);
            mapResult.set("Fibre", element.fibre);
            mapResult.set("Gras", element.fats);

            arrayNourriture.push(mapResult);
        }
    }
}

/**
 *
 */
function fetchToilets(toilets, formatedDate) {
    if (toilets) {
        let mapToilets = new Map();

        mapToilets.set("Date", formatedDate);
        mapToilets.set("Urine", toilets.urine);
        mapToilets.set("Transit", toilets.feces);

        arrayToilets.push(mapToilets);
    }
}

/**
 *
 */
function fetchGlycemia(glycemia, formatedDate) {
    if (glycemia) {
        let mapGlycemia = new Map();
        mapGlycemia.set("Date", formatedDate);
        mapGlycemia.set("Glycémie", parseInt(glycemia));

        arrayGlycemia.push(mapGlycemia);
    }
}

/**
 *
 */
function fetchWeights(weight, formatedDate) {
    if (weight && weight !== "0.00") {
        let mapWeight = new Map();
        mapWeight.set("Date", formatedDate);
        let weightUnit = localStorage.getItem("prefUnitePoids");
        mapWeight.set("weightUnit", weightUnit);

        if (weightUnit === "LBS") {
            mapWeight.set("weight", (weight * 2.2).toFixed(2));
        } else {
            mapWeight.set("weight", weight);
        }
        arrayWeights.push(mapWeight);
    }
}

/**
 *
 */
function fetchActivities(activity, formatedDate) {
    if (activity) {
        let mapActivity = new Map();
        let minutes = parseInt(activity.heure * 60) + parseInt(activity.minute);
        let duration = formatDuration(minutes);

        mapActivity.set("Date", formatedDate);
        mapActivity.set("duration", duration);
        mapActivity.set("hours", duration.slice(0, 2));
        mapActivity.set("minutes", duration.slice(3, 5));
        arrayActivities.push(mapActivity);
    }
}

/**
 * Keys: "date", "startHour", "endHour", "wakeUpQt", "wakeUpState"
 */
function fetchSleeps(sleep, formatedDate) {
    if (sleep) {
        let mapSleep = new Map();
        if (sleep.duree && sleep.duree !== 0) {
            mapSleep.set("Date", formatedDate);
            mapSleep.set("startHour", sleep.heureDebut);
            mapSleep.set("endHour", sleep.heureFin);
            mapSleep.set("duration", formatDuration(sleep.duree));
            sleep.nbReveils < 0 ? mapSleep.set("wakeUpQt", 0) : mapSleep.set("wakeUpQt", sleep.nbReveils);
            mapSleep.set("wakeUpState", sleep.etatReveil);
            arraySleeps.push(mapSleep);
        }
    }
}


// ---- FONCTIONS UTILS ----------------------------------------------------

/**
 * Takes minutes and transform in a string like hh:mm
 */
function formatDuration(min) {
    let minutes = Math.floor(min);
    let hours;
    if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = Math.floor(minutes % 60);
        if (hours < 10) {
            hours = "0" + hours;
        }

    } else if (minutes < 60) {
        hours = "00";
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}

/**
 * Takes a string time as hh:00 and transform in int minuttes
 */
function getDuration(time) {
    return (parseInt(time.slice(0, 2) * 60) + parseInt(time.slice(3, 5)))
}

// ---- PUBLIC FONCTIONS ----------------------------------------------------

// PUBLIC FONCTIONS
/**
 * keys : date, consumption, quantity, volume, unit, protein, glucide, fiber, fat
 * @public
 */
export function getHydratations() {
    if (arrayHydratations.length !== 0) {
        sortEntries(arrayHydratations);
        return arrayHydratations;
    }
    return null;
}


/**
 * keys :
 * @public
 */
export function getNourriture() {
    if (arrayNourriture.length !== 0) {
        sortEntries(arrayNourriture);
        return arrayNourriture;
    }
    return null;
}

/**
 * keys :
 * @public
 */
export function getAlcohol() {
    if (arrayAlcohol.length !== 0) {
        sortEntries(arrayAlcohol);
        return arrayAlcohol;
    }
    return null;
}

/**
 * Function used to calculate the macros total and the average per day.
 * @public
 * keys : "hydratation", "alcool", "nourriture"
 * @return: a map with a total for each macro (protein, glucide, fiber, fat) as well as their average.
 */
export function getMacrosTotalAndAveragePerDay(category) {
    let totalFiber = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalGlucide = 0;
    let days;
    let macrosMap = new Map();
    let arrayMacros;
    switch (category) {
        case "hydratation":
            arrayMacros = arrayHydratations;
            break;
        case "nourriture":
            arrayMacros = arrayNourriture;
            break;
        case "alcool":
            arrayMacros = arrayAlcohol;
            break;
    }

    if (arrayMacros.length !== 0) {
        arrayMacros.forEach((data) => {
            totalFiber += data.get("Fibre");
            totalProtein += data.get("Protéine");
            totalFat += data.get("Gras");
            totalGlucide += data.get("Glucide");
        });
        days = getNumberOfUniqueDate(arrayMacros);
    } else { // empty array
        return null;
    }
    macrosMap.set("totalFiber", totalFiber);
    macrosMap.set("totalProtein", totalProtein);
    macrosMap.set("totalFat", totalFat);
    macrosMap.set("totalGlucide", totalGlucide);
    macrosMap.set("averageFiber", +(totalFiber / days).toFixed(2));
    macrosMap.set("averageProtein", +(totalProtein / days).toFixed(2));
    macrosMap.set("averageFat", +(totalFat / days).toFixed(2));
    macrosMap.set("averageGlucide", +(totalGlucide / days).toFixed(2));

    return macrosMap;
}

/**
 * keys : urine, feces
 * @public
 */
export function getToilets() {
    if (arrayToilets.length !== 0) {
        sortEntries(arrayToilets);
        return arrayToilets;
    }
    return null;
}

/**
 * keys : "totalUrine", totalFeces", "averageUrinePerDay", "averageFecesPerDay"
 * @public
 */
export function getAverageToilets() {
    let totalUrine = 0;
    let totalFeces = 0;
    let days = getNumberOfUniqueDate(arrayToilets);
    let mapToilets = new Map();

    if (arrayToilets.length !== 0) {
        arrayToilets.forEach((data) => {
            totalUrine += data.get("Urine");
            totalFeces += data.get("Transit");
        });
        mapToilets.set("totalUrine", totalUrine);
        mapToilets.set("totalFeces", totalFeces);
        mapToilets.set("averageUrinePerDay", parseInt((totalUrine / days).toFixed(2)));
        mapToilets.set("averageFecesPerDay", parseInt((totalFeces / days).toFixed(2)));

        return mapToilets;
    }
    return null;
}

/**
 * keys : Date, Glycemie
 * @public
 */
export function getGlycemia() {
    if (arrayGlycemia.length !== 0) {
        sortEntries(arrayGlycemia);
        return arrayGlycemia;
    }
    return null;
}

/**
 * keys : Date, Glycemie
 * @public
 * @return the average glycemia for the last few days
 */
export function getAverageGlycemia() {
    let total = 0;
    let moyenne = 0;
    let days = getNumberOfUniqueDate(arrayGlycemia)
    let mapAverageGlycemia = new Map();

    if (arrayGlycemia.length !== 0) {
        arrayGlycemia.forEach((data) => {
            total += data.get("Glycémie");
        });
        moyenne = (total / days).toFixed(2);
        mapAverageGlycemia.set("Moyenne", parseFloat(moyenne) + " mmol/L");
        mapAverageGlycemia.set("Référence", "4.7 - 6.8 mmol/L");

        return mapAverageGlycemia;
    }
    return null;
}

/**
 * keys : date, hour, minute, duration
 * @public
 * @return an array of the activities or null
 */
export function getActivities() {
    if (arrayActivities.length !== 0) {
        sortEntries(arrayActivities);
        return arrayActivities;
    } else {
        return null;
    }
}

/**
 *
 * @public
 * @return a map with keys : TotalDuration, AverageDuration
 */
export function getAggregateActivities() {
    let totalDuration = 0;
    let totalDays = 0;

    if (arrayActivities.length !== 0) {
        getActivities().forEach((data) => {
            totalDuration = totalDuration + parseInt(data.get('minutes')) + parseInt(data.get('hours') * 60);
            totalDays = totalDays + 1;
        });

        mapAggActivities.set("TotalDuration", formatDuration(totalDuration));
        mapAggActivities.set("AverageDuration", formatDuration(totalDuration / totalDays));

        return mapAggActivities;
    } else {
        return null;
    }
}

/**
 * WEIGHTS
 * @public
 * @return a map with keys : weightUnit, weight, Date
 */
export function getWeights() {
    if (arrayWeights.length !== 0) {
        sortEntries(arrayWeights);

        return arrayWeights
    } else {
        return null;
    }
}


/**
 * WEIGHTS
 * @public
 * @return a map with keys : initalWeight, finalWeight, deltaWeight, weightUnit
 */
export function calculateAggregateWeights() {
    let initialWeight = 0;
    getWeights();
    let finalWeight = arrayWeights.length > 0 ? arrayWeights[0].get("weight") : 0;
    if (arrayWeights.length === 1) {
        initialWeight = finalWeight;
    } else if (arrayWeights.length > 1 ) {
        initialWeight = arrayWeights[arrayWeights.length - 1].get("weight");
    }

    mapAggWeights.set("initalWeight", initialWeight);
    mapAggWeights.set("finalWeight", finalWeight);
    mapAggWeights.set("deltaWeight", (finalWeight - initialWeight).toFixed(2));
    mapAggWeights.set("weightUnit", localStorage.getItem("prefUnitePoids"));

}


/**
 * WEIGHTS
 * @private
 * @return a map with keys : initalWeight, finalWeight, deltaWeight, weightUnit
 */
export function getAggregateWeights() {
    return mapAggWeights;
}


/**
 * SLEEPS
 * @public
 * @return an array of map with keys : date, hour, minute, duration, wakeUpQt, wakeUpState
 */
export function getSleeps() {
    if (arraySleeps.length !== 0) {
        sortEntries(arraySleeps);
        return arraySleeps;
    } else {
        return null;
    }
}

/**
 * SLEEPS
 * @public
 * @return a map with keys : averageStartHour, averageEndHour, averageDuree, averageWakeUpQt
 */
export function getAggregateSleeps() {
    if (arraySleeps.length !== 0) {
        let minTotalStartHours = 0;
        let minTotalEndHours = 0;
        let minTotalDuration = 0;
        let totalWakeUp = 0;

        let totalDaysStart = 0;
        let totalDaysEnd = 0;
        let totalDaysDuration = 0;
        let totalDaysWakeUp = 0;

        getSleeps().forEach((data) => {
            if (data.get("startHour")) {
                minTotalStartHours += getDuration(data.get("startHour"));
                totalDaysStart += 1;
            }

            if (data.get("endHour")) {
                minTotalEndHours += getDuration(data.get("endHour"));
                totalDaysEnd += 1
            }

            if (getDuration(data.get("duration")) !== 0) {
                minTotalDuration += getDuration(data.get("duration"));
                totalDaysDuration += 1;
            }
            totalWakeUp += parseInt(data.get("wakeUpQt"));
            totalDaysWakeUp += 1;

        });

        mapAggSleeps.set("averageStartHour", formatDuration(minTotalStartHours / totalDaysStart));
        mapAggSleeps.set("averageEndHour", formatDuration(minTotalEndHours / totalDaysEnd));
        mapAggSleeps.set("averageDuree", formatDuration(minTotalDuration / totalDaysDuration));
        mapAggSleeps.set("averageWakeUpQt", (totalWakeUp / totalDaysWakeUp).toFixed(1));
        return mapAggSleeps;
    } else {
        return null;
    }
}


/**
 * Sort the entries from the most recent date to the oldest one
 * @private
 * Note : the key containing the date value must be called Date
 */
function sortEntries(arrayToSort) {
    arrayToSort.sort((a, b) => new Date(b.get("Date").replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"))
        - new Date(a.get("Date").replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")));
}

/**
 *
 * @private
 * @return number of distinct date
 */
function getNumberOfUniqueDate(array_aliments) {
    let set_date = new Set();
    array_aliments.forEach((data) => {
        set_date.add(data.get('Date'))
    });
    return set_date.size;
}


/**
 * @param {date} like dd-MM-yyyy (ex : 01-01-2022)
 * @private
 * @return a formated date
 */
export function formatDate(date) {
    let formatedDate;
    let month;
    let lang = localStorage.getItem("userLanguage");
    const dateFormat = localStorage.getItem("profile") ? JSON.parse(localStorage.getItem("profile")).dateFormat : null;
    /** if dateFormat if specified in user profile, consider it */
    if (dateFormat) {
        switch (dateFormat) {
            case "LL-dd-yyyy":
                formatedDate = date.slice(3, 5) + "-" + date.slice(0, 2) + "-" + date.slice(-4);
                break;
            case "dd-LL-yyyy":
                formatedDate = date;
                break;
            case "yyyy-LL-dd":
                formatedDate = date.slice(-4) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2);
                break;
            case "yyyy-LLL-dd":
                date = date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
                month = new Date(date).toLocaleString(lang, {month: 'short'});
                formatedDate = date.slice(-4) + "-" + month + "-" + date.slice(3, 5);
                break;
            case "dd-LLL-yyyy":
                date = date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
                month = new Date(date).toLocaleString(lang, {month: 'short'});
                formatedDate = date.slice(3, 5) + "-" + month + "-" + date.slice(-4);
                break;
        }
        // else, get date format of the user lang
    } else {
        date = date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
        switch (lang) {
            case "fr":
                formatedDate = new Date(date).toLocaleDateString('fr-FR');
                break;
            case "en":
                formatedDate = new Date(date).toLocaleDateString('en-EN');
                break;
            case "es":
                formatedDate = new Date(date).toLocaleDateString('es-ES');
                break;
        }
    }
    return formatedDate;
}

/**
 * @return date as dd-mm-yyyy
 */
function formatTodayDate() {
    let today = new Date();
    let month = today.getMonth().toString().length === 1 ? '0' + today.getMonth() : today.getMonth();
    return today.getDate() + '-' + month + '-' + today.getFullYear();
}

//----------TEST--------
/**
 * @Function used for testing
 * Public function which hide a private function in order to keep integrity of frontEnd not using this method
 * instead og getWeights and to be able to test it
 */
export function testReport_fetchActivities(activity, formatedDate) {
    return fetchActivities(activity, formatedDate)
}

export function testReport_fetchAlcohols(alcohol, formatedDate) {
    return fetchDrinks("alcool", alcohol, formatedDate)
}

export function testReport_fetchFood(food, formatedDate) {
    return fetchNourriture(food, formatedDate)
}

export function testReport_fetchGlycemias(glycemia, formatedDate) {
    return fetchGlycemia(glycemia, formatedDate)
}

export function testReport_fetchHydratation(hydrates, formatedDate) {
    return fetchDrinks("hydratation", hydrates, formatedDate);
}

export function testReport_fetchSleeps(sleep, formatedDate) {
    return fetchSleeps(sleep, formatedDate)
}

export function testReport_fetchTransits(transit, formatedDate) {
    return fetchToilets(transit, formatedDate)
}

export function testReport_fetchWeights(weight, formatedDate) {
    return fetchWeights(weight, formatedDate)
}


/**
 * @Function used for testing
 */
export function test_fetchNourriture(array_nourriture, formatedDate) {
    fetchNourriture(array_nourriture, formatedDate);
    return arrayNourriture;
}

/**
 * @Function used for testing
 */
export function test_fetchToilets(toilets, formatedDate) {
    fetchToilets(toilets, formatedDate);
    return arrayToilets;
}

/**
 * @Function used for testing
 */
export function test_fetchActivites(activites, formatedDate) {
    fetchActivities(activites, formatedDate);
    return arrayActivities;
}

/**
 * @Function used for testing
 */
export function test_fetchSleep(sleeps, formatedDate) {
    fetchSleeps(sleeps, formatedDate);
    return arraySleeps;
}

/**
 * @Function used for testing
 */
export function test_fetchGlycemia(glycemia, formatedDate) {
    fetchGlycemia(glycemia, formatedDate)
    return arrayGlycemia;
}

/**
 * @Function used for testing
 */
export function test_fetchDrinksHydratation(typeOfDrink, drinks, formatedDate) {
    fetchDrinks(typeOfDrink, drinks, formatedDate);
    return arrayHydratations;
}

/**
 * @Function used for testing
 */
export function test_fetchDrinksAlcohol(typeOfDrink, drinks, formatedDate) {
    fetchDrinks(typeOfDrink, drinks, formatedDate);
    return arrayAlcohol;
}

/**
 * @Function used for testing
 */
export function resetDataArrays() {
    arrayWeights = [];
    arraySleeps = [];
    arrayActivities = [];
    arrayHydratations = [];
    arrayNourriture = [];
    arrayAlcohol = [];
    arrayToilets = [];
    arrayGlycemia = [];
}


/**
 * @Function used for testing
 */
export function test_getNumberOfUniqueDate(array_aliments) {
    return getNumberOfUniqueDate(array_aliments);
}

/**
 * @Function used for testing
 */
export function test_sortEntries(arrayToSort) {
    sortEntries(arrayToSort);
}

/**
 * @Function used for testing
 */
export function test_formatDuration(min) {
    return formatDuration(min);
}

/**
 * @Function used for testing
 */
export function test_getDuration(time) {
    return getDuration(time);
}

/**
 * @Function used for testing
 */
export function injectDataInArrayHydratation(value) {
    arrayHydratations = value;
}

/**
 * @Function used for testing
 */
export function injectDataInArrayNourriture(value) {
    arrayNourriture = value;
}

export function injectDataInArrayAlcohol(value) {
    arrayAlcohol = value;
}

/**
 * @Function used for testing
 */
export function injectDataInArrayToilets(value) {
    arrayToilets = value;
}

/**
 * @Function used for testing
 */
export function injectDataInArraySleeps(value) {
    arraySleeps = value;
}

/**
 * @Function used for testing
 */
export function injectDataInArrayActivities(value) {
    arrayActivities = value;
}

/**
 * @Function used for testing
 */
export function injectDataInArrayGlycemia(value) {
    arrayGlycemia = value;
}



