import React from "react"
import { IonInput, IonList, IonRow, IonIcon, IonLabel, IonItem, IonAvatar, IonCol, IonButton} from '@ionic/react';

import './pages/Tab1.css';

const Proteines = () => {

  const accor = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      (!divElt.style.display || divElt.style.display === "none") ? divElt.style.display = "block":divElt.style.display = "none";
    }    
  }
  return (

        <IonList>
          <IonItem className="divTitre1" id="divTitre1">
            <IonAvatar slot="start">
              <img src="/assets/Hydratation.jpeg" alt=""/>
            </IonAvatar>
            <IonLabel>
              <h2><b>Hydratation</b></h2>
            </IonLabel>
            <IonInput className='inputTextGly' readonly color="danger" value="TODO"></IonInput>
            <IonIcon className="arrowDashItem" icon={""} onClick={() => accor("myDIV1")}/>
          </IonItem>
          <div id="myDIV1">       
            <IonItem className='eauItem'>     
              <IonRow>
                <IonCol size="4">
                  <IonLabel className = 'dashEau'><h3>Eau 250ml x</h3></IonLabel></IonCol>
                <IonCol size="1" >
                  <IonInput className='inputTextEau' color="danger" value="" placeholder="______"></IonInput>  
                </IonCol>
                <IonCol size="3">
                  <IonLabel className = 'dashPortionEau'><h3>portions</h3></IonLabel></IonCol>
                  <IonCol className="plusMoinsBotton" size="4" >
                    <IonButton color="light">+</IonButton> 
                    <IonButton color="light">-</IonButton> 
                    </IonCol>
              </IonRow>
            </IonItem>
            <select id="materialSelect">
              <option value="-1">Autre breuvage</option>
              <option value="gr">Café</option>
              <option value="oz">Lait</option>
              <option value="ml">Tisane</option>
              <option value="tasse">Jus de pomme</option>
              <option value="unite">Soda diète</option>
            </select>
          </div>          
        </IonList>    
  );
}
export default Proteines;