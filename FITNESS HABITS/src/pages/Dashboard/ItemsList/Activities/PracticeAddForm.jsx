import React, {useState} from "react";
import {IonButton, IonDatetime, IonLabel, IonRow, IonSelect, IonSelectOption, IonContent, IonModal, IonInput, IonItem, IonItemGroup, IonIcon} from "@ionic/react";
import * as translate from "../../../../translate/Translator";
import "../../../Tab1.css"
import PratiqueUtil from "./Practice";
import {calendar, time as timeIcon} from "ionicons/icons";

const PracticeAddForm = (props) => {
    const [currentDate, minDate] = PratiqueUtil.getCurrentMinDate()

    const [date, setDate] = useState(currentDate)
    const [intensity, setIntensity] = useState(null)
    const [name, setName] = useState('')
    const [duration, setDuration] = useState(null)
    const [time, setTime] = useState(null)

    /*
      Prepare values before submission. 
      Convert the time and duration into integers.
      Reset form after submission.
    */
    const beforeSubmit = (e) => {
        e.preventDefault()

        if (intensity != null && duration != null && time != null) {
            let [durationHour, duratioMinute] = duration.split(":")
            let [timeHour, timeMinute] = time.split(":")

            props.onSubmitAction({
                name,
                time: (parseInt(timeHour) * 60 + parseInt(timeMinute)),
                duration: (parseInt(durationHour) * 60 + parseInt(duratioMinute)),
                intensity,
                date
            })

            resetForm()
        }
    }

    /*
      Reset the form to its original values.
    */
    const resetForm = () => {
        setName('')
        setDate(currentDate)
        setDuration(null)
        setTime(null)
        setIntensity(null)
        props.onDidDismiss(false)
    }

    return (
        <IonModal className='activity-modal-xsmall' data-testid="addForm"
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
                    <IonItemGroup className="inputGroupActivity">
                        <IonItem lines="none">
                            <IonDatetime className="date-format"
                                data-testid="dateValue"
                                displayFormat="YYYY-MM-DD"
                                min={minDate}
                                max={currentDate}
                                value={date}
                                onIonChange={(e) => { setDate(e.detail.value)}}
                            />
                            <IonIcon className="date-icon" icon={calendar} />
                        </IonItem>
                        <IonItem>
                            <IonDatetime className="time-format"
                                         data-testid="timeValue"
                                         presentation="time"
                                         displayFormat="HH:mm"
                                         value={time != null ? time : "00:00"}
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

export default PracticeAddForm