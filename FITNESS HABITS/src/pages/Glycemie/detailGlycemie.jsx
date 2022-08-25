import firebase from 'firebase';

import React, { useState, useEffect } from "react";
import { IonLabel, IonItem, IonItemDivider,IonBackButton,IonButton, button, IonContent, IonAvatar, IonDatetime, IonList, IonItemGroup} from "@ionic/react";
import { Line } from 'react-chartjs-2';
import Glycemie from "../Dashboard/ItemsList/Glycemie";
import * as translate from '../../translate/Translator';
import { IonIcon } from "@ionic/react";
import { calendar, options } from 'ionicons/icons';
import Graphe from "../GrapheGlycemie/graphe";
import CanvasJSReact from '../GrapheGlycemie/canvasjs.stock.react';
import moment from "moment"


    const userUID = localStorage.getItem('userUid');
    //var [popupDate, setPopupDate] = useState(glycemie.popupDate);


      const dashboard = JSON.parse(localStorage.getItem('dashboard'));
      var entreeGlycemie = firebase.database().ref('dashboard/' + userUID);
      //var graphData = []
      var dates = [];
      var taux = [];
    //   entreeGlycemie.orderByChild("glycemie/dailyGlycemie").once("value").then(function(snapshot){
    //     //Note: Si jamais le graphe ne s'affiche pas il faut juste diminuer la dimension de la fenetre du navigateur.
        
    //     for (var [,value] of Object.entries(snapshot.val())) {
    //         if (value.glycemie.dateGlycemie !== undefined ) {
    //             var date = moment(value.glycemie.popupDate).format('YYYY-MM-DD');
    //             var tauxGlycemie = value.glycemie.dailyGlycemie;
    //             dates.push(date);
    //             taux.push(tauxGlycemie);
    //         }
    //     }        
    //   });

    entreeGlycemie.orderByChild("glycemie/dailyGlycemie").once("value").then(function(snapshot){
        //Note: Si jamais le graphe ne s'affiche pas il faut juste diminuer la dimension de la fenetre du navigateur.
        if(snapshot.val()) {
            for (var [,value] of Object.entries(snapshot.val())) {
                if (value.glycemie && value.glycemie.popupDate !== undefined ) {
                    var date = moment(value.glycemie.popupDate).format('YYYY-MM-DD');
                    var tauxGlycemie = value.glycemie.dailyGlycemie;
                    dates.push(date);
                    taux.push(tauxGlycemie);
                }
            } 
        }       
      });

    const chartData = {
        labels: dates,
        datasets: [
            {
                label:"Graphe Glycémie",
                data: taux,
                backgroundColor: ["red","blue","green","violet","orange","yellow","red","blue","green","violet","orange","yellow"],
            },
        ],
    };
    

const DetailGlycemie = () => {
    var [dailyGlycemieList, setdailyGlycemieList] = useState([]);
   
    return (
        <div className="pageDetailsGlycemie" >
            <IonContent>
                <ion-grid>
                    <ion-row>
                        <div className="entetePage">
                            <IonButton className="boutonPrec" href="/Dashboard" >
                                <IonAvatar slot="start" className="btn" >
                                    <img src="/assets/back.svg" alt="" />
                                </IonAvatar>
                            </IonButton>
                            <b>{translate.getText("GLYC_TITLE")}</b>
                        </div>
                    </ion-row>

                    <ion-row>
                        <ion-col size="6">
                            <p>{translate.getText("GLYC_ALERTE")}</p>
                        </ion-col>
                        <ion-col size="4"></ion-col>
                        <ion-col size="2">
                            <img className="iconeAlert" src="/assets/alerts.png" alt="" />
                        </ion-col>
                    </ion-row>

                    <ion-row>
                        <ion-col size="4">
                            <IonItem lines="none" className="calendrier">
                                <IonIcon className="date-icon" icon={calendar} />
                            </IonItem>
                        </ion-col>
                        <ion-col size-md="6" size-sm="4" size-sx="4"></ion-col>
                        <ion-col size-md="2" size-sm="4" size-xs="4">
                            <div className="cibleClasse2">
                                <span> {translate.getText("CIBLE_GLY")} : [4.5 - 6.5]</span>
                            </div>
                        </ion-col>
                    </ion-row>

                    <ion-row className="zoneGraphe">
                        <Line data={chartData} class="bordureGraphe"/>
                        <Graphe/>
                        {/* <CanvasJSReact.CanvasJSChart options={options} />             */}
                    </ion-row>

                    <ion-row class="lastTake">
                        <h4>{translate.getText("DER_PRISE_GLY")} : {dashboard.glycemie.dailyGlycemie} mmol/L</h4>
                    </ion-row>
                    <ion-row class="lastTake">
                        {moment(dashboard.glycemie.popupDate).format('YYYY-MM-DD')} 
                        {/* {translate.getText("A_GLY")} */}
                    </ion-row>
                </ion-grid>
            </IonContent>
        </div>   
   
    );
 }

export default DetailGlycemie;
