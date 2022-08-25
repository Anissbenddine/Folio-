import React, { useState, useEffect } from "react";
import * as weightService from "../service/weightService"
import * as translate from "../../../translate/Translator";
import { IonAvatar, IonInput, IonIcon, IonLabel, IonItem, IonButton, IonModal, IonContent, IonSelect, IonSelectOption, IonDatetime, IonItemGroup } from "@ionic/react";
import { calendar, time, trash} from "ionicons/icons";
import "../../Tab1.css";
import "../../weight.css";
import DeleteConfirmation from "./DeleteConfirmation"


// Variables in Firebase remains in French for now with a translation in comment
const WeightModify = (props) => {
  // Ajout de cette variable dans le but de vérifier quelle était la préférence d'affichage du poids.
  const [unitWeight, setUnitWeight] = useState("KG");
  const [popoverDate, setPopoverDate] = useState(weightService.formatDate(props.weightElement.x));
  const [weight, setWeight] = useState(props.weightElement.y);

  const popoverSelectOptions = {
    cssClass: 'popover-select'
  }

  useEffect(() => {
    setWeight(parseFloat(props.weightElement.y).toFixed(1));
  }, [props.weightElement.y]);

  useEffect(() => {
    setPopoverDate(weightService.formatDate(props.weightElement.x));
  }, [props.weightElement.x]);

  useEffect(() => {
    setUnitWeight(props.unitWeight);
  }, [props.unitWeight]);

 

	// Capture of the vent if the weight preference unit changes
  const handleUnitWeightChange = (event) => {
    let newUnitWeight = event.detail.value;
    weightService.setPrefUnitWeight(newUnitWeight);
    let oldUnitWeight = unitWeight;
    setUnitWeight(newUnitWeight);

    var weightAdjust = weight;
    if (oldUnitWeight === "KG" && newUnitWeight === "LBS") {
      weightAdjust = weight * 2.2;
    } else if (oldUnitWeight === "LBS" && newUnitWeight === "KG") {
      weightAdjust = weight / 2.2;
    }

		// Then we reduce to one decimal point but using parseFloat to use toFixed
    props.updatePrefUnit(oldUnitWeight, newUnitWeight);
    setWeight(parseFloat(weightAdjust).toFixed(1));
  };

  const handleCloseModal = () => {
    props.setShowWeightModify(false)
    setWeight(parseFloat(props.weightElement.y).toFixed(1));
    setPopoverDate(weightService.formatDate(props.weightElement.x));
  }

  return (
    <IonModal data-testid = "modal" isOpen={props.showWeightModify} id="modify-weight-modal" 
              onDidDismiss={handleCloseModal} >
      <IonContent className="modalContent">
          <IonItemGroup className="delete">
            <IonAvatar data-testid="deleteModal" className='trashAvtr' onClick={() => props.setShowConfirmation(true)}><IonIcon className="iconModifier" icon={trash} /></IonAvatar>
          </IonItemGroup>
          <IonItemGroup className="weight-date">
            <IonLabel className="new-weight">
              {translate.getText("WEIGHT_NAME_SECTION")}
            </IonLabel>

            <IonItem className="input-weight-item">
              <IonInput
              value={weight}
              className="input-weight"
              type="tel"
              maxlength={5}
              onIonChange={ev => setWeight(ev.detail.value)}   
              data-testid = "weight"  
              ></IonInput>
            </IonItem>
            
            <IonSelect className="weight-type" data-testid = "select" value={unitWeight} 
                        interface="popover" interfaceOptions={popoverSelectOptions}
                        onIonChange={handleUnitWeightChange} >
              <IonSelectOption  value="LBS">LBS</IonSelectOption >
              <IonSelectOption  value="KG">KG</IonSelectOption >
            </IonSelect>
            
          </IonItemGroup>
          <IonItemGroup className="weight-date">                        
              <IonItem>
                <IonDatetime
                  className="date-format"
                  value={popoverDate}
                  display-format={props.dateFormat}
                  monthShortNames={translate.getText("ABBREVIATION_MONTH")}
                  style={{ color: "black" }}
                  onIonChange={ev => setPopoverDate(ev.detail.value)}
                  data-testid = "date" 
                />
                <IonIcon className="date-icon" icon={calendar} />
              </IonItem>

              <IonItem>
                <IonDatetime
                  className="time-format"
                  value={popoverDate}
                  display-format="HH:mm"
                  style={{ color: "black" }}
                  onIonChange={ev => setPopoverDate(ev.detail.value)}
                  data-testid = "time" 
                />
                <IonIcon className="date-icon" icon={time} />
              </IonItem>
          </IonItemGroup>
        <IonButton 
          data-testid = "edit" id="input-weight-button" shape="round" expand="block" 
          onClick={() => props.onModify(weight, popoverDate)}>{translate.getText("MODIFY")}
        </IonButton>
      </IonContent>
      <DeleteConfirmation
        showConfirmation={props.showConfirmation}
        setShowConfirmation={props.setShowConfirmation}
        onDelete= {props.onDelete}>
    </DeleteConfirmation>
    </IonModal>
    

  );
};
export default WeightModify;
