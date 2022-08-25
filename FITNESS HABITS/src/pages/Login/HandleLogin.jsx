
import { toast } from "../../Toast";
import firebase from "firebase";
import "firebase/storage";
import "firebase/auth";
import * as translate from "../../translate/Translator";
import { signInWithGoogle, signInWithFacebook } from "../../firebaseConfig";

const EMAIL = "@fithab.com";

/*
 * Verifies user exists, redirects to dashboard on success.
 */
async function HandleLogin(username, password, props, setBusy, flags) {
    setBusy(true);
    let response = await userExists(username, password, flags);
    setBusy(false);
    if (response !== true) {
        getErrorMessage(flags);
        return false;
    } else {
        getSuccessMessage(flags);
        props.history.push("/dashboard");
    }
}

function getErrorMessage(flags) {
    if (flags.email_flag === true) {
        toast(translate.getText("AUTH_LOGIN_ERROR"), 4000);
    } else if (flags.google_flag === true) {
        toast(translate.getText("AUTH_FED_CONNECT_GOOGLE_ERROR"), 4000);
    } else if (flags.facebook_flag === true) {
        toast(translate.getText("AUTH_FED_CONNECT_FB_ERROR"), 4000);
    }
}

function getSuccessMessage(flags) {
    if (flags.email_flag === true) {
        toast("Authentification reussi!");
    } else if (flags.google_flag === true) {
        toast(translate.getText("AUTH_FED_CONNECT_GOOGLE_SUCCESS"));
    } else if (flags.facebook_flag === true) {
        toast(translate.getText("AUTH_FED_CONNECT_FB_SUCCESS") );
    }
}


/*
 * Verifies if user exists, returns true if user exists.
 */
export async function userExists (username, password, flags) {
    let res;
    try {
        if (flags.email_flag === true) {
            res = await firebase.auth().signInWithEmailAndPassword(username+EMAIL, password);
        } else if (flags.google_flag === true) {
            res = await signInWithGoogle();   
        } else if (flags.facebook_flag === true) {
            res = await signInWithFacebook();
        }
        localStorage.setItem("userUid", res.user.uid);
        return true;
    } catch (error) {
        return false;
    }
}

export default HandleLogin;