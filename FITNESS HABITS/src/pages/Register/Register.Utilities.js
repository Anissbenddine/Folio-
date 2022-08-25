import { toast } from "../../Toast"
import * as translate from "../../translate/Translator"
import { firebaseCreateUser } from "./firebase.helper";


export function validateFieldsEmpty (username, password) {
    return (username.trim() === "" || password.trim() === "")
}

export function validatePasswordsMatching (password, confirmPassword) {
    return password === confirmPassword
}

export async function registerUser(username, password) {
    const email = username + "@fithab.com"
    try {
        await firebaseCreateUser(email, password)
        return true
    } catch (error) {
        toast(error.message, 5000)
        return false
    }
}

export async function signUp(username, password, confirmPassword) {
    const areFieldsEmpty = validateFieldsEmpty(username, password)
    const arePasswordsMatching = validatePasswordsMatching(password, confirmPassword)

    if (areFieldsEmpty) {
        return toast(translate.getText("USER_NAME_PASSWORD_REQUIRED"))
    } else if (!arePasswordsMatching) {
        return toast(translate.getText("PASSWORD_NOT_MATCH"))
    }

    const response = await registerUser(username, password)
    if (response) {
        return true
    }
}