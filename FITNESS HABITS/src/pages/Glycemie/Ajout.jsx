import firebaseDb from "../../firebaseConfig"
import React, { useState } from 'react';
import { arrowBack } from "ionicons/icons";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonCard,
    IonButton,
    IonCardContent,
    IonDatetime,
    IonCardHeader,
    IonCardTitle,
    IonSelectOption,
    IonSelect
} from "@ionic/react";
import '../Tab1.css'


const Ajout = () => {

    const initialValues = {
        id: '',
        jour: [],
        heure: '',
        notifierAvant: ''    }

    var [values, setValues] = useState(initialValues)

    const handleInputChange = e => {
        var { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleFormSubmit = e => {
        e.preventDefault();
        add(values)
    }

    const add = obj => {
        firebaseDb.child('NotificationGlycemie').push(
            obj,
            err => {
                if (err)
                    console.log(err);
                else {
                    window.location.href = "/glycemie"
                }
            }
        )
    }

    const jour = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    return (
        <div>
            <IonPage>

                <IonHeader className="notGlyAdd">
                    <IonToolbar>
                        <IonTitle class="titre">Nouveau horaire</IonTitle>
                    </IonToolbar>

                    <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                        <IonFabButton routerDirection="back" href="/glycemie" size="small">
                            <IonIcon icon={arrowBack} />
                        </IonFabButton>
                    </IonFab>
                </IonHeader>

                <IonContent>

                    <form onSubmit={handleFormSubmit}>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Jour</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonSelect multiple={true} name="jour" onIonChange={handleInputChange} value={values.jour} >
                                    {jour.map((option, i) => (
                                    <IonSelectOption value={option} key={i}>{option}</IonSelectOption>))} 
                                </IonSelect>
                            </IonCardContent>

                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Heure</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonDatetime display-format="h:mm A" name="heure" picker-format="h:mm: A" onIonChange={handleInputChange} value={values.heure}></IonDatetime>
                            </IonCardContent>
                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Notifier avant:</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonDatetime name="notifierAvant" display-format="mm" picker-format="mm" value={values.notifierAvant} onIonChange={handleInputChange}></IonDatetime>
                            </IonCardContent>
                        </IonCard>

                        <IonButton expand="block" type="submit">Ajouter</IonButton>
                    </form>
                </IonContent>
            </IonPage>
        </div>
    );


};

export default Ajout;
