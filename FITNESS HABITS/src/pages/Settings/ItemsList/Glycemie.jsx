import React, {useState, useEffect} from "react"
import { IonLabel, IonItem, IonAvatar, IonIcon} from '@ionic/react';
import {arrowDropdownCircle} from "ionicons/icons";

import '../../../pages/Tab1.css';

const Glycemie = (props) => {

  const [currentDate, setCurrentDate] = useState({startDate:props.currentDate});

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  return (
    <div>
      <IonItem className="divTitre4" href="/Glycemie">
      <IonAvatar slot="start">
        <img src="/assets/Gly.jpg" alt=""/>
      </IonAvatar>
      <IonLabel>
        <h2><b>Glycémie</b></h2>
      </IonLabel>
      <IonIcon className="arrowDashItem" icon={arrowDropdownCircle}/>
    </IonItem>
    </div>   
  );
}
export default Glycemie;