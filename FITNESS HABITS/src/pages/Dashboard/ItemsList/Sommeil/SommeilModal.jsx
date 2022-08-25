import React from "react";
import {
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
  IonText,
  IonAvatar,
} from "@ionic/react";
import * as translate from "../../../../translate/Translator";
import "./SommeilModal.css";

class SommeilModal extends React.Component {
  render() {
    return (
      <>
        <IonContent className="ion-padding">
          <ion-grid>
            <ion-row>
              <ion-col>
                <IonText color="dark" class="sommeil-modal-title">
                  <b>{translate.getText("SLEEP")}</b>
                </IonText>
              </ion-col>
              <ion-col class="ion-text-right">
                <IonText color="dark" class="cible-modal">
                  <b>Cible | 9:00</b>
                </IonText>
              </ion-col>
            </ion-row>
            <div class="hr-modal-title-back">
              <div class="hr-modal-title-front"></div>
            </div>
            <ion-row>
              <ion-col>
                <IonText color="dark" class="compte-modal">
                  <b>Heure totale de sommeil : 00 H</b>
                </IonText>
              </ion-col>
            </ion-row>
            <div class="hr"></div>
            <ion-row>
              <ion-col>
                <IonText color="dark">Afficher le graphique</IonText>
              </ion-col>
            </ion-row>

            <ion-row class="modal-data">
              <ion-col>
                <IonText color="dark" class="data-time">
                  De <b class="data-time">00 : 00</b> à{" "}
                  <b> 10 : 10 - réveillé en colère</b>
                </IonText>
                <br />
                <IonText color="dark" class="data-text">
                  Durant cette période, je me suis réveillé 04 fois.
                </IonText>
                <div class="hr"></div>
              </ion-col>
            </ion-row>

            <ion-row class="modal-data">
              <ion-col>
                <IonText color="dark" class="data-time">
                  De <b>00 : 00</b> à <b> 10 : 10 - réveillé en colère</b>
                </IonText>
                <br />
                <IonText color="dark" class="data-text">
                  Durant cette période, je me suis réveillé 04 fois.
                </IonText>
                <div class="hr"></div>
              </ion-col>
            </ion-row>

            <ion-row class="modal-data">
              <ion-col>
                <IonText color="dark" class="data-time">
                  De <b>00 : 00</b> à <b> 10 : 10 - réveillé en colère</b>
                </IonText>
                <br />
                <IonText color="dark" class="data-text">
                  Durant cette période, je me suis réveillé 04 fois.
                </IonText>
                <div class="hr"></div>
              </ion-col>
            </ion-row>

            <ion-row class="modal-data">
              <ion-col class="ion-text-right" size="10"></ion-col>
              <ion-col class="ion-text-right" size="1">
                <IonAvatar class="float-right">
                  <img src="assets\icon\gear.webp" alt="Gear" />
                </IonAvatar>
              </ion-col>
            </ion-row>
          </ion-grid>
        </IonContent>
      </>
    );
  }
}

export default SommeilModal;
