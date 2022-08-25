import React, { Fragment } from "react";
import { IonIcon, IonLabel } from "@ionic/react";
import { globe, menu } from "ionicons/icons";

const Toggle = (props) => {
    return (
        <Fragment>
            <div className="SizeChange">
                <div className="grid-container">
                    <div className="grid-item">
                        <button id="toggle" className="buttonHeaderDash" onClick={props.click}>
                            <IonIcon className="targetProfil" icon={menu} />
                        </button>
                    </div>
                    <div className="grid-item">
                        <IonLabel className='profilTitleDashboard' color='danger'>
                            <h3>FitnessHabits</h3>
                        </IonLabel>
                    </div>
                    <div className="grid-item">
                        <ion-anchor href="/languages" routerDirection="forward">
                            <IonIcon className="targetProfil" icon={globe} />
                        </ion-anchor>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Toggle