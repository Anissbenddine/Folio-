// this file is not use anymore

import React, { useState , useEffect} from 'react';
import firebase from 'firebase'
import { IonItemGroup, IonItemDivider, IonInput, IonRow, IonButton, IonCard, IonCardContent,
         IonLabel, IonGrid, IonCol, IonContent, IonDatetime, IonText, IonSelect, IonSelectOption } from '@ionic/react';
import "../../weight.css";
import * as translate from "../../../translate/Translator";
import * as weightService from "../../Weight/service/weightService"

import moment from "moment"

const DIFF_UNITY_WEIGHT = 2.2;
const userUID = localStorage.getItem('userUid'); // Récupération du userID

// Variables in Firebase remains in French for now with a translation in comment
// When displaying the page, we will display the information found in "preferencesPoids" of the user's profile
const Initialisation = () => {

// Retour à la page principale de l'application
const redirectDashboard = () => {
  window.location.href = "/dashboard"
}

function formatDate (date) {
  return moment(date).format('YYYY-MM-DD');
}

const [initialWeight, setInitialWeight] = useState("");
const [targetWeight, setTargetWeight] = useState("");
const [targetDate, setTargetDate] = useState("");
const [unitWeight, setUnitWeight] = useState("");

const handleWeightInitialChange = (value) => {
  setInitialWeight(value)
}

const handleWeightTargetChange = (value) => {
  setTargetWeight(value)
}

const handleDateTargetChange = (value) => {
  setTargetDate(value);
};

const handleUnitWeightChange = (e) => {
  let new_value = e.detail.value
  let OldUnitWeight = unitWeight; // Recover the old unit of weight
  setUnitWeight(new_value);

  if (OldUnitWeight === "KG" && new_value === "LBS") {
    setTargetWeight((targetWeight * DIFF_UNITY_WEIGHT).toFixed(1))
    setInitialWeight((initialWeight * DIFF_UNITY_WEIGHT).toFixed(1))
  } else if (OldUnitWeight === "LBS" && new_value === "KG") {
    setTargetWeight((targetWeight / DIFF_UNITY_WEIGHT).toFixed(1))
    setInitialWeight((initialWeight / DIFF_UNITY_WEIGHT).toFixed(1))
  }
}

// Retrieving initial and target customer information for display
let preferencesWeightRef = firebase.database().ref('profiles/' + userUID + "/preferencesPoids");
useEffect(() => {
  preferencesWeightRef.once("value").then(function(snapshot) {
    if (snapshot.val() !== null) {
      // Firebase : poidsCible = targetWeight, poidsInitial = initialWeight
      var ini = snapshot.val().poidsInitial;
      var ci = snapshot.val().poidsCible;
      // We must put values of 0 if it does not exist yet...
      if (ini == null){
        ini = 0;
      }

      if (ci == null){
        ci = 0;
      }

			// Firebase : unitePoids = unitWeight
      setUnitWeight(snapshot.val().unitePoids);
      if (snapshot.val().unitePoids === "LBS") {
        ini *= DIFF_UNITY_WEIGHT;
        ci *= DIFF_UNITY_WEIGHT;
      }
			// Firebase : dateCible = targetDate
      setInitialWeight(parseFloat(ini).toFixed(1));
      setTargetWeight(parseFloat(ci).toFixed(1));
      setTargetDate(snapshot.val().dateCible)
    }
  })
},[])

// Event that will return to the starting values either null for all fields except the type of weight which must be KG by default
const handleReinitialization = () => {
// Retrieve the first data in relation to the weight, as we have reset the basic information.
// Move the weight info retrieval via firebase here, because elsewhere the DB is called several times.
  let weightRef = firebase.database().ref('dashboard/' + userUID)
  weightRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
    var graphData = []
    // I removed the validation whether or not the fireball return contained data to remove a smell code
    // If the result is null, the graph will remain null and put 0 as the default value
    for (const [,value] of Object.entries(snapshot.val())) {
        if (value.poids.datePoids !== undefined) {
            let dateWeight = formatDate(value.poids.datePoids)
            let weight = weightService.formatWeight(value.poids.dailyPoids)
            graphData.push ({x: dateWeight, y: weight})
        }
    }
    // Sorting to have the information from the oldest date to the most recent
    graphData.sort((a, b) => (a.x > b.x) ? 1 : -1);

    if(graphData.length > 0){
      // Retrieve the first value that the user entered when he started with the application
      setInitialWeight(parseFloat(graphData[0].y).toFixed(1));
    } else {
      setInitialWeight("0.0");
    }
    // If we put the return to KG at the start of the function, the mechanic will just change the type of weight without actually resetting
    // Except that at this place, it's just perfect
    setUnitWeight("KG");
    setTargetWeight("0.0");
    setTargetDate("");
  });
}

