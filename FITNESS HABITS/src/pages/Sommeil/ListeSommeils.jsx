import { IonGrid, IonList } from "@ionic/react";
import firebase from "firebase";
import React, { useEffect, useImperativeHandle, useState } from "react";
import ElementSommeil from "./ElementSommeil";
import "./Sommeil.css";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

const ListeSommeils = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    refresh: () => {
      getSleepPeriods();
    },
  }));

  const [elementsSommeil, setElementsSommeil] = useState([]);

  const getSleepPeriods = async () => {
    let sleepPeriods;
    await db.once("value").then((snapshot) => {
      sleepPeriods = snapshot.val();
    });

    if (sleepPeriods != null) {
      let elementsSommeilTmp = [];
      var items = Object.keys(sleepPeriods).map(function (key) {
        return [key, sleepPeriods[key]];
      });

      items.sort(function (a, b) {
        return new Date(b[1].startDate) - new Date(a[1].startDate);
      });

      for (const [key, value] of items) {
        value.id = key;
        elementsSommeilTmp.push(
          <ElementSommeil
            key={key}
            info={value}
            closeFunction={getSleepPeriods}
          ></ElementSommeil>
        );
      }
      setElementsSommeil(elementsSommeilTmp);
    }
  };

  useEffect(() => {
    getSleepPeriods();
  }, []);

  return <IonGrid className="list-modal">{elementsSommeil}</IonGrid>;
});

export default ListeSommeils;
