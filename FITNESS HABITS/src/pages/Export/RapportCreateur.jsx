import {jsPDF} from "jspdf";
import "jspdf-autotable";
import * as CompilerBilan from './CompilerBilan';
import * as translate from '../../translate/Translator';
import JSZip from "jszip";
import {saveAs} from 'file-saver';
import * as CSV from 'csv-string'

export async function creerPdf(dataSelected, d1, d2) {
    const doc = new jsPDF();
    // logo
    doc.autoTable({
        body: [[' ']],
        alternateRowStyles: {fillColor: "#ffffff"},
        didDrawCell: (data) => {
            if (data.section === 'body' && data.column.index === 0) {
                doc.addImage('/assets/Logo2.png', 'png', 15, 4, 59, 15);
            }
        }
    });
    doc.text(createPeriod(d1, d2), 75, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
        body: [[' ']],
        tableWidth: 'wrap',
        startY: doc.lastAutoTable.finalY + 10,
        alternateRowStyles: {fillColor: "#ffffff"},
    });

    dataSelected.forEach((data) => {
        switch (data) {
            case "activities":
                manageActivities(doc);
                break;
             case "alcool":
                 manageAlcool(doc);
                 break;
            case "glycémie":
                manageGlycemia(doc);
                break;
            case "hydratation":
                manageHydratation(doc);
                break;
            case "nourriture":
                manageFood(doc);
                break;
            case "poids":
                CompilerBilan.calculateAggregateWeights();
                manageWeight(doc);
                break;
            case "sommeil":
                manageSleep(doc);
                break;
            case "toilettes":
                manageTransit(doc);
                break;
            case "supplements":
                // A IMPLEMENTER
                break;

            default:
                break;
        }
    });
    doc.save("FitnessHabits-data-" + createPeriod(d1, d2) + ".pdf");

}
/**
*  ----------- ALCOHOL --------------
*/
function manageAlcool(doc){
    doc.text(translate.getText("ALCOOL_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    let headers = nourritureHydratAlcoolHeaders();
    if(CompilerBilan.getAlcohol()) {
        addAlcoolTable(doc, headers);
        addAlcoolMacrosTable(doc);
    } else {
        insertHeaders(doc, headers, "#e7a54f");
        insertNoDataFound(doc);
    }
}
export function addAlcoolTable(document, headers) {
    let values = [];
        let alcool = CompilerBilan.getAlcohol();

        alcool.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
        });
        createTable(document, headers, values, "#e7a54f", "#ffd39b");
}
export function addAlcoolMacrosTable(document) {
    let headers = nourritureHydraAlcoolAggrHeaders();
    let footerTable = alcoolAggrData();
    if (footerTable.length !== 0) {

        document.autoTable({
            head: [headers],
            headStyles: {
                fillColor: "#e7a54f"
            },
            columnStyles: {
                1: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                2: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                3: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                4: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
            body: footerTable,
            tableWidth: 'wrap'
        });
    }
}
export function alcoolAggrData() {
    let dataTable = [];
    if (CompilerBilan.getMacrosTotalAndAveragePerDay('alcool')) {
        let alcoolMacros = CompilerBilan.getMacrosTotalAndAveragePerDay('alcool');
        let line_1 = [];
        let line_2 = [];
        var totalFiber = alcoolMacros.get("totalFiber");
        var averageFiber = alcoolMacros.get("averageFiber");

        var totalProtein = alcoolMacros.get("totalProtein");
        var averageProtein = alcoolMacros.get("averageProtein");

        var totalFat = alcoolMacros.get("totalFat");
        var averageFat = alcoolMacros.get("averageFat");

        var totalGlucide = alcoolMacros.get("totalGlucide");
        var averageGlucide = alcoolMacros.get("averageGlucide");

        line_1.push(translate.getText("EXP_REPORT_MACROS", ["TOTAL"]), totalProtein, totalGlucide, totalFiber, totalFat);
        line_2.push(translate.getText("EXP_REPORT_MACROS", ["AVG"]), averageProtein, averageGlucide, averageFiber, averageFat);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}

export function nourritureHydratAlcoolHeaders() {
    var Date = translate.getText("DATE_TITLE")
    var name = translate.getText("SUPPL_NOM");
    var quantite = translate.getText("EXP_REPORT_QT");
    var unity = translate.getText("EXP_REPORT_UNIT");
    var proteine = translate.getText("EXP_REPORT_MACROS", ["PROT"]);
    var glucide = translate.getText("EXP_REPORT_MACROS", ["GLUC"]);
    var fibre = translate.getText("EXP_REPORT_MACROS", ["FIBRE"]);
    var gras = translate.getText("EXP_REPORT_MACROS", ["FATS"]);
    return [Date, name, quantite, unity, proteine, glucide, fibre, gras];
}

export function nourritureHydraAlcoolAggrHeaders() {
    let headers = [];
    headers.push(" ", translate.getText("EXP_REPORT_MACROS", ["PROT"]),
        translate.getText("EXP_REPORT_MACROS", ["GLUC"]),
        translate.getText("EXP_REPORT_MACROS", ["FIBRE"]),
        translate.getText("EXP_REPORT_MACROS", ["FATS"]));
    return headers;
}
/**
*  ----------- ACTIVITIES --------------
*/
function manageActivities(doc){
    doc.text(translate.getText("EXPORT_ACTIVITES_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    let headers = activitiesHeaders();
    if(CompilerBilan.getActivities()) {
        addActivitiesTable(doc, headers);
        addActivitiesAggregateTable(doc);
    } else {
        insertHeaders(doc, headers, "#0f5780");
        insertNoDataFound(doc);
    }
}
export function addActivitiesTable(document, headers) {
    let values = [];
    let activities = CompilerBilan.getActivities();

    activities.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('duration')}]);
    });

    addContentWithAutotable(document, headers, values, "#0f5780", "#7cc8f6");

}
export function addActivitiesAggregateTable(document) {
    let footerTable = activitiesAggrData();
    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}

