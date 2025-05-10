export const getElement = (selector) => {
    return document.querySelector(selector);
};

export const getAllElement = (selector) => {
    return document.querySelectorAll(selector);
};

export const createElement = (tag, id, classNames) => {
    const element = document.createElement(tag);

    if (Array.isArray(classNames)) {
        classNames.forEach(className => {
            element.classList.add(className);
        });
    } else if (typeof classNames === 'string') {
        element.classList.add(classNames);
    }

    id ? element.id = id : null;
    return element;
};