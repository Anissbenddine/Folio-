import React, { useEffect, useImperativeHandle, useState } from "react";
import {
  IonText,
  IonGrid,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonRow,
  IonCol,
  IonButtons,
  IonIcon,
  IonButton,
  IonItemDivider,
} from "@ionic/react";
import firebase from "firebase";
import * as translate from "../../translate/Translator";
import { Line } from "react-chartjs-2";

import { arrowDropleft, arrowDropright, calendar } from "ionicons/icons";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

const Graphique = React.forwardRef((props, ref) => {
  const [cible, setCible] = useState("00:00");

  useImperativeHandle(ref, () => ({
    refresh: () => {
      getSleepPeriods();
    },
  }));

  const [isShown, setIsShown] = useState(false);

  const [dataGraph, setDataGraph] = useState([]);
  let timeFrame = {};
  const [endDate, setEndDate] = useState();
  const [datax, setDatax] = useState([]);
  let sleepPeriodsList;
  let intervalValue = 7;

  const getSleepPeriods = async () => {
    let sleepPeriods;
    await db.once("value").then((snapshot) => {
      sleepPeriods = snapshot.val();
    });

    if (sleepPeriods != null) {
      sleepPeriodsList = Object.entries(sleepPeriods).reverse();
      for (const [key, value] of sleepPeriodsList) {
        let s = new Date(value["startDate"]);
        const [sh, sm] = value["startTime"].split(":");
        s.setHours(sh);
        s.setMinutes(sm);
        let e = new Date(value["endDate"]);
        const [eh, em] = value["endTime"].split(":");
        e.setHours(eh);
        e.setMinutes(em);

        let n = new Date(e - s);
        let date =
          e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear();

        if (datax.some((item) => item.date === date)) {
          let allo = datax.find((item) => item.date === date);
          allo["time"] = allo["time"] + n / (1000 * 3600);
        } else {
          datax.push({
            id: new Date(value["endDate"]),
            date:
              e.getDate() + "/" + (e.getMonth() + 1) + "/" + e.getFullYear(),
            time: n / (1000 * 3600),
          });
        }
      }

      timeFrame = { start: 7, end: new Date() };
      let temp = new Date();
      temp.setHours(0, 0, 0, 0);
      setEndDate(temp);
      setGraph();
    }
  };

  function setGraph() {
    let tempDatax = [];
    let dateCounter = new Date(timeFrame["end"]);
    dateCounter.setDate(dateCounter.getDate() - timeFrame["start"]);
    dateCounter.setHours(0, 0, 0, 0);

    for (const obj of datax) {
      if (obj.id < dateCounter || obj.id > timeFrame["end"]) {
      } else {
        tempDatax.push(obj);
      }
    }

    while (dateCounter <= timeFrame["end"]) {
      let tempDate =
        dateCounter.getDate() +
        "/" +
        (dateCounter.getMonth() + 1) +
        "/" +
        dateCounter.getFullYear();

      if (tempDatax.some((item) => item.date === tempDate)) {
      } else {
        tempDatax.push({
          id: new Date(dateCounter),
          date:
            dateCounter.getDate() +
            "/" +
            (dateCounter.getMonth() + 1) +
            "/" +
            dateCounter.getFullYear(),
          time: 0,
        });
      }
      dateCounter.setDate(dateCounter.getDate() + 1);
    }

    tempDatax.sort((a, b) => a.id - b.id);

    let dotColor = [];

    for (let i = 0; i < tempDatax.length; i++) {
      dotColor.push("#989aa2");
    }

    setDataGraph({
      labels: tempDatax.map((data) => data.date),
      datasets: [
        {
          label: translate.getText("DAILY_SLEEP"),
          data: tempDatax.map((data) => data.time),
          backgroundColor: ["#404395"],
          borderColor: "black",
          borderWidth: 2,
          pointBackgroundColor: dotColor,
        },
      ],
      options: {
        scales: {
          y: {
            type: "time",
            time: {
              unit: "hour",
            },
          },
        },
      },
    });
  }

  const handleTimeFrame = (event) => {
    let temp = new Date();
    temp.setHours(0, 0, 0, 0);
    setEndDate(temp);

    intervalValue = event.detail.value;
    let endT = new Date();

    timeFrame = { start: intervalValue, end: endT };
    setGraph();
  };

  function moveBackTimeFrame() {
    endDate.setDate(endDate.getDate() - intervalValue);
    timeFrame = {
      start: intervalValue,
      end: endDate,
    };
    setGraph();
  }

  function moveFrontTimeFrame() {
    endDate.setDate(endDate.getDate() + intervalValue);
    timeFrame = {
      start: intervalValue,
      end: endDate,
    };
    setGraph();
  }

  useEffect(() => {
    getSleepPeriods();
  }, []);

  return (
    <IonGrid>
      <div className="App">
        <IonRow>
          <IonItemDivider>
            {!isShown && (
              <IonText onClick={() => setIsShown(!isShown)}>
                {translate.getText("SHOW_GRAPH")}{" "}
              </IonText>
            )}
            {isShown && (
              <IonText
                data-testid="closegraph"
                onClick={() => setIsShown(!isShown)}
              >
                {translate.getText("CLOSE_GRAPH")}
              </IonText>
            )}
          </IonItemDivider>
        </IonRow>
        {isShown && (
          <>
            <IonRow className="graphButtons">
              <IonRow>
                <IonButtons>
                  <IonButton onClick={moveBackTimeFrame}>
                    <IonIcon icon={arrowDropleft}></IonIcon>
                  </IonButton>
                  <IonButton onClick={moveFrontTimeFrame}>
                    <IonIcon icon={arrowDropright} onclick="()"></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonRow>
              <IonButton fill="clear">
                <IonIcon icon={calendar}></IonIcon>
              </IonButton>
              <IonText className="graphCible">
                {translate.getText("TARGET")} | {cible}
              </IonText>
            </IonRow>
            <div>
              <Line data={dataGraph} />
            </div>

            <IonSegment className="timeFrame" onIonChange={handleTimeFrame}>
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
            </IonSegment>
          </>
        )}
      </div>
      <div className="hr-modal-title-back">
        <div className="hr-modal-title-front"></div>
      </div>
    </IonGrid>
  );
});

export default Graphique;
