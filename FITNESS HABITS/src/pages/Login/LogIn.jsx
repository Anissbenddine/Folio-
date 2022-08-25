import "firebase/storage";
import "firebase/auth";
import React, { useState} from "react";
import { IonInput, IonGrid, IonItem, IonRow, IonCol, IonPage, IonButton, IonLoading, IonIcon } from "@ionic/react";
import * as translate from "../../translate/Translator"
/* les imports de l'équipe GEFRAL */
import {arrowForward} from "ionicons/icons";
import  HandleLogin  from "./HandleLogin";


const LogIn = (props) => {
    const [username, setUsername]= useState("");
    const [password, setPassword]= useState("");
    const [busy, setBusy]= useState(false);
    const flags = {
        email_flag: false,
        facebook_flag: false,
        google_flag: false,
    }

    async function handleSubmit() {
        HandleLogin(username, password, props, setBusy, flags);
    }

    return (
        <IonPage className="fondIntro">
            <IonGrid>
                <IonRow className="">
                    <IonCol>
                    </IonCol>
                    <IonCol size="8">
                        <img className="logoIntro" src="/assets/LogoLegion.svg" alt="Logo" />
                    </IonCol>
                    <IonCol>
                    </IonCol>
                </IonRow>

                {/*Bout de code rajouté par l'équipe Gefral */}
                <IonRow style={{marginBottom:30}}>
                    <IonCol size="12" >
                        <IonButton id="facebook" className="btn-home" onClick={() => { flags.facebook_flag = true; handleSubmit() }}>
                            <IonCol size="1" >
                                <img src="/assets/socials/facebookLogo.svg" width="100%" height="100%" alt="Logo_texte" />
                            </IonCol>
                            {translate.getText("AUTH_FED_CONNECT_FB")}
                        </IonButton>
                        {/* <IonButton className="btn-home" onClick={() => { setFlags(prevState => ({ ...prevState, google_flag: true })); handleSubmit()}}> */}
                        <IonButton className="btn-home" onClick={() => { flags.google_flag = true;handleSubmit() }}>

                            <IonCol size="1" >
                                <img src="/assets/socials/googleLogo.svg" width="100%" height="100%" alt="Logo_texte" />
                            </IonCol>
                            {translate.getText("AUTH_FED_CONNECT_GOOGLE")}
                            <IonIcon icon={arrowForward}/>
                        </IonButton>
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol>
                        <IonLoading message={translate.getText("WAIT")} duration={0} isOpen={busy} />
                        <IonItem color="transparent" lines="none">
                            <IonInput type="input" className="input-login-name" placeholder={translate.getText("USER_NAME")} onIonChange={(e) => setUsername(e.target.value)}/>
                        </IonItem>
                        <IonItem color="transparent" lines="none" style={{marginBottom:20}}>
                            <IonInput id="password" className="input-login-password" type="password" placeholder={translate.getText("PASSWORD")} onIonChange={(e) => setPassword(e.target.value)}/>
                        </IonItem>
                        
                        <IonButton id="login-click" className="input-login-click btn-home" style={{marginBottom:20}}  size="large" onClick={() => { flags.email_flag = true; handleSubmit() }} >{translate.getText("CONNECT")}</IonButton>
                        <IonButton className="btn-home" color="secondary" href="/register">{translate.getText("NEW_REGISTER")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
};

export default LogIn;