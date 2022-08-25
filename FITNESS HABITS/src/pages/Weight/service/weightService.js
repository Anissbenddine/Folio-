import firebase from 'firebase'
import moment from "moment";
import 'moment/locale/fr' 
import 'moment/locale/es' 
import * as translate from "../../../translate/Translator";
const DIFF_UNITY_WEIGHT = 2.2;


export function initProfile() {
  return new Promise((resolve) => {
    const userUID = localStorage.getItem('userUid');
    let profileRef = firebase.database().ref('profiles/'+ userUID)
    profileRef.once("value").then(function(snapshot) {
      const dbProfile = snapshot.val();
      const dataProfile = checkDataProfile(dbProfile)
      localStorage.setItem("profile", JSON.stringify(dataProfile));
      resolve();
    })
  });
}

function checkDataProfile(dbProfile) {
  let dataProfile = {
    dateFormat:"dd-LL-yyyy",
    preferencesPoids:{
      dateCible:NaN,
      poidsCible:NaN,
      poidsInitial:NaN,
      unitePoids:"KG"
    },
    pseudo:"",
    size:0
  };
  if (dbProfile) {
    if(dbProfile.dateFormat) {
      dataProfile.dateFormat = dbProfile.dateFormat;
    }
    if(dbProfile.pseudo) {
      dataProfile.pseudo = dbProfile.pseudo;
    }
    if(dbProfile.size) {
      dataProfile.size = dbProfile.size;
    }
    dataProfile = checkPreference(dataProfile, dbProfile.preferencesPoids)
  }
  return dataProfile;
}

function checkPreference(dataProfile, preferencesPoids) {
  if(preferencesPoids) {
    if(preferencesPoids.dateCible) {
      dataProfile.preferencesPoids.dateCible = preferencesPoids.dateCible;
    }
    if(preferencesPoids.poidsCible) {
      dataProfile.preferencesPoids.poidsCible = preferencesPoids.poidsCible;
    }
    if(preferencesPoids.poidsInitial) {
      dataProfile.preferencesPoids.poidsInitial = preferencesPoids.poidsInitial;
    }
    if(preferencesPoids.unitePoids) {
      dataProfile.preferencesPoids.unitePoids = preferencesPoids.unitePoids;
    }
  }
  return dataProfile;
}

export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("profile"));
  } catch (error) {
    return {
      dateFormat:"dd-LL-yyyy",
      preferencesPoids:{
        dateCible:NaN,
        poidsCible:NaN,
        poidsInitial:NaN,
        unitePoids:"KG"
      },
      pseudo:"",
      size:0
    }
  } 
}

export function getPrefDate() {
  try {
    return JSON.parse(localStorage.getItem("profile")).dateFormat;
  } catch {
    return "dd-LL-yyyy";
  }
}

export function getTargetWeightDate() {
  try {
    return JSON.parse(localStorage.getItem("profile")).preferencesPoids.dateCible;
  } catch {
    return NaN;
  }
}

export function getTargetWeight() {
  try {
    return JSON.parse(localStorage.getItem("profile")).preferencesPoids.poidsCible;
  } catch {
    return NaN;
  }
}

export function getInitialWeight() {
  try {
    return JSON.parse(localStorage.getItem("profile")).preferencesPoids.poidsInitial;
  } catch {
    return NaN;
  }
}

export function getPrefUnitWeight() {
  try {
    return JSON.parse(localStorage.getItem("profile")).preferencesPoids.unitePoids;
  } catch {
    return "KG";
  }
}

export function getSize() {
  try {
    return JSON.parse(localStorage.getItem("profile")).size;
  } catch {
    return 0;
  }
}

export function setPrefUnitWeight(value) {
    const userUID = localStorage.getItem('userUid');
    let profile = JSON.parse(localStorage.getItem("profile"));
    profile.preferencesPoids.unitePoids = value;
    localStorage.setItem("profile", JSON.stringify(profile));
    // Firebase : preferencesPoids = preferencesWeight, unitePoids = unitWeight
    firebase.database().ref('profiles/' + userUID +"/preferencesPoids").update({"unitePoids": value})
}

