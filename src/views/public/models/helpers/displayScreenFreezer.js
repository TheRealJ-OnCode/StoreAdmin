import {createElement, getElement} from "./DOM.utils";

export const displayScreenFreezer = () => {
    const body = getElement("body");
    removeScreenFreezer()
    const freezerLayout = createElement("div", "freezer-layout")
    body.append(freezerLayout);
    
}
export const removeScreenFreezer = () => {
    const freezer = getElement("#freezer-layout");
    if (freezer) freezer.remove();
}