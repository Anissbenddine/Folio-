import React, { useEffect, useState } from "react";
import firebase from "firebase";
import {
  IonInput,
  IonRow,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar,
  IonCol,
  IonButton,
  IonDatetime,
  IonGrid,
  IonSelect,
  IonSelectOption,
  IonText,
  IonModal,
} from "@ionic/react";
import { arrowDropdownCircle } from "ionicons/icons";
import { toast } from "../../../../Toast";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css";
import "./Sommeil.css";
import "./SommeilModal";
import SommeilModal from "./SommeilModal";
import { useHistory } from "react-router";
import AjoutPeriodeForm from "../../../Sommeil/AjoutPeriodeForm";

const Sommeil = (props) => {
  const userUID = localStorage.getItem("userUid");
  const db = firebase.database().ref("users/" + userUID + "/sleep/periods");

  let history = useHistory();

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState({
    startDate: props.currentDate,
  });
  const [selectedHeureDebut, setSelectedHeureDebut] = useState(
    props.sommeil.heureDebut || "00:00"
  );
  const [selectedHeureFin, setSelectedHeureFin] = useState(
    props.sommeil.heureFin || "00:00"
  );
  const [nbReveils, setNbReveils] = useState(props.sommeil.nbReveils || 0);
  const [selectedEtatReveil, setEtatReveil] = useState(
    props.sommeil.etatReveil || null
  );

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

      let n = new Date(0, 0);
      n.setMinutes(total * 60);
      let averageTime = n.toTimeString().slice(0, 5);

      setAverageSleep(averageTime);
    }
  };

  function addToAverageSleep(i) {
    setAverageSleep((averageSleep) => averageSleep + 24);
    setAverageSleep(77);
  }

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate]);

  useEffect(() => {
    setSelectedHeureDebut(props.sommeil.heureDebut);
  }, [props.sommeil.heureDebut]);

  useEffect(() => {
    setSelectedHeureFin(props.sommeil.heureFin);
  }, [props.sommeil.heureFin]);

  useEffect(() => {
    setNbReveils(props.sommeil.nbReveils);
  }, [props.sommeil.nbReveils]);

  useEffect(() => {
    setEtatReveil(props.sommeil.etatReveil);
  }, [props.sommeil.etatReveil]);

  useEffect(() => {
    getSleepPeriods();
  }, []);

  /**
   * Fonction qui calcule la duréee.
   * @return Durée en minutes
   **/
  const calculer_duree = () => {
    const heure_debut = +selectedHeureDebut.substring(0, 2);
    const heure_fin = +selectedHeureFin.substring(0, 2);
    const minutes_debut = +selectedHeureDebut.substring(3, 5);
    const minutes_fin = +selectedHeureFin.substring(3, 5);

    const heure_duree =
      heure_debut > heure_fin
        ? heure_fin + 24 - heure_debut
        : heure_fin - heure_debut;
    const minutes_duree =
      minutes_debut > minutes_fin
        ? 0 - minutes_debut + minutes_fin
        : minutes_fin - minutes_debut;
    const duree_totale = heure_duree * 60 + minutes_duree;

    return duree_totale;
  };

  // Formattage de la durée
  const duree = calculer_duree();
  const duree_heures = Math.floor(duree / 60);
  const duree_minutes = duree % 60;
  const duree_format_heure =
    duree_heures + ":" + (duree_minutes < 10 ? "0" : "") + duree_minutes;

  // Fontion qui sauvegarde les resultat dans le local storage et dans le backend
  const handleSave = () => {
    if (duree === 0) return toast(translate.getText("SOMMEIL_DUREE_ERROR"));
    else if (selectedEtatReveil === null)
      return toast(translate.getText("SOMMEIL_ETAT_REVEIL_ERROR"));

    // Calcul de l'heure
    const dashboard = JSON.parse(localStorage.getItem("dashboard"));
    dashboard.sommeil.heureDebut = selectedHeureDebut;
    dashboard.sommeil.heureFin = selectedHeureFin;
    dashboard.sommeil.nbReveils = nbReveils;
    dashboard.sommeil.etatReveil = selectedEtatReveil;
    dashboard.sommeil.duree = duree;
    localStorage.setItem("dashboard", JSON.stringify(dashboard));

    // Sauvegarder
    const userUID = localStorage.getItem("userUid");
    firebase
      .database()
      .ref(
        "dashboard/" +
          userUID +
          "/" +
          currentDate.startDate.getDate() +
          (currentDate.startDate.getMonth() + 1) +
          currentDate.startDate.getFullYear()
      )
      .update(dashboard);

    // Feedback pour le succès
    setIsOpen(false);
    toast(translate.getText("DATA_SAVED"));
  };

  window.addEventListener("ionModalDidDismiss", (event) => {
    setShowAddModal(false);
  });

  return (
    <div>
      <IonModal isOpen={showModal} class="modal-sommeil">
        <SommeilModal></SommeilModal>
        <IonButton color="success" onClick={() => setShowModal(false)}>
          Fermer
        </IonButton>
      </IonModal>
      <IonModal isOpen={showAddModal} class="modal-sommeil">
        <AjoutPeriodeForm
          closeFunction={() => setShowAddModal(false)}
        ></AjoutPeriodeForm>
      </IonModal>
      <ion-grid class="tab-sommeil">
        <ion-row>
          <ion-col
            onClick={() => setShowAddModal(true)}
            class="tab-icon clickable"
            size="auto"
          >
            <div class="point"></div>
            <img width="50" class="moon" src="assets\moon.webp" alt="Moon" />
          </ion-col>
          <ion-col
            class="white-bg clickable"
            onClick={() => history.push("/sleep")}
          >
            <ion-grid>
              <ion-row>
                <ion-col>
                  <IonText color="dark" class="sommeil-title">
                    <b>{translate.getText("SLEEP")}</b>
                  </IonText>
                </ion-col>
                <ion-col class="ion-text-right">
                  <IonText color="dark" class="compte">
                    <b>0 : 00</b>
                  </IonText>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <IonText class="cible" color="dark">
                    {translate.getText("TARGET")} | 9:00
                  </IonText>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <IonText color="dark">
                    {translate.getText("DAILY_AVERAGE_7_DAYS")} | {averageSleep}
                  </IonText>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-col>
        </ion-row>
      </ion-grid>

      {isOpen && (
        <IonItem className="bg-sommeil">
          <IonGrid>
            {/* ROW 1 */}
            <IonRow className="ion-text-center">
              {/* ENDORMI À */}
              <IonCol size="6">
                <IonRow>
                  <IonCol size="12">
                    <IonLabel>
                      <b className="text-white">
                        {translate.getText("BED_TIME")}
                      </b>
                    </IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonDatetime
                      className="input-sommeil"
                      cancelText={translate.getText("CANCEL")}
                      doneText="OK"
                      displayFormat="HH:mm"
                      value={selectedHeureDebut}
                      onIonChange={(e) => setSelectedHeureDebut(e.detail.value)}
                    ></IonDatetime>
                  </IonCol>
                </IonRow>
              </IonCol>

              {/* Éveillé À */}
              <IonCol size="6">
                <IonRow>
                  <IonCol size="12">
                    <IonLabel>
                      <b className="text-white">
                        {translate.getText("WAKE_UP_TIME")}
                      </b>
                    </IonLabel>
                  </IonCol>
                  <IonCol size="12">
                    <IonDatetime
                      className="input-sommeil"
                      cancelText={translate.getText("CANCEL")}
                      doneText="OK"
                      displayFormat="HH:mm"
                      value={selectedHeureFin}
                      onIonChange={(e) => setSelectedHeureFin(e.detail.value)}
                    ></IonDatetime>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>

            {/* ROW 2 - Nombre de réveils */}
            <IonRow className="text-white ion-justify-content-center ion-align-items-center ion-text-center">
              <IonCol size="7" className="ion-text-end">
                <IonText style={{ width: "100%" }} className="ion-wrap">
                  {translate.getText("I_WOKE_UP")}
                </IonText>
              </IonCol>

              <IonCol
                size="5"
                className="side-by-side ion-justify-content-start ion-align-items-center ion-text-justify"
              >
                <IonInput
                  style={{ maxWidth: "40px", color: "black" }}
                  className="input-sommeil ion-text-center ion-margin"
                  type="number"
                  value={nbReveils}
                  onIonChange={(e) => setNbReveils(e.detail.value)}
                ></IonInput>
                <IonText className="ion-text-justify">
                  {translate.getText("TIMES")}
                </IonText>
              </IonCol>
            </IonRow>

            <IonRow className="ion-align-items-center">
              {/* Select */}
              <IonCol size="8">
                <IonItem className="ion-no-padding" lines="none">
                  <IonLabel className="ion-hide">
                    {translate.getText("STATE_OF_MIND")}
                  </IonLabel>
                  <IonSelect
                    style={{ minWidth: "100%" }}
                    className="input-sommeil"
                    cancelText={translate.getText("CANCEL")}
                    value={selectedEtatReveil}
                    placeholder={translate.getText("STATE_OF_MIND")}
                    onIonChange={(e) => setEtatReveil(e.detail.value)}
                  >
                    <IonSelectOption value="repose">
                      {translate.getText("RESTED")}
                    </IonSelectOption>
                    <IonSelectOption value="heureux">
                      {translate.getText("HAPPY")}
                    </IonSelectOption>
                    <IonSelectOption value="fatigue">
                      {translate.getText("FATIGUE")}
                    </IonSelectOption>
                    <IonSelectOption value="colere">
                      {translate.getText("ANGRY")}
                    </IonSelectOption>
                  </IonSelect>
                </IonItem>
              </IonCol>
              <IonCol className="ion-align-items-center ion-text-center">
                <IonButton className="btn-rounded" onClick={handleSave}>
                  <b>OK</b>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      )}
    </div>
  );
};
export default Sommeil;
