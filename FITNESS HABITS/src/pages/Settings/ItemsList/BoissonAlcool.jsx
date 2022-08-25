import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonToggle, IonLabel, IonRadioGroup, IonInput, IonAvatar, IonItemGroup, IonCheckbox, IonTextarea, IonRow } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import Alcool from '../Alcool'

import '../../../pages/Tab1.css';
import HeadItems from './HeadItems';


const BoissonAlcool = (props) => {
  
  const [notifications, setNotifications] = useState(props.alcool.notifications);
  const [dailyTarget, setDailyTarget] = useState(props.alcool.dailyTarget);
  const [limitConsom, setLimitConsom] = useState(props.alcool.limitConsom);
  const [gender, setGender] = useState(props.gender ? props.gender : '');
  const [alcoolService] = useState(props.alcoolService);
  const [profileService] = useState(props.profileService);
 
  // update state on prop change
  useEffect(() => defineGender());
  useEffect(() => {
    setNotifications(props.alcool.notifications);
    defineGender().then(() =>{
      setDailyTarget(props.alcool.dailyTarget); 
      setLimitConsom(props.alcool.limitConsom);
    });
  }, [props.alcool.limitConsom.educAlcool, props.alcool.dailyTarget, props.alcool.limitConsom, props.alcool.notifications])

  const accorAlcool = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      if(!divElt.style.display || divElt.style.display === "none") divElt.style.display = "block"
      else divElt.style.display = "none";
    }
  }

  const handleOnNotifications = event => {
    const updatedNotifications = { ...notifications, "active": event.detail.checked };
    setNotifications(updatedNotifications);
    alcoolService.settings.updateNotifications(updatedNotifications);
  }

  const handleDailyTargetChangeAlcool = event => {
    const { name, value } = event.target;

    let nameValue = '';
    if(value) nameValue = value;
    else nameValue = (name === 'value') ? 0 : ''

    const updatedDailyTarget = { ...dailyTarget, [name]: nameValue };
    setDailyTarget({ ...dailyTarget, [name]: value});

    alcoolService.settings.updateDailyTarget(updatedDailyTarget);
  };

  const handleOnEducAlcool = event => {
    const updatedLimitConsom = { ...limitConsom, "educAlcool": event.detail.checked };
    updatedLimitConsom.dailyTarget = 3;
    if(event.detail.checked){
      if(gender === "H" || gender === "")
      {
        updatedLimitConsom.dailyTarget = 3;
        updatedLimitConsom.weeklyTarget = 15;
      } else {
        updatedLimitConsom.dailyTarget = 2;
        updatedLimitConsom.weeklyTarget = 10;
      }
    } 
    setLimitConsom(updatedLimitConsom);
    alcoolService.settings.updateLimitConsom(updatedLimitConsom);
  };

  const handleOnLimitConsom = event => {
    const { name, value } = event.target;

    let nameValue = '';
    if(value) nameValue = value;
    else nameValue = (name === 'value') ? 0 : ''

    const updatedLimitConsom = { ...limitConsom, [name]: nameValue };
    setLimitConsom({ ...limitConsom, [name]: value});
    alcoolService.settings.updateLimitConsom(updatedLimitConsom);
  };

  const defineGender = async () => 
    profileService
      .get()
      .then(profile => {
        console.log('WOLOLO')
        console.log(profileService);
        if (profile) {
          setGender(profile.gender);
        }
      });

  return (
    <div>
      {/* Entête Alcool */}
      <IonItem className="divTitre8">
        <IonAvatar slot="start">
          <img src="/assets/Alcool.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Alcool</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accorAlcool("myDIV7")} />
      </IonItem>

      {/* Détails Alcool */}
      <div id="myDIV7">
     <HeadItems/>
              
        {/* Items Alcool */}
        <Alcool 
          alcoolService={alcoolService}
          alcools={props.alcool.alcools}
        />
       
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type= 'number' min='0' name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChangeAlcool}></IonInput>  
            </IonCol>
          </IonItem>
        </IonRadioGroup>

        {/* Activer les notifications*/}
        <IonItemGroup className="notifHeader">
          <IonItem>
            <IonCol size="1"></IonCol>
            <IonCol size="5" className="notifHeader"><h3>Activer les notifications</h3></IonCol>
            <IonCol size='3'></IonCol>
            <IonCol size='3'><IonToggle id="notificationToggle" color="dark" name="notifications" onIonChange={handleOnNotifications} checked={notifications.active} /></IonCol>
          </IonItem>
        </IonItemGroup>

        {/* Limites de consommations*/}
        <IonItemGroup className="limiteConsom" 
hidden={!notifications.active}
        >
          <IonItem>
            <IonCol size="1"></IonCol>
            <IonLabel className='cibleTitle'><h3>Limites de consommations</h3></IonLabel> 
          </IonItem>
          <IonItem>
            <IonCol size="3">
              <IonInput id='dailyTargetToggle' type='number' min='0' className='inputConsom' name="dailyTarget" onIonChange={handleOnLimitConsom} 
disabled={limitConsom.educAlcool} 
value={limitConsom.dailyTarget}
              ></IonInput>
            </IonCol>
            <IonCol size="3">
              <IonLabel className = "notifHeader" position="fixed"><h3>par jour</h3></IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size="3">
              <IonInput id='weeklyTargetToggle' type='number' min='0' className='inputConsom' name="weeklyTarget" onIonChange={handleOnLimitConsom} 
disabled={limitConsom.educAlcool} 
value={limitConsom.weeklyTarget}
              ></IonInput>
            </IonCol>
            <IonCol size="2">
              <IonLabel className = "notifHeader" position="fixed"><h3>par semaine</h3></IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size="1"/>
            <IonCol size="2">
              <IonLabel className = "notifHeader" position="fixed"><h3>Maximum</h3></IonLabel>
            </IonCol>
            <IonCol size="3">
              <IonInput type='number' min='0' max='7' className='inputConsom' name="sobrietyDays" onIonChange={handleOnLimitConsom} 
value={limitConsom.sobrietyDays}
              ></IonInput>
            </IonCol>
            <IonCol size="5">
              <IonLabel className = "notifHeader"><h3>jour/s par semaine</h3></IonLabel>
            </IonCol>
          </IonItem>
          <IonItem>
            <IonCol size='1'></IonCol>
            <IonCol size='1'>
              <IonCheckbox id="educAlcoolToggle" onIonChange={handleOnEducAlcool} 
checked={limitConsom.educAlcool} 
value={limitConsom.educAlcool}
              ></IonCheckbox>
            </IonCol>
            <IonCol size='12'>
              <IonLabel className = "notifHeader" ><h2>Utiliser les recommandations</h2><h2>d'Educ'alcool</h2></IonLabel>
            </IonCol>
          </IonItem>
          <IonRow>
            <IonCol size="12">
              <IonLabel position="center" className = "notifHeader"><h3>Message de notification</h3></IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="1"/>
            <IonCol size="10">
              <IonTextarea position="center" id="message_notif" rows={4} clear-on-edit="true" className="messagenotif" name="notificationMessage" onIonChange={handleOnLimitConsom} 
value={limitConsom.notificationMessage}
              ></IonTextarea>
            </IonCol>
          </IonRow>
        </IonItemGroup>
      </div>
    </div>            
  );
}
export default BoissonAlcool;