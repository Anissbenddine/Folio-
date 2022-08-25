import React, {useEffect, useRef, useState} from "react";
import {IonContent, IonInput, IonRow, IonSelect, IonSelectOption, IonDatetime, IonIcon, IonLabel, IonModal, IonCol, IonButton} from '@ionic/react';
import {create} from 'ionicons/icons';
import PratiqueUtil from "./Practice.js"
import * as translate from "../../../../translate/Translator";

const ActivityItem = (props) =>  {
    const [name, setName] = useState(props.activity.name)
    const [intensity, setIntensity] = useState(props.activity.intensity)
    const [duration, setDuration] = useState(PratiqueUtil.formatHourMinute(props.activity.duration))
    const [time, setTime] = useState(PratiqueUtil.formatHourMinute(props.activity.time))
    const [showDelete, setShowDelete] = useState(false)

    const isMounted = useRef(1)

    useEffect(() => {
        isMounted.current = 1

        return () => {
            isMounted.current = 0
        }
    })

    useEffect(() => {
        let [durationHour, durationMinute] = duration.split(":")
        let [timeHour, timeMinute] = time.split(":")

        let modifiedActivity = {
            ...props.activity,
            name,
            intensity,
            duration: (parseInt(durationHour) * 60 + parseInt(durationMinute)),
            time: (parseInt(timeHour) * 60 + parseInt(timeMinute))

        }
        props.modifyActivity(modifiedActivity)
    }, [intensity, duration, name, time])



    return  (
      <div className='activityItem' data-testid={'activityItem' + props.activity.id} >
          <IonRow>
              <IonCol size='3'>
                  <IonInput style={{textAlign: "left"}}
                            className="fontInputActivity"
                            data-testid="nameValue"
                            type='text'
                            value={name}
                            onIonChange={(e) => {
                                if (isMounted.current) {
                                    setName(e.detail.value)
                                }
                            }}/>
              </IonCol>
              <IonCol size='5'>
                  <IonSelect data-testid="intensityValue"
                             className="fontInputActivity"
                             onIonChange={e => {
                                 if (isMounted.current) {
                                     setIntensity(e.detail.value)
                                 } }}
                             value={intensity}>
                      <IonSelectOption value="INTENSITY_LOW">
                          {translate.getText("INTENSITY_LOW")}
                      </IonSelectOption>
                      <IonSelectOption value="INTENSITY_MEDIUM">
                          {translate.getText("INTENSITY_MEDIUM")}
                      </IonSelectOption>
                      <IonSelectOption value="INTENSITY_HIGH">
                          {translate.getText("INTENSITY_HIGH")}
                      </IonSelectOption>
                      <IonSelectOption value="INTENSITY_HIIT">
                          {translate.getText("INTENSITY_HIIT")}
                      </IonSelectOption>
                  </IonSelect>
              </IonCol>
              <IonCol size='3'>
                  <IonDatetime data-testid="durationValue"
                               className="fontInputActivity"
                               presentation="time"
                               displayFormat="HH:mm"
                               min="00:01"
                               minuteValues="0,5,10,15,20,25,30,35,40,45,50,55"
                               value={duration}
                               onIonChange={e => {
                                   if (isMounted.current) {
                                       setDuration(e.detail.value)
                                   }
                               }}/>
              </IonCol>
              <IonCol size='1'>
                  <IonIcon icon={create} data-testid="deleteOpen" onClick={() =>  {
                      setShowDelete(true) }
                  }/>
              </IonCol>
          </IonRow>
          <div className="buttonActivityGroup fontInputActivityGrey">
              <label style={{ marginTop: "10px" }}>
                  {translate.getText("START_TIME")}
              </label>
              <IonDatetime data-testid="timeValue"
                           presentation="time"
                           displayFormat="HH:mm"
                           value={time}
                           onIonChange={e => {
                               if (isMounted.current) {
                                   setTime(e.detail.value)
                               }
                           }}/>
          </div>

          <IonModal className='activity-modal-xxsmall' isOpen={showDelete} onDidDismiss={() => {
              if (isMounted.current) {
                  setShowDelete(false)
              }
          }}>
              <IonContent className='activity-content'>
                  <IonLabel data-testid="deleteTitle"><h1 className='activityTitle' >{translate.getText("DELETE_USUAL_ACTIVITY")}</h1></IonLabel>
                  <p data-testid="deleteDescription">
                      {translate.getText("DELETE_USUAL_ACTIVITY_DESCRIPTIION")}
                  </p>
                  <div className="buttonActivityItem">
                      <IonButton className="input-activity-button" data-testid="deleteConfirm" onClick={() => {
                          if (isMounted.current) {
                              props.onRemoveActivity(props.activity)
                          }
                      }}>
                          {translate.getText("CONFIRM_DELETE")}
                      </IonButton>
                      <IonButton className="input-activity-button" data-testid="deleteCancel" onClick={() => {
                          if (isMounted.current) {
                              setShowDelete(false)
                          }
                      }}>
                          {translate.getText("WEIGHT_PREF_CANCEL")}
                      </IonButton>
                  </div>
              </IonContent>
          </IonModal>
      </div>
    )
}

export default ActivityItem