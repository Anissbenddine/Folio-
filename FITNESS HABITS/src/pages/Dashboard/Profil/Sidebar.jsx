import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import React, { useState, useEffect } from "react";
import { IonList, IonGrid, IonRow, IonCol, IonHeader, IonIcon, IonInput, IonLabel, IonContent, IonItemDivider, IonItem, IonSelect, IonSelectOption, IonPage, IonFooter } from "@ionic/react";
import { arrowDropdownCircle, arrowRoundBack, logOut } from "ionicons/icons";
import { TakePicture } from "../../TakePicture/TakePicture";
import * as translate from "../../../translate/Translator";
import {convertToCM,convertToImperial} from "./UnitDisplay"

//CSS
import "./Sidebar.css"


// Note: remove picturedDisabled once TakePicture is properly implemented/fixed.
const Sidebar = ({ handleClose, pictureDisabled }) => {
    const [currentUnitDisplay, setUnitSizeDisplay] = useState("M");
    const [unitSize,setUnitSize] = useState('');
    const [unitDisplayLong,setUnitDisplayLong] = useState(translate.getText("SIDEBAR_HEIGHT_M_DISPLAY"))
    const [isImperial,setIsImperial] = useState(false);
    const [imperial,setImperial] = useState({feet:5,inches:6})

    const unitDisplayCalculations = (newUnitDisplay,value) => {
        (newUnitDisplay === "IMP") ? setIsImperial(true) :setIsImperial(false);

        if (newUnitDisplay === "IMP" && currentUnitDisplay !== "IMP") {
                setImperial(convertToImperial(currentUnitDisplay,value));
                setUnitSizeDisplay("IMP");
        }

        if (newUnitDisplay === "CM") {
            switch (currentUnitDisplay) {
                case "M":
                    setUnitSize(value*100);
                    break;
                case "IMP":
                    setUnitSize(convertToCM(currentUnitDisplay,value,imperial));
                    break;
                default:
                    setUnitSize(value);
                    break;
            }
            setUnitDisplayLong(translate.getText("SIDEBAR_HEIGHT_CM_DISPLAY"));
            setUnitSizeDisplay("CM");
        }

        if (newUnitDisplay === "M") {
            switch (currentUnitDisplay) {
                case "CM":
                    setUnitSize(value/100)
                    break;
                case "M":
                    setUnitSize(value)
                    break;
                default:
                    setUnitSize(convertToCM(currentUnitDisplay,(value),imperial)/100);
                    break;
            }
            setUnitDisplayLong(translate.getText("SIDEBAR_HEIGHT_M_DISPLAY"));
            setUnitSizeDisplay("M");
        }
    }

    const handleUniteSizDisplayChange = (event) => {
        unitDisplayCalculations(event.detail.value,unitSize);
    }

    const [sidebarClass, setSidebarClass] = useState("sidebar");
    const [profile, setProfile] = useState({
        pseudo: "",
        email: "",
        size: "",
        gender: "",
        dateFormat: "",
        profilePicture: "",
    });

    // load the current profile from the local storage if it exists, otherwise load it from the DB
    useEffect(() => {
        const localProfile = localStorage.getItem("profile");
        if (localProfile) {
            setProfile(JSON.parse(localProfile));
            setUnitSize(JSON.parse(localProfile).size/100);
        } else {
            const userUID = localStorage.getItem("userUid");
            console.log("Loading Profile From DB...");
            firebase.database().ref("profiles/" + userUID)
                .once("value", (snapshot) => {
                    const dbProfile = snapshot.val();
                    if (dbProfile) {
                        localStorage.setItem("profile", JSON.stringify(dbProfile));
                        setProfile(dbProfile);
                        setUnitSize(dbProfile.size/100);
                    }
                });

            // Update User Data, when applicable
            const supportedAuthProviderIds = [
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ];

            let user = firebase.auth().currentUser;
            if (supportedAuthProviderIds.includes(user.providerId)) {
                profile.pseudo = user.displayName.replace(" ", ".");
                profile.email = user.email;
                const userUID = localStorage.getItem("userUid");
                //Sauvegarde ou mise à jour dans la base de données firebase
                firebase.database().ref("profiles/" + userUID).update({
                    "pseudo": profile.pseudo,
                    "email": profile.email,
                });
            }
        }
    }, []);

    const handleInputChange = (event) => {
        const userUID = localStorage.getItem("userUid");
        var { name, value } = event.target;
        if (name === "size" && !isImperial) {
        unitDisplayCalculations(currentUnitDisplay,value);
        value = convertToCM(currentUnitDisplay,value);
        }
        if (currentUnitDisplay === "IMP") {
            switch (name) {
                case "inches":
                    setImperial({feet:imperial.feet,inches:value});
                    value = Math.round(((Number((imperial.feet*12))+Number(value)))*2.54);
                    break;
                default:
                    setImperial({feet:value,inches:imperial.inches});
                    value = Math.round(((Number((value*12))+Number(imperial.inches)))*2.54);
                    break;
            }
            name = "size";
        }
        const updatedProfile = { ...profile, [name]: (value ?? "") };
        setProfile({ ...profile, [name]: value ? value : "" });
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        firebase.database().ref("profiles/" + userUID).update({
            [name]: (value ?? "")
        });
    };

    const handleUserSignOut = () => {
        firebase.auth().signOut().then(() => {
            localStorage.clear();
            window.location.replace("/");
        }).catch(console.log);
    }

    const closeHandler = (e) => {
        e.preventDefault();
        setSidebarClass("sidebarClose");
        handleClose();
    }

    return (
        // <div className={sidebarClass} data-testid="sidebar">
        <IonPage className={sidebarClass} data-testid="sidebar">
            <IonHeader className="sideBarHeader">
                <IonGrid >
                    <IonRow >
                        {!pictureDisabled && <TakePicture />}
                        <IonCol size="5">
                            <IonInput className="userNameProfil" value="" readonly color="danger"><h3 data-testid="username">{profile.pseudo}</h3></IonInput>
                        </IonCol>
                        <IonCol size="1.5">
                            <button id="close" data-testid="btn-close" className="sideBarButton" color="danger" onClick={closeHandler}>
                                <IonIcon icon={arrowRoundBack} />
                            </button>
                            <button id="close" className="sideBarButtonLogout" color="danger" onClick={handleUserSignOut} data-testid="btn-signout">
                                <IonIcon icon={logOut} />
                            </button>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonHeader>
            <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <img src="/assets/LogoCadre.svg" alt={translate.getText("ALT_LOGO_TXT")} />
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid>
                <IonRow className="sideBarHeaderTitle">
                    <IonCol>
                        <IonLabel className="headerTitleDashboard" color="danger">
                            <h3>{translate.getText("SIDEBAR_LBL_PROFILE")}</h3>
                        </IonLabel>
                    </IonCol>
                </IonRow>
            </IonGrid>
            <IonGrid className="whiteBackground">
                <IonRow>
                    <IonCol>
                        <IonList>
                        
                            <IonItemDivider color="warning" className="profilText"><h2>{translate.getText("SIDEBAR_LBL_USERNAME")}</h2></IonItemDivider>
                            <IonItem>
                                <IonInput className="inputProfilText" type="text" name="pseudo" value={profile.pseudo} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_LBL_USERNAME")} clearInput ></IonInput>
                            </IonItem>
                            <IonItemDivider color="warning" className="profilText"><h2>{translate.getText("SIDEBAR_LBL_EMAIL")}</h2></IonItemDivider>
                            <IonItem>
                                <IonInput className="inputProfilText" type="email" name="email" value={profile.email} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_PLCHLDR_EMAIL")} clearInput data-testid="email"></IonInput>
                            </IonItem>
                            <IonItemDivider color="warning" className="profilText"><h2>{translate.getText("SIDEBAR_LBL_TAILLE")}</h2></IonItemDivider>
                            {!isImperial &&< IonItem className="profilText">
                            <h6 className="inputProfilText">{unitSize} {unitDisplayLong}</h6>
                            </IonItem> }
                            {isImperial &&< IonItem className="profilText">
                            <h6 className="inputProfilText">{imperial.feet} pieds {imperial.inches} pouces </h6>
                            </IonItem> }
                            <IonItem>
                            {!isImperial && <IonInput className="inputProfilText"  type="number" name="size" value={unitSize} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"/>}
                            {isImperial && <IonInput className="inputProfilText" style={{maxWidth:"150px"}} type="number" name="feet" value={imperial.feet} onIonBlur={handleInputChange} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"><span>'</span></IonInput>}
                            {isImperial && <IonInput className="inputProfilText" style={{maxWidth:"150px"}} type="number" name="inches" onIonBlur={handleInputChange} value={imperial.inches} placeholder={translate.getText("SIDEBAR_PLCHLDR_TAILLE")} clearInput data-testid="height"><span>"</span></IonInput>}
                            <IonLabel >
                                <h2 style={{padding:"0px",color:"black"}}>
                                <b>Unité:</b>
                                </h2>
                            </IonLabel>
                            <IonSelect
                            color="black"
                            okText={translate.getText("POIDS_PREF_CHOISIR")}
                            cancelText={translate.getText("POIDS_PREF_ANNULER")}
                            onIonChange={handleUniteSizDisplayChange}
                            >
                            <IonSelectOption value="M">M</IonSelectOption>
                            <IonSelectOption value="CM">CM</IonSelectOption>
                            <IonSelectOption value="IMP">IMPÉRIALE</IonSelectOption>
                            </IonSelect>
                            </IonItem>
                            
                            <IonItemDivider className="profilText"><h2>{translate.getText("SIDEBAR_LBL_SEXE")}</h2></IonItemDivider>
                            <IonItem>
                            <select name="gender" value={profile.gender} onChange={handleInputChange} placeholder={translate.getText("SIDEBAR_LBL_SEXE")} data-testid="gender">
                                <option value="M">{translate.getText("SIDEBAR_LBL_SEXE_MAN")}</option>
                                <option value="F">{translate.getText("SIDEBAR_LBL_SEXE_WOMAN")}</option>
                                <option value="O">{translate.getText("SIDEBAR_LBL_SEXE_OTHER")}</option>
                                <option value="N">{translate.getText("SIDEBAR_LBL_SEXE_NO_ANSWER")}</option>
                            </select>
                                
                            </IonItem>


                            <IonItemDivider className="profilText">
                                <h2 className="noPadding">{translate.getText("SIDEBAR_LBL_DATEFORMAT")}</h2>
                            </IonItemDivider>
                            <IonItem>
                            <select name="dateFormat" value={profile.dateFormat} onChange={handleInputChange} data-testid="dateFormat">
                                <option value="LL-dd-yyyy">{translate.getText("SIDEBAR_OPTION_DATE_1")}</option>
                                <option value="dd-LL-yyyy">{translate.getText("SIDEBAR_OPTION_DATE_2")}</option>
                                <option value="yyyy-LL-dd">{translate.getText("SIDEBAR_OPTION_DATE_3")}</option>
                                <option value="yyyy-LLL-dd">{translate.getText("SIDEBAR_OPTION_DATE_4")}</option>
                                <option value="dd-LLL-yyyy">{translate.getText("SIDEBAR_OPTION_DATE_5")}</option>
                            </select>
                            </IonItem>
                            <IonItemDivider color="warning" className="profilText"></IonItemDivider>
                        </IonList>
                    </IonCol>
                </IonRow>
            </IonGrid>
            </IonContent>
            <IonFooter className="sidebarfooter"></IonFooter>
        </IonPage>
        // {/* </div> */}
    )
}
export default Sidebar;