export function activitiesHeaders() {
    var Date = translate.getText("DATE_TITLE");
    var duree = translate.getText("EXP_REPORT_DURATION") + " (h)";
    return [Date, duree];
}

export function activitiesAggrData() {
    let activitiesAggrTable = []
    if (CompilerBilan.getAggregateActivities()) {
        let aggregateActivities = CompilerBilan.getAggregateActivities();

        let line_1 = [];
        let line_2 = [];

        var durationTitle = translate.getText("EXP_REPORT_MACROS", ["TOTAL"]) + " (h)";
        var totalDuration = aggregateActivities.get("TotalDuration");
        line_1.push(durationTitle, totalDuration);

        var AverageDurationActTitle = translate.getText("EXP_REPORT_AVERAGE_DURATION_ACTIVITY") + " (h)";
        var averageDuration = aggregateActivities.get("AverageDuration");
        line_2.push(AverageDurationActTitle, averageDuration);

        activitiesAggrTable.push(line_1, line_2);
    }
    return activitiesAggrTable;
}


/**
*  ----------- GLYCEMIA --------------
*/
function manageGlycemia(doc){
    doc.text(translate.getText("GLYC_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    let headers = glycemiaHeaders();
    if(CompilerBilan.getGlycemia()) {
        addGlycimiaTable(doc, headers);
        addAverageGlycimiaTable(doc);
    } else {
        insertHeaders(doc, headers, "#6e233d");
        insertNoDataFound(doc);
    }
}
export function addGlycimiaTable(document, headers) {
        let glycimia = CompilerBilan.getGlycemia();
        let values = [];

        glycimia.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Glycémie')}]);
        });

        addContentWithAutotable(document, headers, values, "#6e233d", "#ff9bbd");
}
export function addAverageGlycimiaTable(document) {
    let footerTable = glycimiaAggrData();
    if (footerTable.length !== 0) {

        document.autoTable({
            body: footerTable,
            tableWidth: 'wrap',
            theme: 'grid'
        });
    }
}
export function glycemiaHeaders() {
    let Date = translate.getText("DATE_TITLE");
    let glycemie = translate.getText("GLYC_TITLE") + " (mmol/L)";
    return [Date, glycemie];
}

