import React, { useState } from 'react';
import {
    IonTabBar, IonTabButton, IonHeader, IonIcon, IonAvatar,
    IonLabel, IonFooter, IonContent, IonPage, IonItem, IonRadioGroup, IonRadio, IonListHeader
} from '@ionic/react';
import { home, arrowDropleftCircle, settings } from 'ionicons/icons';
import '../Tab1.css';
import * as translate from '../../translate/Translator.js';


export const Languages = (props) => {
    const [selected, setSelected] = useState(translate.getLang());
    const set = (e) => {
        translate.setLang(e.detail.value);
        setSelected(e.detail.value);
    };

    return (
        <IonPage className="SizeChange">
            <IonHeader className="langHeader">
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="" href="/dashboard">
                        <IonIcon className="arrowDashItem" icon={arrowDropleftCircle} />
                    </IonTabButton>
                    <IonTabButton tab="menu">
                        <IonLabel className="headerTitle">{translate.getText("LANG_TITLE")}</IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="settings" href="/languages">
                        <IonIcon className="targetProfil "/>
                    </IonTabButton>
                </IonTabBar>
            </IonHeader>

            <IonContent>
                <IonRadioGroup value={selected} onIonChange={e => set(e) }>
                    <IonListHeader>
                        <IonLabel className="headerTitle">{translate.getText("LANG_CHOOSE_LANG")}</IonLabel>
                    </IonListHeader>

                    <IonItem class="flexCenter">
                        <IonLabel class="flexCenter">
                            <IonAvatar class="flexCenter">
                                <img class="langueFlag" src="/assets/flags/flag_UK_square-128.png" alt=""/>
                            </IonAvatar>
                            <span class="langueName">English</span>
                        </IonLabel>
                        <IonRadio class="order-3" slot="start" value="en" />
                    </IonItem>

                    <IonItem class="flexCenter">
                        <IonLabel class="flexCenter">
                            <IonAvatar class="flexCenter">
                                <img class="langueFlag" src="/assets/flags/flag_spain_square-128.png" alt=""/>
                            </IonAvatar>
                            <span class="langueName">Español</span>
                        </IonLabel>
                        <IonRadio class="order-3" slot="start" value="es" />
                    </IonItem>

                    <IonItem class="flexCenter">
                        <IonLabel class="flexCenter">
                            <IonAvatar class="flexCenter">
                                <img class="langueFlag" src="/assets/flags/flag_france_square-128.png" alt=""/>
                            </IonAvatar>
                            <span class="langueName">Français</span>
                        </IonLabel>
                        <IonRadio class="order-3" slot="start" value="fr" />
                    </IonItem>
                </IonRadioGroup>
            </IonContent>

            <IonFooter>
                <IonTabBar slot="bottom" color="light">
                    <IonTabButton tab="" href="/dashboard">
                        <IonIcon color="warning" className="target" icon={home} />
                        <IonLabel className="text"><h3>Home</h3></IonLabel>
                    </IonTabButton>
                    <IonTabButton tab="tab2" href="/settings">
                        <IonIcon color="warning" className="target" icon={settings} />
                        <IonLabel className="text"><h3>Cibler</h3></IonLabel>
                    </IonTabButton>
                </IonTabBar>
            </IonFooter>
        </IonPage>
    )

}
export default Languages;