import React, {useState, useEffect} from 'react';
import { IonCol, IonItem, IonIcon, IonLabel, IonRadioGroup, IonInput, IonAvatar } from '@ionic/react';
import { arrowDropdownCircle } from 'ionicons/icons';
import Hydrate from '../Hydrate'
import firebase from 'firebase'

import '../../../pages/Tab1.css';
import HeadItems from './HeadItems';

//Added to translator
import * as translate from '../../../translate/Translator';

const Hydratation = (props) => {
  const [dailyTarget, setDailyTarget] = useState(props.hydratation.dailyTarget);

  // update state on prop change
  useEffect(() => {
    setDailyTarget(props.hydratation.dailyTarget);
  }, [props.hydratation.dailyTarget])

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      if(!divElt.style.display || divElt.style.display === "none") {
         divElt.style.display = "block"
      } else {
        divElt.style.display = "none";
      }
    }
  }

  const handleDailyTargetChange = event => {
    const userUID = localStorage.getItem('userUid');
    const { name, value } = event.target;
    let retval;
    if (name === 'value') {
      retval = 0;
    } else {
      retval = '';
    }
    const updatedDailyTarget = { ...dailyTarget, [name]: value ? value : retval };
    setDailyTarget({ ...dailyTarget, [name]: value });
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.hydratation.dailyTarget= updatedDailyTarget;
    localStorage.setItem('settings', JSON.stringify(settings));
    firebase.database().ref('settings/'+userUID).update(settings);
  };

  return (
    <div>
      {/* Entête hydratation */}
      <IonItem className="divTitre1">
        <IonAvatar slot="start">
          <img src="/assets/Hydratation.jpeg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>{translate.getText('HYDR_TITLE')}</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => accor("myDIV1")} />
      </IonItem>

      {/* Détails hydratation */}
      <div id="myDIV1">
      <HeadItems/>
              
        {/* Items hydratation */}
        <Hydrate hydrates={props.hydratation.hydrates} />
      
        {/* Cible quotidienne */}
        <IonRadioGroup>
          <IonItem className="cibleQuotid">
            <IonCol size="1"></IonCol>
            <IonLabel className = 'cibleTitle'><h3> {translate.getText('HYD_TITLE_TARGET')} </h3></IonLabel> 
            <IonCol size="2">
              <IonInput id = 'cibleQtte' type = "number" name="value" value={dailyTarget.value} onIonChange={handleDailyTargetChange}></IonInput>  
            </IonCol>
            <select id="materialSelectCibleQuot" name="unit" value={dailyTarget.unit} onChange={handleDailyTargetChange}>
              <option value8="-1"></option>
              <option value="gr">{translate.getText('UNIT_GR')}</option>
              <option value="oz">{translate.getText('UNIT_OZ')}</option>
              <option value="ml">{translate.getText('UNIT_ML')}</option>
              <option value="tasse">{translate.getText('UNIT_CUP')}</option>
              <option value="unite">{translate.getText('UNIT_TEXT')}</option>
            </select>
          </IonItem>
        </IonRadioGroup>  
      </div>
    </div>            
  );
}
export default Hydratation;