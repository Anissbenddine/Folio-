import firebase from "firebase"
const dict = require("./Translation.json");
const supportedLanguages = ["en", "es", "fr"];
const userUID = localStorage.getItem("userUid");

export function initLangue() {
    var language = "fr"
    let prefLangueRef = firebase.database().ref("language/" + userUID)
    prefLangueRef.once("value").then(function(snapshot) {
        if (localStorage["userLanguage"]) {
            language = localStorage.getItem("userLanguage");
        } else if (snapshot.val() != null && supportedLanguages.includes(snapshot.val().langue)) {
            language = snapshot.val().langue
        } else {
            var locale = window.navigator.userLanguage
                    || window.navigator.language;
            locale = locale.substring(0, 2);
            if (supportedLanguages.includes(locale)) {
                language = locale;
            }
        }
    })
    localStorage.setItem("userLanguage", language);
}

export function setLang(lang) {
    if (supportedLanguages.includes(lang)) {
        localStorage.setItem("userLanguage", lang);
        var field = { "langue": lang }
        firebase.database().ref("language/" + userUID).update(field);
    }
}

export function getLang() {
    return localStorage.getItem("userLanguage");
}

export function getText(key, subKeys = undefined) {
    if (dict === undefined || dict[key] === undefined) {
        return "";
    }
    return searchKeyAtVariableDepth(dict[key], getLang(), subKeys ? subKeys : []);
}

const searchKeyAtVariableDepth = (obj, lang, subkeys) => {
    if (subkeys.length === 0)
    {
        return obj[lang] ? obj[lang] : `Translation into ${ lang } for node ${JSON.stringify(obj)} is currently not supported`;
    }
    const currentKey = subkeys[0];

    subkeys.splice(0, 1);

    if (obj[currentKey]) {
        return searchKeyAtVariableDepth(obj[currentKey], lang, subkeys);
    }
    return `Node with key ${currentKey} is undefined`;
};
