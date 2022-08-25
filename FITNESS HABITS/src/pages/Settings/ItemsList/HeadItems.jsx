import React from 'react';
import { IonRow, IonCol, IonItem, IonIcon, IonLabel} from '@ionic/react';
import { star } from 'ionicons/icons';
import '../../../pages/Tab1.css';

//Added to translator
import * as translate from '../../../translate/Translator';

const HeadItems = () => {

  const desc = translate.getText('FOOD_MODULE', ['functions', 'add_description', 'placeholder']);
  const taille = translate.getText('SIDEBAR_LBL_PORTION_SIZE');
  const unitMesure = translate.getText('SIDEBAR_LBL_UNIT');

  return (    
    <IonItem className="descripItem">     
    <IonRow>
      <IonCol size="1">
        <IonIcon  className="target" icon={star}/></IonCol>
      <IonCol size="3">
        <IonLabel className = 'description'><h3>{ desc }</h3></IonLabel></IonCol>
      <IonCol size="2" >
        <IonLabel className = 'taillePortion'><h3>{ taille } </h3></IonLabel>
      </IonCol>
      <IonCol size="2" >
        <IonLabel className = 'uniteMesure'><h3>{ unitMesure }</h3></IonLabel>
      </IonCol>
      <IonCol size="4" >
      <div>
        <img className="" src="/assets/Triangle.png" alt="" />   
      </div>
      </IonCol>
    </IonRow>                     
  </IonItem>        
  );
}
export default HeadItems;