export function glycimiaAggrData() {
    let dataTable = [];
    if (CompilerBilan.getAverageGlycemia()) {
        let averageGlycemia = CompilerBilan.getAverageGlycemia();
        let line_1 = [];
        let line_2 = [];

        var moyenneTitle = translate.getText("AVG");
        var moyenne = averageGlycemia.get("Moyenne");
        line_1.push(moyenneTitle, moyenne);

        var referenceActTitle = translate.getText("EXP_REF_GLY");
        var reference = averageGlycemia.get("Référence");
        line_2.push(referenceActTitle, reference);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}
/**
*  ----------- HYDRATATION --------------
*/

function manageHydratation(doc){
    doc.text(translate.getText("HYDR_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    let headers = nourritureHydratAlcoolHeaders();
    if(CompilerBilan.getHydratations()) {
        addHydratationTable(doc, headers);
        addHydratationMacrosTable(doc)
    } else {
        insertHeaders(doc, headers, "#65afc5");
        insertNoDataFound(doc);
    }
}
export function addHydratationTable(document, headers) {
    let values = [];
        let hydratation = CompilerBilan.getHydratations();

        hydratation.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')}, {content: data.get('Quantité')}, {content: data.get('Unité')}, {content: data.get('Protéine')}, {content: data.get('Glucide')}, {content: data.get('Fibre')}, {content: data.get('Gras')}]);
        });
        createTable(document, headers, values, "#65afc5", "#beecff");
}
export function addHydratationMacrosTable(document) {
    let headers = nourritureHydraAlcoolAggrHeaders();
    let footerTable = hydratationAggrData();
    if (footerTable.length != 0) {

        document.autoTable({
            head: [headers],
            headStyles: {
                fillColor: "#65afc5"
            },
            columnStyles: {
                1: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                2: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                3: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                4: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
            body: footerTable,
            tableWidth: 'wrap'
        });
    }
}
export function hydratationAggrData() {
    let line_1 = [];
    let line_2 = [];
    let dataTable = [];
    if (CompilerBilan.getMacrosTotalAndAveragePerDay('hydratation')) {
        let hydratationMacros = CompilerBilan.getMacrosTotalAndAveragePerDay('hydratation');

        var totalFiber = hydratationMacros.get("totalFiber");
        var averageFiber = hydratationMacros.get("averageFiber");

        var totalProtein = hydratationMacros.get("totalProtein");
        var averageProtein = hydratationMacros.get("averageProtein");

        var totalFat = hydratationMacros.get("totalFat");
        var averageFat = hydratationMacros.get("averageFat");

        var totalGlucide = hydratationMacros.get("totalGlucide");
        var averageGlucide = hydratationMacros.get("averageGlucide");

        line_1.push(translate.getText("EXP_REPORT_MACROS", ["TOTAL"]), totalProtein, totalGlucide, totalFiber, totalFat);
        line_2.push(translate.getText("EXP_REPORT_MACROS", ["AVG"]), averageProtein, averageGlucide, averageFiber, averageFat);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}



/**
*  ----------- NOURRITURE --------------
*/
function manageFood(doc){
    doc.text(translate.getText("NOURRITURE_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    let headers = nourritureHydratAlcoolHeaders();
    if(CompilerBilan.getNourriture()) {
        addNourritureTable(doc, headers);
        addNourritureMacros(doc);
    } else {
        insertHeaders(doc, headers, "#185742");
        insertNoDataFound(doc);
    }
}
export function addNourritureTable(document, headers) {
    let values = [];
        let nourriture = CompilerBilan.getNourriture();

        nourriture.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Nom')},
                        {content: data.get('Quantité')}, {content: data.get('Unité')},
                        {content: data.get('Protéine')}, {content: data.get('Glucide')},
                        {content: data.get('Fibre')}, {content: data.get('Gras')}]);
        });
        createTable(document, headers, values, "#185742", "#b4ead8");
}
export function addNourritureMacros(document) {
    let headers = nourritureHydraAlcoolAggrHeaders();
    let footerTable = nourritureAggrData();
    if (footerTable.length != 0) {
        document.autoTable({
            head: [headers],
            headStyles: {
                fillColor: "#185742"
            },
            columnStyles: {
                1: {
                    fillColor: "#a52a2a",
                    textColor: "#ffffff"
                },
                2: {
                    fillColor: "#db4e3e",
                    textColor: "#ffffff"
                },
                3: {
                    fillColor: "#589051",
                    textColor: "#ffffff"
                },
                4: {
                    fillColor: "#c99b2e",
                    textColor: "#ffffff"
                }
            },
            body: footerTable,
            tableWidth: 'wrap'
        });
    }
}
export function nourritureAggrData() {
    let dataTable = [];
    if (CompilerBilan.getMacrosTotalAndAveragePerDay('nourriture')) {
        let nourritureMacros = CompilerBilan.getMacrosTotalAndAveragePerDay('nourriture');
        let line_1 = [];
        let line_2 = [];

        var totalFiber = nourritureMacros.get("totalFiber");
        var averageFiber = nourritureMacros.get("averageFiber");

        var totalProtein = nourritureMacros.get("totalProtein");
        var averageProtein = nourritureMacros.get("averageProtein");

        var totalFat = nourritureMacros.get("totalFat");
        var averageFat = nourritureMacros.get("averageFat");

        var totalGlucide = nourritureMacros.get("totalGlucide");
        var averageGlucide = nourritureMacros.get("averageGlucide");

        line_1.push(translate.getText("EXP_REPORT_MACROS", ["TOTAL"]), totalProtein, totalGlucide, totalFiber, totalFat);
        line_2.push(translate.getText("EXP_REPORT_MACROS", ["AVG"]), averageProtein, averageGlucide, averageFiber, averageFat);

        dataTable.push(line_1, line_2);
    }
    return dataTable;
}
/**
*  ----------- POIDS --------------
*/
function manageWeight(doc){
    doc.text(translate.getText("POIDS_NOM_SECTION"), 10, doc.lastAutoTable.finalY + 10);
    let headers = weightHeaders();
    if (CompilerBilan.getWeights()) {
        addWeightTable(doc, headers);
        addWeightAggregateTable(doc);
    } else {
        insertHeaders(doc, headers, "#113d37");
        insertNoDataFound(doc);
    }
}
export function addWeightTable(document, headers) {
    let values = [];
    let weights = CompilerBilan.getWeights();

    weights.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('weight')}]);
    });

    addContentWithAutotable(document, headers, values, "#113d37", "#bbebe5");
}
export function addWeightAggregateTable(document) {
    let footerTable = weightAggrData();
    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}
