import React from 'react';
import { IonHeader, IonToolbar,IonItemDivider,IonAvatar, IonButtons, IonBackButton, IonTitle} from '@ionic/react';

import * as translate from "../../../translate/Translator";


const Header = ({ url }) => {
    return (
        <IonHeader>
            <IonToolbar className='headerPoids'>
                <IonButtons slot="start">
                    <IonBackButton defaultHref={url} />
                </IonButtons>
                <IonItemDivider className='headerPoids'>
                    <IonTitle>
                        {translate.getText("WEIGHT_NAME_SECTION")}
                    </IonTitle>
                    <IonAvatar className='alertsAvtr'>
                        <img className='alertsIcon' src="/assets/alerts.png" alt=""/>
                    </IonAvatar>
                </IonItemDivider>
            </IonToolbar>
        </IonHeader>
    )
}

export default Header;
