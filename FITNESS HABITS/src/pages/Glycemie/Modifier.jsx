import firebaseDb from "../../firebaseConfig";
import React, { useState, useEffect } from 'react';
import '../Tab1.css'
import {
    IonCard,
    IonButton,
    IonCardContent,
    IonDatetime,
    IonCardHeader,
    IonCardTitle,
    IonPage,
    IonSelect,
    IonSelectOption
} from "@ionic/react";


const Modifier = (props) => {

    const initialFieldValues = {
        id: '',
        jour: '',
        heure: '',
        notifierAvant: ''
    }

    var [values, setValues] = useState(initialFieldValues)

    // populate fields
    useEffect(() => {
        if (props.currentId == '')
            setValues({
                ...initialFieldValues
            })
        else
            setValues({
                ...props.glycemie[props.currentId]
            })
    }, [props.currentId, props.glycemie])

    // edit db
    const edit = obj => {
        firebaseDb.child(`NotificationGlycemie/${props.currentId}`).set(
            obj,
            err => {
                if (err)
                    console.log(err);
                else
                    window.location.href = "/glycemie";
            }
        )
    }

    const handleInputChange = e => {
        var { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleFormSubmit = e => {
        e.preventDefault();
        edit(values)
    }

    const jour = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

    return (
        <IonPage>

            <form onSubmit={handleFormSubmit}>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>Jour</IonCardTitle>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonSelect name="jour" multiple={true} value={values.jour} onIonChange={handleInputChange}>
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
                        <IonDatetime name="heure" display-format="h:mm A" picker-format="h:mm: A" value={values.heure} onIonChange={handleInputChange}></IonDatetime>
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

                <IonButton expand="block" type="submit">Terminer</IonButton>
            </form>

        </IonPage>
    );

};

export default Modifier;
