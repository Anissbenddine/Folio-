import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react"
import { IonLabel, IonSegment, IonSegmentButton, IonIcon} from "@ionic/react";
import "../../../pages/weight.css";
import * as weightService from "../service/weightService"
import * as translate from "../../../translate/Translator";
import { calendar} from "ionicons/icons";

// Variables in Firebase remains in French for now with a translation in comment
const TableWeight = (props) => {
  const [dateStart, setDateStart] = useState("7")
  const [data, setData] = useState({datasets: []});
  const [options, setOptions] = useState();

  const plugins = [{
    afterDraw: chart => {
      if(chart.legend.legendItems[2] && !chart.legend.legendItems[2].hidden) {
        var ctx = chart.chart.ctx;
        var xAxis = chart.scales['x-axis-0'];
        var yAxis = chart.scales['y-axis-0'];
        var x = xAxis.getPixelForValue(chart.config.options.targetWeightDate)
        ctx.save();
        ctx.strokeStyle = '#37F52E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, yAxis.bottom);
        ctx.lineTo(x, yAxis.top);
        ctx.stroke();
        ctx.restore();
      }
    }
  }]

  useEffect(() => {
    let endDate = new Date()
    let startDate = new Date(endDate);;
    if(dateStart < 0) {
      endDate = weightService.toDate(props.targetWeightDate)
      endDate.setMonth(endDate.getMonth()+1)
      startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - -dateStart);
    } else {
      startDate.setDate(startDate.getDate() - dateStart);
    }
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let weightIni = weightService.formatWeight(props.initialWeight)
    let weightCib = props.targetWeight
    let dataWeightInitial = [{x: startDate, y: weightIni},{x: endDate, y: weightIni}]
    let dataWeightTarget = [{x: startDate, y: weightCib},{x: endDate, y: weightCib}]

    const dataInit = {
      datasets: [
      {
          label: translate.getText("WEIGHT_PREF_WEIGHT_INITIAL"),
          data: dataWeightInitial,
          fill: false,
          borderColor: "#F45650",
          backgroundColor: "#F45650",
          pointRadius: 0
      },
      {
          label: translate.getText("WEIGHT_NAME_SECTION"),
          data: props.graphData,
          fill: false,
          borderColor: "#3B81C4",
          backgroundColor: "#3B81C4",
          lineTension: 0
      },
      {
          label: translate.getText("WEIGHT_PREF_WEIGHT_TARGET"),
          data: dataWeightTarget,
          fill: false,
          borderColor: "#37F52E",
          backgroundColor: "#37F52E",
          pointRadius: 0
      }
      ]
    };

    setData(dataInit)

    var optionsInit = {
      title: {text: translate.getText("WEIGHT_TABL_EVO"), display: true},
      legend: {
        position: "bottom",
        align: "middle"
      },
      scales: {
        xAxes: [{
          type: "time",
          ticks: {
            min: startDate,
            max: endDate,
            unit: "day",
            minRotation: 50
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: translate.getText("WEIGHT_NAME_SECTION") + ' (' + weightService.getPrefUnitWeight() + ")" 
          }
        }]
      },
      targetWeightDate: props.targetWeightDate
    }

    setOptions(optionsInit);
  }, [props.initialWeight, props.targetWeight, props.graphData, dateStart, props.targetWeightDate])

  return (
    <div className="tableWeight">
      <IonIcon className="date-icon" icon={calendar} />

      <Line data-testid = "chart" className="ionTableau poidsGraph" height={250} data={data} options={options} plugins={plugins}/>

      <hr className="lineSeparator"/>

      <IonSegment data-testid = "dateFilter" className="dateFilter" value={dateStart} onIonChange={(event) => setDateStart(event.detail.value)}>
        <IonSegmentButton value="7">
          <IonLabel>{translate.getText("WEIGHT_WEEK")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="30">
          <IonLabel>{translate.getText("WEIGHT_MONTH")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="90">
          <IonLabel>{translate.getText("WEIGHT_QUARTER")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="182">
          <IonLabel>{translate.getText("WEIGHT_SEMESTER")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="365">
          <IonLabel>{translate.getText("WEIGHT_YEAR")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="-90">
          <IonLabel>{translate.getText("WEIGHT_TARGET_NAME")}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </div>
  );
}

export default TableWeight;