export function formatWeight(weight) {
  let prefUnitWeight = getPrefUnitWeight();
  if (prefUnitWeight === "LBS") {
    return (weight * DIFF_UNITY_WEIGHT).toFixed(1)
  }
  return parseFloat(weight).toFixed(1)
}

export function formatToKG(weight) {
  let prefUnitWeight = getPrefUnitWeight();
  if (prefUnitWeight === "LBS") {
    return (weight / DIFF_UNITY_WEIGHT).toFixed(2)
  }

  return weight;
}

export function calculation_BMI(height, dailyWeight){
	return (dailyWeight / ((height / 100) * (height / 100))).toFixed(2);
}

export function check_BMI_change(BMI_value){
  var BMI_category = find_new_category(BMI_value);
  let BMI_category_local = localStorage.getItem('BMI_group');

  localStorage.setItem('BMI_group', BMI_category);
  if (BMI_category_local !== null && BMI_category.localeCompare(BMI_category_local) ) {
      alert(translate.getText(BMI_category));
  }
}

export function find_new_category(BMI_value){
    var BMI_group = '';
    if (BMI_value <= 18.49) {
      BMI_group = 'SKIN_CATEGORY';

    } else if (BMI_value >= 18.5 && BMI_value <= 25) {
      BMI_group = 'IDEAL_CATEGORY';

    } else if (BMI_value >= 25.01 && BMI_value <= 30) {
      BMI_group = 'OVERWEIGHT_CATEGORY';

    } else if (BMI_value >= 30.01 && BMI_value <= 35) {
      BMI_group = 'CATEGORY_OB_CLASS_1';

    } else if (BMI_value >= 35.01 && BMI_value <= 40) {
      BMI_group = 'CATEGORY_OB_CLASS_2';

    } else {
      BMI_group = 'CATEGORY_OB_CLASS_3';
    }

    return BMI_group+"";
}

export function formatDate (date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
}

export function toDate (date) {
  return moment(date).toDate();
}

export function formatDateShape (date,shape) {
  var lang = localStorage.getItem("userLanguage")
    shape = shape.toUpperCase();
    shape = shape.replace(/L/gi,"M");
    if(lang === 'en'){
      moment.locale('en')
      return moment(date).format(shape);
    }
    else if(lang === 'es'){
      moment.locale('es')
      return moment(date).format(shape);
    }
    else {
      moment.locale('fr')
      return moment(date).format(shape);
    }
}

export function updateWeightDashboard(newWeight, weightDate, currentDate) {
  const userUID = localStorage.getItem('userUid');
  weightDate = toDate(weightDate);
  let dashboard = {poids: {
    dailyPoids: formatToKG(newWeight),
    datePoids: weightDate
  }};

  if(currentDate && !compareDate(weightDate, currentDate)) {
    dashboard = JSON.parse(localStorage.getItem("dashboard"));
    dashboard.poids.dailyPoids = formatToKG(newWeight);
    dashboard.poids.datePoids = weightDate;
    localStorage.setItem("dashboard", JSON.stringify(dashboard));
  }

  firebase
      .database()
      .ref(
          "dashboard/" +
    userUID +
    "/" +
    weightDate.getDate() +
    (weightDate.getMonth() + 1) +
    weightDate.getFullYear()
  )
  .update(dashboard);
}

export function deleteWeightDashboard(weightDate,currentDate) {
  const userUID = localStorage.getItem('userUid');
  weightDate = toDate(weightDate);
  let dashboard = {poids: {
    dailyPoids: 0,
    datePoids: null
  }};  
  if(currentDate && !compareDate(weightDate, currentDate)) {
      dashboard = JSON.parse(localStorage.getItem("dashboard"));
      dashboard.poids.dailyPoids = parseFloat(0).toFixed(1)
      dashboard.poids.datePoids = null;
      localStorage.setItem("dashboard", JSON.stringify(dashboard));
  }

  firebase
      .database()
      .ref(
          "dashboard/" +
    userUID +
    "/" +
    weightDate.getDate() +
    (weightDate.getMonth() + 1) +
    weightDate.getFullYear() 
    
  )
  .update(dashboard);
}

