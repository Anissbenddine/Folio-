import firebase from "firebase"
import "firebase/auth";
import "firebase/storage";

// la nouvelle base de donnée !
const config={
  apiKey: "AIzaSyAJrExNTypmQvQXZhsJobZ4jfxBKJeL5vM",
  authDomain: "fithabits-cc64a.firebaseapp.com",
  projectId: "fithabits-cc64a",
  storageBucket: "fithabits-cc64a.appspot.com",
  messagingSenderId: "914952051814",
  appId: "1:914952051814:web:3af440e0cdee006927a1a7",
  measurementId: "G-JYH5F13KKW"
}

export default firebase.initializeApp(config).database().ref();


export const storage = firebase.storage();

/*Config authentification Google et Facebook par l'équipe GEFRAL*/
export const auth = firebase.auth();
const providerGoogle = new firebase.auth.GoogleAuthProvider();
providerGoogle.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(providerGoogle);
const providerFacebook = new firebase.auth.FacebookAuthProvider();
providerFacebook.setCustomParameters({ prompt: "select_account" });
export const signInWithFacebook = () => auth.signInWithPopup(providerFacebook);

export function getCurrentUser() {        
    return new Promise((resolve, reject) => {
        const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                resolve(user)
            } else {
                resolve(null)
            }
            unsubscribe()
        })
    })
}

