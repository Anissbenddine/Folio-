import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import NourrLegumes from '../../NourrLegumes';
import firebase from 'firebase'

import '../../../Tab1.css'
import HeadItems from '../HeadItems';

const NourriLegumes = (props) => {
  
  const [dailyTarget, setDailyTarget] = useState(props.legumes.dailyTarget);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.legumes.dailyTarget);
  }, [props.legumes.dailyTarget])

  const accorGras = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const handleDailyTargetChangeLegumes = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' };
    setDailyTarget({ ...dailyTarget, [name]: value });
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  return (
    <div>
      {/* Entête legumes */}
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
          <img src="/assets/Legumes.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Légumes et Fruits</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" onClick={() => accorGras("myDIV4")} icon={arrowDropdownCircle} />
      </IonItem>

      {/* Détails legumes */}
      <div id="myDIV4">
      <HeadItems/>
              
        {/* Items legumes */}
        <NourrLegumes legumes={props.legumes.legumes} />

       
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type= 'number' name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChangeLegumes}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChangeLegumes}>
              <option value11="-1"></option>
              <option value11="gr">gr</option>
              <option value11="oz">oz</option>
              <option value11="ml">ml</option>
              <option value11="tasse">tasse</option>
              <option value11="unite">unité</option>
            </select>
          </IonItem>
        </IonRadioGroup>  
      </div>
    </div>             
  );
}
export default NourriLegumes;
