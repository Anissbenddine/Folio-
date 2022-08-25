import firebase from "firebase"
import DefaultSettings from "../pages/Settings/DefaultSettings"

const getUserUID = () => localStorage.getItem("userUid");

const getDashBoardRef = (currentDate) =>
    firebase
        .database()
        .ref(
            "dashboard/"
            + getUserUID()
            + (currentDate
                ? (
                    "/"
                    + currentDate.startDate.getDate()
                    + (currentDate.startDate.getMonth() + 1)
                    + currentDate.startDate.getFullYear()
                )
                : ""
            )
        );

const getSettingsRef = () =>
    firebase
        .database()
        .ref(
            "settings/"
            + getUserUID()
        );

const updateDashBoardRef = (currentDate, dashboard) =>
    getDashBoardRef(currentDate).update(dashboard);

const getDashboardLocalStorage = () =>
    JSON.parse(localStorage.getItem("dashboard"));

const getSettingsLocalStorage = () =>
    JSON.parse(localStorage.getItem("settings"));

const updateDashboardLocalStorage = (dashboard) =>
    localStorage.setItem("dashboard", JSON.stringify(dashboard));

const updateSettingsRef = (settings) =>
    getSettingsRef().update(settings);

const updateSettingsLocalStorage = (settings) =>
    localStorage.setItem("settings", JSON.stringify(settings));

const updateSettings = (doSomething) => {
    const settings = getSettingsLocalStorage();
    doSomething(settings);
    updateSettingsLocalStorage(settings);
    return updateSettingsRef(settings);
}

const AlcoolService = {
    dashboard: {
        updateAlcools: (alcools, currentDate) => {
            const dashboard = getDashboardLocalStorage();
            dashboard.alcool.alcools = alcools;
            updateDashboardLocalStorage(dashboard);

            return updateDashBoardRef(currentDate, dashboard);
        },
        addAlcool: (alcoolToRemove, currentDate) => {
            const dashboard = getDashboardLocalStorage();
            dashboard.alcool.alcools.unshift(alcoolToRemove);
            updateDashboardLocalStorage(dashboard);

            return updateDashBoardRef(currentDate, dashboard);
        },
        getConsommations: () =>
            getDashBoardRef()
                .orderByKey()
                .once("value")
                .then(snapshot => snapshot.val()),
        updateGlobalConsumption: (totalConsumption, currentDate) => {
            const dashboard = getDashboardLocalStorage();
            dashboard.alcool.dailyTarget.globalConsumption = totalConsumption;
            updateDashboardLocalStorage(dashboard);

            return updateDashBoardRef(currentDate, dashboard);
        },
    },
    settings: {
        updateAlcools: (alcools) =>
            updateSettings(settings => settings.alcool.alcools = alcools),
        getAlcool: () =>
            firebase
                .database()
                .ref("settings/" + getUserUID() + "/alcool")
                .once("value")
                .then(snapshot => {
                    const sets = snapshot.val();
                    return sets || {
                        dailyTarget: {
                            value: 0,
                            unit: ""
                        },
                        notifications: {
                            active: false
                        },
                        limitConsom: {
                            educAlcool: true,
                            weeklyTarget: 0,
                            dailyTarget: 0,
                            sobrietyDays: 7,
                            notificationMessage: ""
                        },
                        alcools: DefaultSettings.alcools
                    };
                }),
        updateNotifications: (notifications) =>
            updateSettings(settings => settings.alcool.notifications = notifications),
        updateDailyTarget: (dailyTarget) =>
            updateSettings(settings => settings.alcool.dailyTarget = dailyTarget),
        updateLimitConsom: (limitConsom) =>
            updateSettings(settings => settings.alcool.limitConsom = limitConsom)
    },
    getNotificationMsg: (userLang) => {
        switch (userLang) {
            case "fr":
                return "Selon les recommandations d'ÉducAlcool, vous venez de dépasser la limite. C'est juste un rappel...";
            case "en":
                return "According to EducAlcool guidelines, you just exceeded the limits of alcohol intake. This is just a reminder...";
            case "es":
                return "Según las recomendaciones de ÉducAlcool, acaba de superar el límite. Es solo un recordatorio ...";
        }
    }
};

export default AlcoolService; 