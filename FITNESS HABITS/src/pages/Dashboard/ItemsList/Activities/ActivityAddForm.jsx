import React, {useState} from "react";
import {IonButton, IonDatetime, IonLabel, IonRow, IonSelect, IonSelectOption, IonContent, IonModal, IonInput, IonItemGroup, IonItem, IonIcon} from "@ionic/react";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css"
import {time as timeIcon} from "ionicons/icons";

const ActivityAddForm = (props) => {
    const [intensity, setIntensity] = useState("INTENSITY_LOW")
    const [name, setName] = useState('')
    const [duration, setDuration] = useState('00:00')
    const [time, setTime] = useState('00:00')

    /*
      Prepare values before submission. 
      Convert the time and duration into integers.
      Reset form after submission.
    */
    const beforeSubmit = (e) => {
        e.preventDefault()
        let [durationHour, durationMinute] = duration.split(":")
        let [timeHour, timeMinute] = time.split(":")

        props.onSubmitAction({
            name,
            duration: (parseInt(durationHour) * 60 + parseInt(durationMinute)),
            intensity,
            time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
        })
        resetForm()
    }

    /*
      Reset the form to its original values.
    */
    const resetForm = () => {
        setName('')
        setDuration('00:00')
        setIntensity("INTENSITY_LOW")
        props.onDidDismiss(false)
    }

    return (
        <IonModal className='activity-modal-xxsmall' data-testid="addForm"
                  isOpen={props.isOpen} onDidDismiss={resetForm}>
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
                                      onIonChange={(e) => { setName(e.detail.value)}}
                                      required={true}/>
                        </IonItem>
                    </IonItemGroup>
                    <IonItemGroup className="inputGroupActivity">
                        <IonItem className="inputActivity">
                            <IonLabel data-testid="addDuration"
                                      className="label-activity"
                                      style={{marginRight:"10px"}}>
                                {translate.getText("EXP_REPORT_DURATION")}
                            </IonLabel>
                            <IonDatetime className="time-format"
                                         data-testid="durationValue"
                                         presentation="time"
                                         displayFormat="HH:mm"
                                         min="00:05"
                                         value={duration != null ? duration : "00:00"}
                                         minuteValues="0,5,10,15,20,25,30,35,40,45,50,55"
                                         onIonChange={e => {
                                             setDuration(e.detail.value)
                                         }}/>
                        </IonItem>
                        <IonItem className="inputActivity select-intensity-activity-parent">
                            <IonSelect data-testid="intensityValue"
                                       placeholder={translate.getText("INTENSITY")}
                                       onIonChange={e => {setIntensity(e.detail.value)}}>
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
                    <IonItemGroup>
                        <IonItem>
                            <IonLabel className="label-activity">
                                {translate.getText("START_TIME")}
                            </IonLabel>
                            <IonDatetime className="time-format"
                                         data-testid="timeValue"
                                         presentation="time"
                                         displayFormat="HH:mm"
                                         value={time}
                                         onIonChange={e => {
                                             setTime(e.detail.value)
                                         }}/>
                            <IonIcon className="date-icon" icon={timeIcon} />
                        </IonItem>
                    </IonItemGroup>
                    <IonRow className="rowAddButtonActivity">
                        <IonButton className="input-activity-button" type="submit" data-testid="addSubmit">{translate.getText("ADD")}</IonButton>
                    </IonRow>
                </form>
            </IonContent>
        </IonModal>
    )
}

export default ActivityAddForm