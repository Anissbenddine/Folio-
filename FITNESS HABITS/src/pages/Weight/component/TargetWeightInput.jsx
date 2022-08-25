import React, { useState, useEffect } from "react";
import * as weightService from "../service/weightService"
import * as translate from "../../../translate/Translator";
import { IonInput, IonIcon, IonLabel, IonItem, IonButton, IonModal, IonContent, IonSelect, IonSelectOption, IonDatetime, IonItemGroup } from "@ionic/react";
import { calendar} from "ionicons/icons";
import "../../Tab1.css";
import "../../weight.css";

const DIFF_UNITY_WEIGHT = 2.2;
// Variables in Firebase remains in French for now with a translation in comment
const TargetWeightInput = (props) => {
const [targetWeight, setTargetWeight] = useState(props.targetWeight);
const [targetDate, setTargetDate] = useState(props.targetDate);
const [unitWeight, setUnitWeight] = useState(props.unitWeight);

const popoverSelectOptions = {
  cssClass: 'popover-select'
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
  weightService.setPrefUnitWeight(new_value);
  setUnitWeight(new_value);
  var weightAdjust = targetWeight
  if (OldUnitWeight === "KG" && new_value === "LBS") {
    weightAdjust = weightAdjust * DIFF_UNITY_WEIGHT
  } else if (OldUnitWeight === "LBS" && new_value === "KG") {
    weightAdjust = weightAdjust / DIFF_UNITY_WEIGHT
  }
  props.updatePrefUnit(OldUnitWeight, new_value);
  setTargetWeight(parseFloat(weightAdjust).toFixed(1))
}

const handleCloseModal = () => {
  props.setShowInputTargetWeight(false)
  setTargetWeight(props.targetWeight);
  setTargetDate(weightService.formatDate(props.targetDate));
}

const selectDate= () => {
  try{
    document.querySelector('#dateTest').shadowRoot.querySelector('.datetime-text').setAttribute('style', 'display:none');
  }catch{}

}

useEffect(() => {
  setTargetWeight(props.targetWeight);
}, [props.targetWeight]);

useEffect(() => {
  setTargetDate(weightService.formatDate(props.targetDate));
}, [props.targetDate]);

useEffect(() => {
  setUnitWeight(props.unitWeight);
}, [props.unitWeight]);

  return (
    <IonModal data-testid = "modal" isOpen={props.showInputTargetWeight} id="modify-weight-modal" 
    onDidDismiss={handleCloseModal} onWillPresent={selectDate}
    >
        <IonContent className="modalContent">
            <IonItemGroup className="newTargetWeight">
                <IonLabel>
                    <b>{translate.getText("NEW_TARGET_WEIGHT")}</b>
                </IonLabel>
            </IonItemGroup>
            <IonItemGroup className="targetWeightInput">
                <IonItem className="input-target-weight-item">
                    <IonInput
                        value={targetWeight}
                        onIonChange={e => handleWeightTargetChange(e.detail.value)}
                        className="input-weight"
                        type="tel"
                        maxlength={5}
                        data-testid = "targetInput"
                    ></IonInput>
                </IonItem>
                <IonSelect value={unitWeight} onIonChange={handleUnitWeightChange} className="weight-type"
                           data-testid = "select"  interface="popover"
                           interfaceOptions={popoverSelectOptions}>
                    <IonSelectOption  value="LBS">LBS</IonSelectOption >
                    <IonSelectOption  value="KG">KG</IonSelectOption >
               </IonSelect>
          </IonItemGroup>
          <IonItemGroup className="target-weight-date">  
            <IonItem className="targetDateValue"data-testid="targetDate" >
              {weightService.formatDateShape(targetDate, props.dateFormat)}
            </IonItem>                      
            <IonItem>
                <IonDatetime
                  id="dateTest"
                  className="date-format"
                  value={targetDate}
                  display-format={props.dateFormat}
                  monthShortNames={translate.getText("ABBREVIATION_MONTH")}
                  style={{ color: "black" }}
                  onIonChange={ev => handleDateTargetChange(ev.detail.value)} 
                  data-testid = "date" 
                />
                <IonIcon className="date-icon" icon={calendar} />
            </IonItem>
              
          </IonItemGroup>
              <IonItemGroup>
              <IonButton data-testid = "add" id="input-weight-button" shape="round" expand="block" onClick= {() => props.onAdd(targetWeight, targetDate)}>
                {translate.getText("ADD_TARGET_WEIGHT")}
              </IonButton>
          </IonItemGroup>
      </IonContent>
      
    </IonModal>
  );
};
export default TargetWeightInput;