export function weightHeaders() {
    var agg = CompilerBilan.getAggregateWeights();
    var Date = translate.getText("DATE_TITLE");
    var poids = translate.getText("EXP_REPORT_WEIGHT") + ' (' + agg.get('weightUnit') + ')';
    return [Date, poids];
}
export function weightAggrData() {
    let weightAggrTable = [];
    if (CompilerBilan.getAggregateWeights()) {
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];

        var aggregateWeight = CompilerBilan.getAggregateWeights();

        var aggInitialWeight = translate.getText("EXP_REPORT_INITIAL_WEIGHT");
        var initalWeight = aggregateWeight.get("initalWeight");
        line_2.push(aggInitialWeight, initalWeight);

        var aggFinalWeight = translate.getText("EXP_REPORT_FINAL_WEIGHT");
        var finalWeight = aggregateWeight.get("finalWeight");
        line_3.push(aggFinalWeight, finalWeight);

        var aggDifference = translate.getText("EXP_REPORT_DIFF_WEIGHT");
        var difference = aggregateWeight.get("deltaWeight");
        line_4.push(aggDifference, difference);

        weightAggrTable.push(line_2, line_3, line_4);
    }
    return weightAggrTable;
}
/**
*  ----------- SOMMEIL --------------
*/
function manageSleep(doc) {
    doc.text(translate.getText("SLEEP"), 10, doc.lastAutoTable.finalY + 10);
    let headers = sleepsHeaders();
    if(CompilerBilan.getSleeps()) {
        addSleepTable(doc, CompilerBilan.getSleeps(), headers);
        addSleepAggregateTable(doc);
    } else {
        insertHeaders(doc, headers, "#152b3f");
        insertNoDataFound(doc);
    }
}
export function addSleepTable(document, sleeps, headers) {
    let values = [];
    sleeps.forEach((data) => {
        values.push([{content: data.get('Date')}, {content: data.get('startHour')}, {content: data.get('endHour')}, {content: data.get('duration')}, {content: data.get('wakeUpQt')}, {content: data.get('wakeUpState')}]);
    });

    addContentWithAutotable(document, headers, values, "#152b3f", "#4ca9ff");
}
export function addSleepAggregateTable(document) {
    let footerTable = sleepAggrData();

    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}