export function initDailyPoidsList() {
  return new Promise((resolve) => {
  const userUID = localStorage.getItem('userUid');
  let weightRef = firebase.database().ref('dashboard/' + userUID)
  weightRef.orderByChild("poids/dailyPoids").once("value").then(function(snapshot){
    var dailyWeightList = []
    if(snapshot.val()) {
      for (const [,value] of Object.entries(snapshot.val())) {
        if (value.poids && value.poids.datePoids !== undefined) {
            let dateWeight = formatDate(value.poids.datePoids)
            let weight = formatWeight(value.poids.dailyPoids)
            dailyWeightList.push ({x: dateWeight, y: weight})
        }
    }
    dailyWeightList.sort(function(a,b){
      return new Date(b.x) - new Date(a.x)
    })
    }
    localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
    resolve();
  })
  })
}

export function getDailyWeightList() {
  const listeDailyPoids = localStorage.getItem("listeDailyPoids")
  return listeDailyPoids ? JSON.parse(listeDailyPoids) : [];
}

export function getLastWeightInfos(array){
  var dernier=[NaN, "NaN"]
  if (array.length > 0) {
    dernier[0] = array[0].x
    dernier[1] = array[0].y
  }
  return dernier
}

export function getTime(date) {
  return moment(date).format('HH:mm');
}

export function compareDate(date1, date2) {
  return moment(date1).format('YYYY-MM-DD').localeCompare(moment(date2).format('YYYY-MM-DD'));
}

export function updateDailyWeightListPrefUnit(dailyWeightList, oldUnitWeight, newUnitWeight) {
  let valueModifier = 1;
  if (oldUnitWeight === "KG" && newUnitWeight === "LBS") {
    valueModifier = DIFF_UNITY_WEIGHT;
  } else if (oldUnitWeight === "LBS" && newUnitWeight === "KG") {
    valueModifier = 1 / DIFF_UNITY_WEIGHT;
  } 

  dailyWeightList.map((item) => {
      item.y = parseFloat(item.y * valueModifier).toFixed(1);
      return item;
  })

  localStorage.setItem("listeDailyPoids", JSON.stringify(dailyWeightList));
  return dailyWeightList;
}

export function updateDailyWeightList(dailyWeightList, newWeight, newDate, oldDate) {
  let updatedDailyWeightList = []
  for (let i = 0; i < dailyWeightList.length; i++) {
    if(!compareDate(dailyWeightList[i].x, oldDate)) {
      dailyWeightList[i].x = newDate;
      dailyWeightList[i].y = parseFloat(newWeight).toFixed(1);
      updatedDailyWeightList.push(dailyWeightList[i])
    }

    if(compareDate(dailyWeightList[i].x, newDate)) {
      updatedDailyWeightList.push(dailyWeightList[i])
    }
  }
  
  updatedDailyWeightList.sort(function(a,b){
    return new Date(b.x) - new Date(a.x)
  })

  localStorage.setItem("listeDailyPoids", JSON.stringify(updatedDailyWeightList));
  return updatedDailyWeightList;
}

export function updateDailyWeightListDelete(dailyWeightList,item) {
  let updatedList = [...dailyWeightList]
  const index = updatedList.indexOf(item);
  if (index > -1) { 
    updatedList.splice(index, 1); 
  
  } 

  return updatedList;
}

export function updateTargetWeight(newTargetWeight, newTargetDate) {
  const userUID = localStorage.getItem('userUid');
  newTargetWeight = formatToKG(newTargetWeight)

  let preferencesPoids = {poidsCible : newTargetWeight, dateCible: newTargetDate}
  firebase.database().ref('profiles/' + userUID + "/preferencesPoids").update(preferencesPoids);

  let profile = this.getProfile();
  profile.preferencesPoids.poidsCible = newTargetWeight;
  profile.preferencesPoids.dateCible = newTargetDate;
  localStorage.setItem("profile", JSON.stringify(profile));
}