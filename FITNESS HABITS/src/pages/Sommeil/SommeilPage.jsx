import {
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBack, add } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import firebase from "firebase";

import BoutonAlertes from "./BoutonAlertes";
import Graphique from "./Graphique";
import HeuresTotales from "./HeuresTotales";
import ListeSommeils from "./ListeSommeils";
import "./Sommeil.css";
import AjoutPeriodeForm from "./AjoutPeriodeForm";
import * as translate from "../../translate/Translator";

const SommeilPage = (props) => {
  const [showListModal, setShowListModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const listRef = useRef();
  const history = useHistory();

  window.addEventListener("ionModalDidDismiss", (event) => {
    setShowAddModal(false);
    setShowListModal(false);
  });

  const addPeriodEvent = () => {
    setShowAddModal(false);
    listRef.current.refresh();
  };

  return (
    <IonPage className="page">
      <IonModal isOpen={showListModal} class="modal-sommeil">
        <ListeSommeils closeFunction={addPeriodEvent}></ListeSommeils>
      </IonModal>

      <IonModal isOpen={showAddModal} class="modal-sommeil">
        <AjoutPeriodeForm closeFunction={addPeriodEvent}></AjoutPeriodeForm>
      </IonModal>

      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons>
            <IonButton onClick={() => history.goBack()}>
              <IonIcon color="light" icon={arrowBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{translate.getText("SLEEP")}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <BoutonAlertes></BoutonAlertes>
        <Graphique></Graphique>
        <HeuresTotales></HeuresTotales>
        <ListeSommeils ref={listRef}></ListeSommeils>
      </IonContent>

      <IonFooter>
        <IonRow class="boutonsBas">
          <IonButton
            color="primary"
            shape="round"
            onClick={() => setShowAddModal(true)}
          >
            {translate.getText("ADD")}
            <IonIcon icon={add}></IonIcon>
          </IonButton>
          <IonButton
            color="medium"
            shape="round"
            onClick={() => setShowListModal(true)}
          >
            {translate.getText("SEE_LIST")}
          </IonButton>
        </IonRow>
      </IonFooter>
    </IonPage>
  );
};
export default SommeilPage;
