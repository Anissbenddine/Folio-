import React, { useState, useEffect } from "react";
import firebase from "firebase";
import DatePicker from "react-datepicker";
import {
  arrowDropleftCircle,
  arrowDroprightCircle,
  arrowDropdownCircle,
  settings,
} from "ionicons/icons";
import {
  IonContent,
  IonList,
  IonPage,
  IonTabBar,
  IonIcon,
  IonTabButton,
  IonLabel,
  IonFooter,
  IonGrid,
  IonCol,
  IonRow,
  IonAlert,
  IonItem,
  IonAvatar,
  IonInput,
  IonButton,
} from "@ionic/react";
import Profil from "./Profil/Profil";
import Fruit from "./ItemsList/Food/Fruit";
import ProteinFood from "./ItemsList/Food/ProteinFood";
import Vegetables from "./ItemsList/Food/Vegetables";
import GrainFood from "./ItemsList/Food/GrainFood";
import DairyProducts from "./ItemsList/Food/DairyProducts";
import { initSampleFoodItem } from "./ItemsList/Food/Food";
import { round } from "./ItemsList/Food/Food";

import Hydratation from "./ItemsList/Hydratation";
import Glycemie from "./ItemsList/Glycemie";
import Supplements from "./ItemsList/Supplements";
import Toilettes from "./ItemsList/Toilettes";
import Activities from "./ItemsList/Activities/Activities";
import Sommeil from "./ItemsList/Sommeil/Sommeil";
import PracticeList from "./ItemsList/Activities/PracticeList";
import AlcoolList from "./ItemsList/Alcool/AlcoolList";
import Poids from "../Weight/component/Poids";
import DefaultDashboard from "./DefaultDashboard";
import FormatDate from "../../DateUtils";

import "../Tab1.css";
import Home from "../Footer/Home";
import Export from "../Footer/Export";
import * as translate from "../../translate/Translator";

import AlcoolService from "../../services/AlcoolService";

