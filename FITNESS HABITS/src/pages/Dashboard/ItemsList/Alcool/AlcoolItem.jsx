import React, {useState } from 'react'
import { IonInput, IonIcon, IonItem, IonCol} from '@ionic/react';
import { star} from 'ionicons/icons';
import uuid from 'react-uuid';

import '../../../Tab1.css';

const AlcoolItem = (props) => {

  const [itemDashAlcool, setItemDashAlcool] = useState({
    id: props.itemDashAlcool ? props.itemDashAlcool.id : uuid(),
    favoris: props.itemDashAlcool ? props.itemDashAlcool.favoris : false, 
    name:props.itemDashAlcool ? props.itemDashAlcool.name : '', 
    qtte:props.itemDashAlcool ? props.itemDashAlcool.qtte : 0, 
    proteine:props.itemDashAlcool ? props.itemDashAlcool.proteine : 0, 
    glucide:props.itemDashAlcool ? props.itemDashAlcool.glucide : 0, 
    fibre:props.itemDashAlcool ? props.itemDashAlcool.fibre : 0, 
    gras:props.itemDashAlcool ? props.itemDashAlcool.gras : 0, 
    unit: props.itemDashAlcool ? props.itemDashAlcool.unit : '',
    consumption: props.itemDashAlcool ? props.itemDashAlcool.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItemDashAlcool({ ...itemDashAlcool, [name]: value });
  }

  const saveChanges = () => {
    props.save(itemDashAlcool);
  }

  return (
    <div id="divPopUp1-1">
        <IonCol size="1">
          <button className="buttonOK" onClick={saveChanges}>OK</button>
        </IonCol>  
        <IonCol size="1">
          <span className="buttonCloseEdit" onClick={() => props.close()}>X</span>
        </IonCol>                              
        <IonItem  className="divAdd">
          <IonCol size="1">
            <IonIcon className="starFavoris" icon={star}/>
          </IonCol>
          <IonCol size="3">
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={itemDashAlcool.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="0" name="qtte" value={itemDashAlcool.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <select id="materialSelectAddHyd" name="unit" defaultValue={itemDashAlcool.unit} onChange={handleChange}>
            <option value="-1"></option>
            <option value="gr">gr</option>
            <option value="oz">oz</option>
            <option value="ml">ml</option>
            <option value="tasse">tasse</option>
            <option value="unite">unité</option>
          </select>
          <IonCol className ="colNutProteinesHyd" size="1"><div className ="divMacroAdd">Pro</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Prot" name="proteine" value={itemDashAlcool.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1"><div className ="divMacroAdd">Glu</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gluc" name="glucide" value={itemDashAlcool.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1"><div className ="divMacroAdd">Fib</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Fibre" name="fibre" value={itemDashAlcool.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1"><div className ="divMacroAdd">Gras</div>
            <IonInput className = 'divAddTextNut' type= 'number' placeholder="Gras" name="gras" value={itemDashAlcool.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>        
      </div>
  );
};

export default AlcoolItem;