// Event qui viendra confirmer les informations sur les objectifs de l'utilisateur
const handlerConfirmation = () => {
  let pi = 0.0, pc = 0.0;
	// Si l'utilisateur omet de saisir ses informations de base, il devra saisir les champs manquant
	// unitePoids ne pourrait jamais être vide, donc on enlève cette condition
  if (initialWeight !== 0 && targetWeight !== 0 && targetDate !== ""){
    pi = initialWeight;
    pc = targetWeight;
    // On stock les informations en KG dans la BD
    // On garde 2 virgules pour la BD donc on créer des variables temporaires en parallelle
    if (unitWeight === "LBS") {
      pi = (initialWeight / DIFF_UNITY_WEIGHT).toFixed(2)
      pc = (targetWeight / DIFF_UNITY_WEIGHT).toFixed(2)
    }
    // Firebase : poidsInitial = initialWeight, poidsCible = targetWeight
    // Firebase : unitePoids = unitWeight, dateCible = targetDate
    let preferencesPoids = {poidsInitial: pi, poidsCible : pc, unitePoids: unitWeight, dateCible: targetDate}
    weightService.setPrefUnitWeight(unitWeight)
    firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);
    redirectDashboard();
  } else {
      var message_alert = "";
			message_alert += translate.getText("WEIGHT_BEGINNING_ALERT_MESSAGE");
			// We will make 3 independent condition between it
			if (initialWeight == 0){
				message_alert += translate.getText("INITIAL_EMPTY_WEIGHT");
			}

			if (targetWeight == 0){
        message_alert += translate.getText("EMPTY_TARGET_WEIGHT");
      }

      if (targetDate === ""){
        message_alert += translate.getText("EMPTY_TARGET_WEIGHT_DATE");
      }
			message_alert += translate.getText("WEIGHT_END_MESSAGE_ALERT");
      alert(message_alert);
  }
}

  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <IonItemGroup>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("WEIGHT_PREF_UNIT_WEIGHT")}</IonLabel>
              <IonSelect data-testid = "pop_up_unite" slot ="end" value={unitWeight} okText={translate.getText("WEIGHT_PREF_CHOOSE")} cancelText={translate.getText("WEIGHT_PREF_CANCEL")} onIonChange={e => handleUnitWeightChange(e)}>
                <IonSelectOption value="LBS">LBS</IonSelectOption>
                <IonSelectOption value="KG">KG</IonSelectOption>
              </IonSelect>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("WEIGHT_PREF_WEIGHT_INITIAL")}</IonLabel>
              <IonInput data-testid = "poids_init" class="ion-text-right" slot="end" value={initialWeight} onIonChange={e => handleWeightInitialChange(e.target.value)}></IonInput>
              <IonText class="ion-text-left" style={{margin: 5}} slot="end">{unitWeight}</IonText>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("WEIGHT_PREF_WEIGHT_TARGET")}</IonLabel>
              <IonInput class="ion-text-right" slot="end" value={targetWeight} onIonChange={e => handleWeightTargetChange(e.target.value)}></IonInput>
              <IonText class="ion-text-left" style={{margin: 5}} slot="end">{unitWeight}</IonText>
            </IonItemDivider>
            <IonItemDivider>
              <IonLabel slot="start">{translate.getText("WEIGHT_PREF_DATE_TARGET")}</IonLabel>
              <IonDatetime
                monthShortNames = {translate.getText("ABBREVIATION_MONTH")}
                slot="end"
                displayFormat="YYYY MMM DD"
                placeholder={translate.getText("WEIGHT_SUGGESTION_DATE")}
                max="2099-10-31"
                value={targetDate}
                onIonChange={(e) => handleDateTargetChange(e.target.value)}
              ></IonDatetime>
            </IonItemDivider>
          </IonItemGroup>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={handleReinitialization}>{translate.getText("WEIGHT_PREF_RESET")}</IonButton>
            </IonCol>
            <IonCol size="6">
              <IonButton shape="round" expand="block" onClick={handlerConfirmation}>{translate.getText("WEIGHT_PREF_CONFIRM")}</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCard>
    </IonContent>
  )
}

export default Initialisation;

