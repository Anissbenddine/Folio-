import {
  IonButton,
  IonCol,
  IonDatetime,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
  IonInput,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React, { useState } from "react";
import "./Sommeil.css";
import * as translate from "../../translate/Translator";
import pencil from "./pencil.svg";

import { information, trash } from "ionicons/icons";
import firebase from "firebase";

const userUID = localStorage.getItem("userUid");
const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

function ElementSommeil(props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [startDate, setStartDate] = useState(props.info.startDate);
  const [startTime, setStartTime] = useState(props.info.startTime);
  const [endDate, setEndDate] = useState(props.info.endDate);
  const [endTime, setEndTime] = useState(props.info.endTime);
  const [nbAwoken, setNbAwoken] = useState(props.info.nbAwoken);
  const [mood, setMood] = useState(props.info.mood);

  let d = new Date(props.info.startDate);

  window.addEventListener("ionModalDidDismiss", (event) => {
    setShowEditModal(false);
  });

  let deletePeriod = () => {
    db.child(props.info.id)
      .remove()
      .then(() => {
        setShowEditModal(false);
        setDeleted(true);
        props.closeFunction();
      });
  };

  let editPeriod = () => {
    if (endTime && mood && startTime) {
      let doc = {
        startDate: startDate,
        startTime: startTime,
        endDate: endDate,
        endTime: endTime,
        mood: mood,
        nbAwoken: nbAwoken,
      };

      db.child(props.info.id)
        .update(doc)
        .then(() => {
          setShowEditModal(false);
          props.closeFunction();
        });
    }
  };

  return deleted ? null : (
    <div className="">
      <IonModal isOpen={showEditModal} className="modal-sommeil">
        <form className="page">
          <IonGrid>
            <IonItem className="ajout-item">
              <IonCol>
                <IonLabel className="ajout-label-nbrFois">
                  {translate.getText("BED_DATE")}
                </IonLabel>
                <IonDatetime
                  presentation="date"
                  value={startDate}
                  onIonChange={(e) => setStartDate(e.target.value)}
                ></IonDatetime>
              </IonCol>
              <IonCol></IonCol>
              <IonCol>
                <IonLabel className="ajout-label-nbrFois">
                  {translate.getText("BED_TIME")}
                </IonLabel>
                <IonInput
                  value={startTime}
                  onIonChange={(e) => setStartTime(e.target.value)}
                  type="time"
                ></IonInput>
              </IonCol>
            </IonItem>
            <IonItem className="ajout-item">
              <IonCol>
                <IonLabel className="ajout-label-nbrFois">
                  {translate.getText("BED_DATE_END")}
                </IonLabel>
                <IonDatetime
                  presentation="date"
                  value={endDate}
                  onIonChange={(e) => setEndDate(e.target.value)}
                ></IonDatetime>
              </IonCol>
              <IonCol></IonCol>
              <IonCol>
                <IonLabel className="ajout-label-nbrFois">
                  {translate.getText("BED_TIME_END")}
                </IonLabel>
                <IonInput
                  value={endTime}
                  onIonChange={(e) => setEndTime(e.target.value)}
                  type="time"
                ></IonInput>
              </IonCol>
            </IonItem>
            <IonItem className="ajout-item">
              <IonCol size="8">
                <IonLabel className="ion-text-wrap">
                  {translate.getText("I_WOKE_UP")}
                </IonLabel>
              </IonCol>
              <IonCol>
                <IonInput
                  value={nbAwoken}
                  onIonChange={(e) => setNbAwoken(e.target.value)}
                  min="0"
                  type="number"
                ></IonInput>
              </IonCol>
              <IonCol>
                <IonLabel>{translate.getText("TIMES")}</IonLabel>
              </IonCol>
            </IonItem>
            <IonItem className="ajout-item">
              <IonLabel className="ajout-label-nbrFois">
                {translate.getText("STATE_OF_MIND")}
              </IonLabel>
              <IonSelect
                value={mood}
                onIonChange={(e) => setMood(e.target.value)}
              >
                <IonSelectOption value="HAPPY">
                  😄 - {translate.getText("HAPPY")}
                </IonSelectOption>
                <IonSelectOption value="ANGRY">
                  😠 - {translate.getText("ANGRY")}
                </IonSelectOption>
                <IonSelectOption value="RESTED">
                  🙂 - {translate.getText("RESTED")}
                </IonSelectOption>
                <IonSelectOption value="FATIGUE">
                  🥱 - {translate.getText("FATIGUE")}
                </IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonRow className="ion-justify-content-evenly">
              <IonCol>
                <IonButton
                  className="bouton-edit"
                  color="danger"
                  shape="round"
                  onClick={() => deletePeriod()}
                >
                  {translate.getText("DELETE")}
                  <IonIcon icon={trash}></IonIcon>
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  className="bouton-edit"
                  color="primary"
                  shape="round"
                  onClick={() => editPeriod()}
                >
                  {translate.getText("MODIFY")}
                  <IonIcon icon={information}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </form>
      </IonModal>
      <IonRow className="modal-data">
        <IonCol size="10">
          <IonText color="dark" className="data-time">
            {translate.getText("DE")} <b>{props.info.startTime}</b>{" "}
            {translate.getText("A")}{" "}
            <b>
              {props.info.endTime} - {translate.getText("STATE_OF_MIND")} :{" "}
              {translate.getText(props.info.mood)}
            </b>
          </IonText>
          <br />
          <IonText color="dark" className="data-text">
            {translate.getText("I_WOKE_UP")} {props.info.nbAwoken}{" "}
            {translate.getText("TIMES")}
          </IonText>
          <br />
          <IonText color="dark" className="data-date">
            {d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()}
          </IonText>
        </IonCol>
        <IonCol>
          <IonButton
            color="medium"
            shape="circle"
            className="big-icon"
            onClick={() => setShowEditModal(true)}
          >
            <img className="big-icon" src={pencil} />
          </IonButton>
        </IonCol>
      </IonRow>
      <div className="hr"></div>
    </div>
  );
}

export default ElementSommeil;
