import { DateTime } from "luxon";
import firebase from "firebase"

export async function FormatDate(date) {
    return new Promise((resolve) => {
        const dt = DateTime.fromJSDate(date);
        let format = "LL-dd-yyyy";
        const userUID = localStorage.getItem("userUid");
        if (userUID) {
            obtenirFormatDb(userUID).then((val) => {
                format = val ? val : format;
                resolve(dt.toFormat(format));
            });
        } else {
            resolve(dt.toFormat(format));
        }
    });
}

function obtenirFormatDb(userUID) {
    return new Promise((resolve) => {
        firebase
            .database()
            .ref("profiles/" + userUID + "/dateFormat")
            .once("value", (snapshot) => {
                const sets = snapshot.val();
                if (sets) {
                    resolve(sets);
                } else {
                    resolve(null);
                }
            });
    });
}

export default FormatDate;
