import React, {useState} from "react"
import {IonModal, IonContent, IonLabel, IonCol, IonRow, IonButton} from '@ionic/react';
import * as translate from "../../../../translate/Translator";
import '../../../Tab1.css';
import ActivityItem from "./ActivityItem";
import ActivityAddForm from "./ActivityAddForm";
import PratiqueUtil from "./Practice";

const ActivityList = (props) =>  {
    const [showAddForm, setShowAddForm] = useState(false)

    return (
        <div>
            <IonModal data-testid="activityList" className="activity-modal-big"
                      isOpen={props.showActivityList} onDidDismiss={() => props.setShowActivityList(false)}>
                <IonContent className="activity-content">
                    <IonLabel data-testid="activityTitle"><h1 className='activityTitle' >{translate.getText("USUAL_ACTIVITES")}</h1></IonLabel>
                    <hr className="lineSeparatorActivity"/>
                    <br/>
                    <div>
                        <IonRow>
                            <IonCol className="activityItemCol" size={3}>{translate.getText("ACTIVITY")}</IonCol>
                            <IonCol className="activityItemCol" size={5}>{translate.getText("INTENSITY")}</IonCol>
                            <IonCol className="activityItemCol" size={3}>{translate.getText("EXP_REPORT_DURATION")}</IonCol>
                            <IonCol className="activityItemCol" size={1}></IonCol>
                        </IonRow>
                        {
                            props.activities.map(activity => (
                                <ActivityItem key={activity.id} activity={activity} modifyActivity={props.modifyActivity} onRemoveActivity={props.removeActivity}/>
                            ))
                        }
                    </div>
                    <br/>
                    <IonButton data-testid="addActivity" className="input-activity-button" shape="round" expand="block"  onClick={() => setShowAddForm(true)}>
                        {translate.getText("ADD")}
                    </IonButton>
                    <ActivityAddForm onSubmitAction={props.addActivity} isOpen={showAddForm} onDidDismiss={setShowAddForm} />
                </IonContent>
            </IonModal>
        </div>
    );
}
export default ActivityList;