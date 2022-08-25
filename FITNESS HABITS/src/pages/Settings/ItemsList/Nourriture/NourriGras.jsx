import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import NourrGras from '../../NourrGras';
import firebase from 'firebase'

import '../../../Tab1.css'
import HeadItems from '../HeadItems';


const NourriGras = (props) => {
  
  const [dailyTarget, setDailyTarget] = useState(props.gras.dailyTarget);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.gras.dailyTarget);
  }, [props.gras.dailyTarget])

  const accorGras = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }
  }

  const handleDailyTargetChangeGras = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : (name === 'value') ? 0 : '' };
    setDailyTarget({ ...dailyTarget, [name]: value });
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.gras.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  return (
    <div>
      {/* Entête Gras */}
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
          <img src="/assets/Gras.jpg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Gras</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accorGras("myDIV2")} />
      </IonItem>

      {/* Détails Gras */}
      <div id="myDIV2">
   <HeadItems/>
              
        {/* Items Gras */}
        <NourrGras gras={props.gras.gras} />

       
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3>Cible quotidienne</h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type= 'number' name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChangeGras}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChangeGras}>
              <option value10="-1"></option>
              <option value10="gr">gr</option>
              <option value10="oz">oz</option>
              <option value10="ml">ml</option>
              <option value10="tasse">tasse</option>
              <option value10="unite">unité</option>
            </select>
          </IonItem>
        </IonRadioGroup>  
      </div>
    </div>              
  );
}
export default NourriGras;
