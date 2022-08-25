import { IonButton, IonIcon, IonRow, IonText } from "@ionic/react";
import { notifications } from "ionicons/icons";
import React from "react";
import "./Sommeil.css";
import * as translate from "../../translate/Translator";

function BoutonAlertes() {
  return (
    <IonRow className="notificationRow">
      <IonText>{translate.getText("ALERTS_SETUP")}: </IonText>
      <IonButton className="big-icon" color="medium" shape="circle">
        <IonIcon slot="icon-only" icon={notifications}></IonIcon>
      </IonButton>
    </IonRow>
  );
}

export default BoutonAlertes;
