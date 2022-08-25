import { 
    IonList,
    IonLabel,
    IonItem
 } from "@ionic/react";
import React, {useEffect, useRef} from "react";
import "./Supplements.css";
import * as supplementsService from "./SupplementsService"
import * as translate from '../../../../translate/Translator'
import './Supplements.css';

const ListeMedSup = (props) => {
    const VALEURS_SUPP_PAR_DEFAUT = useRef([
        "Supplement",
        "Suplemento", 
        "Supplément"
    ]);
    
    const VALEURS_TYPE_MED_PAR_DEFAUT = useRef([
        "Medicament",
        "Medicamento",
        "Médicament"
    ]);

    useEffect(() => {
        supplementsService.mettreAJourListeMedSupLocale();
    });

    const listeSupplements = () => {
        const supplementsLocaux = localStorage.getItem('supplements') ? JSON.parse(localStorage.getItem('supplements')) : "";

        if (listeMedSupEstVide(supplementsLocaux)) {
            return(
            <IonLabel>
                {translate.getText("SUPPL_LISTE_MED_VIDE")}
            </IonLabel>);
        }

        let listeMedSupLocale = supplementsLocaux.listeMedSup;
        let supplementsSeulement = listeMedSupLocale.filter(medSup => VALEURS_SUPP_PAR_DEFAUT.current.includes(medSup.typeChoisi));

        supplementsSeulement.sort((sup1, sup2) => sup1.nomChoisi.localeCompare(sup2.nomChoisi));

        if(listeEstVide(supplementsSeulement)) {
            return(
            <IonLabel>
                {translate.getText("SUPPL_LISTE_SUP_VIDE")}
            </IonLabel>);
        }

        return (
            <IonList>
                <IonItem>
                    <IonLabel 
                    color="light"
                    className="categorie">
                        {translate.getText("SUPPL_LISTE_SUP")}
                    </IonLabel>
                </IonItem>

                {supplementsSeulement.map((supplement, index) =>
                    <IonItem key={"" + supplement.nomChoisi + index}>
                        <IonLabel 
                        color="light"
                        className="labelMedSupp">{supplement.nomChoisi}</IonLabel>
                        <IonLabel color="light">
                            {"" + supplement.quantiteChoisie + " " + supplement.formatDoseChoisi}
                        </IonLabel>
                    </IonItem>
                )}
            </IonList>
        );
    }

    const listeMedicaments = () => {
        const supplementsLocaux = localStorage.getItem('supplements') ? JSON.parse(localStorage.getItem('supplements')) : "";

        if (listeMedSupEstVide(supplementsLocaux)) {
            return(
            <IonLabel>
                {translate.getText("SUPPL_LISTE_MED_VIDE")}
            </IonLabel>);
        }

        let listeMedSupLocale = supplementsLocaux.listeMedSup;
        let medicamentsSeulement = listeMedSupLocale.filter(medSup => VALEURS_TYPE_MED_PAR_DEFAUT.current.includes(medSup.typeChoisi));

        medicamentsSeulement.sort((med1, med2) => med1.nomChoisi.localeCompare(med2.nomChoisi));

        if(listeEstVide(medicamentsSeulement)) {
            return(
            <IonLabel>
                {translate.getText("SUPPL_LISTE_MED_VIDE")}
            </IonLabel>);
        }

        return (
            <IonList>
                <IonItem>
                    <IonLabel 
                    color="light"
                    className="categorie">
                        {translate.getText("SUPPL_LISTE_MED")}
                    </IonLabel>
                </IonItem>
                
                {medicamentsSeulement.map((medicament, index) =>
                    <IonItem key={"" + medicament.nomChoisi + index}>
                        <IonLabel 
                        color="light"
                        className="labelMedSupp">{medicament.nomChoisi}</IonLabel>
                        <IonLabel color="light">
                            {"" + medicament.quantiteChoisie + " " + medicament.formatDoseChoisi}
                        </IonLabel>
                    </IonItem>
                )}
            </IonList>
        );
    }

    const listeMedSupEstVide = (supplements) => {
        return !supplements || (supplements && !supplements.listeMedSup)
    }

    const listeEstVide = (liste) => {
        return !liste || (liste && liste.length === 0);
    }

    return (
    <div data-testid="listeMedSup">
        {listeSupplements()}
        {listeMedicaments()}
    </div>);
};

export default ListeMedSup;