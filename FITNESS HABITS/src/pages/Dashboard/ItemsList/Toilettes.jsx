import React, { useState, useEffect } from "react"
import firebase from 'firebase'
import { IonText, IonDatetime, IonGrid, IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton, IonList, IonListHeader, IonContent } from '@ionic/react';
import { addCircle, removeCircle } from 'ionicons/icons';
import * as translate from '../../../translate/Translator'
import moment from "moment"
import { time } from 'ionicons/icons';
import { calendar } from 'ionicons/icons';
import '../../../pages/Tab1.css';

const Toilettes = (props) => {

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block" : divElt.style.display = "none";
    }
  }

  const [currentDate, setCurrentDate] = useState({ startDate: props.currentDate });
  const [popupDate, setPopupDate] = useState(moment(props.currentDate.startDate).format('DD-MM-YYYY'))
  const [popupTime, setPopupTime] = useState(moment(props.currentDate.startDate).format('HH:mm:ss:ms')) 
  const [urineEdit, setUrineToEdit] = useState(undefined);
  const [urine, setUrineDisplay] = useState(props.toilettes.urine);
  const [feces, setFeces] = useState(props.toilettes.feces);
  const [buttonPopup, setButtonPopup] = useState(false);
  const [selectedFecesStyle, setFecesStyle] = useState(undefined);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setUrineDisplay(props.toilettes.urine);
  }, [props.toilettes.urine])

  useEffect(() => {
    setFeces(props.toilettes.feces);
  }, [props.toilettes.feces])

  const openAddItemContainer = () => {
    setUrineToEdit(undefined);
    setUrineDisplay(true);
  }

  const openEditItemContainer = (index) => {
    //setUrineToEdit(cereales[index]);
    setUrineDisplay(true);
  }
  const handleChangeUrineAdd = () => {
    setUrineDisplay(urine + 1);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.toilettes.urine = urine + 1;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleDateChange = (event) => {
    const dateChange = event.target.value;
    setPopupDate(moment(dateChange).format('YYYY-MM-DD'));
  }

  const handleChangeUrineMin = () => {
    if (urine >= 1) {
      setUrineToEdit(urine - 1);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.urine = urine - 1;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
    } else if (urine === 0) {
      setUrineToEdit(0);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.urine = 0;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
    }    
  }

  const handleChangeFecesAdd = () => {
    if (selectedFecesStyle === undefined) {
      return;
    }
    
    setFeces(feces + 1);
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.toilettes.feces = feces + 1;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const handleChangeFecesMin = () => {
    if (feces >= 1) {
      setFeces(feces - 1);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.feces = feces - 1;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
    } else if (feces === 0) {
      setFeces(0);
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.toilettes.feces = 0;
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/' + userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear()).update(dashboard);
    }
  }
  
  function getFecesStyle (type) {
    if (selectedFecesStyle === type) {
      return {padding: "10px", margin: "10px", border: "3px solid #2BA58A", textAlign: "center"}
    } else {
      return {padding: "10px", margin: "10px", border: "3px solid #707070", textAlign: "center"}
    }
  }

  function Popup(props) {
    // handleTimeWait();
    return (props.trigger) ? (

        <div className='popup'>
          <div className='popup-inner'>
            {props.children}
          </div>
        </div>
    ) : "";
  }

  const handleChangeToilet = event => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    const userUID = localStorage.getItem('userUid');
    var date = currentDate.startDate.getDate() + (currentDate.startDate.getMonth() + 1) + currentDate.startDate.getFullYear();
    var time = currentDate.startDate.getHours() + ':'+currentDate.startDate.getMinutes() + ':'+ currentDate.startDate.getSeconds();
    firebase.database().ref('dashboard/' + userUID + "/" + date).update(dashboard);
  }


  return (
    <div className="Toilettes" >
    {/*fenetre qui pop up quand on clique sur toilette*/}
    <Popup trigger={buttonPopup} setTrigger={setButtonPopup} className="popupClass">
      <IonContent>
        <div className="titreToilette">
          <span>
            {translate.getText("NB_QUOTIDIENNE_TOILETTE")}
          </span>
        </div>
        <div className="contentFecesUrine">
          <span>
            {translate.getText("URINE_TITLE")} : {urine <= 9 ? "0" + urine : urine} {translate.getText("TIMES")}
          </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>
            {translate.getText("EXP_UR_TR")} : {feces <= 9 ? "0" + feces : feces} {translate.getText("TIMES")}
          </span>
        </div>
        <div className="addUrine">
          <span style={{paddingRight: "60%"}}>{translate.getText("URINE_TITLE")}</span>
          <IonButton color="danger" size="small" onClick={() => handleChangeUrineMin()}>
            <IonIcon icon={removeCircle} />
          </IonButton>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <IonButton color="danger" size="small" onClick={() => handleChangeUrineAdd()}>
            <IonIcon icon={addCircle} />
          </IonButton>
        </div>
        <div className="addTransit">
          <span>{translate.getText("EXP_UR_TR")}</span>
          <div className="typesTransit">
            <IonGrid>
              <IonRow>
                <IonCol>
                  <div style={{textAlign: "center"}}>
                    <IonText style={{fontFamily: "Roboto, sans-serif"}}>
                      {translate.getText("TOILET_CONST")}
                    </IonText>
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{textAlign: "center"}}>
                    <IonText style={{fontFamily: "Roboto, sans-serif"}}>
                      {translate.getText("TOILET_SADDLE")}
                    </IonText>
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{textAlign: "center"}}>
                    <IonText style={{fontFamily: "Roboto, sans-serif"}}>
                      {translate.getText("TOILET_DIARRHEA")}
                    </IonText>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <div style={getFecesStyle(1)} onClick={() => setFecesStyle(1)}>
                    {translate.getText("SUPPL_TYPE")} 1
                    <img src="/toiletTransit/Échelle-de-bristol-1.png" alt="toilettes" />
                  </div>
                </IonCol>
                <IonCol>
                  <div style={getFecesStyle(3)} onClick={() => setFecesStyle(3)}>
                    {translate.getText("SUPPL_TYPE")} 3
                    <img src="/toiletTransit/Échelle-de-bristol-3.png" alt="toilettes" />
                  </div>
                </IonCol>
                <IonCol>
                  <div style={getFecesStyle(5)} onClick={() => setFecesStyle(5)}>
                    {translate.getText("SUPPL_TYPE")} 5
                    <img src="/toiletTransit/Échelle-de-bristol-5.png" alt="toilettes" />
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <div style={getFecesStyle(2)} onClick={() => setFecesStyle(2)}>
                    {translate.getText("SUPPL_TYPE")} 2
                    <img src="/toiletTransit/Échelle-de-bristol-2.png" alt="toilettes" />
                  </div>
                </IonCol>
                <IonCol>
                  <div style={getFecesStyle(4)} onClick={() => setFecesStyle(4)}>
                    {translate.getText("SUPPL_TYPE")} 4
                    <img src="/toiletTransit/Échelle-de-bristol-4.png" alt="toilettes" />
                  </div>
                </IonCol>
                <IonCol>
                  <div style={getFecesStyle(6)} onClick={() => setFecesStyle(6)}>
                    {translate.getText("SUPPL_TYPE")} 6
                    <img src="/toiletTransit/Échelle-de-bristol-6.png" alt="toilettes" />
                  </div>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="8">
                  <div className="sourceText">
                    <h6>{translate.getText("SOURCE")} </h6>
                    https://m.pharmacie-principale.ch/themes-sante/divers/la-force-et-la-texture-de-nos-selles-nous-parlent-de-notre-sante
                  </div>
                </IonCol>
                <IonCol>
                  <div style={getFecesStyle(7)} onClick={() => setFecesStyle(7)}>
                    {translate.getText("SUPPL_TYPE")} 7
                    <img src="/toiletTransit/Échelle-de-bristol-7.png" alt="toilettes" />
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>
        <IonButton className="ion-margin-top boutonSupprimer" onClick={() => handleChangeFecesAdd()} expand="block" type="submit"> 
          {translate.getText("SUPPL_ADD_SELECT")} 
        </IonButton>
        <IonButton className="ion-margin-top boutonSupprimer" onClick={() => setButtonPopup()} expand="block" type="cancel">{translate.getText("CANCEL")}</IonButton>
          <ion-row>
            <ion-col>
              <IonItem className="borderDateHeure">
                <IonDatetime
                  className="date-format dateHeureClass"
                  value={popupDate}
                  display-format='YYYY-MM-DD'
                  monthShortNames={translate.getText("ABBREVIATION_MONTH")}
                  style={{ color: "#707070" }}
                  data-testid="date"
                  placeholder={popupDate}
                  onIonChange={handleDateChange}
                />
                <IonIcon className="date-icon iconeDateHeure" icon={calendar} />
              </IonItem>
            </ion-col>
            <ion-col>
              <IonItem>
                <IonDatetime
                  className="time-format dateHeureClass "
                  value={popupTime}
                  display-format="HH:mm"
                  style={{ color: "#707070" }}
                  data-testid="time"
                  placeholder={popupTime}
                  onIonChange={ev => setPopupTime(ev.target.value)}
                />
                <IonIcon className="date-icon iconeDateHeure" icon={time} />
              </IonItem>
            </ion-col>
          </ion-row>
      </IonContent>
    </Popup>

    <IonItem lines="none" className="globalModule" >
      <IonGrid>
        <IonRow className="">
          <IonCol size-md="1" size-sm="3" size-xs="3">
            <div className="avatarClass">
              <IonButton className="boutonGeneral boutonToiletColor" onClick={() => setButtonPopup(true)}>
                <IonAvatar slot="start" >
                  <div class="point"></div>
                  <img src="/assets/toilettes.png" alt="toilettes" />
                </IonAvatar>
              </IonButton>
            </div>
          </IonCol>
          <IonCol size-md="11" size-sm="9" size-xs="9">
            <IonItem lines="none" className="divTitress">
              <div className="labelClass">
                <IonButton className="boutonToilettes">
                  <IonLabel>
                    <h2><b>{translate.getText("TOILETS_TITLE")}</b></h2>
                  </IonLabel>
                </IonButton>
              </div>
              <div className="detailsClass">
                <div>
                  <span> {translate.getText("EXP_UR_TR")} : {feces}</span>
                </div>
                <div>
                  <span>{translate.getText("URINE_TITLE")} : {urine} </span>
                </div>
              </div>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  </div>
  );
}
export default Toilettes;