const Dashboard = (props) => {
  const [showAlert6, setShowAlert6] = useState(false);
  const [toDay, setToDaye] = useState({ startDate: new Date() });
  const [sidebarCloseDetecter, setSidebarCloseDetecter] = useState("true");
  const [currentDate, setCurrentDate] = useState({ startDate: new Date() });
  const [formatedCurrentDate, setFormatedCurrentDate] = useState("");
  const [localday, setLocalday] = useState({
    startDate: new Date().toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }),
  });

  /* useless comment */

  const accor = (divId) => {
    const divElt = document.getElementById(divId);
    if (divElt) {
      !divElt.style.display || divElt.style.display === "none"
        ? (divElt.style.display = "block")
        : (divElt.style.display = "none");
    }
  };

  const sidebarCloseHandler = () => {
    FormatDate(currentDate.startDate).then((dt) => {
      setFormatedCurrentDate(dt);
    });
    setSidebarCloseDetecter(!sidebarCloseDetecter);
  };

  const initFoodDashboardTemplate = () => {
    const foodDashboardTemplate = {
      globalMacroNutrientConsumption: {
        proteins: 0,
        carbs: 0,
        fibre: 0,
        fats: 0,
      },
      categories: {
        proteinFood: {
          macroNutrientConsumption: {
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 0,
          },
          items: [],
        },
        grainFood: {
          macroNutrientConsumption: {
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 0,
          },
          items: [],
        },
        vegetables: {
          macroNutrientConsumption: {
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 0,
          },
          items: [],
        },
        fruit: {
          macroNutrientConsumption: {
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 0,
          },
          items: [],
        },
        dairyProducts: {
          macroNutrientConsumption: {
            proteins: 0,
            carbs: 0,
            fibre: 0,
            fats: 0,
          },
          items: [],
        },
      },
    };
    return foodDashboardTemplate;
  };

  const [dashboard, setDashboard] = useState({
    hydratation: {
      dailyTarget: {
        value: 0,
        unit: "",
        globalConsumption: 0,
      },
      hydrates: DefaultDashboard.hydrates,
    },
    alcool: {
      dailyTarget: {
        value: 0,
        unit: "",
        globalConsumption: 0,
      },
      alcools: DefaultDashboard.alcools,
    },
    food: initFoodDashboardTemplate(),
    glycemie: {
      dailyGlycemie: 0,
      popupDate:0,
    },
    poids: {
      dailyPoids: 0,
    },
    toilettes: {
      feces: 0,
      urine: 0,
    },
    sommeil: {
      heure: 0,
      minute: 0,
      heureDebut: "00:00",
      heureFin: "00:00",
      nbReveils: 0,
      etatReveil: null,
    },
    supplement: {
      listeMedSup: []
    }
  });

  const [activities, setActivities] = useState([]);
  const [practices, setPracticies] = useState([]);

  const checkAllKeysAreUpToDate = (templateNode, realNode) => {
    Object.keys(templateNode).forEach((key) => {
      if (!realNode[key]) {
        realNode[key] = templateNode[key];
      }
    });
  };

  const checkAllFoodCategoriesAreDefined = (dashboard) => {
    const foodDashboardTemplate = initFoodDashboardTemplate();

    if (!dashboard.food) {
      dashboard.food = foodDashboardTemplate;
      return;
    }
    if (!dashboard.food.globalMacroNutrientConsumption) {
      dashboard.food.globalMacroNutrientConsumption =
        foodDashboardTemplate.globalMacroNutrientConsumption;
    } else {
      checkAllKeysAreUpToDate(
        foodDashboardTemplate.globalMacroNutrientConsumption,
        dashboard.food.globalMacroNutrientConsumption
      );
    }
    if (
      !dashboard.food.categories ||
      Object.keys(dashboard.food.categories).length === 0
    ) {
      dashboard.food.categories = foodDashboardTemplate.categories;
      return;
    }
    Object.keys(foodDashboardTemplate.categories).forEach((category) => {
      if (!dashboard.food.categories[category]) {
        dashboard.food.categories[category] =
          foodDashboardTemplate.categories[category];
        return;
      }
      if (!dashboard.food.categories[category].macroNutrientConsumption) {
        dashboard.food.categories[category].macroNutrientConsumption =
          foodDashboardTemplate.categories[category].macroNutrientConsumption;
      } else {
        checkAllKeysAreUpToDate(
          foodDashboardTemplate.categories[category].macroNutrientConsumption,
          dashboard.food.categories[category].macroNutrientConsumption
        );
      }
      if (!dashboard.food.categories[category].items) {
        dashboard.food.categories[category].items =
          foodDashboardTemplate.categories[category].items;
      } else {
        const sampleFoodItem = initSampleFoodItem({});
        dashboard.food.categories[category].items.forEach((item) => {
          checkAllKeysAreUpToDate(sampleFoodItem, item);
        });
      }
    });
    return;
  };

  const addMissingDashboard = (dashboard) => {
    if (!dashboard.hydratation) {
      dashboard.hydratation = {
        dailyTarget: {
          value: 0,
          unit: "",
          globalConsumption: 0,
        },
        hydrates: DefaultDashboard.hydrates,
      };
    }
    if (!dashboard.alcool) {
      dashboard.alcool = {
        dailyTarget: {
          value: 0,
          unit: "",
          globalConsumption: 0,
        },
        alcools: DefaultDashboard.alcools,
      };
    }
    checkAllFoodCategoriesAreDefined(dashboard);
    if (!dashboard.glycemie) {
      dashboard.glycemie = {
        dailyGlycemie: 0,
      };
    }
    if (!dashboard.poids) {
      dashboard.poids = {
        dailyPoids: 0,
      };
    }
    if (!dashboard.toilettes) {
      dashboard.toilettes = {
        feces: 0,
        urine: 0,
      };
    }
    if (!dashboard.sommeil) {
      dashboard.sommeil = {
        heure: 0,
        minute: 0,
        heureDebut: "00:00",
        heureFin: "00:00",
        nbReveils: 0,
        etatReveil: null,
      };
    }
    if (!dashboard.supplement) {
      dashboard.supplement = {
          listeMedSup: []
      }
    }
    return dashboard;
  };

  useEffect(() => {
    localStorage.setItem("currentDate", currentDate.startDate);
    const localDashboard = localStorage["dashboard"];
    FormatDate(currentDate.startDate).then((dt) => {
      setFormatedCurrentDate(dt);
    });

    const userUID = localStorage.getItem("userUid");

    if (localDashboard) {
      const updatedSets = addMissingDashboard(JSON.parse(localDashboard));
      localStorage.setItem("dashboard", JSON.stringify(updatedSets));
      setDashboard(updatedSets);
    } else {
      //console.log("Loading Dashboard From DB...");
      firebase
        .database()
        .ref(
          "dashboard/" +
            userUID +
            "/" +
            currentDate.startDate.getDate() +
            (currentDate.startDate.getMonth() + 1) +
            currentDate.startDate.getFullYear()
        )
        .once("value", (snapshot) => {
          const sets = snapshot.val();
          //console.log("sets::"+JSON.stringify(sets));
          if (sets) {
            const updatedSets = addMissingDashboard(sets);
            if (!sets.hydratation.hydrates) {
                sets.hydratation.hydrates = [];
              }
              if (!sets.alcool.alcools) {
                sets.alcool.alcools = [];
              }
            localStorage.setItem("dashboard", JSON.stringify(updatedSets));
            setDashboard(updatedSets);
            //console.log("DB if ::::::::::::::"+JSON.stringify(dashboard));
          } else {
            localStorage.setItem("dashboard", JSON.stringify(dashboard));
            //console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
          }
        });
      }
      firebase.database().ref("activity/" + userUID )
          .once("value", (snapshot) => {
              let activity = snapshot.val();
              if (activity) {
                  if (!(activity.practices)) {
                      activity.practices = [];
                  }
                  if (!(activity.activities)) {
                      activity.activities = [];
                  }
              }
              else {
                  activity = {practices: [], activities: []};
              }
              setActivities(activity.activities);
              setPracticies(activity.practices);
          });
    }, [])

  const updateGlobalMacroNutrientConsumption = (sets) => {
    sets.food.globalMacroNutrientConsumption = {
      proteins: 0,
      carbs: 0,
      fibre: 0,
      fats: 0,
    };
    Object.keys(sets.food.categories).forEach((category) => {
      sets.food.globalMacroNutrientConsumption.proteins = round(
        sets.food.globalMacroNutrientConsumption.proteins +
          sets.food.categories[category].macroNutrientConsumption.proteins
      );
      sets.food.globalMacroNutrientConsumption.carbs = round(
        sets.food.globalMacroNutrientConsumption.carbs +
          sets.food.categories[category].macroNutrientConsumption.carbs
      );
      sets.food.globalMacroNutrientConsumption.fibre = round(
        sets.food.globalMacroNutrientConsumption.fibre +
          sets.food.categories[category].macroNutrientConsumption.fibre
      );
      sets.food.globalMacroNutrientConsumption.fats = round(
        sets.food.globalMacroNutrientConsumption.fats +
          sets.food.categories[category].macroNutrientConsumption.fats
      );
    });
  };

  const updateFoodConsumption = function () {
    const userUID = localStorage.getItem("userUid");
    //console.log("Loading Dashboard From DB...");
    firebase
      .database()
      .ref(
        "dashboard/" +
          userUID +
          "/" +
          currentDate.startDate.getDate() +
          (currentDate.startDate.getMonth() + 1) +
          currentDate.startDate.getFullYear()
      )
      .once("value", (snapshot) => {
        const sets = snapshot.val();
        if (sets) {
          if (!sets.hydratation.hydrates) {
            sets.hydratation.hydrates = [];
          }
          if (!sets.alcool.alcools) {
            sets.alcool.alcools = [];
          }
          const updatedSets = addMissingDashboard(sets);
          updateGlobalMacroNutrientConsumption(updatedSets);
          localStorage.setItem("dashboard", JSON.stringify(updatedSets));
          setDashboard(updatedSets);
          //console.log("sa marche::" + sets.nourriture.globalConsumption);
          firebase
            .database()
            .ref(
              "dashboard/" +
                userUID +
                "/" +
                currentDate.startDate.getDate() +
                (currentDate.startDate.getMonth() + 1) +
                currentDate.startDate.getFullYear()
            )
            .update(sets);
        } else {
          // const localDashboard = localStorage['dashboard'];
          localStorage.setItem("dashboard", JSON.stringify(dashboard));
          //console.log("DB else ::::::::::::::"+JSON.stringify(localStorage));
          //console.log("sa marche pas::");
        }
      });
  };

  const nextDay = () => {
    const localDate = currentDate.startDate.setDate(
      currentDate.startDate.getDate() + 1
    );
    setCurrentDate({ startDate: new Date(localDate) });
    // need to set currentDate in localstorage
    //localStorage.setItem("currentDate", localDate);
    setLocalday({ startDate: new Date(localDate) });
    //console.log(currentDate.startDate)

    setFormatedCurrentDate(localDate);

    const userUID = localStorage.getItem("userUid");
    firebase
      .database()
      .ref(
        "dashboard/" +
          userUID +
          "/" +
          currentDate.startDate.getDate() +
          (currentDate.startDate.getMonth() + 1) +
          currentDate.startDate.getFullYear()
      )
      .once("value", (snapshot) => {
        const sets = snapshot.val();
        //console.log("dataBase" + JSON.stringify (sets));
        //console.log("BOOOOOOOOOOM")
        if (!sets) {
          //console.log("!snapshot.val()")
          firebase
            .database()
            .ref(
              "dashboard/" +
                userUID +
                "/" +
                currentDate.startDate.getDate() +
                (currentDate.startDate.getMonth() + 1) +
                currentDate.startDate.getFullYear()
            )
            .update({
              hydratation: {
                dailyTarget: {
                  value: 0,
                  unit: "",
                  globalConsumption: 0,
                },
                hydrates: DefaultDashboard.hydrates,
              },
              alcool: {
                dailyTarget: {
                  value: 0,
                  unit: "",
                  globalConsumption: 0,
                },
                alcools: DefaultDashboard.alcools,
              },
              food: initFoodDashboardTemplate(),
              glycemie: {
                dailyGlycemie: 0,
              },
              poids: {
                dailyPoids: 0,
              },
              toilettes: {
                feces: 0,
                urine: 0,
              },
              sommeil: {
                heureDebut: "00:00",
                heureFin: "00:00",
                nbReveils: 0,
                etatReveil: null,
              },
              supplement: {
                  listeMedSup: []
              }
            });
          // .then(dt => {
          //   setFormatedCurrentDate(dt);
          // });
          ///////////// USE THEN ///////////////////////////////
          firebase
            .database()
            .ref(
              "dashboard/" +
                userUID +
                "/" +
                currentDate.startDate.getDate() +
                (currentDate.startDate.getMonth() + 1) +
                currentDate.startDate.getFullYear()
            )
            .once("value", (snapshot) => {
              const set = snapshot.val();
              // const set = addMissingDashboard(JSON.parse(sets));
              localStorage.setItem("dashboard", JSON.stringify(set));
              const localDashboard = localStorage["dashboard"];

              // const sets = addMissingDashboard(JSON.parse(set));
              // localStorage.setItem('dashboard', JSON.stringify(sets));

              // localStorage.setItem('dashboard', JSON.stringify(sets));
              //  setDashboard(JSON.parse(localDashboard ));

              //console.log("Local Storage::::::" + JSON.stringify(localDashboard));
              //console.log("Local Storage::::::" + JSON.stringify(set));
              // setDashboard(localDashboard)
            });
        } else {
          //console.log("snapshot.val()")

          if (!sets.hydratation.hydrates) {
            sets.hydratation.hydrates = [];
          }
          if (!sets.alcool.alcools) {
            sets.alcool.alcools = [];
          }
          const updatedSets = addMissingDashboard(sets);
          // localStorage.setItem('dashboard', JSON.stringify(updatedSets));
          setDashboard(updatedSets);
          //console.log("Dashboard" + JSON.stringify(dashboard))
        }
      });
  };

  const prevDay = () => {
    const localDate = currentDate.startDate.setDate(
      currentDate.startDate.getDate() - 1
    );
    setCurrentDate({ startDate: new Date(localDate) });
    // need to set currentDate in localstorage
    //localStorage.setItem("currentDate", localDate);
    setLocalday({ startDate: new Date(localDate) });
    //console.log(currentDate.startDate)

    const userUID = localStorage.getItem("userUid");
    firebase
      .database()
      .ref(
        "dashboard/" +
          userUID +
          "/" +
          currentDate.startDate.getDate() +
          (currentDate.startDate.getMonth() + 1) +
          currentDate.startDate.getFullYear()
      )
      .once("value", (snapshot) => {
        const sets = snapshot.val();
        //console.log("dataBase" + JSON.stringify (sets));
        if (!sets) {
          //console.log("!snapshot.val()")
          firebase
            .database()
            .ref(
              "dashboard/" +
                userUID +
                "/" +
                currentDate.startDate.getDate() +
                (currentDate.startDate.getMonth() + 1) +
                currentDate.startDate.getFullYear()
            )
            .update({
              hydratation: {
                dailyTarget: {
                  value: 0,
                  unit: "",
                  globalConsumption: 0,
                },
                hydrates: DefaultDashboard.hydrates,
              },
              alcool: {
                dailyTarget: {
                  value: 0,
                  unit: "",
                  globalConsumption: 0,
                },
                alcools: DefaultDashboard.alcools,
              },
              food: initFoodDashboardTemplate(),
              glycemie: {
                dailyGlycemie: 0,
              },
              poids: {
                dailyPoids: 0,
              },
              toilettes: {
                feces: 0,
                urine: 0,
              },
              sommeil: {
                heureDebut: "00:00",
                heureFin: "00:00",
                nbReveils: 0,
                etatReveil: null,
              },
              supplement: {
                listeMedSup: []
              }
            });
          firebase
            .database()
            .ref(
              "dashboard/" +
                userUID +
                "/" +
                currentDate.startDate.getDate() +
                (currentDate.startDate.getMonth() + 1) +
                currentDate.startDate.getFullYear()
            )
            .once("value", (snapshot) => {
              const set = snapshot.val();
              // const set = addMissingDashboard(JSON.parse(sets));
              //localStorage.setItem('dashboard', JSON.stringify(set));

              const updatedSets = addMissingDashboard(set);
              //localStorage.setItem('dashboard', JSON.stringify(updatedSets));
              setDashboard(updatedSets);
            });
        } else {
          //console.log("snapshot.val()")

          if (!sets.hydratation.hydrates) {
            sets.hydratation.hydrates = [];
          }
          if (!sets.alcool.alcools) {
            sets.alcool.alcools = [];
          }
          const updatedSets = addMissingDashboard(sets);
          // localStorage.setItem('dashboard', JSON.stringify(updatedSets));
          setDashboard(updatedSets);
          //console.log("Dashboard" + JSON.stringify(dashboard))
        }
      });
  };

  return (
    <IonPage>
      <Profil close={sidebarCloseHandler}> </Profil>
      <IonContent>
        <div className="datePickerPage">
          <IonGrid>
            <IonRow>
              <IonCol size="2">
                <IonTabButton>
                  <IonIcon
                    className="buttonTimeLeft"
                    icon={arrowDropleftCircle}
                    onClick={() => console.log("Go Left!")}
                  />
                </IonTabButton>
              </IonCol>
              <IonCol></IonCol>
              <IonCol style={{ textAlign: "center" }}>
                <IonLabel className="datePicker">
                  {formatedCurrentDate}
                </IonLabel>
                {/* <IonCol>
            <DatePicker className="datePicker"
              selected={ currentDate.startDate}
              dateFormat="MM-dd-yyyy"
              readOnly/> 
          </IonCol> */}
              </IonCol>
              <IonCol></IonCol>
              <IonCol size="2">
                <IonTabButton>
                  <IonIcon
                    className="buttonTimeRight"
                    icon={arrowDroprightCircle}
                    onClick={() => console.log("Go Right!")}
                  />
                </IonTabButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
        <IonList>
          <Hydratation
            hydrate={dashboard.hydratation}
            hydrates={dashboard.hydratation.hydrates}
            currentDate={currentDate}
            globalConsumption={
              dashboard.hydratation.dailyTarget.globalConsumption
            }
          />
          <div>
            <IonItem className="divTitre2">
              <IonAvatar slot="start">
                <img src="/assets/nutrition.jpg" alt="" />
              </IonAvatar>
              <IonLabel>
                <h2>
                  <b>{translate.getText("FOOD_MODULE", ["title"])}</b>
                </h2>
              </IonLabel>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonButton fill="clear" size="small">
                      <span id="totalMacroNutrient">
                        {translate.getText("FOOD_MODULE", [
                          "macroNutrientSummary",
                        ])}
                        :
                      </span>
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton color="primary" shape="round" size="small">
                      {translate.getText("FOOD_MODULE", [
                        "macroNutrients",
                        "proteins",
                      ])}
                      : {dashboard.food.globalMacroNutrientConsumption.proteins}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton color="primary" shape="round" size="small">
                      {translate.getText("FOOD_MODULE", [
                        "macroNutrients",
                        "carbs",
                      ])}
                      : {dashboard.food.globalMacroNutrientConsumption.carbs}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton color="primary" shape="round" size="small">
                      {translate.getText("FOOD_MODULE", [
                        "macroNutrients",
                        "fibre",
                      ])}
                      : {dashboard.food.globalMacroNutrientConsumption.fibre}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton color="primary" shape="round" size="small">
                      {translate.getText("FOOD_MODULE", [
                        "macroNutrients",
                        "fats",
                      ])}
                      : {dashboard.food.globalMacroNutrientConsumption.fats}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonIcon
                className="arrowDashItem"
                icon={arrowDropdownCircle}
                onClick={() => accor("myDIV22")}
              />
            </IonItem>
          </div>

          <div id="myDIV22">
            <IonList id="listNourriture">
              <Fruit
                updateFoodConsumptionCallback={updateFoodConsumption}
                macroNutrientConsumption={
                  dashboard.food.categories.fruit.macroNutrientConsumption
                }
                foodItems={dashboard.food.categories.fruit.items}
                currentDate={currentDate}
              />
              <ProteinFood
                updateFoodConsumptionCallback={updateFoodConsumption}
                macroNutrientConsumption={
                  dashboard.food.categories.proteinFood.macroNutrientConsumption
                }
                foodItems={dashboard.food.categories.proteinFood.items}
                currentDate={currentDate}
              />
              <Vegetables
                updateFoodConsumptionCallback={updateFoodConsumption}
                macroNutrientConsumption={
                  dashboard.food.categories.vegetables.macroNutrientConsumption
                }
                foodItems={dashboard.food.categories.vegetables.items}
                currentDate={currentDate}
              />
              <GrainFood
                updateFoodConsumptionCallback={updateFoodConsumption}
                macroNutrientConsumption={
                  dashboard.food.categories.grainFood.macroNutrientConsumption
                }
                foodItems={dashboard.food.categories.grainFood.items}
                currentDate={currentDate}
              />
              <DairyProducts
                updateFoodConsumptionCallback={updateFoodConsumption}
                macroNutrientConsumption={
                  dashboard.food.categories.dairyProducts
                    .macroNutrientConsumption
                }
                foodItems={dashboard.food.categories.dairyProducts.items}
                currentDate={currentDate}
              />
            </IonList>
          </div>

          <Supplements currentDate={currentDate} />
          <Glycemie glycemie={dashboard.glycemie} currentDate={currentDate} />
          <Toilettes
            toilettes={dashboard.toilettes}
            currentDate={currentDate}
          />
          <Activities key={practices.length} currentDate={currentDate} practices={practices} activities={activities}/>
          <Sommeil currentDate={currentDate} sommeil={dashboard.sommeil} />
          <AlcoolList
            alcoolService={AlcoolService}
            alcool={dashboard.alcool}
            alcools={dashboard.alcool.alcools}
            globalConsumption={dashboard.alcool.dailyTarget.globalConsumption}
            currentDate={currentDate}
          />
          <Poids
            poids={dashboard.poids}
            currentDate={currentDate}
            sidebarCloseDetecter={sidebarCloseDetecter}
          />
        </IonList>
      </IonContent>

      <IonFooter>
        <IonTabBar slot="bottom" color="light">
          <IonTabButton tab="tab1" href="/dashboard">
            <Home />
          </IonTabButton>
          <IonTabButton tab="" href="/export">
            <Export />
          </IonTabButton>
          <IonTabButton tab="tab2" href="/settings">
            <IonIcon color="warning" className="target" icon={settings} />
            <IonLabel className="text">
              <h3>Cibler</h3>
            </IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </IonPage>
  );
};
export default Dashboard;
