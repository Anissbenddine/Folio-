import React, {useState, useEffect} from 'react';
import { IonGrid, IonRow, IonCol, IonItem, IonIcon, IonLabel, IonInput, IonAvatar, IonButton, IonList, IonCard, IonCardHeader, IonCardContent } from '@ionic/react';
import {arrowDropdownCircle, star, addCircle, trash, eye} from 'ionicons/icons';
import uuid from 'react-uuid';
import firebase from 'firebase';
import '../../../Tab1.css';
import * as translate from '../../../../translate/Translator';

export const SUPPORTED_UNITS_CONVERTER = {
  g: {
    name: 'g',
    gramQtyPerUnit: 1
  },
  oz: {
    name: 'oz',
    gramQtyPerUnit: 28.3495
  },
  ml: {
    name: 'ml',
    gramQtyPerUnit: 1
  },
  lb: {
    name: 'lb',
    gramQtyPerUnit: 453.592
  }
};

const DECIMAL_PLACES_DEFAULT = 2;

export const initSampleFoodItem = (props) => {
  const sampleFoodItem = {
    id: props.item ? props.item.id : uuid(),
    favorite: props.item ? props.item.favorite : false, 
    name: props.item ? props.item.name : '', 
    qtyConsumed: props.item ? props.item.qtyConsumed : 0,
    refQty: props.item ? props.item.refQty : 0, 
    proteins: props.item ? props.item.proteins : 0, 
    carbs: props.item ? props.item.carbs : 0, 
    fibre: props.item ? props.item.fibre : 0, 
    fats: props.item ? props.item.fats : 0, 
    unit: props.item ? props.item.unit : SUPPORTED_UNITS_CONVERTER.g.name
  };
  return sampleFoodItem;
};

export const round = (number) => {
  return parseFloat(number.toFixed(DECIMAL_PLACES_DEFAULT));
};

