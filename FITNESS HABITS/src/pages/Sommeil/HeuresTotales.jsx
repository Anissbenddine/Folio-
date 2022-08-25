import { IonRow, IonText } from "@ionic/react";
import React, { useEffect, useImperativeHandle, useState } from "react";
import "./Sommeil.css";
import * as translate from "../../translate/Translator";
import firebase from "firebase";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

const HeuresTotales = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refresh: () => {
      getSleepPeriods();
    },
  }));

  const [averageSleep, setAverageSleep] = useState(0);

  const getSleepPeriods = async () => {
    let sleepPeriods;
    await db.once("value").then((snapshot) => {
      sleepPeriods = snapshot.val();
    });

    let nbSleepPeriods = 0;
    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    let sleepPeriodsList;

    if (sleepPeriods != null) {
      sleepPeriodsList = Object.entries(sleepPeriods).reverse();

      let total = 0.0;
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

        if (e > startDate && e <= endDate) {
          total = total + n / (1000 * 3600);
          nbSleepPeriods++;
        }
      }

      total = total / nbSleepPeriods;
      console.log(nbSleepPeriods);

      let n = new Date(0, 0);
      n.setMinutes(total * 60);
      let averageTime = n.toTimeString().slice(0, 5);

      setAverageSleep(averageTime);
    }
  };

  useEffect(() => {
    getSleepPeriods();
  }, []);

  return (
    <IonRow>
      <IonText className="heuresTotales">
        {translate.getText("DAILY_AVERAGE_7_DAYS")} : {averageSleep}
      </IonText>
    </IonRow>
  );
});

export default HeuresTotales;
