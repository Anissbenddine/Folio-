import { IonIcon, IonLabel, IonCol, IonItem, IonButton, IonInput} from '@ionic/react';
import { star, trash, create, addCircle } from 'ionicons/icons';
import React, {useState, useEffect} from 'react';
import uuid from 'react-uuid';
import firebase from 'firebase'

const LegumesItem = (props) => {

  const [item, setItem] = useState({
    id: props.item ? props.item.id : uuid(),
    favoris: props.item ? props.item.favoris : false, 
    name:props.item ? props.item.name : '', 
    qtte:props.item? props.item.qtte : 0, 
    proteine:props.item ? props.item.proteine : 0, 
    glucide:props.item ? props.item.glucide : 0, 
    fibre:props.item ? props.item.fibre : 0, 
    gras:props.item? props.item.gras : 0, 
    unit: props.item? props.item.unit : '',
    consumption: props.item ? props.item.consumption:0
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  }

  const saveChanges = () => {
    props.save(item);
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
            <IonInput className = 'divAddText' placeholder="Description" name="name" value={item.name} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <IonInput className = 'divAddText' type= 'number' placeholder="Taille/portion" name="qtte" value={item.qtte} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol size="2">
            <select id="PopUpUnitSelect" name="unit" defaultValue={item.unit} onChange={handleChange}>
              <option value="-1"></option>
              <option value="gr">gr</option>
              <option value="oz">oz</option>
              <option value="ml">ml</option>
              <option value="tasse">tasse</option>
              <option value="unite">unité</option>
            </select>
          </IonCol>
          <IonCol className ="colNutProteinesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Prot" name="proteine" value={item.proteine} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutFibresHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gluc" name="glucide" value={item.glucide} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGlucidesHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Fibre" name="fibre" value={item.fibre} onIonChange={handleChange}></IonInput>  
          </IonCol>
          <IonCol className ="colNutGrasHyd" size="1">
            <IonInput className = 'divAddText' type= 'number' placeholder="Gras" name="gras" value={item.gras} onIonChange={handleChange}></IonInput>  
          </IonCol>
        </IonItem>            
      </div>
  );
}

const NourrLegumes = (props) => {

  const [legumes, setLegumes] = useState(props.legumes);
  const [legumesToEdit, setLegumesToEdit] = useState(undefined);
  const [currentDate, setCurrentDate] = useState({startDate: new Date()});
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(false);
  
  // update state on prop change
  useEffect(() => {
    setLegumes(props.legumes);
  }, [props.legumes])

  const updateFavorisStatus = (event, index) => {
    event.stopPropagation();
    var array = [...legumes];
    if(event.target.style.color === ''){
      event.target.style.color = '#d18a17';
      array[index].favoris = true;
      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      dashboard.legumes.legumes.unshift(array[index]);
      localStorage.setItem('dashboard', JSON.stringify(dashboard));
      const userUID = localStorage.getItem('userUid');
      firebase.database().ref('dashboard/'+userUID + "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
    } else {
      event.target.style.color = '';
      array[index].favoris = false;
    }
    setLegumes(array);

    // update the cache and persist in DB
    updateCacheAndBD(array);
  }

  const deleteItem = (item) => {
    var array = [...legumes];
    array.splice(item, 1);
    setLegumes (array);
    closeItemContainer();
    
    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.legumes= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const closeItemContainer = () => {
    setLegumesToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setLegumesToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openEditItemContainer = (index) => {
    setLegumesToEdit(legumes[index]);
    setItemContainerDisplayStatus(true);
  }

  const saveItem = (item) => {
    var array = [...legumes];
    const index = array.findIndex((e) => e.id === item.id);
    index === -1 ? array.unshift(item): array[index] = item;
    setLegumes (array);
    closeItemContainer();

    // update the cache and persist in DB
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.legumes= array;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  const updateCacheAndBD = (legumes) => {
    const settings = JSON.parse(localStorage.getItem('settings'));
    settings.legumes.legumes= legumes;
    localStorage.setItem('settings', JSON.stringify(settings));
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('settings/'+userUID).update(settings);
  }

  return (
    <div> 
      <div className="divHyd">
        <div className="sett">
          { legumes.map((leg, index) => (      
            <IonItem className="divTitre11" key={leg.id}>
              <IonCol size="1">
                <IonIcon className='starFavoris' onClick={(e) => updateFavorisStatus(e,index)} icon={star}></IonIcon>
              </IonCol>
              <IonCol size="3">
              <IonLabel className="nameDscrip"><h2><b>{leg.name}</b></h2></IonLabel>
              </IonCol>
              <IonCol size="1">
              <IonLabel className="unitDescrip"><h2><b>{leg.qtte}</b></h2></IonLabel>
              </IonCol>
              <select id="materialSelect" value={leg.unit} disabled="disabled">
                <option value4="-1"></option>
                <option value4="gr">gr</option>
                <option value4="oz">oz</option>
                <option value4="ml">ml</option>
                <option value4="tasse">tasse</option>
                <option value4="unite">unité</option>
              </select>
              <IonButton className='editButton' color="danger" size="small" onClick={() => openEditItemContainer(index)}>
                <IonIcon  icon={create} />
              </IonButton>
              <div className="triangle1">
                <div className="triangleText1-1"><b>{leg.gras}</b></div>
                <div className="triangleText2-2"><b>{leg.proteine}</b></div>
                <div className="triangleText3-3"><b>{leg.fibre}</b></div>
                <div className="triangleText4-4"><b>{leg.glucide}</b></div>         
              </div>
              <IonButton className="trashButton" color="danger" size="small" onClick={() => deleteItem(index)}>
                <IonIcon  icon={trash} />
              </IonButton>
            </IonItem>
            ))
          } 
        </div>
      </div>
      <div className="ajoutBotton">    
        <IonButton className="ajoutbreuvage1" color="danger" size="small" onClick={() => openAddItemContainer()}>
        <IonIcon icon={addCircle}/><label className="labelAddItem">Legumes</label></IonButton>
      </div>
      {itemContainerDisplayStatus && <LegumesItem close={closeItemContainer} item={legumesToEdit} save={(item) => saveItem(item)}/>}
    </div> 
  );
}
export default NourrLegumes;
