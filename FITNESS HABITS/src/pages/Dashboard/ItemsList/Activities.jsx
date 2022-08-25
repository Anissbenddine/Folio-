import React, {useEffect, useState} from "react"
import firebase from 'firebase'
import { IonInput, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';
import {arrowDropdownCircle} from 'ionicons/icons';

import '../../Tab1.css';

const Activities = (props) =>  {

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});
  const [heure, setHeure] = useState(props.heures);
  const [minute, setMinute] = useState(props.minutes);
  const [activities, setActivities] = useState (props.activities);

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }    
  }

  useEffect(() => {
    setHeure(props.heures);
  }, [props.heures])

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setActivities(props.activities);
  }, [props.activities])

  useEffect(() => {
    setMinute(props.minutes);
  }, [props.minutes])

  const handleChangeMinute = event => {
    const activitiesMinute = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.activities.minute = activitiesMinute;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setMinute(activitiesMinute);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }
  
  const handleChangeHeure = event => {
    const activitiesHeure = event.target.value;
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.activities.heure= activitiesHeure;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    setHeure(activitiesHeure);
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  return (
    <div>
      <IonItem className="divTitre6">
        <IonAvatar slot="start">
          <img src="/assets/Running.jpg" alt=""/>
        </IonAvatar>
        <IonLabel><h2><b>Activités</b></h2></IonLabel>
        <IonInput className='inputTextGly' value={heure+":"+minute} readonly></IonInput>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV6")}/>     
      </IonItem>
      <div id="myDIV6">
      <IonItem>     
      <IonRow>
        <IonCol size="2">
          <IonLabel className = 'joggingTitle'><h3>Durée</h3></IonLabel>
        </IonCol>
        <IonCol size="2" >
          <IonInput className='inputTextActivities' type= "number" value={heure} placeholder="______" onIonChange={handleChangeHeure}></IonInput>  
        </IonCol>
        <IonCol className="activitieCheck" size="3" >
          <IonButton classname = "buttonActivities" color="light" onClick={""}>HH</IonButton> 
        </IonCol>
        <IonCol size="2" >
          <IonInput className='inputTextActivities' type= "number" value={minute} placeholder="______" onIonChange={handleChangeMinute}></IonInput>  
        </IonCol>
        <IonCol className="activitieCheck"  size="3" >
          <IonButton classname = "buttonActivities" color="light" onClick={""}>Min</IonButton> 
        </IonCol>
      </IonRow>
    </IonItem>
      </div>
    </div>    
  );
}
export default Activities;