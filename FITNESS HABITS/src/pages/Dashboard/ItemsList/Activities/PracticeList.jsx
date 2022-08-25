import React, {useState} from "react"
import { IonModal, IonContent, IonLabel, IonButton } from '@ionic/react';
import * as translate from "../../../../translate/Translator";
import PratiqueUtil from "./Practice.js"
import PracticeItem from "./PracticeItem";
import PracticeAddForm from "./PracticeAddForm";
import '../../../Tab1.css';

const PracticeList = (props) =>  {
  const weekPrior = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), props.currentDate.getDate() - 6)
  const [showAddForm, setShowAddForm] = useState(false)

   return (
    <div>
      <IonModal data-testid="practiceList" className="activity-modal-big"
                isOpen={props.showPracticeList} onDidDismiss={() => props.setShowPracticeList(false)}>
        <IonContent className="activity-content">
          <IonLabel data-testid="practiceTitle"><h1 className='activityTitle' >{translate.getText("PRACTICES")}</h1></IonLabel>
          <hr className="lineSeparatorActivity"/>
          <div>
            <IonLabel className="activityInfo">{translate.getText("SEVEN_DAYS")}</IonLabel>
            <IonLabel className="activityInfoNoColor"> | {PratiqueUtil.getTotalDuration(props.practices, weekPrior, props.currentDate)}</IonLabel>
          </div>
          <div>
            <IonLabel className="activityInfo">{translate.getText("AVG_INTENSITY")}</IonLabel>
            <IonLabel className="activityInfoNoColor"> | {translate.getText(PratiqueUtil.getAverageIntensity(props.practices, weekPrior, props.currentDate))}</IonLabel>
          </div>
          <br/>
            {
              props.practices.map(practice => (
                  <PracticeItem key={practice.id} practice={practice} modifyPractice={props.modifyPractice} onRemovePractice={props.removePractice} />
              ))
            }
          <br/>
          <IonButton data-testid="addPractice" className="input-activity-button" shape="round" expand="block"  onClick={() => setShowAddForm(true)}>
            {translate.getText("MANUAL_ENTRY")}
          </IonButton>
          <PracticeAddForm onSubmitAction={props.addPractice} isOpen={showAddForm} onDidDismiss={setShowAddForm} />
        </IonContent>
      </IonModal>
    </div>
  );
}
export default PracticeList;