import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import NourrCereales from '../../NourrCereales';
import firebase from 'firebase'

import '../../../Tab1.css'
import HeadItems from '../HeadItems';

const NourriCereales = (props) => {
  
  const [dailyTarget, setDailyTarget] = useState(props.cereales.dailyTarget);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.cereales.dailyTarget);
  }, [props.cereales.dailyTarget])

  const accorCereales = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const handleDailyTargetChangeCereales = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' };
    setDailyTarget({ ...dailyTarget, [name]: value});
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.cereales.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  return (
    <div>
      {/* Entête cereales */}
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
          <img src="/assets/grain.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Féculents</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accorCereales("myDIV5")} />
      </IonItem>

      {/* Détails cereales */}
      <div id="myDIV5">
      <HeadItems/>
              
        {/* Items cereales */}
        <NourrCereales cereales={props.cereales.cereales} />

        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type= 'number' name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChangeCereales}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChangeCereales}>
              <option value9="-1"></option>
              <option value9="gr">gr</option>
              <option value9="oz">oz</option>
              <option value9="ml">ml</option>
              <option value9="tasse">tasse</option>
              <option value9="unite">unité</option>
            </select>
          </IonItem>
        </IonRadioGroup>  
      </div>
    </div>           
  );
}
export default NourriCereales;
