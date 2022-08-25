import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import NourrProteines from '../../NourrProteines';
import firebase from 'firebase'

import '../../../Tab1.css'

import HeadItems from '../HeadItems';

const NourriProteines = (props) => {
  
  const [dailyTarget, setDailyTarget] = useState(props.proteines.dailyTarget);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.proteines.dailyTarget);
  }, [props.proteines.dailyTarget])

  const accorProteines = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const handleDailyTargetChangeProteines = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' };
    setDailyTarget({ ...dailyTarget, [name]: value});
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.proteines.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  return (
    <div>
      {/* Entête proteines */}
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
          <img src="/assets/Proteines.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Protéines</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accorProteines("myDIV3")} />
      </IonItem>

      {/* Détails proteines */}
      <div id="myDIV3">
        <HeadItems/>
              
        {/* Items proteines */}
        <NourrProteines proteines={props.proteines.proteines} />

       
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type= 'number' name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChangeProteines}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChangeProteines}>
              <option value12="-1"></option>
              <option value12="gr">gr</option>
              <option value12="oz">oz</option>
              <option value12="ml">ml</option>
              <option value12="tasse">tasse</option>
              <option value12="unite">unité</option>
            </select>
          </IonItem>
        </IonRadioGroup>  
      </div>
    </div>             
  );
}
export default NourriProteines;