export function sleepsHeaders() {
    var Date = translate.getText("DATE_TITLE");
    var startHour = translate.getText("EXP_REPORT_START_HOUR_SLEEP");
    var endHour = translate.getText("EXP_REPORT_END_HOUR_SLEEP");
    var duration = translate.getText("EXP_REPORT_DURATION") + " (h)";
    var wakeUpQt = translate.getText("EXP_REPORT_WAKEUP_QT_SLEEP");
    var wakeUpState = translate.getText("EXP_REPORT_WAKEUP_STATE");
    return [Date, startHour, endHour, duration, wakeUpQt, wakeUpState];
}
export function sleepAggrData() {
    let sleepAggrTable = [];
    if (CompilerBilan.getAggregateSleeps()) {
        let aggregateSleeps = CompilerBilan.getAggregateSleeps();

        let line_1 = [];
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];

        var avgStartHourSleepTitle = translate.getText("EXP_REPORT_AVG_START_HOUR_SLEEP");
        var averageStartHour = aggregateSleeps.get("averageStartHour");
        line_1.push(avgStartHourSleepTitle, averageStartHour);

        var aggInitialHour = translate.getText("EXP_REPORT_AVG_END_HOUR_SLEEP");
        var averageEndHour = aggregateSleeps.get("averageEndHour");
        line_2.push(aggInitialHour, averageEndHour);

        var averageDurationSleepTitle = translate.getText("EXP_REPORT_AVG_DURATION_SLEEP");
        var averageDuree = aggregateSleeps.get("averageDuree");
        line_3.push(averageDurationSleepTitle, averageDuree);

        var averageWakeupQtTitle = translate.getText("EXP_REPORT_AVG_WAKEUP_QT");
        var averageWakeUpQt = aggregateSleeps.get("averageWakeUpQt");
        line_4.push(averageWakeupQtTitle, averageWakeUpQt);

        sleepAggrTable.push(line_1, line_2, line_3, line_4);

    }
    return sleepAggrTable;
}
/**
*  ----------- TOILET/ TRANSIT --------------
*/
function manageTransit(doc){
    doc.text(translate.getText("TOILETS_TITLE"), 10, doc.lastAutoTable.finalY + 10);
    let headers = transitHeaders();
    if(CompilerBilan.getToilets()) {
        addToiletsTable(doc, headers);
        addAverageToiletsTable(doc);
    } else {
        insertHeaders(doc, headers, "#bba339");
        insertNoDataFound(doc);
    }
}
export function addToiletsTable(document, headers) {
    let values = [];
        let toilets = CompilerBilan.getToilets();

        toilets.forEach((data) => {
            values.push([{content: data.get('Date')}, {content: data.get('Urine')}, {content: data.get('Transit')}]);
        });

        addContentWithAutotable(document, headers, values, "#bba339", "#ffea9a");

}
export function addAverageToiletsTable(document) {
    let footerTable = toiletteAggrData();
    document.autoTable({
        body: footerTable,
        tableWidth: 'wrap',
        theme: 'grid'
    });
}
export function transitHeaders() {
    var Date = translate.getText("DATE_TITLE")
    var urine = translate.getText("URINE_TITLE");
    var transit = translate.getText("EXP_UR_TR");
    return [Date, urine, transit];
}

export function toiletteAggrData() {
    let dataTable = [];
    if (CompilerBilan.getAverageToilets()) {
        let averageToilets = CompilerBilan.getAverageToilets();

        let line_1 = [];
        let line_2 = [];
        let line_3 = [];
        let line_4 = [];

        var totFecesTitle = translate.getText("EXP_UR_TR");
        var totalFeces = averageToilets.get("totalFeces");
        line_1.push(totFecesTitle, totalFeces);

        var totUrineTitle = translate.getText("EXP_TOT_UR");
        var totalUrine = averageToilets.get("totalUrine");
        line_2.push(totUrineTitle, totalUrine);

        var averageFecesPerDayTitle = translate.getText("EXP_AVG_TRA");
        var averageFecesPerDay = averageToilets.get("averageFecesPerDay");
        line_3.push(averageFecesPerDayTitle, averageFecesPerDay);

        var averageUrinePerDayTitle = translate.getText("EXP_AVG_UR");
        var averageUrinePerDay = averageToilets.get("averageUrinePerDay");
        line_4.push(averageUrinePerDayTitle, averageUrinePerDay);

        dataTable.push(line_1, line_2, line_3, line_4);
    }
    return dataTable;
}

