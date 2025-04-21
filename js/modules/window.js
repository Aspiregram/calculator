import { calculatorDisplay, expression, setExpression } from "./calculation.js";
import { activityDisplay, handleMemory } from "./activity.js";

// Getting the necessary DOM elements
const root = document.documentElement;
const popupMenu = document.getElementById("popup-menu");
const popupControls = document.getElementsByClassName("popup-controls");
export const popupOption = document.getElementsByClassName("popup-option");
export const colorEdit = document.getElementById("color-edit");
export const colorPanel = document.getElementById("color-panel");
export const backdrop = document.getElementsByClassName("backdrop");
export const closePreview = document.getElementById("close-preview");
const colorWrapper = document.querySelector(".color-wrapper");
export const colorInput = document.getElementsByClassName("color-input");
export const textInput = document.getElementsByClassName("text-input");
export const colorPreview = document.getElementById("color-preview");
export const colorAccept = document.getElementById("color-accept");

// Setting up global variables
export const rootColor = [
  getComputedStyle(root).getPropertyValue("--primary-color"),
  getComputedStyle(root).getPropertyValue("--secondary-color"),
  getComputedStyle(root).getPropertyValue("--tertiary-color"),
  getComputedStyle(root).getPropertyValue("--quaternary-color"),
];
let temporaryRootColor = [];

/**
 * Toggles an "active" state on a button element.
 * @param {HTMLButtonElement} whichButton - The button to toggle the active state on.
 * @returns {void}
 */
export const toggleActiveButton = (whichButton) => {
  whichButton.classList.add("active");
  setTimeout(() => whichButton.classList.remove("active"), 200);
};

/**
 * Toggles the visibility of the popup menu.
 * @param {number} x - The x-coordinate for the popup menu position.
 * @param {number} y - The y-coordinate for the popup menu position.
 * @param {boolean} isHidden - A flag indicating whether the popup menu should be hidden or shown.
 * @param {HTMLDivElement} whichDisplay - The chosen display to be updated.
 * @returns {void}
 */
export const togglePopupMenu = (x, y, isHidden, whichDisplay) => {
  if (!isHidden) {
    popupMenu.removeAttribute("class");
    popupMenu.style.left = `${x}px`;
    popupMenu.style.top = `${y}px`;

    if (whichDisplay === activityDisplay[0]) {
      popupControls[0].classList.remove("hidden");
      popupControls[1].classList.add("hidden");
    } else {
      popupControls[0].classList.add("hidden");
      popupControls[1].classList.remove("hidden");
    }
  } else {
    popupMenu.classList.add("hidden");
  }
};

/**
 * Handles the interaction with the popup menu options.
 * @param {HTMLLIElement} targetedLi - The targeted list item element.
 * @param {HTMLSpanElement} whichOption - The selected option from the popup menu.
 * @returns {void}
 */
export function evaluateTargetedLi(targetedLi, whichOption) {
  switch (whichOption) {
    case popupOption[0]:
      navigator.clipboard.writeText(
        targetedLi.textContent.split("=")[1].trim()
      );
      break;

    case popupOption[1]:
    case popupOption[2]:
      if (!activityDisplay[0].classList.contains("hidden")) {
        if (activityDisplay[0].querySelector("ul").childElementCount > 1) {
          targetedLi.remove();
        } else {
          activityDisplay[0].innerHTML = "";
        }
      } else {
        handleMemory["memory-li-clear"](targetedLi);
      }
      break;

    case popupOption[3]:
      handleMemory["memory-li-sum"](targetedLi);
      break;

    case popupOption[4]:
      handleMemory["memory-li-minus"](targetedLi);
      break;

    default:
      break;
  }
}

/**
 * Updates the calculator display with the content from the clipboard.
 * @returns {void}
 */
export const updateDisplayWithClipboard = () => {
  navigator.clipboard.readText().then((text) => {
    setExpression(text);
    calculatorDisplay.textContent = expression;
  });
};

/**
 * Updates the calculator display with the content from the targeted list item.
 * @param {HTMLLIElement} targetedLi - The targeted list item element.
 * @param {HTMLDivElement} whichDisplay - The chosen display to be updated.
 * @returns {void}
 */
export const updateDisplayWithLi = (targetedLi, whichDisplay) => {
  if (whichDisplay === activityDisplay[0]) {
    setExpression(targetedLi.textContent.split("=")[1].trim());
  } else {
    setExpression(targetedLi.querySelector("span").textContent.trim());
  }

  calculatorDisplay.textContent = expression;
};

/**
 * Toggles the visibility of the color panel.
 * @param {boolean} isHidden - A flag indicating whether the color panel should be hidden or shown.
 * @return {void}
 */
export const toggleColorPanel = (isHidden) => {
  if (!isHidden) {
    colorPanel.removeAttribute("class");
  } else {
    backdrop[1].classList.add("fadeout");
    colorWrapper.classList.add("scaleout");
    colorPreview.classList.add("disabled");
    colorAccept.classList.add("disabled");
    setTimeout(() => {
      colorPanel.classList.add("hidden");
      backdrop[1].classList.remove("fadeout");
      colorWrapper.classList.remove("scaleout");
    }, 200);
  }
};

/**
 * Picks the color scheme based on the picked color.
 * @param {InputEvent} pickedColor - The color picked by the user.
 * @return {void}
 */
export const pickColorScheme = (pickedColor) => {
  for (let i = 0; i < rootColor.length; i++) {
    temporaryRootColor[i] = pickedColor[i].value;
  }
};

/**
 * Previews the color scheme based on the temporarily stored colors.
 * @param {string} targetedDataset - The dataset attribute to set the color scheme for.
 * @param {boolean} isActive - A flag indicating whether the preview is active or not.
 * @return {void}
 */
export function previewColorScheme(targetedDataset, isActive) {
  if (isActive) {
    for (let i = 0; i < rootColor.length; i++) {
      root.style.setProperty(
        targetedDataset[i].dataset.root,
        temporaryRootColor[i]
      );
    }

    backdrop[1].classList.add("fadeout");
    closePreview.classList.remove("hidden");
    colorWrapper.classList.add("scaleout");
  } else {
    for (let i = 0; i < rootColor.length; i++) {
      root.style.setProperty(targetedDataset[i].dataset.root, rootColor[i]);
    }

    backdrop[1].classList.remove("fadeout");
    closePreview.classList.add("hidden");
    colorWrapper.classList.remove("scaleout");
  }
}

/**
 * Sets the color scheme based on the given colors.
 * @param {string} targetedDataset - The dataset attribute to set the color scheme for.
 * @return {void}
 */
export const setColorScheme = (targetedDataset) => {
  for (let i = 0; i < rootColor.length; i++) {
    rootColor[i] = temporaryRootColor[i];
    root.style.setProperty(targetedDataset[i].dataset.root, rootColor[i]);

    textInput[i].placeholder = rootColor[i];
  }
};
