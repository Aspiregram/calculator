import * as calc from "./calculation.js";
import * as act from "./activity.js";
import * as wind from "./window.js";

// Getting the necessary DOM elements
const toggleHistory = document.getElementById("toggle-history");
const colorForm = document.querySelector(".color-form");

// Setting up global variables
let targetedLi = null;
let closeActivityWrapper = false;

/**
 * Sets a new value to expression.
 * @param {boolean} newCloseActivityWrapper - The new value to be set.
 * @returns {void}
 */
export const setCloseActivityWrapper = (newCloseActivityWrapper) => {
  closeActivityWrapper = newCloseActivityWrapper;
};

/**
 * Checks if the given color is valid.
 * @param {string} validColor - The color to be validated.
 * @returns {boolean} - Returns true if the color is valid, false otherwise.
 */
const isValidColor = (validColor) => {
  const valid = new Option().style;

  valid.color = validColor;

  return valid.color !== "";
};

/**
 * Handles the interaction with the document in some aspects.
 * @param {MouseEvent} e - The mouse event triggered by the user.
 * @returns {void}
 */
const documentInteraction = (e) => {
  if (targetedLi !== e.target) wind.togglePopupMenu(null, null, true, null);

  if (closeActivityWrapper && !e.target.closest(".activity-wrapper")) {
    act.activityWrapper.classList.add("moveinalt");
    wind.backdrop[0].classList.add("fadeout");

    setTimeout(() => {
      act.activityWrapper.classList.remove("moveinalt");
      act.activityWrapper.style.setProperty("display", "none");
      wind.backdrop[0].classList.remove("fadeout");
      wind.backdrop[0].style.setProperty("display", "none");

      wind.colorEdit.removeAttribute("style");
    }, 200);

    closeActivityWrapper = false;
  }
};

/**
 * Handles the interaction with the form in some aspects.
 * @param {MouseEvent} e - The mouse event triggered by the user.
 * @returns {void}
 */
const inputInteraction = (e) => {
  const typedColor = e.target;

  for (let i = 0; i < wind.textInput.length; i++) {
    if (
      typedColor.dataset.root === wind.colorInput[i].dataset.root &&
      isValidColor(typedColor.value) &&
      typedColor.value.length === 7
    ) {
      wind.colorInput[i].value = typedColor.value;
    } else if (typedColor.dataset.root === wind.colorInput[i].dataset.root) {
      wind.colorInput[i].value = wind.rootColor[i];
    }
  }

  if (typedColor.value) {
    wind.colorPreview.classList.remove("disabled");
    wind.colorAccept.classList.remove("disabled");
  } else {
    wind.colorPreview.classList.add("disabled");
    wind.colorAccept.classList.add("disabled");
  }

  wind.pickColorScheme(wind.colorInput);
};

