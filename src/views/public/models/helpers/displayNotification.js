// ! notificater for upload page
import {createElement, getElement} from "./DOM.utils";
let notificationTimeoutId;

export const uploadPageNotificater = (type = "danger", message, setTimer = true, timeout = 1500) => {
    const body = getElement("body");
    const firstChildOfBody = getElement("h1.text-center");

    deleteuploadPageNotificater();

    const newAlertContainer = createElement("div", "alert-container", type);
    const messageSection = createElement("div", null, "message-section");
    messageSection.textContent = message;
    newAlertContainer.appendChild(messageSection);
    body.insertBefore(newAlertContainer, firstChildOfBody);

    if (setTimer) {
        if (notificationTimeoutId) {
            clearTimeout(notificationTimeoutId);
        }
        notificationTimeoutId = setTimeout(() => {
            deleteuploadPageNotificater();
        }, timeout);
    }
};
export const deleteuploadPageNotificater = () => {
    const alertContainer = getElement("#alert-container");
    if (alertContainer) {
        alertContainer.remove();
    }
}