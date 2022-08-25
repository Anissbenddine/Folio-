import React from 'react';
import { IonIcon, IonLabel } from '@ionic/react';
import {download, save} from 'ionicons/icons';
import '../Tab1.css';


const Export = () => {

  return (    
    <div>
    <IonIcon color="warning" className="save" icon={download} />
    <IonLabel className="text"><h3>Exporter</h3></IonLabel>
    </div> 
  );
}
export default Export;
