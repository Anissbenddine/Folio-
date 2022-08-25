import firebase from "firebase"

const getUserUID = () => localStorage.getItem("userUid");

const getProfileRef = () =>
    firebase
        .database()
        .ref(
            "dashboard/"
      + getUserUID()
        );


const ProfileService = {
    get: () => {
        let localProfile = localStorage.getItem("profile");
        if (localProfile) {
            localProfile = JSON.parse(localProfile);
            return Promise.resolve(localProfile);
        }

        return getProfileRef()
            .once("value")
            .then(snapshot => {
                const profile = snapshot.val();
                if (profile) {
                    localStorage.setItem("profile", JSON.stringify(profile));
                }
                return profile;
            })
    }
};

export default ProfileService;