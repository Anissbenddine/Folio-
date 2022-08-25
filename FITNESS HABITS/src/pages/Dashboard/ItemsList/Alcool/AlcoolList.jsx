import React, {useState, useEffect} from "react"
import { IonInput, IonButton, IonIcon, IonLabel, IonItem, IonAvatar, IonCol} from '@ionic/react';
import { arrowDropdownCircle, trash, addCircle, removeCircle} from 'ionicons/icons';
import { DateTime } from "luxon";
import { getLang } from "../../../../translate/Translator"

import '../../../Tab1.css';
import AlcoolItem from './AlcoolItem';

const AlcoolList = (props) => {
  //---- Header alcool ---------
  const [, setDailyTarget] = useState(props.alcool.dailyTarget);
  const [alcool, setAlcool] = useState(props.alcools);
  const [globalConsumption, setGlobalConsumption] = useState(props.globalConsumption);
  const [alcoolService] = useState(props.alcoolService);
  
  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.alcool.dailyTarget);
  }, [props.alcool.dailyTarget])

  useEffect(() => {
    setGlobalConsumption(props.globalConsumption);
  }, [props.globalConsumption])

  useEffect(() => {
    setAlcool(props.alcools);
  }, [props.alcools])
  
  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      divElt.style.display = (!divElt.style.display || divElt.style.display === "none")
        ? "block"
        : "none";
    }
  }

