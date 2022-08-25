import React, {useState} from "react";
import {IonButton, IonDatetime, IonLabel, IonSelect, IonSelectOption, IonContent, IonModal, IonInput, IonItemGroup, IonItem, IonIcon} from "@ionic/react";
import PratiqueUtil from "./Practice";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css"
import {calendar, time as timeIcon} from "ionicons/icons";

const PracticeEditForm = (props) => {
    const [currentDate, minDate] = PratiqueUtil.getCurrentMinDate()
    const [showDelete, setShowDelete] = useState(false);
    const [date, setDate] = useState(props.practice.date)
    const [intensity, setIntensity] = useState(props.practice.intensity)
    const [name, setName] = useState(props.practice.name)
    const [duration, setDuration] = useState(PratiqueUtil.formatHourMinute(props.practice.duration))
    const [time, setTime] = useState(PratiqueUtil.formatHourMinute(props.practice.time))

    /*
      Prepare values before submission. 
      Convert the time and duration into integers.
      Reset form after submission.
    */
    const beforeSubmit = (e) => {
        e.preventDefault()
        let [durationHour, duratioMinute] = duration.split(":")
        let [timeHour, timeMinute] = time.split(":")

        props.onSubmitAction({
            id: props.practice.id,
            name,
            time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
            duration: (parseInt(durationHour) * 60 + parseInt(duratioMinute)),
            intensity,
            date
        })
        resetForm()
    }

    /*
      Reset the form to its original values.
    */
    const resetForm = () => {
        props.onDidDismiss(false)
    }

    return (
        <div>
            <IonModal className='activity-modal-xsmall' data-testid="addForm"
                      isOpen={props.isOpen}
                      onDidDismiss={() => {
                          if (props.isMounted.current) {
                              resetForm()
                          }
                      }}>
                <IonContent className='activity-content'>
                    <form onSubmit={beforeSubmit}>
                        <IonItemGroup>
                            <IonItem>
                                <IonInput style={{textAlign: "left"}}
                                          className="inputFormActivity"
                                          data-testid="nameValue"
                                          type='text'
                                          placeholder={translate.getText("NAME_ACTIVITY")}
                                          value={name}
                                          onIonChange={(e) => {
                                              if (props.isMounted.current) {
                                                  setName(e.detail.value)
                                              }}}
                                          required={true}/>
                            </IonItem>
                        </IonItemGroup>
                        <IonItemGroup className="inputGroupActivity">
                            <IonItem className="inputActivity">
                                <IonLabel data-testid="modifyDuration"
                                          className="label-activity"
                                          style={{marginRight:"10px"}}>
                                    {translate.getText("EXP_REPORT_DURATION")}
                                </IonLabel>
                                <IonDatetime className="time-format"
                                             data-testid="durationValue"
                                             presentation="time"
                                             displayFormat="HH:mm"
                                             min="00:01"
                                             minuteValues="0,5,10,15,20,25,30,35,40,45,50,55"
                                             value={duration}
                                             onIonChange={e => {
                                                 if (props.isMounted.current) {
                                                     setDuration(e.detail.value)
                                                 }
                                             }}
                                             required={true} />
                            </IonItem>
                            <IonItem className="inputActivity select-intensity-activity-parent">
                                <IonSelect data-testid="intensityValue"
                                           placeholder={translate.getText("INTENSITY")}
                                           onIonChange={e => {
                                               if (props.isMounted.current) {
                                                   setIntensity(e.detail.value)
                                               }}}
                                           required={true}
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
                            </IonItem>
                        </IonItemGroup>
                        <IonItemGroup className="inputGroupActivity">
                            <IonItem lines="none">
                                <IonDatetime className="date-format"
                                             data-testid="dateValue"
                                             displayFormat="YYYY-MM-DD"
                                             min={minDate}
                                             max={currentDate}
                                             value={date}
                                             onIonChange={(e) => {
                                                 if (props.isMounted.current) {
                                                     setDate(e.detail.value)
                                                 }}}
                                             required={true}
                                />
                                <IonIcon className="date-icon" icon={calendar} />
                            </IonItem>
                            <IonItem>
                                <IonDatetime className="time-format"
                                             data-testid="timeValue"
                                             presentation="time"
                                             displayFormat="HH:mm"
                                             value={time}
                                             onIonChange={e => {
                                                 if (props.isMounted.current) {
                                                     setTime(e.detail.value)
                                                 }
                                             }}
                                             required={true} />
                                <IonIcon className="date-icon" icon={timeIcon} />

                            </IonItem>
                        </IonItemGroup>
                        <IonItemGroup className="buttonActivityGroup">
                            <IonItem lines="none" className="buttonActivityItem">
                                <IonButton className="input-activity-button" type="submit" data-testid="modifySubmit">{translate.getText("MODIFY")}</IonButton>
                            </IonItem>
                            <IonItem lines="none" className="buttonActivityItem">
                                <IonButton className="input-activity-button" onClick={() => {
                                    if (props.isMounted.current) {
                                        setShowDelete(true)
                                    }
                                }} data-testid="deleteOpen">{translate.getText("DELETE")}</IonButton>
                            </IonItem>

                        </IonItemGroup>
                    </form>
                </IonContent>
            </IonModal>

            <IonModal className='activity-modal-xxsmall' isOpen={showDelete} onDidDismiss={() => {
                if (props.isMounted.current) {
                    setShowDelete(false)
                }
            }}>
                <IonContent className='activity-content'>
                    <IonLabel data-testid="deleteTitle"><h1 className='activityTitle' >{translate.getText("DELETE_ACTIVITY")}</h1></IonLabel>
                    <p data-testid="deleteDescription">
                        {translate.getText("DELETE_ACTIVITY_DESCRIPTIION")}
                    </p>
                    <div className="buttonActivityItem">
                        <IonButton className="input-activity-button" data-testid="deleteConfirm" onClick={() => {
                            if (props.isMounted.current) {
                                props.onRemovePractice(props.practice)
                            }
                        }}>
                            {translate.getText("CONFIRM_DELETE")}
                        </IonButton>
                        <IonButton className="input-activity-button" data-testid="deleteCancel" onClick={() => {
                            if (props.isMounted.current) {
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

export default PracticeEditForm