/**
*  ----------- SUPPLEMENTS --------------
*/
//A IMPLEMENTER


/**
*  ----------- GENERIC FUNCTIONS --------------
*/
/**
*
*/
export function addContentWithAutotable(document, headers, values, headerColor, bodyColor) {
    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: headerColor
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: bodyColor
        },
    });
}

/**
*
*/
export function insertNoDataFound(document) {
    document.autoTable({
        body: [[translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE")]],
        startY: document.lastAutoTable.finalY,
        bodyStyles: {
            halign: "center",
            fontSize: 10
        },
    });
}

/**
*
*/
export function insertHeaders(document, headers, headerColor) {
    document.autoTable({
        head: [headers],
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: headerColor
        },
    });
}


/**
 * format two dates as a period.
 * @param d1 the first date.
 * @param d2 the seconde date.
 * @returns {string} the period.
 */
export function createPeriod(d1, d2) {
    let temp_d1 = d1.toISOString().slice(0, 10);
    let temp_d2 = d2.toISOString().slice(0, 10);
    d1 = temp_d1.slice(-2) + '-' + temp_d1.slice(5, 7) + '-' + temp_d1.slice(0, 4);
    d2 = temp_d2.slice(-2) + '-' + temp_d2.slice(5, 7) + '-' + temp_d2.slice(0, 4);

    return translate.getText("DE") + " " + CompilerBilan.formatDate(d1) + " " + translate.getText("A")
        + " " + CompilerBilan.formatDate(d2);
}


/***********************************************************************************************
 ************************************** CSV PART ***********************************************
 */
export function creerCSV(dataSelected, d1, d2) {
    var zip = new JSZip();
    var date = createPeriod(d1, d2);

    dataSelected.forEach((data) => {
        switch (data) {
            case "hydratation":
                hydratationCSV(zip, date);
                break;
            case "activities":
                activitiesCSV(zip, date);
                break;
            case "nourriture":
                nourritureCSV(zip, date);
                break;
            case "sommeil":
                sleepsCSV(zip, date);
                break;
            case "toilettes":
                toiletteCSV(zip, date);
                break;
            case "alcool":
                alcoolCSV(zip, date);
                break;
            case "glycémie":
                glycimiaCSV(zip, date);
                break;
            case "poids":
                weightCSV(zip, date);
                break;
            case "supplements":
                // A IMPLEMENTER
                break;
            default:
                break;
        }
    });
    zip.generateAsync({type: "blob"}).then(function (content) {

        saveAs(content, 'FitnessHabits-data-' + createPeriod(d1, d2) + ".zip");
    });
}

export function weightCSV(zip, date) {
    if (CompilerBilan.getWeights()) {
        let poid = CompilerBilan.getWeights();
        let headers = weightHeaders();
        let poidData = headers[0] + ", " + headers[1];

        poid.forEach((data) => {
            poidData += "\n" + data.get('Date') + ", " + data.get('weight');
        });
        zip.file(formedTitle("EXP_REPORT_WEIGHT", date), poidData, {binary: true});
    } else {
        zip.file(formedTitle("EXP_REPORT_WEIGHT", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

export function activitiesCSV(zip, date) {
    if (CompilerBilan.getActivities()) {
        let activities = CompilerBilan.getActivities();
        let headers = activitiesHeaders();
        let values = [];
        values.push(headers);

        activities.forEach((data) => {
            values.push([data.get('Date'), data.get('duration')]);
        });
        zip.file(formedTitle("EXPORT_ACTIVITES_TITLE", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("EXPORT_ACTIVITES_TITLE", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

export function sleepsCSV(zip, date) {
    if (CompilerBilan.getSleeps()) {
        let sleeps = CompilerBilan.getSleeps();
        let headers = sleepsHeaders();
        let values = [];
        values.push(headers);
        sleeps.forEach((data) => {
            values.push([data.get('Date'), data.get('startHour'), data.get('endHour'), data.get('duration'), data.get('wakeUpQt'), data.get('wakeUpState')]);
        });
        zip.file(formedTitle("SLEEP", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("SLEEP", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

export function nourritureCSV(zip, date) {
    if (CompilerBilan.getNourriture()) {
        let nourriture = CompilerBilan.getNourriture();
        let headers = nourritureHydratAlcoolHeaders();
        let values = [];
        values.push(headers);
        nourriture.forEach((data) => {
            values.push([data.get('Date'), data.get('Nom'), data.get('Quantité'), data.get('Unité'), data.get('Protéine'), data.get('Glucide'), data.get('Fibre'), data.get('Gras')]);
        });
        zip.file(formedTitle("NOURRITURE_TITLE", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("NOURRITURE_TITLE", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

export function hydratationCSV(zip, date) {
    if (CompilerBilan.getHydratations()) {
        let hydratation = CompilerBilan.getHydratations();
        let headers = nourritureHydratAlcoolHeaders();
        let values = [];
        values.push(headers);

        hydratation.forEach((data) => {
            values.push([data.get('Date'), data.get('Nom'), data.get('Quantité'), data.get('Unité'), data.get('Protéine'), data.get('Glucide'), data.get('Fibre'), data.get('Gras')]);
        });
        zip.file(formedTitle("HYDR_TITLE", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("HYDR_TITLE", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}


export function toiletteCSV(zip, date) {
    if (CompilerBilan.getToilets()) {
        let toilets = CompilerBilan.getToilets();
        let headers = transitHeaders();
        let values = [];
        values.push(headers);

        toilets.forEach((data) => {
            values.push([data.get('Date'), data.get('Urine'), data.get('Transit')]);
        });
        zip.file(formedTitle("TOILETS_TITLE", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("TOILETS_TITLE", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}


export function alcoolCSV(zip, date) {
    if (CompilerBilan.getAlcohol()) {
        let alcool = CompilerBilan.getAlcohol();
        let headers = nourritureHydratAlcoolHeaders();
        let values = [];
        values.push(headers);
        alcool.forEach((data) => {
            values.push([data.get('Date'), data.get('Nom'), data.get('Quantité'), data.get('Unité'), data.get('Protéine'), data.get('Glucide'), data.get('Fibre'), data.get('Gras')]);
        });
        zip.file(formedTitle("ALCOOL_TITLE", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("ALCOOL_TITLE", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}


export function glycimiaCSV(zip, date) {
    if (CompilerBilan.getGlycemia()) {
        let glycimia = CompilerBilan.getGlycemia();
        let headers = glycemiaHeaders();
        let values = [];
        values.push(headers);

        glycimia.forEach((data) => {
            values.push([data.get('Date'), data.get('Glycémie')]);
        });
        zip.file(formedTitle("GLYC_TITLE", date), CSV.stringify(values), {binary: true});
    } else {
        zip.file(formedTitle("GLYC_TITLE", date), translate.getText("NO_DATA_FOUND_IN_SELECTED_DATES_TITLE"), {binary: true});
    }
}

export function formedTitle(title, date){
    return translate.getText(title) + " - " + date.replaceAll('/', '-') + ".csv"
}

function createTable(document, headers, values, headerColor, bodyColor) {
    document.autoTable({
        head: [headers],
        body: values,
        startY: document.lastAutoTable.finalY + 15,
        headStyles: {
            fillColor: headerColor
        },
        bodyStyles: {
            minCellHeight: 9,
            halign: "left",
            valign: "center",
            fontSize: 11,
            fillColor: bodyColor
        },
        columnStyles: {
            4: {
                fillColor: "#a52a2a",
                textColor: "#ffffff"
            },
            5: {
                fillColor: "#db4e3e",
                textColor: "#ffffff"
            },
            6: {
                fillColor: "#589051",
                textColor: "#ffffff"
            },
            7: {
                fillColor: "#c99b2e",
                textColor: "#ffffff"
            }
        }
    });

}




