import React, { useState } from "react";
import { IonInput, IonGrid, IonRow, IonCol, IonPage, IonButton, IonItem } from "@ionic/react";
import * as translate from "../../translate/Translator"
import { signUp } from "./Register.Utilities";
import { useHistory } from "react-router";

const Register = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    let history = useHistory()

    async function signUpButtonEnter() {
        const response = await signUp(username, password, confirmPassword)

        if (response) history.push("/dashboard")
    }

    return (
        <IonPage className="fondIntro">
            <IonGrid >
                <IonRow style={{ marginBottom: 30 }}>
                    <IonCol size="8" offset="2">
                        <img className="logoIntro" src="/assets/LogoLegion.svg" width="100%" height="100%" alt="Logo" />
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol style={{ marginBottom: 30 }}>
                        {/* <IonLoading message="Registration in progress!" duration={10} isOpen={busy}/> */}
                        <IonItem color="transparent" lines="none">
                            <IonInput className="input-login" placeholder={translate.getText("USER_NAME")} onIonChange={(e) => setUsername(e.target.value)} />
                        </IonItem>
                        <IonItem color="transparent" lines="none">
                            <IonInput className="input-login" type="password" placeholder={translate.getText("PASSWORD")} onIonChange={(e) => setPassword(e.target.value)} />
                        </IonItem>
                        <IonItem color="transparent" lines="none">
                            <IonInput className="input-login" type="password" placeholder={translate.getText("CONFIRM_PASWORD")} onIonChange={(e) => setconfirmPassword(e.target.value)} />
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonButton data-testid="btn-register" className="btn-home" onClick={signUpButtonEnter}>{translate.getText("REGISTER")}</IonButton>
                        <IonButton className="btn-home" color="secondary" href="/login">{translate.getText("ALREADY_REGISTERED")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonPage>
    );
};
export default Register;