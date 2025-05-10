import {createElement, getElement} from "./DOM.utils";

export const displayOptionsModal = (headerTitle, box) => {
    const body = getElement("body");
    const firstChildOfBody = getElement("h1.text-center");
    deleteOptionsModal();
    const modal = createElement("div", "option-modal");
    const layout = createElement("div", "option-layout");
    const closeTag = createElement("div", "close-option-modal");
    closeTag.textContent = "x";
    closeTag.addEventListener("click", e => deleteOptionsModal(box))
    modal.appendChild(layout);

    const headerText = createElement("h4", null, "text-center");
    headerText.textContent = headerTitle + " əlavə et";
    const input = createElement("input", "option-input");
    const button = createElement("button", "approve-btn");
    button.textContent = "Təsdiqlə";
    layout.append(closeTag, headerText, input, button);
    body.insertBefore(modal, firstChildOfBody);
    return {button}

}


export const deleteOptionsModal = (box) => {
    const optionModal = getElement("#option-modal");
    if (optionModal) {
        optionModal.remove();
        box ? box.selectedIndex = 0 : false

    }
}