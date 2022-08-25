import { IonIcon, IonLabel, IonCol, IonItem, IonButton} from '@ionic/react';
import { star, trash, create } from 'ionicons/icons';
import React from 'react';

const supplements = (props)=>{
    return (
      <div>
        <IonItem className="divTitre33">
            {/* Attributs des items à créer */}
          <IonCol size="1"><IonIcon className='starFavoris' id={props.key} onClick={props.favoris} icon={star}/></IonCol>
          <IonLabel className="nameDscrip"><h2><b>{props.name}</b></h2></IonLabel>
          <IonLabel className="unitDescrip"><h2><b>{props.children}</b></h2></IonLabel>
            {/* les unités et check buttons */}                       
          <select id="materialSelectSupp"
          >
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <select id="materialSelectSupp" >
            <option value="-1"></option>
            <option value="Quotidien">Quotidien</option>
            <option value="Lundi">Lundi</option>
            <option value="Mardi">Mardi</option>
            <option value="Mercredi">Mercredi</option>
            <option value="Jeudi">Jeudi</option>
            <option value="Vendredi">Vendredi</option>
            <option value="Samedi">Samedi</option>
            <option value="Dimanche">Dimanche</option>
          </select>
          <select id="materialSelectSupp" >
            <option value="-1"></option>
            <option value="Levé">Levé</option>
            <option value="Déjeuner">Déjeuner</option>
            <option value="Av-Midi">Av-Midi</option>
            <option value="Lunch">Lunch</option>
            <option value="Ap-Midi">Ap-Midi</option>
            <option value="Souper">Souper</option>
            <option value="Soir">Soir</option>
          </select>                
          <IonButton className='editButton' color="danger" size="small" onClick={props.editEvent}>
            <IonIcon  icon={create} />
          </IonButton> 
            {/* Bouton supprimer un item */}  
          <IonButton color="danger" size="small" onClick={props.delEvent}>
            <IonIcon  icon={trash} />
          </IonButton>
        </IonItem>
      </div> 
    );
}
export default supplements;
