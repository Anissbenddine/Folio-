import React, {useState} from "react"
import {IonItem, IonItemDivider, IonImg, IonText, IonGrid, IonRow, IonCol} from '@ionic/react';
import * as translate from "../../../../translate/Translator";
import '../../../Tab1.css';
import PratiqueUtil from "./Practice.js"
import './Activity.css'
import PracticeList from "./PracticeList";
import ActivityList from "./ActivityList";
import firebase from "firebase";

const Activities = (props) =>  {
  const date = props.currentDate.startDate
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
  const weekPrior = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6)

  const [showPracticeList, setShowPracticeList] = useState(false)
  const [showActivityList, setShowActivityList] = useState(false)
  const [activities, setActivities] = useState (PratiqueUtil.getActivitiesSorted(props.activities))
  const [practices, setPractices] = useState(PratiqueUtil.getPracticesFilter(props.practices, date))

  const target = {
    duration: 0,
    intensity: "INTENSITY_LOW"
  }

  /*
    Add a new practice to the firebase database.
    Give the practice an unique id.
    Concatenate the new practice to the list.
  */
  const addPractice = (practiceToAdd) => {
    const userUID = localStorage.getItem('userUid')
    let newId = 1
    if (practices.length !== 0) {
      newId = Math.max.apply(Math, practices.map((practice) => {return practice.id})) + 1
    }
    let modifiedDate = new Date(practiceToAdd.date)
    let newPractice = {
      id: newId,
      name: practiceToAdd.name,
      date: (new Date(modifiedDate.getTime() + (modifiedDate.getTimezoneOffset() * 60 * 1000))).toISOString(),
      time: practiceToAdd.time,
      duration: practiceToAdd.duration,
      intensity: practiceToAdd.intensity
    }
    firebase.database().ref('activity/'+userUID).update({practices: practices.concat(newPractice)}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(practices.concat(newPractice), date))
    })
  }

  /*
    Modify a practice in the firebase database.
    Filter the old practice from the current list.
    Concatenate the new practice to the list.
  */
  const modifyPractice = (practiceToModify) => {
    const userUID = localStorage.getItem('userUid')

    let practicesWithoutOld = practices.filter((item) => {
      return item.id !== practiceToModify.id
    }).concat({...practiceToModify})

    firebase.database().ref('activity/'+userUID).update({practices: practicesWithoutOld}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(practicesWithoutOld, date))
    })

  }

  /*
    Remove a practice from the firebase database.
    Filter the practice from the current list.
  */
  const removePractice = (practiceToDelete) => {
    const remainingPractices = practices.filter( (practice) => {
      if(practice.id === practiceToDelete.id) {
        return false
      }
      return true
    })

    const userUID = localStorage.getItem('userUid')
    firebase.database().ref('activity/'+userUID).update({practices: remainingPractices}).then(() => {
      setPractices(PratiqueUtil.getPracticesFilter(remainingPractices, date))
    })
  };

  /*
      Add a new activity to the firebase database.
      Give the activity an unique id.
      Concatenate the new activity to the list.
    */
  const addActivity = (activityToAdd) => {
    const userUID = localStorage.getItem('userUid')
    let newId = 1
    if (activities.length !== 0) {
      newId = Math.max.apply(Math, activities.map((practice) => {return practice.id})) + 1
    }
    let newActivity = {
      id: newId,
      name: activityToAdd.name,
      duration: activityToAdd.duration,
      intensity: activityToAdd.intensity,
      time: activityToAdd.time
    }
    firebase.database().ref('activity/'+userUID).update({activities: activities.concat(newActivity)}).then(() => {
      setActivities(PratiqueUtil.getActivitiesSorted(activities.concat(newActivity)))
    })
  }

  /*
    Modify a activity in the firebase database.
    Filter the old activity from the current list.
    Concatenate the new activity to the list.
  */
  const modifyActivity = (activityToModify) => {
    const userUID = localStorage.getItem('userUid')

    let activityWithoutOld = activities.filter((activity) => {
      return activity.id !== activityToModify.id
    }).concat({...activityToModify})

    firebase.database().ref('activity/'+userUID).update({activities: activityWithoutOld}).then(() => {
      setActivities(PratiqueUtil.getActivitiesSorted(activityWithoutOld))
    })

  }

  /*
    Remove a activity from the firebase database.
    Filter the activity from the current list.
  */
  const removeActivity = (activityToDelete) => {
    const remainingActivities = activities.filter( (activity) => {
      if(activity.id === activityToDelete.id) {
        return false
      }
      return true
    })

    const userUID = localStorage.getItem('userUid')
    firebase.database().ref('activity/'+userUID).update({activities: remainingActivities}).then(() => {
      setActivities(PratiqueUtil.getActivitiesSorted(remainingActivities))
    })
  };

   return (
    <div>
      <IonItem className="divTitre6" lines="none">
        <IonItemDivider className="overviewIcon">
          <div data-testid = "openActivity" className="icone" onClick={() => setShowActivityList(true)}>
            <IonImg  src="/assets/running_blanc_fp.png"/>
          </div>
        </IonItemDivider>
        <IonGrid className="overviewInfos">
          <div data-testid = "openPractice" onClick={() => setShowPracticeList(true)}>
            <IonRow>
              <IonCol size="8">
                <IonText className="overviewTitle" data-testid="moduleTitle">
                  {translate.getText("ACTIVITIES")}
                </IonText>
              </IonCol>
              <IonCol size="4">
                <IonText className="dailyDuration" data-testid="dailyDuration">
                  {PratiqueUtil.getTotalDuration(practices, today, tomorrow)}
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="8">
                <IonText className="overviewTarget" data-testid="targetTitle">{translate.getText("ACTIVITY_TARGET_NAME")} | </IonText>
                <IonText className="overviewTarget" data-testid="targetDuration">{PratiqueUtil.formatHourMinute(target.duration)}, </IonText>
                <IonText className="overviewTarget" data-testid="targetIntensity">{translate.getText(target.intensity)}</IonText>
              </IonCol>
              <IonCol size="4">
                <IonText className="dailyIntensity" data-testid ="dailyIntensity">{translate.getText(PratiqueUtil.getAverageIntensity(practices, today, tomorrow))}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonText className="overviewWeekly" data-testid="weeklyTitle">{translate.getText("SEVEN_DAYS")} | </IonText>
                <IonText className="overviewWeekly" data-testid="weeklyDuration">{PratiqueUtil.getTotalDuration(practices, weekPrior, tomorrow)}, </IonText>
                <IonText className="overviewWeekly" data-testid="weeklyIntensity">{translate.getText(PratiqueUtil.getAverageIntensity(practices, weekPrior, tomorrow))}</IonText>
              </IonCol>
            </IonRow>
          </div>
        </IonGrid>
        <PracticeList practices={practices} currentDate={tomorrow}
                      showPracticeList={showPracticeList} setShowPracticeList={setShowPracticeList}
                      addPractice={addPractice} modifyPractice={modifyPractice} removePractice={removePractice}/>
        <ActivityList activities={activities} practices={practices}  currentDate={tomorrow}
                      showActivityList={showActivityList} setShowActivityList={setShowActivityList}
                      addActivity={addActivity} modifyActivity={modifyActivity} removeActivity={removeActivity}/>
      </IonItem>
    </div>
  );
}
export default Activities;