//---- Items alcool ---------
  const [hydrateToEdit, setHydrateToEdit] = useState(undefined);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);

  const totalConsumption = ()=>{
    var array = [...alcool];
    var sum = 0;
    var consumption = 0;

    for (let item of array){
      consumption = item.consumption;
      sum += consumption; 
    }

    setGlobalConsumption(sum);
    return sum
  }

  const DailyConsumptionIncrement = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);

    if (index !== 0) {
      array[index] = item;
    }

    array[item].consumption += 1;

    updateCacheAndBD(array);
    alcoolService.dashboard.updateGlobalConsumption(totalConsumption(), currentDate);
  }

  const DailyConsumptionDecrementAlcool = (item)=>{  
    var array = [...alcool];
    const index = array.findIndex((event) => event.id === item.id);  

    if (index !== 0) {
      array[index] = item;
    }

    if (array[item].consumption >=1){
      array[item].consumption -= 1;
    }

    updateCacheAndBD(array);
    alcoolService.dashboard.updateGlobalConsumption(totalConsumption(), currentDate);
  }

  const deleteItemAlcool = (item) => {
    var array = [...alcool];
    var sum = 0;
    var consumption = 0;
    const index = array.findIndex((e) => e.id === item.id);

    if (index === -1) {
      array.splice(item, 1);
    } else {
      array[item] = item;
    }

    setAlcool(array);  
    for (let value of array){
      consumption = value.consumption;
      sum += consumption; 
    }
    setGlobalConsumption(sum);
    alcoolService.dashboard.updateGlobalConsumption(sum, currentDate);
    updateCacheAndBD(array);
  }

  const saveItem = (item) => {
    var array = [...alcool];
    const index = array.findIndex((e) => e.id === item.id);

    if (index === -1) {
      array.unshift(item);
    } else {
      array[index] = item;
    }

    setAlcool (array);
    closeItemContainer();
    updateCacheAndBD(array);
    checkNotifications();
  }

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  const updateCacheAndBD = (alcools) => {
    alcoolService
      .dashboard
      .updateAlcools(alcools, currentDate)
      .then(checkNotifications);
  }

  const closeItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setHydrateToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const checkNotifications = () => {
    // Obtenir les préférences de l'utilisateur
    alcoolService
      .settings
      .getAlcool()
      .then(settings => {
        settings.limitConsom.notificationMessage = getNotificationMsg()
        getConsommationBackToMonday(settings);
      });
  }

  const getConsommationBackToMonday = (alcoolSettings) =>
    alcoolService.dashboard.getConsommations()
      .then(consommations => {
        const date = new Date();

        // Vérifier s'il respecte ses consommations journalières
        respectDailyConsumption(alcoolSettings, consommations, date);

        // Vérifier s'il respecte ses consommations hebdomadaires
        // Obtenir les formats de date de la semaine
        respectWeeklyConsumption(alcoolSettings, consommations, date);

        // Vérifier s'il respecte ses jours de consommation de suite 
        respectConsecutiveConsumption(alcoolSettings, consommations, date);
      });
   
  const respectDailyConsumption = (alcoolSettings, consommations, date) => {
    const dailyCount = getConsumptionsCount(consommations, date);

    if (alcoolSettings.notifications.active && 
      alcoolSettings.limitConsom && 
      alcoolSettings.limitConsom.dailyTarget && 
      dailyCount > alcoolSettings.limitConsom.dailyTarget
    ) {
      displayNotification(getLang(), alcoolSettings.limitConsom.notificationMessage);
    }
  }

  const respectWeeklyConsumption = (alcoolSettings, consommations, date) => {
    let weeklyCount = 0;
      for (let i = 0; i < date.getDay(); i++) {
        const dateDiff = DateTime.fromJSDate(date).minus({ days: i}).toJSDate();
        weeklyCount += getConsumptionsCount(consommations, dateDiff)
      }
      if(alcoolSettings.notifications.active && alcoolSettings.limitConsom &&
          alcoolSettings.limitConsom.weeklyTarget && weeklyCount > alcoolSettings.limitConsom.weeklyTarget) {
        displayNotification(getLang(), alcoolSettings.limitConsom.notificationMessage)
      }
  }

  const respectConsecutiveConsumption = (alcoolSettings, consommations, date) => {
    if(alcoolSettings.limitConsom && alcoolSettings.limitConsom.sobrietyDays)
    {
      for (let i = 0; i < alcoolSettings.limitConsom.sobrietyDays; i++) {
        const dateDiff = DateTime.fromJSDate(date).minus({ days: i}).toJSDate();
        if(getConsumptionsCount(consommations, dateDiff) === 0) {
          break;
        }
      }
    }
  }

  const getDbDate = (date) => {
    return date.getDate().toString() + (date.getMonth() + 1).toString() + date.getFullYear().toString();
  }

  const getNotificationMsg = () => alcoolService.getNotificationMsg(getLang());

  const getConsumptionsCount = (consommations, date) => {
    let count = 0;
    const code = getDbDate(date);
    if(consommations[code] && consommations[code].alcool && consommations[code].alcool.alcools)
    {
      for (const alc of consommations[code].alcool.alcools) {
        if(alc.consumption) {
          count += alc.consumption;
        }
      }
    }
    return count;
  }

  const displayNotification = (header, message) => {
    // Notification already being displayed check
    if (document.getElementsByTagName('ion-toast').length > 0) {
      return
    }

    const toast = document.createElement('ion-toast');
    let header_msg
    let close_msg
    switch (header) {
      case "en": 
        header_msg = "Too much alcohol?"
        close_msg = "Close"
            break;
      case "fr": 
        header_msg = "Trop d'Alcool?"
        close_msg = "Fermer"
            break;
      case "es": 
        header_msg = "¿Demasiado alcohol?"
        close_msg = "Cerrar"
    }

    toast.header = header_msg;
    toast.message = message;
    toast.duration = 5000;
    toast.position = 'top'
    toast.cssClass = 'toast-alcool'
    toast.buttons = [close_msg];

    document.body.appendChild(toast);
    toast.present();
  }

  return (
  <div>
    <IonItem className="divTitre8">
      <IonAvatar slot="start">
        <img src="/assets/Alcool.jpg" alt=""/>
      </IonAvatar>
      <IonLabel><h2><b>Alcool</b></h2></IonLabel>
      <IonInput className='inputTextGly' value = {globalConsumption} readonly></IonInput> 
      <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV8")}/>
    </IonItem>          
    <div id="myDIV8">
    <div> 
          <div className="divHyd">
            <div className="sett">
              { alcool.map((alco, index) => (      
                <IonItem className="divTitre11" key={alco.id}>
                  <IonCol size="1">
                  </IonCol>
                  <IonLabel className="nameDscripDashboard"><h2><b>{alco.name}</b></h2></IonLabel>      
                  <IonButton className="trashButton" color="danger" size="small" onClick={()=>DailyConsumptionDecrementAlcool(index)}>
                    <IonIcon  icon={removeCircle} />
                  </IonButton>
                  <IonCol size="2" >
                    <IonInput className='inputTextDashboard' value = {alco.consumption} readonly></IonInput>  
                  </IonCol>
                  <IonButton className='AddButtonHydr' color="danger" size="small" onClick={()=>DailyConsumptionIncrement(index)}>
                    <IonIcon  icon={addCircle} />
                  </IonButton>
                  <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItemAlcool(index)}>
                    <IonIcon  icon={trash} />
                  </IonButton>
                </IonItem>
                ))
              } 
            </div>
          </div>
          <div className="ajoutBotton">    
            <IonButton className="ajoutbreuvage1" color="danger" size="small" onClick={() => openAddItemContainer()}>
            <IonIcon icon={addCircle}/><label className="labelAddItem">breuvage</label></IonButton>
          </div>
          {itemContainerDisplayStatus && <AlcoolItem close={closeItemContainer} item={hydrateToEdit} save={(itemDashAlcool) => saveItem(itemDashAlcool)}/>}   
        </div>        
    </div>
  </div>  
  );
}
export default AlcoolList;