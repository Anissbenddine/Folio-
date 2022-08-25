import React, { useState, useEffect } from "react";
import firebase from 'firebase';
import moment from "moment";
import DetailGlycemie from "./../../../pages/Glycemie/detailGlycemie";


import {
  IonInput,
  IonLabel,
  IonItem,
  IonAvatar,
  IonRow,
  IonIcon,
  IonCol,
  IonButton,
  IonDatetime,
  IonGrid,
  IonCheckbox,
  IonSelect,
  IonRadio,
  IonRadioGroup,
  IonListHeader,
  IonSelectOption,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItemDivider
} from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import { time } from 'ionicons/icons';
import { calendar } from 'ionicons/icons';
import '../../Tab1.css';
import Graphe from "../../GrapheGlycemie/graphe";
import * as translate from '../../../translate/Translator'
import {resolveAny} from "dns";


    
const handleSave = () => { }
const minMmol = 2;
const maxMmol = 40;
const minMg = 36;
const maxMg = 218;

export function mgToMmol (param1) {
  return param1*0.0555;
}

export function tauxMmolValid(taux){
  if(taux < minMmol || taux > maxMmol ) {
    return false;
  }
  return true ;
}

export function tauxMgValid(taux){
  if(taux < minMg || taux > maxMg ) {
    return false;
  }
  return true ;
}

const Glycemie = (props) => {
 const current = new Date ();
 const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
   const [currentDate, setCurrentDate] = useState({ startDate: new Date() });
  const [dailyGlycemie, setDailyGlycemie] = useState(props.glycemie.dailyGlycemie);
  const [glycemie, setGlycemie] = useState(props.glycemie);
  const [buttonPopup, setButtonPopup] = useState(false);
  var [popupDate, setPopupDate] = useState(props.glycemie.popupDate);
  //var [popupDate, setPopupDate] = useState(moment(date).format('YYYY-MM-DD'));
  const [popupTime, setPopupTime] = useState(moment(props.currentDate.startDate).format('HH:mm:ss:ms'))
  const [uniteGlycemie, setUniteGlycemie] = useState(props.glycemie.uniteGlycemie);
  const [momentPrise, setMomentPrise] = useState(props.glycemie.momentPrise)
  const [laDate, setLaDate] = useState(props.glycemie.laDate)
  
  // popupDate = moment(currentDate).format('YYYY-MM-DD');

  glycemie.uniteGlycemie = "mmol";
  console.log(popupDate);
  useEffect(() => {
    setMomentPrise(props.glycemie.momentPrise);
  }, [props.glycemie])

  useEffect(() => {
   setPopupDate(moment(props.glycemie.popupDate).format('YYYY-MM-DD'));
}, [props.glycemie.popupDate])

  useEffect(() => {
    setPopupTime(moment(props.currentDate.startDate).format('HH:mm:ss:ms'));
  }, [props.currentDate])

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setDailyGlycemie(parseFloat(props.glycemie.dailyGlycemie));
  }, [props.glycemie.dailyGlycemie])

  useEffect(() => {
   setLaDate(props.glycemie.laDate);
},  [props.glycemie.laDate])

  useEffect(() => {
    setGlycemie(props.glycemie);
    // window.localStorage.setItem("taux",glycemie);
  }, [props.glycemie])

  useEffect(() => {
    setUniteGlycemie(props.glycemie.uniteGlycemie);
  }, [props.glycemie.uniteGlycemie])

  const handleTimeWait = () => {
    let timeFinal = (new Date()).getTime();
    let timeFn = moment(popupDate).toDate();
    timeFn.setTime(timeFinal)
    setPopupDate(moment(timeFn).format('YYYY-MM-DD'))
    setPopupTime(moment(timeFn).format('HH:mm:ss:ms'))
    console.log(popupDate)
  }

  const handleDateChange = (event) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    let dateChange = event.detail.value;
    //var newDate = moment(dateChange).format('YYYY-MM-DD');
    //console.log('date entree au form')
    //console.log(moment(dateChange).format('YYYY-MM-DD'));   
    //setPopupDate(moment(oldTime).format('YYYY-MM-DD'))
    //dateChange = moment(dateChange).format('YYYY-MM-DD')
    dashboard.glycemie.popupDate=dateChange;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    
    //date = new Date (newDate);
    //date = moment(date).format('YYYY-MM-DD');
    //console.log("date");
    //console.log(date);
    //props.glycemie.popupDate = date;
    //date = new Date (newDate); 
    //setPopupDate(date);
    //console.log("popupDate")
    //console.log(popupDate);
  }

  const handleTimeChange = (event) => {
    const timeChange = event.target.value;
    setPopupTime(moment(timeChange).format('HH:mm:ss:ms'));
  }

