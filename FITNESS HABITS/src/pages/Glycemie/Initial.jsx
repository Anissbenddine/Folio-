import firebaseDb from "../../firebaseConfig"
import React, { useState, useEffect } from 'react'
import { add, arrowBack, trash} from "ionicons/icons";
import Modifier from './Modifier'
import {toast} from '../../Toast'
import '../Tab1.css'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal
} from "@ionic/react";


const Initial = () => {

  var [glycemie, setGlycemie] = useState({})

  // Reading from db
  useEffect(() => {
    firebaseDb.child('NotificationGlycemie').on('value', snapshot => {
        if (snapshot.val() != null)
            setGlycemie({
            ...snapshot.val()
        })
        snapshot.forEach(function (childSnapshot) {
    });

    })
  }, [])

  const [showModal, setShowModal] = useState(false);
  const [currentId, setCurrentId] = useState('');

  const editAction = (currentId) => {
    setCurrentId(currentId);
    setShowModal(true);
  }

  function supprimer(e){
    toast("Horaire supprimer");
    firebaseDb.database.ref('NotificationGlycemie/' + e).remove()
  }

  return (
        <IonPage>
            <IonHeader className="notGlyChange">
                <IonToolbar>
                    <IonTitle class="titre">Notifications glycémie</IonTitle>
                </IonToolbar>

            <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                <IonFabButton href="/settings" size="small">
                    <IonIcon icon={arrowBack} />
                </IonFabButton>
            </IonFab>
        </IonHeader>
        
        <IonModal isOpen={showModal} cssClass='my-custom-class'>
            <IonHeader>
                <IonToolbar>
                    <IonTitle class="titre">Modifier horaire</IonTitle>
                </IonToolbar>

            <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                <IonFabButton onClick={() => {setShowModal(false)}} size="small">
                    <IonIcon icon={arrowBack} />
                </IonFabButton>
            </IonFab>
        </IonHeader>
            <IonContent>
              <Modifier {...({ currentId, glycemie })} />
            </IonContent>
        </IonModal>

        <IonContent>

          {
            Object.keys(glycemie).map(e => {
              return <IonCard key={e} onClick={() => editAction(e)}>
                  <IonCardContent>
                    <div>
                        <div class="heure" name="heure">{new Date(glycemie[e].heure).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>

                        <div name="notifierAvant">Notifier avant {new Date(glycemie[e].notifierAvant).toLocaleTimeString([], {minute:'2-digit'})} min</div>

                        <div class="jour" name="jour">{glycemie[e].jour.join("  ")}</div>
                    </div>
                        <IonFab class="arrow" vertical="top" horizontal="end" slot="fixed">
                            <IonFabButton class="removeButton" size="small" onClick={() => supprimer(e)} href="/glycemie">
                            <IonIcon icon={trash}/>                            
                            </IonFabButton>
                        </IonFab>

                  </IonCardContent>

              </IonCard>

            })
          }
        </IonContent>

        <IonFab vertical="bottom" horizontal="center" slot="fixed" >
            <IonFabButton href="/glycemieAjout"><IonIcon icon={add}/></IonFabButton>
        </IonFab>

      </IonPage>
  );
};
export default Initial;
