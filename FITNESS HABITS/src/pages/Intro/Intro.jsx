import React from 'react';
import { IonGrid, IonPage, IonButton, IonCol, IonRow } from '@ionic/react';
import * as translate from "../../translate/Translator";

const Intro = () => {
    translate.initLangue();
    return (
        <IonPage className="intro">
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <img className="intro-logo" src="/assets/LogoLegion.svg" alt={translate.getText("ALT_LOGO")} />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <img src="/assets/LogoCadre.svg" alt={translate.getText("ALT_LOGO_TXT")}/>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton size="large" class="btn-home" routerLink="/login">{translate.getText("CONNECT")}</IonButton>
                    </IonCol>
                    <IonCol>
                        <IonButton size="large"  class="btn-home" routerLink="/register">{translate.getText("REGISTER")}</IonButton>
                    </IonCol>                
                </IonRow>
            </IonGrid>
        </IonPage>
    )
}

export default Intro;