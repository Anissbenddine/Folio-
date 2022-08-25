import React, { useState, useEffect } from "react";
import * as weightService from "../service/weightService"
import * as translate from "../../../translate/Translator";
import { IonLabel, IonText, IonItem, IonItemDivider, IonImg} from "@ionic/react";
import "../../../pages/Tab1.css";
import "../../../pages/weight.css";
import WeightInput from "./WeightInput";

// Variables in Firebase remains in French for now with a translation in comment
const Poids = (props) => {
  // Ajout de cette variable dans le but de vérifier quel était la préférence d'affichage du poids.
  const [unitWeight, setUnitWeight] = useState("");
  var [dailyWeight, setDailyWeight] = useState(props.poids.dailyPoids);
  var [initialWeight, setInitialWeight] = useState("");
  var [targetWeight, setTargetWeight] = useState("");
  var [targetWeightDate, setTargetWeightDate] = useState("");
  const [dateFormat, setDateFormat] = useState("YYYY/MM/DD");
  var [size, setSize] = useState("");
  var [BMI, setBMI] = useState("0.00");
  const [showInputWeight, setShowInputWeight] = useState(false);


  /*
  ***********************************************************************
  ** update the daily weight value if the favorite unit change
  ***********************************************************************
  */
  useEffect(() => {
    var tmp= 0;
    if (weightService.getPrefUnitWeight() === "LBS") {
      tmp = props.poids.dailyPoids * 2.2;
    } else {
      tmp = props.poids.dailyPoids;
    }

    setDailyWeight(parseFloat(tmp).toFixed(1));
  }, [props.poids.dailyPoids]);


  /*
  ***********************************************************************
  ** get favorite unite weight form database and set it to localstorage 
  ** get size value form database and set it to localstorage
  ** calculate the BMI value 
  ***********************************************************************
  */
  useEffect(() => {
    weightService.initProfile().then(() => {
      setUnitWeight(weightService.getPrefUnitWeight());
      setSize(weightService.getSize());
    
      setInitialWeight(weightService.getInitialWeight);
      setTargetWeight(weightService.getTargetWeight);
      setTargetWeightDate(weightService.getTargetWeightDate);
      let format = weightService.getPrefDate();
      format = format.replace(/y/gi, 'Y');
      format = format.replace(/L/gi, 'M');
      format = format.replace(/d/gi, 'D');
      setDateFormat(format);
    });
  },[]);

  useEffect(() => {
    setBMI(weightService.calculation_BMI(weightService.getSize(), weightService.formatToKG(dailyWeight)));
  },[dailyWeight, size]);



   /*
  ***********************************************************************
  ** get weight values (initial, target) form database and set them to 
  ** localstorage 
  ** get target weight date form database and set it to localstorage
  ***********************************************************************
  */


   /*
  ***********************************************************************
  ** get the favorite date format form database and set it to 
  ** localstorage 
  ** update the date format 
  ***********************************************************************
  */

  useEffect(() => { 
    if(weightService.getProfile()) {
      setUnitWeight(weightService.getPrefUnitWeight());
      setSize(weightService.getSize());
    
      setInitialWeight(weightService.getInitialWeight);
      setTargetWeight(weightService.getTargetWeight);
      setTargetWeightDate(weightService.getTargetWeightDate);

       let format = weightService.getPrefDate();
       format = format.replace(/y/gi, 'Y');
       format = format.replace(/L/gi, 'M');
       format = format.replace(/d/gi, 'D');
       setDateFormat(format);
    }
  }, [props.sidebarCloseDetecter]);

  /*
  ***********************************************************************
  ** handle the event if daily weight change
  ***********************************************************************
  */
  const handleChange = (newWeight, weightDate) => {
    weightService.updateWeightDashboard(newWeight, weightDate, props.currentDate.startDate)
    
    if(!weightService.compareDate(weightDate, props.currentDate.startDate)) {
      setDailyWeight(parseFloat(newWeight).toFixed(1));
      // On utilise directement la valeur qu'on a sauvé dans le localstorage du dashboard
      const newBMI = weightService.calculation_BMI(size, weightService.formatToKG(newWeight))
      setBMI(newBMI);
      weightService.check_BMI_change(newBMI);
    }
    
    setShowInputWeight(false)
  };

  return (
    <div>
      <IonItem className="divTitre9" lines="none">
          <IonItemDivider className="divIcone">
            <div data-testid = "openModal" className="icone"  onClick={() => setShowInputWeight(true)}>
              <IonImg  src="/assets/Poids.jpg"/>
            </div>
          </IonItemDivider>
          <ion-anchor href="/detailsWeight" routerDirection="forward" id="link">
            <IonItemDivider  className="divInfosPoids">
              <div className="leftContentInfos">
                <div  className="titrePoids">
                  <IonText>
                      {translate.getText("WEIGHT_NAME_SECTION")}
                  </IonText>
                </div>
                <div className="divPoidsCib">
                  <IonLabel>
                  <b className="PoidsCib">
                    <span>
                      {translate.getText("WEIGHT_TARGET_NAME")} :
                    </span>
                    &nbsp;
                    <span data-testid = "targWeight">
                      {weightService.formatWeight(targetWeight)}
                    </span>
                    &nbsp;
                    <span>
                      {unitWeight === "KG" ? "Kg" : "Lbs"}, 
                    </span>
                  </b>
                  &nbsp;
                  <span data-testid = "targWeightDate" className="dateCible" >
                    {weightService.formatDateShape(targetWeightDate, dateFormat)} 
                  </span>
                  </IonLabel>
                </div>
                <div className="titrePoidsIni">
                  <IonLabel>
                    <div className="poidsIni">
                      <b>
                        <span> 
                        {translate.getText("WEIGHT_INITIAL_NAME")} : </span>
                      </b>

                      <span  data-testid = "initWeight">
                        { weightService.formatWeight(initialWeight)}
                      </span>
                      &nbsp;
                      <span>{unitWeight === "KG" ? "Kg" : "Lbs"}
                      </span>
                      </div>
                  </IonLabel>
                </div>
              </div>
              <div className="rightContentInfos">
                <div className="dailyPoids">
                  <IonLabel>
                    <span data-testid = "dlyPoids">{dailyWeight}</span>
                    &nbsp;
                    <span data-testid = "prefUnit">{unitWeight === "KG" ? "Kg" : "Lbs"}</span>
                  </IonLabel>
                </div>
                <div className="divImc">
                  <IonLabel>
                    <span  className="IMC">
                      {translate.getText("WEIGHT_BMI_ACRONYM")} :
                    </span>
                    &nbsp;
                    <span  className="IMC" data-testid = "imc">
                      {BMI === "Infinity" ? "NaN" : BMI}
                    </span>
                  </IonLabel>
                </div>
              </div>
            </IonItemDivider>
          </ion-anchor> 
          <WeightInput
            dailyWeight={dailyWeight} 
            onSubmit={handleChange} 
            setDailyWeight={setDailyWeight} 
            showInputWeight={showInputWeight} 
            setShowInputWeight={setShowInputWeight}
            adjustUnit = {setUnitWeight}
            unitWeight = {unitWeight}
            dateFormat = {dateFormat}
            currentDate = {props.currentDate}
          ></WeightInput>      
      </IonItem>
  
    </div>

  );
};
export default Poids;