// Creating an event listener for handling the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", () => {
  // Creating an event listener for handling calculatorButton's keyboard inputs
  window.addEventListener("keydown", (e) => {
    if (
      wind.colorPanel.classList.contains("hidden") &&
      act.activityWrapper.style.display !== "flex"
    ) {
      switch (e.key) {
        case "Escape":
        case "Delete":
          calc.calculatorButton[2].click();
          wind.toggleActiveButton(calc.calculatorButton[2]);
          break;

        case "Backspace":
          calc.calculatorButton[3].click();
          wind.toggleActiveButton(calc.calculatorButton[3]);
          break;

        case "/":
          calc.calculatorButton[7].click();
          wind.toggleActiveButton(calc.calculatorButton[7]);
          break;

        case "*":
          calc.calculatorButton[11].click();
          wind.toggleActiveButton(calc.calculatorButton[11]);
          break;

        case "Enter":
          calc.calculatorButton[23].click();
          wind.toggleActiveButton(calc.calculatorButton[23]);
          break;

        default:
          for (const b of calc.calculatorButton) {
            if (b.value === e.key) {
              b.click();
              wind.toggleActiveButton(b);
            }
          }
          break;
      }
    }
  });

  // Creating an event listener for handling calculatorButton's buttons clicks
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".calculator-button")) return;

    calc.updateDisplay(e.target);
  });

  // Creating an event listener for handling memoryButton's buttons clicks
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".memory-button")) return;

    act.handleMemory[e.target.id]();
  });

  // Creating an event listener for handling memoryLiButton's buttons clicks
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".memory-li-button")) return;

    act.handleMemory[e.target.id](e.target.closest("li"));
  });

  // Creating an event listener for handling activityOption's spans clicks
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".activity-option")) return;

    act.toggleActivityDisplay(e.target);
  });

  // Creating an event listener for handling toggleHistory's span clicks
  toggleHistory.addEventListener("click", () => {
    act.toggleActivityDisplay(toggleHistory);

    setTimeout(() => {
      closeActivityWrapper = true;
    }, 200);
  });

  // Creating an event listener for handling clearActivity's span clicks
  act.activityClear.addEventListener("click", () => {
    act.clearActivity(
      !act.activityDisplay[0].classList.contains("hidden")
        ? act.activityDisplay[0]
        : act.activityDisplay[1]
    );
  });

  // Creating an event listener for handling document's right clicks
  document.addEventListener("contextmenu", (e) => {
    targetedLi = e.target.closest("li");

    if (targetedLi) {
      e.preventDefault();

      wind.togglePopupMenu(
        e.clientX,
        e.clientY,
        false,
        !act.activityDisplay[0].classList.contains("hidden")
          ? act.activityDisplay[0]
          : act.activityDisplay[1]
      );
    }
  });

  // Creating an event listener for handling document's left clicks
  document.addEventListener("click", (e) => {
    if (!e.target.closest("li") || e.target.closest(".memory-li-button"))
      return;

    targetedLi = e.target.closest("li");

    wind.updateDisplayWithLi(
      targetedLi,
      !act.activityDisplay[0].classList.contains("hidden")
        ? act.activityDisplay[0]
        : act.activityDisplay[1]
    );
  });

  // Creating an event listener for handling document's left/right clicks
  document.addEventListener("click", documentInteraction);
  document.addEventListener("contextmenu", documentInteraction);

  // Creating an event listener for handling popupOption's spans clicks
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".popup-option")) return;

    wind.evaluateTargetedLi(targetedLi, e.target);
  });

  // Creating an event listener for handling Ctrl + V presses
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "v") {
      e.preventDefault();

      wind.updateDisplayWithClipboard();
    }
  });

  // Creating an event listener for handling colorEdit's span clicks
  wind.colorEdit.addEventListener("click", () => {
    wind.toggleColorPanel(false);
  });

  // Creating an event listener for handling colorForm's input changes
  document.addEventListener("input", inputInteraction);

  // Creating an event listener for handling colorPreview's button clicks
  wind.colorPreview.addEventListener("click", () => {
    wind.previewColorScheme(wind.colorInput, true);
  });

  // Creating an event listener for handling closePreview's span clicks
  wind.closePreview.addEventListener("click", () => {
    wind.previewColorScheme(wind.colorInput, false);
  });

  // Creating an event listener for handling colorForm's submit button clicks
  colorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    for (const i of wind.textInput) {
      if (i.value) i.value = "";
    }

    wind.setColorScheme(wind.colorInput);

    wind.toggleColorPanel(true);
  });

  // Creating an event listener for handling colorForm's reset button clicks
  colorForm.addEventListener("reset", (e) => {
    e.preventDefault();

    for (let i = 0; i < wind.colorInput.length; i++) {
      wind.colorInput[i].value = wind.rootColor[i];
      if (wind.textInput[i].value) wind.textInput[i].value = "";
      wind.textInput[i].placeholder = wind.rootColor[i];
    }

    wind.toggleColorPanel(true);
  });
});
