import React, { useState, useEffect } from "react";
import * as translate from "../../../translate/Translator";
import * as weightService from "../service/weightService"
import HeaderWeight from "./header";
import { IonLabel, IonItem,  IonContent, IonAvatar, IonIcon, IonList, IonItemGroup} from "@ionic/react";
import { create} from "ionicons/icons";
import TableWeight from "./TableWeight";
import WeightModify from "./WeightModify";
import TargetWeightInput from "./TargetWeightInput";
const DIFF_UNITY_WEIGHT = 2.2;
const DetailsWeight = () => {
  const [unitWeight, setUnitWeight] = useState("");
  var [dailyWeightList, setDailyWeightList] = useState([]);
  var [initialWeight, setInitialWeight] = useState("");
  var [targetWeight, setTargetWeight] = useState("");
  var [targetWeightDate, setTargetWeightDate] = useState("");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
  const [currentDate, setCurrentDate] = useState("")
  //TODO ajouter le set quand la date du poids initial sera implementer
  var [initialweightDate] = useState(1999-9-9)
  const [isShown, setIsShown] = useState(false);
  const [showInputTargetWeight, setShowInputTargetWeight] = useState(false);
  const [showWeightModify, setShowWeightModify] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [weightElement, setWeightElement]  = useState({x:"1970-01-01", y:0})

  useEffect(() => {
    weightService.initProfile().then(() => {
      //unit pref
      setUnitWeight(weightService.getPrefUnitWeight());
      //size
      setSize(weightService.getSize());
      // initila poids
      setInitialWeight(weightService.getInitialWeight);
      // poids cible
      setTargetWeight(weightService.formatWeight(weightService.getTargetWeight()));
      // date poids cible 
      setTargetWeightDate(weightService.getTargetWeightDate);
      
      let format = weightService.getPrefDate();
      format = format.replace(/y/gi, 'Y');
      format = format.replace(/L/gi, 'M');
      format = format.replace(/d/gi, 'D');
      setDateFormat(format);
      setCurrentDate(weightService.formatDateShape(localStorage.getItem("currentDate"), dateFormat))

    });
  },[]);

  useEffect(()=> {
    weightService.initDailyPoidsList().then(()=>{
      setDailyWeightList(weightService.getDailyWeightList());
    })
  },[])



  useEffect(() => {
    setBMI(weightService.calculation_BMI(weightService.getSize(), weightService.formatToKG(weightService.getLastWeightInfos(dailyWeightList)[1])));
  },[dailyWeightList, size]);
  
  const openWeightModify = (element) => {
    setWeightElement(element)
    setShowWeightModify(true);
  }

  const handleWeightChange = (newWeight, weightDate) => {
    if (weightService.compareDate(weightDate, weightElement.x)) {
      weightService.deleteWeightDashboard(weightElement.x, currentDate);
    }
    
    weightService.updateWeightDashboard(newWeight, weightDate, currentDate)
    
    const updatedDailyWeightList = weightService.updateDailyWeightList(dailyWeightList, newWeight, weightDate, weightElement.x)
    setDailyWeightList(updatedDailyWeightList);

    setShowWeightModify(false)
  }

  const handleWeightDelete = () => {
    weightService.deleteWeightDashboard(weightElement.x, currentDate)

    const updatedDailyWeightList = weightService.updateDailyWeightListDelete(dailyWeightList, weightElement)
    setShowConfirmation(false);
    setShowWeightModify(false);
    setDailyWeightList(updatedDailyWeightList);
  }

  const updatePrefUnit = (oldUnitWeight, newUnitWeight) => {
    const updatedDailyWeightList = weightService.updateDailyWeightListPrefUnit(dailyWeightList, oldUnitWeight, newUnitWeight);
    setDailyWeightList(updatedDailyWeightList);
    setUnitWeight(newUnitWeight)
    if (oldUnitWeight === "KG" && newUnitWeight === "LBS") {
      setTargetWeight((targetWeight * DIFF_UNITY_WEIGHT).toFixed(1))
    } else if (oldUnitWeight === "LBS" && newUnitWeight === "KG") {
      setTargetWeight((targetWeight / DIFF_UNITY_WEIGHT).toFixed(1))
    }
  
  }

  const handleTargetWeightChange = (newTargetWeight, newTargetDate) => {
    weightService.updateTargetWeight(newTargetWeight, newTargetDate)
    setShowInputTargetWeight(false);
    setTargetWeight(parseFloat(newTargetWeight).toFixed(1));
    setTargetWeightDate(newTargetDate)
  }

    return (
    <ion-app class="detailsPoids">
      <HeaderWeight url="/dashboard" id="headerPoids"/>
      <IonContent>
        <IonItemGroup className="detailsWeightContent">
      <IonItemGroup className='cibleInfos'>
          <IonItem data-testid="modalTarget" className="PoidsCibInfos"  onClick={() => setShowInputTargetWeight(true)}>
            <IonLabel id="cible" >
              <b className="targetWeight">
                <span>
                  {translate.getText("WEIGHT_TARGET_NAME")} :
                </span>
                &nbsp;
                <span data-testid = "targWeight">
                  {targetWeight}
                </span>
                &nbsp;
                <span>
                  {unitWeight === "KG" ? "Kg" : "Lbs"}, 
                </span>
              </b>
              &nbsp;
              <span data-testid = "targWeightDate" className="targetDate" >
                {weightService.formatDateShape(targetWeightDate, dateFormat)} 
              </span>
            </IonLabel>
          </IonItem>
      </IonItemGroup>
      <IonItemGroup className="graphButton">
        {!isShown &&
        <IonLabel id="graphshowen"  data-testid="showgraph" onClick={() => setIsShown(!isShown)}>{translate.getText("SHOW_GRAPH")} </IonLabel>
        }
         {isShown && 
         <IonLabel id="graphshowen"  data-testid="closegraph" onClick={() => setIsShown(!isShown)}>{translate.getText("CLOSE_GRAPH")}</IonLabel>}

      </IonItemGroup>
      {isShown &&
        <TableWeight
          graphData={dailyWeightList}
          initialWeight={initialWeight}
          targetWeight={targetWeight}
          targetWeightDate={targetWeightDate}>
        </TableWeight>
      }
      <IonItemGroup className="lastWeight">
        <IonLabel id="dernierPoidsValue">
          <span>
            {translate.getText("LAST_WEIGHT")} :
          </span>&nbsp;
          <span data-testid = "lastWeightValue">
            {weightService.getLastWeightInfos(dailyWeightList)[1]}
          </span>&nbsp;
          <span data-testid = "prefUnit">
            {unitWeight === "KG" ? "Kg" : "Lbs"}
          </span>
        </IonLabel>
      </IonItemGroup>
      <IonItemGroup>
        <IonLabel id="dernierPoidsDate">
          <span  data-testid = "lastWeightDate">{weightService.formatDateShape(weightService.getLastWeightInfos(dailyWeightList)[0],dateFormat)}
          </span>&nbsp;
          <span> {translate.getText("WEIGHT_BMI_ACRONYM")} : </span> 
          <span  data-testid = "imc">{BMI === "Infinity" ? "NaN" : BMI}</span>
        </IonLabel>
      </IonItemGroup>
      <IonItemGroup className="initWeight">
        <IonLabel id="initialPoidsInfos">
          <span><b> {translate.getText("WEIGHT_INITIAL_NAME")}  : {weightService.formatWeight(initialWeight)} </b></span> 
          <span data-testid = "prefUnit1" ><b> {unitWeight === "KG" ? "Kg" : "Lbs"},</b></span>&nbsp;
          <span>{translate.getText("WEIGHT_INITIAL_DATE")} {weightService.formatDateShape(initialweightDate,dateFormat)} </span>
        </IonLabel>
      </IonItemGroup>
      <IonItemGroup className="listWeight">
      <IonList className="listHisto">
      
        
       { dailyWeightList.map(item => {
         return(
         <IonItem className="weightItem" key={item.x}>
           <IonLabel>
             <span data-testid="firstElement" id="historiquePoids"><b>{item.y} {unitWeight === "KG" ? "Kg" : "Lbs"}</b></span>&nbsp;
             <span id="historiqueDate">| {weightService.formatDateShape(item.x,dateFormat)} à {weightService.getTime(item.x)}</span>
             <span>
               <IonAvatar data-testid = "modalModify" className='pencilAvtr' onClick={() => openWeightModify(item)}><IonIcon className="iconModifier" icon={create} /></IonAvatar>
              </span>
           </IonLabel>
         </IonItem>
         )
       })}
       </IonList>

      </IonItemGroup>
      
        <WeightModify
          weightElement = {weightElement}
          onModify={handleWeightChange}
          onDelete={handleWeightDelete}
          updatePrefUnit={updatePrefUnit} 
          showWeightModify={showWeightModify} 
          setShowWeightModify={setShowWeightModify}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
          unitWeight = {unitWeight}
          dateFormat = {dateFormat}
        ></WeightModify>  
        <TargetWeightInput 
          showInputTargetWeight={showInputTargetWeight}
          setShowInputTargetWeight={setShowInputTargetWeight}
          onAdd={handleTargetWeightChange}
          dateFormat={dateFormat}
          unitWeight={unitWeight}
          targetWeight={targetWeight}
          targetDate={targetWeightDate}
          updatePrefUnit={updatePrefUnit}>
        </TargetWeightInput>
        </IonItemGroup>
      </IonContent>
    </ion-app>
    );

}
export default DetailsWeight;