import React from "react";
import * as translate from "../../../translate/Translator";
import {IonLabel, IonItem, IonButton, IonModal, IonContent, IonItemGroup } from "@ionic/react";
import "../../Tab1.css";
import "../../weight.css";

const DeleteConfirmation = (props) => {

    return (
        <IonModal data-testid = "modalDeleteConfirmation" isOpen={props.showConfirmation} id="delete-confirmation" 
        onDidDismiss={() => props.setShowConfirmation(false)}>
        <IonContent>
            <IonItemGroup className="newTargetWeight">
                <IonLabel>
                    <b>{translate.getText("CONFIRMATION")}</b>
                </IonLabel>
            </IonItemGroup>
            <IonItemGroup className="confirmation">
                <IonLabel>
                    <b>{translate.getText("DELETE_CONFIRMATION")}</b><br></br>
                    <b>{translate.getText("DELETE_CONFIRMATION_INFOS")}</b>
                </IonLabel>
            </IonItemGroup>
            <IonItemGroup className="buttonConfirm">
                <IonItem className="buttonItem">
                    <IonButton data-testid="cancel" id="cancel-confirmation" shape="round" expand="block"  onClick= {() => props.setShowConfirmation(false)} >
                    {translate.getText("CANCEL_DELETE")}
                    </IonButton>
                </IonItem>
                <IonItem className="buttonItem">
                    <IonButton data-testid= "confirm" id="accept-confirmation" shape="round" expand="block" onClick= {() => props.onDelete()}>
                    {translate.getText("ACCEPT_DELETE")}
                    </IonButton>
                </IonItem>

            </IonItemGroup>
                
        </IonContent>
          
        </IonModal>
      );


}
export default DeleteConfirmation