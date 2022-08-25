import React, { useEffect, useState, useRef } from "react";
import {
  IonInput,
  IonList,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonAvatar,
  IonSelectOption,
  IonSelect,
  IonRadioGroup,
  IonDatetime,
  IonToggle,
  IonCheckbox,
  IonItemGroup,
  IonItemDivider,
  IonAlert,
  IonModal,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonRow,
  IonCol,
} from "@ionic/react";
import { arrowDropdownCircle, arrowBack } from "ionicons/icons";
import * as translate from '../../../translate/Translator'
import { toast } from '../../../Toast';
import './Supplements/Supplements.css';
import { calendar, trash, add, save } from "ionicons/icons";
import ListeMedSup from "./Supplements/listeSupplements";
import * as supplementsService from "./Supplements/SupplementsService"


import "../../Tab1.css";

const Supplements = (props) => {
  const [formulaireAjoutEstAffiche, setFormulaireAjoutEstAffiche] = useState(false);
  const [listeEstAffiche, setListeEstAffiche] = useState(false);
  const [afficherAlerteAjoutRestriction, setAfficherAlerteAjoutRestriction] = useState(false);
  const [afficherAlerteAjoutFormatDose, setAfficherAlerteAjoutFormatDose] = useState(false);
  const [afficherMenu, setAfficherMenu] = useState(false);
  const [formatsDose, setFormatsDose] = useState([
    translate.getText("SUPPL_FORME_TABLET"),
    translate.getText("SUPPL_FORME_CAPSULE"),
    translate.getText("SUPPL_FORME_SIROP"),
    translate.getText("SUPPL_FORME_DROP"),
    translate.getText("SUPPL_FORMAT_BOUTEILLE"),
    translate.getText("SUPPL_FORMAT_GEL"),
    translate.getText("SUPPL_FORMAT_INJECTION")
  ]);
  const [restrictions, setRestrictions] = useState([
    { valeur: translate.getText("SUPPL_RESTRICTION_JEUN"), estCoche: false },
    { valeur: translate.getText("SUPPL_RESTRICTION_MANGEANT"), estCoche: false }]);
  const [nomChoisi, setNomChoisi] = useState("");
  const [typeChoisi, setTypeChoisi] = useState("");
  const [quantiteChoisie, setQuantiteChoisie] = useState("");
  const [formatDoseChoisi, setFormatDoseChoisi] = useState("");
  const [restrictionsChoisies, setRestrictionsChoisies] = useState([]);
  const [nombreDosesChoisi, setNombreDosesChoisi] = useState("");
  const [heuresChoisies, setHeuresChoisies] = useState([{ heure: "" }]);
  const [moisToggle, setMoisToggle] = useState(false);
  const [joursSemaineChoisis, setjoursSemaineChoisis] = useState([]);
  const [joursMoisChoisis, setJoursMoisChoisis] = useState([{ jour: "" }]);
  const [dateDebutChoisie, setDateDebutChoisie] = useState(props.currentDate.startDate.toLocaleDateString());
  const [dateFinChoisie, setDateFinChoisie] = useState(() => {
    const dateFinInitiale = new Date();
    dateFinInitiale.setDate(dateFinInitiale.getDate() + 1);

    return dateFinInitiale.toLocaleDateString();
  });
  const [statutActifChoisi, setStatutActifChoisi] = useState(true);
  const [possedeDateFin, setPossedeDateFin] = useState(false);
  const [formulaireAjoutAEteSoumis, setFormulaireAjoutAEteSoumis] = useState(false);
  const [formatFavoriUtilisateur, setFormatFavoriUtilisateur] = useState("MM-DD-YYYY");

  const heurePriseEstCliqueParUtilisateur = useRef(false);
  const jourPrisEstCliqueParUtilisateur = useRef(false);

  useEffect(() => {
    supplementsService.initSupplements();
    formatterDates();
  });

  const formatterDates = () => {
    const profilLocal = localStorage.getItem("profile");

    if (!profilLocal) {
      return;
    }

    let formatPrefere = JSON.parse(profilLocal).dateFormat;

    let regexDate = /L/g;

    setFormatFavoriUtilisateur(formatPrefere.toUpperCase().replace(regexDate,"M"));
  }

  const handleSave = () => {
    setFormulaireAjoutAEteSoumis(true);

    if (!donneesAjoutSontValides()) {
      return toast(translate.getText("SUPPL_AJOUT_ERREUR"));
    }

    let nouveauSupp = {};

    nouveauSupp.nomChoisi = nomChoisi;
    nouveauSupp.typeChoisi = typeChoisi;
    nouveauSupp.quantiteChoisie = quantiteChoisie;
    nouveauSupp.formatDoseChoisi = formatDoseChoisi;
    nouveauSupp.restrictionsChoisies = restrictionsChoisies;
    nouveauSupp.nombreDosesChoisi = nombreDosesChoisi;
    nouveauSupp.heuresChoisies = heuresChoisies;

    if (!moisToggle) {
      nouveauSupp.joursSemaineChoisis = joursSemaineChoisis;
    } else {
      nouveauSupp.joursMoisChoisis = joursMoisChoisis;
    }

    nouveauSupp.dateDebutChoisie = dateDebutChoisie;

    if (possedeDateFin) {
      nouveauSupp.dateFinChoisie = dateFinChoisie;
    }

    nouveauSupp.statutActifChoisi = statutActifChoisi;

    const userUID = localStorage.getItem('userUid');

    if (!userUID) {
      return toast(translate.getText("SUPPL_ERREUR_CONNEXION"));
    }

    supplementsService.sauvegarderSuppDansBd(nouveauSupp, userUID);

    setFormulaireAjoutEstAffiche(false);
    setFormulaireAjoutAEteSoumis(false);
    toast(translate.getText("DATA_SAVED"));
  }

  const donneesAjoutSontValides = () => {
    return nomChoisiEstValide() && typeChoisiEstValide() && quantiteChoisieEstValide() && formatDoseChoisiEstValide() &&
      nombreDosesChoisiEstValide() && heuresChoisiesSontValides() &&
      joursSemaineChoisisSontValides() && joursMoisChoisisSontValides() && dateDebutChoisieEstValide()
      && dateFinChoisieEstValide();
  }

  const nomChoisiEstValide = () => {
    return nomChoisi;
  }

  const typeChoisiEstValide = () => {
    return typeChoisi;
  }

  const quantiteChoisieEstValide = () => {
    return quantiteChoisie;
  }

  const formatDoseChoisiEstValide = () => {
    return formatDoseChoisi;
  }

  const nombreDosesChoisiEstValide = () => {
    return nombreDosesChoisi;
  }

  const heuresChoisiesSontValides = () => {
    if (!heuresChoisies || heuresChoisies.length <= 0) {
      return false;
    }

    for (let i = 0; i < heuresChoisies.length; i++) {
      if (!heureChoisieCouranteEstValide(i)) {
        return false;
      }
    }

    return true;
  }

  const heureChoisieCouranteEstValide = (indexHeureChoisieCourante) => {
    return heuresChoisies.length > indexHeureChoisieCourante && heuresChoisies[indexHeureChoisieCourante].heure;
  }

  const joursSemaineChoisisSontValides = () => {
    return moisToggle || (!moisToggle && joursSemaineChoisis && joursSemaineChoisis.length > 0);
  }

  const joursMoisChoisisSontValides = () => {
    if (!moisToggle) {
      return true;
    }

    if (moisToggle && (!joursMoisChoisis || joursMoisChoisis.length <= 0)) {
      return false;
    }

    for (let i = 0; i < joursMoisChoisis.length; i++) {
      if (!jourMoisChoisiCourantEstValide(i)) {
        return false;
      }
    }

    return true;
  }

  const jourMoisChoisiCourantEstValide = (indexjourMoisChoisiCourant) => {
    return joursMoisChoisis.length > indexjourMoisChoisiCourant && joursMoisChoisis[indexjourMoisChoisiCourant].jour;
  }

  const dateDebutChoisieEstValide = () => {
    return dateDebutChoisie;
  }

  const dateFinChoisieEstValide = () => {
    return !possedeDateFin || (possedeDateFin && dateDebutChoisie <= dateFinChoisie);
  }

  function mettreAJourRestrictionsChoisies(valeurRestriction, estCochee) {
    setRestrictions(restrictions.map(restrictionCourante => {
      if (restrictionCourante.valeur === valeurRestriction) {
        restrictionCourante.estCoche = estCochee;
      }
      return restrictionCourante;
    }));

    if (estCochee) {
      setRestrictionsChoisies(restrictionsChoisiesCourantes => [...restrictionsChoisiesCourantes, valeurRestriction]);
    } else {
      setRestrictionsChoisies(restrictionsChoisies.filter(restrictionCourante => restrictionCourante !== valeurRestriction));
    }
  }

  function ajouterHeure() {
    setHeuresChoisies([...heuresChoisies, { heure: "" }]);
  }

  function supprimerHeure(indexHeure) {
    setHeuresChoisies(heuresChoisies.filter((_heureCourante, indexCourant) => indexCourant !== indexHeure));
  }

  function gererChangementValeurHeureChoisie(indexHeure, nouvelleHeure, cibleOrigineEvenement) {
    //Le ionChangeEvent est lancé lorsque l'on supprime l'une des heures choisies, la mise à jour
    //des heures choisies ne doit pas être faite une deuxième fois après une suppression.
    if (heurePriseEstCliqueParUtilisateur.current) {
      mettreAJourHeuresChoisies(indexHeure, nouvelleHeure)
      heurePriseEstCliqueParUtilisateur.current = false;
    }
  }

  function mettreAJourHeuresChoisies(indexHeure, nouvelleHeure) {
    setHeuresChoisies(heuresChoisies.map((heureCourante, indexCourant) => {
      if (indexCourant === indexHeure) {
        heureCourante.heure = nouvelleHeure;
      }
      return heureCourante;
    }));
  }

  function gererClicHeurePrise() {
    heurePriseEstCliqueParUtilisateur.current = true;
  }

  function ajouterJour() {
    setJoursMoisChoisis([...joursMoisChoisis, { jour: "" }]);
  }
  function supprimerJour(indexJour) {
    setJoursMoisChoisis(joursMoisChoisis.filter((_jourCourant, indexCourant) => indexCourant !== indexJour));
  }


  function gererChangementValeurJourChoisi(indexJour, nouveauJour, cibleOrigineEvenement) {
    if (jourPrisEstCliqueParUtilisateur.current) {
      mettreAJourjoursChoisis(indexJour, nouveauJour)
      jourPrisEstCliqueParUtilisateur.current = false;
    }
  }


  function mettreAJourjoursChoisis(indexJour, nouveauJour) {
    setJoursMoisChoisis(joursMoisChoisis.map((jourCourant, indexCourant) => {
      if (indexCourant === indexJour) {
        jourCourant.jour = nouveauJour;
      }
      return jourCourant;
    }));
  }

  function gererClicJourPris() {
    jourPrisEstCliqueParUtilisateur.current = true;
  }

  return (
    <div>
      <IonItem className="divTitre3">
        <IonItemDivider className="divIconeSupp">
          <div className="iconeSize" data-testid="btn-open" onClick={() => setAfficherMenu(!afficherMenu)}>
            <IonImg src="/assets/pills_blanc_fr.png" />
          </div>
          <div className="point"></div>
        </IonItemDivider>
        <IonItemDivider class="divInfos">
          <div className="leftInfos">
            <div className="titreSupp">
              {translate.getText("SUPPL_TITLE")}
            </div>
            <div className="supp-text-sm">
              {translate.getText("SUPPL_SECOND_TITLE")}
            </div>
          </div>

          <div className="rightInfos">
            <div className="titreSupp">00%</div>
            <div className="supp-text-sm">100%</div>

          </div>
        </IonItemDivider>

      </IonItem>
      <IonModal data-testid="menu" isOpen={afficherMenu}>
        <IonHeader>
          <IonToolbar id="banniereHeader">
            <IonItem color="transparent" lines="none">
              <IonButton fill="clear" onClick={() => setAfficherMenu(!afficherMenu)}>
                <IonIcon id="iconeRetourMenu" data-testid="iconeRetourMenu" icon={arrowBack}></IonIcon>
              </IonButton>
              <IonTitle id="titreMenu">{translate.getText("SUPPL_TITLE")}</IonTitle>
            </IonItem>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <div id="myDIVSuppl">
            <IonList>
             
              <IonItem className="trashButton" color="red">
                  <IonAvatar slot="start">
                    <img src="/assets/suppl/plus.png" alt="" />
                  </IonAvatar>
                  <IonLabel>
                    <h2>
                      <b>{translate.getText("SUPPL_ADD")}</b>
                    </h2>
                  </IonLabel>
                  <IonIcon
                    data-testid="boutonAjouterSupplement"
                    className="arrowDashItem"
                    icon={arrowDropdownCircle}
                    onClick={() => setFormulaireAjoutEstAffiche(!formulaireAjoutEstAffiche)}
                  />
                </IonItem>

              {formulaireAjoutEstAffiche && 
              <div id="myDIVAjoutSupp1" data-testid="formulaireAjouterSupplement">
                <IonItem>
                  <IonLabel className="border" color="light">{translate.getText("SUPPL_NOM")}</IonLabel>
                  <IonInput
                    className={`inputSuppConsom ${formulaireAjoutAEteSoumis && !nomChoisiEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                    value={nomChoisi}
                    onIonChange={e => setNomChoisi(e.detail.value)}></IonInput>
                </IonItem>

                <IonItemGroup>
                  <IonItemDivider className="categorie">
                    <IonLabel color="light">{translate.getText("SUPPL_TYPE")}</IonLabel>
                  </IonItemDivider>
                  <div className="border">
                    <IonRadioGroup
                      value={typeChoisi}
                      onIonChange={e => setTypeChoisi(e.detail.value)}>
                      <IonItem>
                        <IonLabel
                          className={`${formulaireAjoutAEteSoumis && !typeChoisiEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                          color="light">{translate.getText("SUPPL_SUPPPLEMENT")}</IonLabel>
                        <ion-radio value={translate.getText("SUPPL_SUPPPLEMENT")}></ion-radio>
                      </IonItem>
                      <IonItem>
                        <IonLabel
                          className={`${formulaireAjoutAEteSoumis && !typeChoisiEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                          color="light">{translate.getText("SUPPL_MEDICAMENT")}</IonLabel>
                        <ion-radio value={translate.getText("SUPPL_MEDICAMENT")}></ion-radio>
                      </IonItem>
                    </IonRadioGroup>
                  </div>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider className="categorie">
                    <IonLabel color="light">{translate.getText("SUPPL_DOSE")}</IonLabel>
                  </IonItemDivider>
                  <div className="border">
                    <IonItem>
                      <IonLabel color="light">{translate.getText("SUPPL_QUANTITE")}</IonLabel>
                      <IonInput
                        className={`inputSuppConsom ${formulaireAjoutAEteSoumis && !quantiteChoisieEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                        id="inputDose"
                        type="number"
                        value={quantiteChoisie}
                        onIonChange={e => setQuantiteChoisie(e.detail.value)}></IonInput>
                    </IonItem>

                    <IonItem >
                      <IonSelect
                        color="light"
                        placeholder={translate.getText("SUPPL_FORMAT")}
                        className={`inputSuppConsom ${formulaireAjoutAEteSoumis && !formatDoseChoisiEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                        id="suppSelect"
                        value={formatDoseChoisi}
                        onIonChange={e => setFormatDoseChoisi(e.detail.value)}
                        slot="start"
                      >
                        {formatsDose.map(formatDose =>
                          <IonSelectOption value={formatDose} key={formatDose}>{formatDose}</IonSelectOption>
                        )}
                      </IonSelect>
                    </IonItem>

                    <IonItem>
                      <IonButton

                        expand="block"
                        onClick={() => setAfficherAlerteAjoutFormatDose(true)}
                        shape="round"
                      >
                        <IonIcon className="add-icon" icon={add} ></IonIcon>
                      </IonButton>
                      <IonAlert
                        isOpen={afficherAlerteAjoutFormatDose}
                        onDidDismiss={() => setAfficherAlerteAjoutFormatDose(false)}
                        header={translate.getText("SUPPL_NOUVEAU_FORMAT")}
                        inputs={[
                          {
                            name: "nouveauFormat",
                            type: "text"
                          }]}
                        buttons={[
                          {
                            text: translate.getText("SUPPL_CANCEL"),
                            role: "cancel",
                          },
                          {
                            text: translate.getText("SUPPL_ADD_SELECT"),
                            handler: (donneesAlerte) => {
                              setFormatsDose(formatsDoseCourants => [...formatsDoseCourants, donneesAlerte.nouveauFormat]);
                            }
                          }
                        ]}
                      />
                    </IonItem>
                  </div>
                  <IonItemDivider className="categorie">
                    <IonLabel color="light">{translate.getText("SUPPL_RESTRICTION")}</IonLabel>
                  </IonItemDivider>
                  <div className="border">
                    {restrictions.map(restriction =>
                      <IonItem key={restriction.valeur}>
                        <IonLabel color="light">{restriction.valeur}</IonLabel>
                        <IonCheckbox
                          color="primary"
                          value={restriction.valeur}
                          checked={restriction.estCoche}
                          slot="start"
                          onIonChange={e => mettreAJourRestrictionsChoisies(e.detail.value, e.detail.checked)}
                        ></IonCheckbox>
                      </IonItem>
                    )}
                  </div>
                  <IonItem>
                    <IonButton
                      className="border"
                      expand="block"
                      onClick={() => setAfficherAlerteAjoutRestriction(true)}
                      shape="round"
                    >
                      <IonIcon className="add-icon" icon={add} ></IonIcon>
                    </IonButton>
                    <IonAlert
                      isOpen={afficherAlerteAjoutRestriction}
                      onDidDismiss={() => setAfficherAlerteAjoutRestriction(false)}
                      header={translate.getText("SUPPL_NOUVELLE_RESTRICTION")}
                      inputs={[
                        {
                          name: "nouvelleRestriction",
                          type: "text"
                        }]}
                      buttons={[
                        {
                          text: translate.getText("SUPPL_CANCEL"),
                          role: "cancel"
                        },
                        {
                          text: translate.getText("SUPPL_ADD_SELECT"),
                          handler: (donneesAlerte) => {
                            setRestrictions(restrictionsCourantes => [...restrictionsCourantes, { valeur: donneesAlerte.nouvelleRestriction, estCoche: false }]);
                          }
                        }
                      ]}
                    />
                  </IonItem>
                </IonItemGroup>

                <IonItemGroup>
                  <IonItemDivider className="categorie">
                    <IonLabel color="light">{translate.getText("SUPPL_POSOLOGY")}</IonLabel>
                  </IonItemDivider>

                  <IonItem>
                    <IonLabel className="border" color="light">{translate.getText("SUPPL_NOMBRE_DOSES")}</IonLabel>
                    <IonInput
                      className={`inputSuppConsom ${formulaireAjoutAEteSoumis && !nombreDosesChoisiEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                      value={nombreDosesChoisi}
                      type="number"
                      onIonChange={e => setNombreDosesChoisi(e.detail.value)}></IonInput>
                  </IonItem>
                </IonItemGroup>


                <IonItemGroup>
                  <IonItem lines="none">
                    <IonLabel className="border" color="light">{translate.getText("SUPPL_TIME_TAKEN")}<br /></IonLabel>
                  </IonItem>

                  {heuresChoisies.map((heureCourante, index) => (
                    <IonItemGroup key={index}>
                      <IonRow>
                        <IonCol>
                          <IonItem>
                            <IonDatetime
                              className={`${formulaireAjoutAEteSoumis && !heureChoisieCouranteEstValide(index) ? "champFormulaireAjoutInvalide" : ""}`}
                              displayFormat="HH:mm"
                              placeholder="00:00"
                              value={heureCourante.heure}
                              slot="start"
                              onClick={() => gererClicHeurePrise()}
                              onIonChange={e =>
                                gererChangementValeurHeureChoisie(index, e.detail.value, e.explicitOriginalTarget)
                              }
                            >
                              {translate.getText("SUPPL_HEURE_PRISE")}
                            </IonDatetime>
                          </IonItem>
                        </IonCol>
                        <IonCol>
                          <IonItem>
                            <IonButton className="border" slot="end" onClick={() => supprimerHeure(index)} color="trash">
                              <IonIcon className="trash-icon" icon={trash}></IonIcon>
                            </IonButton>
                          </IonItem>
                        </IonCol>
                      </IonRow>
                    </IonItemGroup>
                  ))}

                  <IonItem>
                    <IonButton
                      className="border"
                      size="small"
                      onClick={ajouterHeure}
                      shape="round"
                    >
                      <IonIcon className="add-icon" icon={add} ></IonIcon>
                    </IonButton>
                  </IonItem>
                </IonItemGroup>

                <IonItem>
                  <IonLabel className="border" color="light">{translate.getText("SUPPL_LESS_THAN_ONCE_PER_WEEK")}</IonLabel>
                  <IonToggle
                    className="border"
                    color="primary"
                    checked={moisToggle}
                    onIonChange={e => {
                      setMoisToggle(e.detail.checked);
                    }}
                    data-testid="toggleJoursMois" />
                </IonItem>

                {!moisToggle && <div>
                  <IonItemGroup data-testid="joursSemaine" className="border">
                    <IonItem>
                      <IonLabel color="light">{translate.getText("SUPPL_REP")}</IonLabel>

                      <IonSelect
                        className={`${formulaireAjoutAEteSoumis && !joursSemaineChoisisSontValides() ? "champFormulaireAjoutInvalide" : ""}`}
                        multiple="true"
                        onIonChange={e => {
                          setjoursSemaineChoisis(e.detail.value);
                        }}
                      >
                        <IonSelectOption value={translate.getText("SUPPL_MONDAY")}>{translate.getText("SUPPL_MONDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_TUESDAY")}>{translate.getText("SUPPL_TUESDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_WEDNESDAY")}>{translate.getText("SUPPL_WEDNESDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_THURSDAY")}>{translate.getText("SUPPL_THURSDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_FRIDAY")}>{translate.getText("SUPPL_FRIDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_SATURDAY")}>{translate.getText("SUPPL_SATURDAY")}</IonSelectOption>
                        <IonSelectOption value={translate.getText("SUPPL_SUNDAY")}>{translate.getText("SUPPL_SUNDAY")}</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonItemGroup>
                </div>}

                {moisToggle && <div>
                  <IonItemGroup data-testid="joursMois">
                    <IonItem lines="none">
                      <IonLabel className="border" color="light">{translate.getText("SUPPL_DAY_OF_INTAKE")}</IonLabel>
                    </IonItem>
                    {joursMoisChoisis.map((jourCourant, index) => (
                      <IonItemGroup key={index}>
                        <IonRow>
                          <IonCol>
                            <IonItem>
                              <IonDatetime
                                className={`${formulaireAjoutAEteSoumis && !jourMoisChoisiCourantEstValide(index) ? "champFormulaireAjoutInvalide" : ""}`}
                                displayFormat="DD"
                                placeholder="01"
                                value={jourCourant.jour}
                                slot="start"
                                onClick={() => gererClicJourPris()}
                                onIonChange={e =>
                                  gererChangementValeurJourChoisi(index, e.detail.value, e.explicitOriginalTarget)
                                }

                              >
                                {translate.getText("SUPPL_DAY_OF_THE_MONTH")}
                              </IonDatetime>
                            </IonItem>
                          </IonCol>
                          <IonCol>
                            <IonItem>
                              <IonButton className="border" slot="end" onClick={() => supprimerJour(index)} color="trash">
                                <IonIcon className="trash-icon" icon={trash}></IonIcon>
                              </IonButton>
                            </IonItem>
                          </IonCol>
                        </IonRow>
                      </IonItemGroup>
                    ))}

                    <IonItem>
                      <IonButton
                        className="border"
                        size="small"
                        onClick={ajouterJour}
                        shape="round"
                      >
                        <IonIcon className="add-icon" icon={add} ></IonIcon>
                      </IonButton>
                    </IonItem>
                  </IonItemGroup>
                </div>}

                <IonItem>
                  <IonLabel className="border" color="light">{translate.getText("SUPPL_DATE_DEBUT")}</IonLabel>
                  <IonDatetime
                    display-timezone="utc"
                    className={`timeBox ${formulaireAjoutAEteSoumis && !dateDebutChoisieEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                    value={dateDebutChoisie}
                    min="2022"
                    max="2099"
                    onIonChange={e => {
                      setDateDebutChoisie(e.detail.value);
                    }}
                    slot="end"
                    displayFormat={formatFavoriUtilisateur}
                  ></IonDatetime>
                  <IonIcon name="calendar" color="black" ></IonIcon>
                  <IonIcon className="date-icon" icon={calendar} slot="end"></IonIcon>
                </IonItem>
                <IonItem>
                  <IonLabel className="border" color="light">{translate.getText("SUPPL_POSSEDE_DATE_FIN")}</IonLabel>
                  <IonToggle
                    className="border"
                    color="primary"
                    checked={possedeDateFin}
                    onIonChange={e => {
                      setPossedeDateFin(e.detail.checked);
                    }}
                    data-testid="toggleDateFin"
                  />
                </IonItem>
                {possedeDateFin && <IonItem>
                  <IonLabel className="border" color="light">{translate.getText("SUPPL_DATE_FIN")}</IonLabel>
                  <IonDatetime
                    display-timezone="utc"
                    className={`timeBox ${formulaireAjoutAEteSoumis && !dateFinChoisieEstValide() ? "champFormulaireAjoutInvalide" : ""}`}
                    value={dateFinChoisie}
                    min="2022"
                    max="2099"
                    onIonChange={e => {
                      setDateFinChoisie(e.detail.value);
                    }}
                    data-testid="dateFin"
                    slot="end"
                    displayFormat={formatFavoriUtilisateur}
                  ></IonDatetime>
                  <IonIcon name="calendar" color="dark" ></IonIcon>
                  <IonIcon className="date-icon" icon={calendar} slot="end"></IonIcon>
                </IonItem>}


                <IonItem>
                  <IonLabel className="border" color="light">{translate.getText("SUPPL_ACTIVE")}</IonLabel>
                  <IonToggle
                    className="border"
                    color="primary"
                    checked={statutActifChoisi}
                    onIonChange={e => {
                      setStatutActifChoisi(e.detail.checked);
                    }} />
                </IonItem>

                <IonItem>
                  <IonButton className="border" type="submit" size="default" onClick={handleSave} data-testid="btn-save">
                    <IonIcon className="save-icon" icon={save} ></IonIcon>
                  </IonButton>
                </IonItem>
              </div>}

              <IonItem className="trashButton" color="red">
                <IonAvatar slot="start">
                  <img src="/assets/suppl/resumen.png" alt="" />
                </IonAvatar>
                <IonLabel>
                  <h2>
                    <b>{translate.getText("SUPPL_LIST")}</b>
                  </h2>
                </IonLabel>
                <IonIcon
                  className="arrowDashItem"
                  icon={arrowDropdownCircle}
                  onClick={() => setListeEstAffiche(!listeEstAffiche)}
                  data-testid="boutonAfficherListeMedSup"
                />
              </IonItem>

              {listeEstAffiche &&
              <ListeMedSup />}

              <IonItem className="trashButton" color="red">
                <IonAvatar slot="start">
                  <img src="/assets/suppl/ecart.png" alt="" />
                </IonAvatar>
                <IonLabel>
                  <h2>
                    <b>{translate.getText("SUPPL_DISPLAY_GAPS")}</b>
                  </h2>
                </IonLabel>
                <IonIcon
                  className="arrowDashItem"
                  icon={arrowDropdownCircle}
                />
              </IonItem>

            </IonList>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};
export default Supplements;