const FoodItem = (props) => {

  const [item, setItem] = useState(initSampleFoodItem(props));

  const handleChange = event => {
    const { name, value } = event.target;
    setItem({ ...item, [name]: value });
  }

  const handleChangeQtyMacro = event => {
    const { name, value } = event.target;

    if (Number(value) >= 0) {
      // TODO: Petit bogue au niveau de l'affichage des valeurs ayant des 0 après la virgule (p.ex., 0.01). 
      // On peut toutefois saisir des valeurs comme ça en entrant d'abord 0.1 et, ensuite, se déplacer vers le gauche à l'aide des touches et ajouter les 0 manquants.
      // C'est un bogue spécifiquement au niveau de l'affichage, car la logique du calcul permet des valeurs pareilles et plusieurs tests unitaires couvrant ses scénarios-là passent.
      setItem({ ...item, [name]: Number(value) });
    } else {
      setItem({ ...item, [name]: 0});
    }
  }

  const handleFavorites = event => {
    item.favorite = !item.favorite;
    event.currentTarget.classList.toggle('active');
  }

  const saveChanges = () => {
    if (item.name === undefined || item.name === '' || item.qtyConsumed === 0 || item.refQty === 0 || item.unit === undefined || item.unit === '' 
        || (item.proteins === 0 && item.carbs === 0 && item.fibre === 0 && item.fats === 0)) {
      alert(translate.getText('FOOD_MODULE', ['functions', 'addErrorMessage', 'saveItem']));
      return;
    }
    props.save(item);
  }

  return (
        <IonCard id='foodItemPopup'>
          <IonCardHeader>
            <IonButton id='closeButton' color='danger' onClick={() => props.close()} style={{  position: 'absolute', right: '1%'}}>X</IonButton>
            <IonButton id='saveButton' color='success' onClick={ saveChanges } style={{  position: 'absolute', right: '15%'}}>OK</IonButton>
            { item.favorite && <IonIcon id='favoriteButton' className="starFavoris active" onClick={ handleFavorites } icon={ star } /> }
            { !item.favorite && <IonIcon id='favoriteButton' className="starFavoris" onClick={ handleFavorites } icon={ star } /> } 
          </IonCardHeader>
          <br/><br/><br/>
          <IonCardContent>
            <IonList>
              <IonLabel className='addFoodItemPopupLabels'>{ translate.getText('FOOD_MODULE', ['functions', 'addLabel', 'name']) }:</IonLabel>
              <IonItem>
                <IonInput className = 'divAddTextNut nourTextInput' name="name" value={ item.name } onIonChange={ handleChange }/>
              </IonItem>
              <IonLabel className='addFoodItemPopupLabels'>{ translate.getText('FOOD_MODULE', ['functions', 'addLabel', 'qtyConsumed']) }:</IonLabel>
              <IonItem>
                <IonInput className = 'divAddTextNut nourTextInput' type= 'number' name="qtyConsumed" value={ item.qtyConsumed } onIonChange={ handleChangeQtyMacro }/>
              </IonItem>
              <IonLabel className='addFoodItemPopupLabels'>{ translate.getText('FOOD_MODULE', ['functions', 'addLabel', 'refQty']) }:</IonLabel>
              <IonItem>
                <IonInput className = 'divAddTextNut nourTextInput' type= 'number' name="refQty" value={ item.refQty } onIonChange={ handleChangeQtyMacro }/>
              </IonItem>
              <IonLabel className='addFoodItemPopupLabels'>{ translate.getText('FOOD_MODULE', ['functions', 'addLabel', 'unit']) }:</IonLabel>
              <IonItem>
                <select id="materialSelectAddHyd" name="unit" value={ item.unit } onChange={ handleChange } style={{ width: '20%', margin: 'auto'}}>
                  <option>{ SUPPORTED_UNITS_CONVERTER.g.name }</option>
                  <option>{ SUPPORTED_UNITS_CONVERTER.oz.name }</option>
                  <option>{ SUPPORTED_UNITS_CONVERTER.ml.name }</option>
                  <option>{ SUPPORTED_UNITS_CONVERTER.lb.name }</option>
                </select>
              </IonItem>
              <br/><br/>
              <IonLabel className='addFoodItemPopupLabels'>{ translate.getText('FOOD_MODULE', ['functions', 'addLabel', 'macroNutrients']) }: ({ item.unit }/{ item.refQty }{ item.unit })</IonLabel>
              <IonItem>
                <IonCol>
                  <IonLabel id='proteinLabel' style={{ fontSize: 'small', color: 'green'}}>{ translate.getText('FOOD_MODULE', ['macroNutrients', 'proteins']) }:</IonLabel>
                </IonCol>
                <IonCol>
                  <IonInput className = 'divAddTextNut nourTextInput' type= 'number' name="proteins" value={ item.proteins } onIonChange={ handleChangeQtyMacro }/>
                </IonCol>
              </IonItem>
              <IonItem>
                <IonCol>
                  <IonLabel id='carbLabel' style={{ fontSize: 'small', color: 'red'}}>{ translate.getText('FOOD_MODULE', ['macroNutrients', 'carbs']) }:</IonLabel>
                </IonCol>
                <IonCol>
                  <IonInput className = 'divAddTextNut nourTextInput' min={ 0 } type= 'number' name="carbs" value={ item.carbs } onIonChange={ handleChangeQtyMacro }/>
                </IonCol>
              </IonItem>        
              <IonItem>
                <IonCol>
                  <IonLabel id='fibreLabel' style={{ fontSize: 'small', color: 'purple'}}>{ translate.getText('FOOD_MODULE', ['macroNutrients', 'fibre']) }:</IonLabel>
                </IonCol>
                <IonCol>
                  <IonInput className = 'divAddTextNut nourTextInput' min={ 0 } type= 'number' name="fibre" value={ item.fibre } onIonChange={ handleChangeQtyMacro }/>
                </IonCol>
              </IonItem>          
              <IonItem>
                <IonCol>
                  <IonLabel id='fatLabel' style={{ fontSize: 'small', color: 'orange'}}>{ translate.getText('FOOD_MODULE', ['macroNutrients', 'fats']) }:</IonLabel>
                </IonCol>
                <IonCol>
                  <IonInput className = 'divAddTextNut nourTextInput' min={ 0 } type= 'number' name="fats" value={ item.fats } onIonChange={ handleChangeQtyMacro }/>
                </IonCol>
              </IonItem>
            </IonList>
            </IonCardContent>
        </IonCard>
  );
}

