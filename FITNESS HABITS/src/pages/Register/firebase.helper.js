import firebase from "firebase"
import "firebase/auth"

export async function firebaseCreateUser(email, password) {
    await firebase.auth().createUserWithEmailAndPassword(email, password)
}