//recuperation de l unite de mesure de glycemie
  const handleUniteGlycemie = (event) => {
    const uniteGlycemie = event.target.value;

    setUniteGlycemie(uniteGlycemie);
    localStorage.setItem("uniteGlycemie", JSON.stringify(uniteGlycemie));
  }

  const handleMomentPriseChange = (event) => {
    const momentPrise = event.target.value;
    setMomentPrise(momentPrise)
    //localStorage.setItem("uniteGlycemie", JSON.stringify(uniteGlycemie));
  }



//met a jour le taux de glycemie dans le dashboard
  const handleChange = event => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    //event.preventDefault();
    let dailGly = parseFloat(event.target.value);
    //localStorage.setItem('dashboard', JSON.stringify(dashboard));
    // dashboard.glycemie.dailyGlycemie = dailGly;
    // localStorage.setItem('dashboard', JSON.stringify(dashboard));
    if (uniteGlycemie === "mmol" ) {
      if (!tauxMmolValid(dailGly)) {
        setButtonPopup(true);
        document.getElementById("inputErreur").innerHTML = ("Veuillez entrer un taux de glycémie compris entre " + minMmol + " et " + maxMmol + " mmol/L");
      }else {
        dashboard.glycemie.dailyGlycemie = dailGly;
        localStorage.setItem('dashboard', JSON.stringify(dashboard));
        
        handleChange2();
      }
    }else if(uniteGlycemie === "mg") {
      if (!tauxMgValid(dailGly)) {
        setButtonPopup(true);
        document.getElementById("inputErreur").innerHTML = ("Veuillez entrer un taux de glycémie compris entre " + minMg + " et " + maxMg + " mg/dL");
      }else {
        dailGly = mgToMmol(dailGly);
        //dailGly = dailGly * 0.0555;
        dashboard.glycemie.dailyGlycemie = dailGly;
        localStorage.setItem('dashboard', JSON.stringify(dashboard));
        handleChange2();


      }
    }
  }




