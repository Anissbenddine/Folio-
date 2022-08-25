import React, { useEffect, useState, useMemo } from 'react';
import '../Tab1.css'
import moment from "moment";
import firebase from 'firebase'
import "firebase/auth";
import * as translate from '../../translate/Translator';

import CanvasJSReact from './canvasjs.stock.react';
import DatePicker from 'react-date-picker';
let CanvasJSChart = CanvasJSReact.CanvasJSChart;
let canvas = CanvasJSReact;

//enum equivalents
const Taux = Object.freeze({
    mmoll: ' mmol/L',
    mgdl: ' mg/dl'
})

// Modification de l'équipe Glicémie
const Graphe = ({ reloadGraph }) => {

    // ========= CONST =========
    const DateRange = Object.freeze({
        _1w: 'semaine' + translate.getText("WEEK_LETTER"),
        _1m: 'mois',
        _3m: '3 mois',
        _6m: '6 mois',
        _1y: 'Année' + translate.getText("YEAR_LETTER")
    })
    const [dateFormat, setDateFormat] = useState("")
    const [data, setData] = useState([]);
    const [tauxLabel, setTauxLabel] = useState(Taux.mmoll);
    const [taux, setTaux] = useState(Taux.mmoll);
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(() => getNewStartDateForRange(DateRange._3m));
    const [average, setAverage] = useState(0);
    const [minimum, setMinimum] = useState(0);
    const [maximum, setMaximum] = useState(0);
    const [loading, setLoading] = useState(true);
    //used to keep track of button style
    const [range, setRange] = useState(DateRange._3m);
    //Used to display average line on graphe *---*
    const [averageDataPoints, setAverageDataPoint] = useState([]);
    const [minimumDataPoints, setMinimumDataPoint] = useState([]);
    const [maximumDataPoints, setMaximumDataPoint] = useState([]);

    //datapoint is a filtered subset of data between 2 dates
    const dataPoints = useMemo(
        () => convertMesurementUnit(
            taux,
            tauxLabel,
            data.filter(({ x, y }) => x >= startDate && x <= endDate)),
        [data, startDate, endDate, tauxLabel, taux]
    );

    // ========= USEEFFECT =========
    //Get data on graphe display
    useEffect(() => {
        if (reloadGraph && dataPoints.length <= 0)
            fetchDatapoints();
    }, [reloadGraph, dataPoints])

    useEffect(() => {
        if (dataPoints && dataPoints.length > 0) {
            let sum = (dataPoints.map(val => val.y)).reduce((a, b) => (a + b), 0)
            let _average = Math.round(((sum / dataPoints.length) + Number.EPSILON) * 100) / 100;
            setAverage(_average)
            setAverageDataPoint([
                { x: startDate, y: _average },
                { x: endDate, y: _average }
            ])

            // minimum
            let min = Math.round(
                (Math.min.apply(
                    Math,
                    dataPoints.map(function (o) {
                        return o.y;
                    })
                ) + Number.EPSILON) * 100) / 100;
            setMinimum(min);
            setMinimumDataPoint([
                { x: startDate, y: min },
                { x: endDate, y: min }
            ])

            // maximum
            let max = Math.round(
                (Math.max.apply(
                    Math,
                    dataPoints.map(function (o) {
                        return o.y;
                    })
                ) + Number.EPSILON) * 100) / 100;
            setMaximum(max);
            setMaximumDataPoint([
                { x: moment(startDate).format(dateFormat).toString(), y: max },
                { x: endDate, y: max }
            ])
        }
    }, [dataPoints]);

    function convertMesurementUnit(currentType, newType, _data) {
        const copy = [..._data]

        for (var i = 0; i < _data.length; i++) {
            if (newType === Taux.mmoll && currentType === Taux.mgdl) {
                copy[i].y = copy[i].y / 18; //  mmol/L = mg/dl / 18
                console.log(copy[i].y)
                setTaux(newType)
            }

            if (newType === Taux.mgdl && currentType === Taux.mmoll) {
                copy[i].y = copy[i].y * 18; //  mg/dl = mmol/L * 18
                setTaux(newType)
            }
        }

        return copy;
    }

    //Get glycemie data from Firebase using userUID from localstorage
    function fetchDatapoints() {
        const userUID = localStorage.getItem('userUid');
        var arr = [];
        firebase.database().ref('profiles/' + userUID + '/dateFormat/').once("value", (snapshot) => {
            setDateFormat(toLocalDateFormat(snapshot.val()));
            console.log(snapshot.val())
        })
        firebase.database().ref('dashboard/' + userUID)
            .once("value", (snapshot) => {
                const sets = snapshot.val();
                if (sets) {
                    var index = 0;
                    for (const key in sets) {
                        arr[index] = { x: moment(key, "DDMMYYYY").toDate(), y: parseInt(sets[key].glycemie.dailyGlycemie) }
                        index++
                    }
                }
                //Sorting data by datetime
                arr.sort((a, b) => {
                    return a.x - b.x;
                });

                setData(arr)
            });
        setLoading(false)
    }

    function toLocalDateFormat(format) {
        if (format === "dd-LL-yyyy") return 'DD-MM-YYYY'
        if (format === "LL-dd-yyyy") return 'MM-DD-YYYY'
        if (format === "yyyy-dd-LL") return 'YYYY-DD-MM'
        if (format === "yyyy-LL-dd") return 'YYYY-MM-DD'
        if (format === "yyyy-LLL-dd") return 'YYYY-MMM-DD'
        if (format === "dd-LLL-yyyy") return 'DD-MMM-YYYY'
    }

    function toDatePickerFormat(format) {
        if (format === "DD-MM-YYYY") return 'dd-MM-y'
        if (format === "MM-DD-YYYY") return 'MM-dd-y'
        if (format === "YYYY-DD-MM") return 'y-dd-MM'
        if (format === "YYYY-MM-DD") return 'y-MM-dd'
        if (format === "YYYY-MMM-DD") return 'y-MMM-dd'
        if (format === "DD-MMM-YYYY") return 'dd-MMM-y'
    }

    function getNewStartDateForRange(range) {
        const startDateAsMoment = moment(endDate);
        switch (range) {
            case DateRange._1w: return startDateAsMoment.subtract(1, 'week').toDate()
            case DateRange._1m: return startDateAsMoment.subtract(1, 'month').toDate()
            case DateRange._3m: return startDateAsMoment.subtract(3, 'month').toDate()
            case DateRange._6m: return startDateAsMoment.subtract(6, 'month').toDate()
            case DateRange._1y: return startDateAsMoment.subtract(1, 'year').toDate()
        }
    }

    function onRangeClick(range) {
        setRange(range)
        setStartDate(getNewStartDateForRange(range))
    }

    function onStartDateChange(value) {
        console.log(dateFormat)
        if (value) {
            setRange("");
            setStartDate(moment(value).toDate())
        }
    }

    function onEndDateChange(value) {
        if (value) {
            setRange("");
            setEndDate(moment(value).toDate())
        }
    }

    function getOptions() {
        let numberFormat = "0.00"

        canvas.CanvasJS.addCultureInfo("fr",
            {
                decimalSeparator: ",",
                digitGroupSeparator: " ",
                months: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
                shortMonths: ["janv.", "févr.", "mars", "avril", "mai", "juin", "juil.", "août", "sep.", "oct.", "nov.", "dec."]
            }
        );

        canvas.CanvasJS.addCultureInfo("es",
            {
                 decimalSeparator: ",",
                 digitGroupSeparator: " ",
                 months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
                 shortMonths: ["ene.", "feb.", "mar.", "abr.", "may.", "jun.", "jul.", "ago.", "sept.", "oct.", "nov.", "dic."]
            }
        );

        return {
            culture: translate.getLang(),
            animationEnabled: true,
            axisX: {
                valueFormatString: dateFormat
            },
            axisY: {
                valueFormatString: numberFormat,
                title: translate.getText("BLOOD_SUGAR_LEVEL"),
                suffix: tauxLabel
            },
            data: [
                {
                    yValueFormatString: numberFormat,
                    xValueFormatString: dateFormat,
                    type: "spline",
                    dataPoints: dataPoints
                },
                {
                    yValueFormatString: numberFormat,
                    type: "line",
                    dataPoints: averageDataPoints
                },
                {
                    yValueFormatString: numberFormat,
                    type: "line",
                    dataPoints: minimumDataPoints
                },
                {
                    yValueFormatString: numberFormat,
                    type: "line",
                    dataPoints: maximumDataPoints
                }
            ]
        };
    }

    //style variables
    let graphWidth = window.innerWidth < 700 ? window.innerWidth * 2 : window.innerWidth
    const tableLeftColStyle = { textAlign: 'right', paddingRight: '10px' }
    const tableMidColStyle = { textAlign: 'right', paddingRight: '5px' }

    return (

        <div style={{ overflowX: "hidden" }} class="bordureGlycemie">
            {/* CONTROLS */}
            <div>
                {Object.values(DateRange).map(val => {
                    return (
                        <button type="button" class={(range === val ? "selectedGraphButton btn btn-success bbn" : "btn btn-success bbn") + " graphButton "}
                            onClick={() => { onRangeClick(val); }}>
                            <h5 class="rangeBtn">{val}</h5>
                        </button>
                    )
                })}
            </div>
            <div>
                {/* <button class={(tauxLabel === " mg/dl" ? "selectedGraphButton" : "") + " graphButton"} onClick={() => { setTauxLabel(Taux.mgdl); }}><h3>mg/dl</h3></button>
                <button class={(tauxLabel === " mmol/L" ? "selectedGraphButton" : "") + " graphButton"} onClick={() => { setTauxLabel(Taux.mmoll); }}><h3>mmol/L</h3></button> */}
            </div>
            <div>
                {/* <h3>
                    <DatePicker className="customDatePicker" locale={translate.getLang()}
                        value={moment(startDate, dateFormat).toDate()}
                        onChange={(val) => onStartDateChange(val)}
                        format={toDatePickerFormat(dateFormat)} />
                        &nbsp;-&nbsp;
                    <DatePicker className="customDatePicker" locale={translate.getLang()}
                        value={moment(endDate, dateFormat).toDate()}
                        onChange={(val) => onEndDateChange(val)}
                        format={toDatePickerFormat(dateFormat)} />
                </h3> */}
            </div>

            {/* GRAPH */}

            {/* IF LOADING */}
            {loading ?
                (
                    <div>{translate.getText('LOADING')}</div>
                )
                // IF NO DATA
                : (!dataPoints || dataPoints.length <= 0 ||
                    !averageDataPoints || averageDataPoints.length <= 0 ||
                    !minimumDataPoints || minimumDataPoints.length <= 0 ||
                    !maximumDataPoints || maximumDataPoints.length <= 0) ?
                    (
                        <div>{translate.getText('NO_DATA_FOUND')}</div>
                    )
                    // ELSE SHOW GRAPH
                    : (
                        <>
                            {/* INFO TABLE */}
                            <table>
                                <tbody style={{ color: "#c0504e" }}>
                                    <tr>
                                        <td style={tableLeftColStyle}>{translate.getText("LAST_VALUE")}:&nbsp;</td>
                                        <td style={tableMidColStyle}>
                                            {(Math.round(((data[data.length - 1].y) + Number.EPSILON) * 100) / 100).toFixed(2)
                                                .toString().replace('.', translate.getText('.'))}
                                        </td>
                                        <td>{tauxLabel}</td>
                                    </tr>
                                    <tr>
                                        <td style={tableLeftColStyle}>{translate.getText("AVERAGE")}:&nbsp;</td>
                                        <td style={tableMidColStyle}>{(average.toFixed(2)).toString().replace('.', translate.getText('.'))}</td>
                                        <td>{tauxLabel}</td>
                                    </tr>
                                    <tr>
                                        <td style={tableLeftColStyle}>{translate.getText("MINIMUM")}:&nbsp;</td>
                                        <td style={tableMidColStyle}>{(minimum.toFixed(2)).toString().replace('.', translate.getText('.'))}</td>
                                        <td>{tauxLabel}</td>
                                    </tr>
                                    <tr>
                                        <td style={tableLeftColStyle}>{translate.getText("MAXIMUM")}:&nbsp;</td>
                                        <td style={tableMidColStyle}>{(maximum.toFixed(2)).toString().replace('.', translate.getText('.'))}</td>
                                        <td>{tauxLabel}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* GRAPH */}
                            <div style={{ overflowX: "scroll" }}>
                                <div style={{ width: graphWidth }}>
                                    <CanvasJSChart options={getOptions()} />
                                </div>
                            </div>
                        </>
                    )}
        </div >
    )

};

export default Graphe;
