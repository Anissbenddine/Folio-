import React from 'react';
import { IonIcon, IonLabel } from '@ionic/react';
import { home } from 'ionicons/icons';
import '../Tab1.css';


const Home = () => {

  return (    
    <div>
    <IonIcon color="warning" className="target" icon={home} />
    <IonLabel className="text"><h3>Home</h3></IonLabel>
    </div>   
  );
}
export default Home;
