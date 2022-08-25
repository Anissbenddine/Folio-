import firebase from "firebase";

const SUPPLEMENTS_PAR_DEFAUT = {
    listeMedSup: []
};

export const initSupplements = () => {
    const supplementsLocaux = localStorage.getItem('supplements');
    const profilLocal = localStorage.getItem("profile");

    if(!profilLocal) {
      initProfile();
    }

    if (supplementsLocaux) {
      const supplementsAJour = ajouterSupplementsManquants(JSON.parse(supplementsLocaux));
      localStorage.setItem("supplements", JSON.stringify(supplementsAJour));
    } else {
      mettreAJourListeMedSupLocale();
    }
}

const initProfile = async () => {
    const userUID = localStorage.getItem('userUid');

    await firebase.database().ref('profiles/' + userUID).once('value').then((dataSnapshot) => {
      if (dataSnapshot.exists()) {
        let profileBd = dataSnapshot.val();
        if (profileBd) {
          localStorage.setItem('profile', JSON.stringify(profileBd));
        }
      }
    });
}

export const mettreAJourListeMedSupLocale = async () => {
    const userUID = localStorage.getItem('userUid');

    await firebase.database().ref('supplements/' + userUID).once('value').then((dataSnapshot) => {
      if (dataSnapshot.exists()) {
        let supplementsBd = dataSnapshot.val();
        if (supplementsBd) {
          const supplementsAJour = ajouterSupplementsManquants(supplementsBd);
          localStorage.setItem('supplements', JSON.stringify(supplementsAJour));
        }
      } else {
        localStorage.setItem('supplements', JSON.stringify(SUPPLEMENTS_PAR_DEFAUT));
      }
    });
  }

const ajouterSupplementsManquants = (supplements) => {
    if (!supplements.listeMedSup) {
      supplements.listeMedSup = [];
    }

    return supplements;
}

export const sauvegarderSuppDansBd = (nouveauSupp, userUID) => {
    const supplementsLocaux = JSON.parse(localStorage.getItem('supplements'));

    firebase.database().ref('supplements/' + userUID).once('value').then((dataSnapshot) => {
      if (dataSnapshot.exists()) {
        let supplementsBd = dataSnapshot.val();
        if (supplementsBd.listeMedSup) {
          supplementsLocaux.listeMedSup = [...supplementsBd.listeMedSup, nouveauSupp];
        }
      } else {
        supplementsLocaux.listeMedSup = [...supplementsLocaux.listeMedSup, nouveauSupp];
      }

      localStorage.setItem('supplements', JSON.stringify(supplementsLocaux));
      firebase.database().ref('supplements/' + userUID).update(supplementsLocaux);
    });
}