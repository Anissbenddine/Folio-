import React from 'react';
import { IonItem, IonIcon, IonLabel, IonAvatar} from '@ionic/react';
import { arrowDropdownCircle,} from 'ionicons/icons';

import '../../../pages/Tab1.css';

const Supplements = () => {

  return (
    <div>
      {/* Entête suppléments */}
      <IonItem className="divTitre3">
        <IonAvatar slot="start">
          <img src="/assets/Supp.jpeg" alt=""/>
        </IonAvatar>
        <IonLabel>
          <h2><b>Suppléments et médicaments</b></h2>
        </IonLabel>
        <IonIcon className="arrowDashItem" icon={arrowDropdownCircle} onClick={""} />
      </IonItem>
                  
      {/* Entête alcool */}
      <div>
        <div id="myDIV6"></div>
      </div>
    </div>       
  );
}
export default Supplements;