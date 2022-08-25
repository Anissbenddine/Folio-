import React, {useEffect, useRef, useState} from "react";
import {IonRow, IonIcon, IonLabel, IonCol} from "@ionic/react";
import {create} from "ionicons/icons";
import PratiqueUtil from "./Practice.js"
import * as translate from "../../../../translate/Translator";
import FormatDate from "../../../../DateUtils";
import PracticeEditForm from "./PracticeEditForm";

const PracticeItem = (props) =>  {
    const [practice, setPractice] = useState(props.practice)
    const [showModify, setShowModify] = useState(false);
    const [formattedDate, setFormattedDate] = useState('')
    const isMounted = useRef(1)

    useEffect(() => {
        isMounted.current = 1

        return () => {
            isMounted.current = 0
        }
    })

    const updatePractice = (Practice) => {
        setPractice(Practice)
        props.modifyPractice(Practice)
    }

    FormatDate(new Date(practice.date)).then(dt => {
        if (isMounted.current) {
            setFormattedDate(dt)
        }
    })

    return  (
        <div className='activityItem' data-testid={'practiceItem' + practice.id} >
            <IonLabel data-testid="practiceName"><b className='activityName'>{practice.name}</b></IonLabel>
            <IonRow>
                <IonCol size='5' className="fontPractice" data-testid="practiceDate">{formattedDate} {translate.getText("AT")} {PratiqueUtil.formatHourMinute(practice.time)}</IonCol>
                <IonCol size='2' className="fontPractice" data-testid="practiceDuration">{PratiqueUtil.formatHourMinute(practice.duration)}</IonCol>
                <IonCol size='3' className="fontPractice" data-testid="practiceIntensity">{translate.getText(practice.intensity)}</IonCol>
                <IonCol size='2'>
                    <IonIcon icon={create} onClick={() =>  {
                        setShowModify(true)}
                    }/>
                </IonCol>
            </IonRow>

            <PracticeEditForm onSubmitAction={updatePractice} isOpen={showModify} onDidDismiss={setShowModify} isMounted={isMounted} onRemovePractice={props.onRemovePractice} practice={practice}/>
        </div>

    )
}

export default PracticeItem