//met a jour la glycemie dans la base de donnees
  const handleChange2 = event => {
    //event.preventDefault();
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    const userUID = localStorage.getItem('userUid');
    //popupDate = moment(popupDate).toDate();
    //popupDate = moment(popupDate).format('YYYY-MM-DD');
    //var time = currentDate.startDate.getHours() + ':'+currentDate.startDate.getMinutes() + ':'+ currentDate.startDate.getSeconds();
    
    //dashboard.glycemie.popupTime = popupTime;
    //localStorage.setItem('dashboard', JSON.stringify(dashboard));
    firebase.database().ref('dashboard/' + userUID + "/" + popupDate).update(dashboard);
  }

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block" : divElt.style.display = "none";
    }
  }

  const [reloadGraph, setReloadGraph] = useState(false)


  // fonction qui de valide le taux de glycemie entre 500mg/dl et 4000mg/dl

  //fonction qui sert a afficher une fenetre popup aprés le clique sur le bouton rouge du module glycemie
  function Popup(props) {
    //console.log('ladate Avant changement')
    //console.log(laDate)
    //console.log(popupDate);
    // handleTimeWait();
    return (props.trigger) ? (

        <div className='popup'>
          <div className='popup-inner'>
            {props.children}
          </div>
        </div>
    ) : "";
  }

  return (
      <div className="Glycemie" >
        {/*fenetre Popup apres clique sur bouton rouge de glycemie*/}
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup} className="popupClass">
          <IonContent>
            <form>
              <ion-grid>
                <ion-row>
                  <ion-col size="5">
                    <IonItem lines="none" className="fontPolice">
                      <IonLabel >{translate.getText("GLYC_TITLE")}</IonLabel>
                    </IonItem>
                  </ion-col>
                  <ion-col size="2">
                    <IonItem lines="none" className="fontPolice inputClass">
                      <IonInput type="tel" value={dailyGlycemie} onIonChange = {handleChange}>
                      </IonInput>
                    </IonItem>

                  </ion-col>
                  <ion-col size="5">
                    <IonItem lines="none" className="fontPolice">
                      <IonSelect interface="popover" value={uniteGlycemie} onIonChange= {handleUniteGlycemie} className="listeDeroulante"  >
                        <IonSelectOption value="mmol" selected>mmol/L</IonSelectOption>
                        <IonSelectOption value="mg" >mg/dL</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </ion-col>
                  <span id = "inputErreur"></span>
                </ion-row >
                <ion-row>
                  <ion-col>
                    <IonItem lines="none" className="fontPolice">
                      <IonLabel><strong>{translate.getText("MOMENT_GLY")}</strong></IonLabel>
                    </IonItem>
                  </ion-col>
                </ion-row>
                <ion-grid>
                  <IonRadioGroup>
                    <ion-row>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("AULEVER_GLYC")}</IonLabel>
                          <IonRadio value="Au lever" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("COUCHE_GLYC")}</IonLabel>
                          <IonRadio value="Au coucher" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("NUIT_GLYC")}</IonLabel>
                          <IonRadio value="La nuit" />
                        </IonItem>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("DEJ_GLYC")}</IonLabel>
                        </IonItem>
                      </ion-col>
                      <ion-col col-6>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("AVANT")}</IonLabel>
                          <IonRadio value="Avant petit dejeuner" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("APRES")}</IonLabel>
                          <IonRadio value="Apres petit dejeuner" />
                        </IonItem>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("LUNCH")}</IonLabel>
                        </IonItem>
                      </ion-col>
                      <ion-col col-6>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("AVANT")}</IonLabel>
                          <IonRadio value="Avant lunch" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("APRES")}</IonLabel>
                          <IonRadio value="Apres lunch" />
                        </IonItem>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("SOUPER")}</IonLabel>
                        </IonItem>
                      </ion-col>
                      <ion-col col-6>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("AVANT")}</IonLabel>
                          <IonRadio value="Avant souper" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("APRES")}</IonLabel>
                          <IonRadio value="Apres souper" />
                        </IonItem>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("COLLATION")}</IonLabel>
                        </IonItem>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("AVANT_MIDI")}</IonLabel>
                          <IonRadio value="Collation-avant-midi" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("APRES_MIDI")}</IonLabel>
                          <IonRadio value="Collation-apres-midi" />
                        </IonItem>
                      </ion-col>
                      <ion-col>
                        <IonItem lines="none" className="fontPolice">
                          <IonLabel>{translate.getText("SOIREE")}</IonLabel>
                          <IonRadio value="Collation-soiree" />
                        </IonItem>
                      </ion-col>
                    </ion-row>
                  </IonRadioGroup>
                </ion-grid>
                <ion-row>
                  <ion-col>
                    <IonItem className="borderDateHeure">
                      <IonDatetime
                          className="date-format dateHeureClass"
                          //value={new Date(props.currentDate.startDate).toISOString()}
                          display-format='YYYY-MM-DD'
                          monthShortNames={translate.getText("ABBREVIATION_MONTH")}
                          style={{ color: "#707070" }}
                          data-testid = "date"
                          placeholder={popupDate}
                          onIonChange = {handleDateChange}
                          //onIonChange={ev => setPopupDate(ev.detail.value)}
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
                          onIonChange={ev => setPopupTime(ev.detail.value)}
                          data-testid = "time"
                          placeholder={popupTime}
                          //onIonChange = {ev => setPopupTime(new Date(ev.target.value).toISOString())}
                      />
                      <IonIcon className="date-icon iconeDateHeure" icon={time} />
                    </IonItem>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <IonButton className="ion-margin-top boutonAjout" onIonChange={handleChange2} expand="block" type="submit" > {translate.getText("SUPPL_ADD_SELECT")} </IonButton>
            </form>
          </IonContent>

        </Popup>

        <IonItem lines="none" className="globalModule" >
          <IonGrid>
            <IonRow className="">
              <IonCol size-md="1" size-sm="3" size-xs="3">
                <div className="avatarClass" >
                  {/*<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="15" height="15">*/}
                  {/*  <circle cx="60" cy="140" r="60" fill="white" />*/}
                  {/*</svg>*/}
                  <IonButton className="boutonClasse" onClick={() => setButtonPopup(true)}>
                    <IonAvatar slot="start" >
                      <img src="/assets/glycemie.png" alt="" />
                    </IonAvatar>
                  </IonButton>
                </div>
              </IonCol>
              <IonCol size-md="11" size-sm="9" size-xs="9">
                <IonItem lines="none" className="divTitress" >
                  <div className="labelClass" >
                    <IonButton className="boutonGlycemie" href="/detailGlycemie">
                      <IonLabel >
                        <h2><b>{translate.getText("GLYC_TITLE")}</b></h2>
                      </IonLabel>
                    </IonButton>
                    <div className="cibleClasse">
                      <span> {translate.getText("CIBLE_GLY")} : [4.5 - 6.5]</span>
                    </div>
                  </div>

                  <div className="detailsClass">
                    <div>
                      <span id="element">{dailyGlycemie}</span>
                    </div>
                    <div>
                      <span>mmol/L </span>
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
export default Glycemie;