const Food = (props) => {
  const [test] = useState(props.test);
  const [foodItems, setFoodItems] = useState(props.foodItems.sort((a, b) => b.favorite - a.favorite));
  const [proteinConsumptionPerCategory, setGlobalProteinConsumption] = useState(props.macroNutrientConsumption.proteins);
  const [carbConsumptionPerCategory, setGlobalCarbConsumption] = useState(props.macroNutrientConsumption.carbs);
  const [fibreConsumptionPerCategory, setGlobalFibreConsumption] = useState(props.macroNutrientConsumption.fibre);
  const [fatConsumptionPerCategory, setGlobalFatsConsumption] = useState(props.macroNutrientConsumption.fats);
  const [currentDate, setCurrentDate] = useState({startDate: props.currentDate}); 
  const [foodItemToEdit, setFoodItemToEdit] = useState(props.foodItemToEdit);
  const [itemContainerDisplayStatus, setItemContainerDisplayStatus] = useState(props.itemContainerDisplayStatus);

  useEffect(() => {
    setCurrentDate(props.currentDate);
  }, [props.currentDate])

  useEffect(() => {
    setGlobalProteinConsumption(props.macroNutrientConsumption.proteins);
  }, [props.macroNutrientConsumption.proteins])

  useEffect(() => {
    setGlobalCarbConsumption(props.macroNutrientConsumption.carbs);
  }, [props.macroNutrientConsumption.carbs])

  useEffect(() => {
    setGlobalFibreConsumption(props.macroNutrientConsumption.fibre);
  }, [props.macroNutrientConsumption.fibre])

  useEffect(() => {
    setGlobalFatsConsumption(props.macroNutrientConsumption.fats);
  }, [props.macroNutrientConsumption.fats])

  useEffect(()=>{
    setFoodItems(props.foodItems)
  }, [props.foodItems])

  const toggle = (divId) => {
    const divElt=document.getElementById(divId);
    if (divElt) {
      if (!divElt.style.display || divElt.style.display === "none") {
        divElt.style.display = "block";
      } else {
        divElt.style.display = "none";
      }
    }
  }

  const consumptionCalculatorFunc = (item, macroNutrientPerRefQty, oldData = undefined) => {
    const unit = item.unit;
    let qtyConsumed = oldData ? oldData.qtyConsumed : item.qtyConsumed;
    let refQty = oldData ? oldData.refQty : item.refQty;
    const qtyConsumedAdjusted = (qtyConsumed * macroNutrientPerRefQty) / refQty;
    return round(qtyConsumedAdjusted * SUPPORTED_UNITS_CONVERTER[unit].gramQtyPerUnit);
  };

  const updateFunc = (macroNutrientConsumption, updatedValue) => {
    macroNutrientConsumption.proteins = round(updatedValue.proteins);
    macroNutrientConsumption.carbs = round(updatedValue.carbs);
    macroNutrientConsumption.fibre = round(updatedValue.fibre);
    macroNutrientConsumption.fats = round(updatedValue.fats);
  }

  const deleteItem = (index) => {
    const item = foodItems[index];
    foodItems.splice(index, 1);
    updateCacheAndDB(macroNutrientConsumption => {
      updateFunc(macroNutrientConsumption,
        {
          proteins: Math.max(macroNutrientConsumption.proteins - consumptionCalculatorFunc(item, item.proteins), 0), 
          carbs: Math.max(macroNutrientConsumption.carbs - consumptionCalculatorFunc(item, item.carbs), 0), 
          fibre: Math.max(macroNutrientConsumption.fibre - consumptionCalculatorFunc(item, item.fibre), 0), 
          fats: Math.max(macroNutrientConsumption.fats - consumptionCalculatorFunc(item, item.fats), 0)
        });
    });
  }

  const saveItem = (item) => {
    const index = foodItems.findIndex((e) => e.id === item.id);

    if (index >= 0 && (JSON.stringify(foodItems[index]) === JSON.stringify(item))) {
      return;
    }
    const proteinsConsumed = consumptionCalculatorFunc(item, item.proteins);
    const carbsConsumed = consumptionCalculatorFunc(item, item.carbs);
    const fibreConsumed = consumptionCalculatorFunc(item, item.fibre);
    const fatsConsumed = consumptionCalculatorFunc(item, item.fats);

    if (index === -1) {
      foodItems.unshift(item);
      updateCacheAndDB(macroNutrientConsumption => { 
        updateFunc(macroNutrientConsumption, 
        {
          proteins: macroNutrientConsumption.proteins + proteinsConsumed, 
          carbs: macroNutrientConsumption.carbs + carbsConsumed, 
          fibre: macroNutrientConsumption.fibre + fibreConsumed, 
          fats: macroNutrientConsumption.fats + fatsConsumed
        })
      });
    } else {
      const oldItem = foodItems[index];
      foodItems[index] = item;
      const oldProteinQty = consumptionCalculatorFunc(oldItem, oldItem.proteins, { qtyConsumed: oldItem.qtyConsumed, refQty: oldItem.refQty });
      const oldCarbQty = consumptionCalculatorFunc(oldItem, oldItem.carbs, { qtyConsumed: oldItem.qtyConsumed, refQty: oldItem.refQty });
      const oldFibreQty = consumptionCalculatorFunc(oldItem, oldItem.fibre, { qtyConsumed: oldItem.qtyConsumed, refQty: oldItem.refQty });
      const oldFatQty = consumptionCalculatorFunc(oldItem, oldItem.fats, { qtyConsumed: oldItem.qtyConsumed, refQty: oldItem.refQty });

      updateCacheAndDB(macroNutrientConsumption => {
        updateFunc(macroNutrientConsumption,
          {
            proteins: Math.max(macroNutrientConsumption.proteins - oldProteinQty + proteinsConsumed, 0), 
            carbs: Math.max(macroNutrientConsumption.carbs - oldCarbQty + carbsConsumed, 0), 
            fibre: Math.max(macroNutrientConsumption.fibre - oldFibreQty + fibreConsumed, 0), 
            fats: Math.max(macroNutrientConsumption.fats - oldFatQty + fatsConsumed, 0)
          });
      });
    }
    closeItemContainer(); 
  }

  const updateCacheAndDB = (updateTotalFunc) => {
    const dashboard = JSON.parse(localStorage.getItem('dashboard'));
    dashboard.food.categories[props.categoryKey].items = foodItems;
    setFoodItems(foodItems);
    updateTotalFunc(dashboard.food.categories[props.categoryKey].macroNutrientConsumption);
    
    setGlobalProteinConsumption(dashboard.food.categories[props.categoryKey].macroNutrientConsumption.proteins);
    setGlobalCarbConsumption(dashboard.food.categories[props.categoryKey].macroNutrientConsumption.carbs);
    setGlobalFibreConsumption(dashboard.food.categories[props.categoryKey].macroNutrientConsumption.fibre);
    setGlobalFatsConsumption(dashboard.food.categories[props.categoryKey].macroNutrientConsumption.fats);

    props.updateFoodConsumptionCallback();

    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    // Le flag <code> test </code> sert à assurer qu'on ne fait pas appel à la BD dans les tests unitaires, pour lesquels l'utilisation de la cache suffit pour tester la logique du module.
    // Ce flag-ci est donc mis à vrai uniquement lors du rendu du composant Nourriture simulé dans les tests, mais demeure 'undefined' en production.
    if (test) {
      return;
    }
    const userUID = localStorage.getItem('userUid');
    firebase.database().ref('dashboard/'+userUID+ "/" + currentDate.startDate.getDate() + (currentDate.startDate.getMonth()+1) + currentDate.startDate.getFullYear()).update(dashboard);
  }

  const closeItemContainer = () => {
    setFoodItemToEdit(undefined);
    setItemContainerDisplayStatus(false);
  }

  const openAddItemContainer = () => {
    setFoodItemToEdit(undefined);
    setItemContainerDisplayStatus(true);
  }

  const openShowItemContainer = (item) => {
    setFoodItemToEdit(item);
    setItemContainerDisplayStatus(true);
  }

   return (
    <div>
      <IonItem className="divTitre22">
        <IonAvatar slot="start">
        <img id='moduleImg' src= { `/assets/${ props.categoryKey }.jpg` } alt="" />
        </IonAvatar>
        <IonLabel>
          <h2>
            <b id='moduleName'>
              { translate.getText('FOOD_MODULE', ['foodCategories', `${ props.categoryKey }`]) } 
            </b>
          </h2>
        </IonLabel>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrients', 'proteins'])}: 
                <div id='proteinConsumptionPerCategory'>{proteinConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrients', 'carbs'])}:
                <div id='carbConsumptionPerCategory'>{carbConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrients', 'fibre'])}:
                <div id='fibreConsumptionPerCategory'>{fibreConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton color='danger' size='small'>{translate.getText('FOOD_MODULE', ['macroNutrients', 'fats'])}:
                <div id='fatConsumptionPerCategory'>{fatConsumptionPerCategory}</div>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonIcon id='proteinArrow' className="arrowDashItem" icon={arrowDropdownCircle} onClick={() => toggle(props.categoryKey)}/>
      </IonItem> 
      <div id={ props.categoryKey }>
      <div className="divHyd">
            <div className="sett">
              { foodItems && foodItems.map((item, index) => (      
                <IonItem id={item.id} className="divTitre11" key={item.id}>
                 <IonCol></IonCol>
                 <IonLabel className="nameDscripDashboard"><h2><b>{item.name}</b></h2></IonLabel>      
                  <IonCol>
                    <IonButton id='showButton' className="eyeButton" color="danger" size="small" onClick={() => openShowItemContainer(item)}>
                      <IonIcon  icon={eye} />
                    </IonButton>
                    <IonButton id='deleteButton' className="trashButton" color="danger" size="small" onClick={() => deleteItem(index)}>
                      <IonIcon  icon={trash} />
                    </IonButton>
                  </IonCol>
                </IonItem>
                ))
              } 
            </div>
          </div>
        <div className="ajoutBotton">    
          <IonButton id='addButton' className="ajoutbreuvage1" color="danger" size="medium" onClick={() => openAddItemContainer()}>
          <IonIcon icon={addCircle}/><label id='addFoodItem' className="labelAddItem">{ translate.getText('FOOD_MODULE', ['functions', 'addFoodItem']) }</label></IonButton>
        </div>
        { itemContainerDisplayStatus && <FoodItem id='saveItem' close={closeItemContainer} item={foodItemToEdit} save={(item) => { saveItem(item); }}/> }
      </div>
    </div>    
  );
}
export default Food;