import React from 'react';
import HeaderWeight from "./header";
import InitializationWeight from "./Initialisation";

// we have cleaned up everything that did not affect the initialization page,
// because the notification configuration section was just an empty shell
// and was useless according to our analyses.
const Configuration = (props) => {
  return (
    <ion-app>
      <HeaderWeight url="/dashboard" />
      <ion-content class="ion-padding" overflow-scroll="true">
        <ion-tabs>
          <ion-tab tab="Initialisation">
            <InitializationWeight />
          </ion-tab>
        </ion-tabs>
      </ion-content>
    </ion-app>
  )
}

export default Configuration;
