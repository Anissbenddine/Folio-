import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import LogIn from "./pages/Login/LogIn";
import Register from "./pages/Register/Register";
import Intro from "./pages/Intro/Intro";
import Dashboard from "./pages/Dashboard/Dashboard";
import Languages from "./pages/Dashboard/Languages";
import GrapheGlycemie from "./pages/GrapheGlycemie/graphe";
import Settings from "./pages/Settings/Settings";
import Export from "./pages/Export/Export";
import ConfigurationPoids from "./pages/Weight/component/configuration";
import { Settings as LuxonSettings } from "luxon";
import GlycemieInitial from "./pages/Glycemie/Initial";
import GlycemieAjout from "./pages/Glycemie/Ajout";
import SommeilPage from "./pages/Sommeil/SommeilPage";
import detailsWeight from "./pages/Weight/component/detailsWeight";
import DetailGlycemie from "./pages/Glycemie/detailGlycemie";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { getCurrentUser } from "./firebaseConfig";

const RoutingSystem = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/logIn" component={LogIn} />
          <Route path="/register" component={Register} />
          <Route path="/export" component={Export} />
          <Route path="/settings" component={Settings} />
          <Route path="/intro" component={Intro} exact={true} />
          <Route path="/glycemie" component={GlycemieInitial} />
          <Route path="/grapheGlycemie" component={GrapheGlycemie} />
          <Route path="/glycemieAjout" component={GlycemieAjout} />
          <Route path="/configurationPoids" component={ConfigurationPoids} />
          <Route path="/languages" component={Languages} />
          <Route path="/sleep" component={SommeilPage} />
          <Route path="/detailsWeight" component={detailsWeight} />
          <Route path="/detailGlycemie" component={DetailGlycemie} />
          <Route
            path="/"
            render={() => <Redirect to="/intro" />}
            exact={true}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

const App = () => {
  const [user, setUser] = useState(getCurrentUser());
  LuxonSettings.defaultLocale = "fr";
  useEffect(() => {
    setUser(user);
    getCurrentUser().then((user) => {
      if (user) {
        //window.history.replaceState({}, "", "/dashboard");
      } else {
        window.history.replaceState({}, "", "/");
      }
    });
  }, [user]);
  return <IonApp className="fondIntro">{<RoutingSystem />}</IonApp>;
};
export default App;
