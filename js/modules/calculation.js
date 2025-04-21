import { activityDisplay, memoryButton, storeActivity } from "./activity.js";

// Getting the necessary DOM elements
export const calculatorDisplay = document.getElementById("calculator-display");
export const calculatorButton =
  document.getElementsByClassName("calculator-button");

// Setting up global variables
export let expression = "0";
export let lastPart = null;
const regex = /(\+|\-|\u00f7|\u00d7)/g;
const handleOperation = {
  "calculator-pct": () => {
    if (expression === "0") lastPart = "0";

    const pct = (parseFloat(lastPart) / 100).toString().substring(0, 6);

    return (expression =
      expression.slice(0, expression.length - lastPart.length) + pct);
  },

  "calculator-ce": () => {
    const ce = (lastPart = "0");

    return (expression =
      expression.slice(0, expression.length - lastPart.length) + ce);
  },

  "calculator-clear": () => {
    return (expression = "0");
  },

  "calculator-del": () => {
    return (expression = expression.slice(0, -1) || "0");
  },

  "calculator-one-div": () => {
    if (expression === "0") lastPart = "0";

    const oneDiv = (1 / parseFloat(lastPart)).toString().substring(0, 8);

    return (expression =
      expression.slice(0, expression.length - lastPart.length) + oneDiv);
  },

  "calculator-pow": () => {
    if (expression === "0") lastPart = "0";

    const pow = Math.pow(parseFloat(lastPart), 2).toString().substring(0, 8);

    return (expression =
      expression.slice(0, expression.length - lastPart.length) + pow);
  },

  "calculator-sqrt": () => {
    if (expression === "0") lastPart = "0";

    const sqrt = Math.sqrt(parseFloat(lastPart)).toString().substring(0, 8);

    return (expression =
      expression.slice(0, expression.length - lastPart.length) + sqrt);
  },

  "calculator-decimal": () => {
    if (expression === "0") lastPart = "0";

    const decimal = !lastPart.includes(".") ? lastPart + "." : lastPart;

    return (expression =
      expression.slice(0, expression.length - lastPart.length) + decimal);
  },

  "calculator-equals": () => {
    let equals = Function(
      `"use strict"; return ${expression
        .replace(/\u00f7/g, "/")
        .replace(/\u00d7/g, "*")
        .replace(/\e/g, Math.E)}`
    )();

    equals = equals.toString().substring(0, 8);

    storeActivity(expression, equals, activityDisplay[0]);

    return (expression = equals);
  },
};

/**
 * Sets a new value to expression.
 * @param {string} newExpression - The new expression to set.
 * @returns {void}
 */
export const setExpression = (newExpression) => {
  expression = newExpression;
};

/**
 * Updates the calculatorDisplay with the current expression.
 * @param {HTMLButtonElement} whichButton - The button that was clicked.
 * @returns {void}
 */
export function updateDisplay(whichButton) {
  if (handleOperation[whichButton.id]) {
    expression = handleOperation[whichButton.id]();
  } else {
    if (expression === "0" && !whichButton.value.match(regex)) {
      expression = whichButton.value;
    } else if (lastPart === "0" && !whichButton.value.match(regex)) {
      expression =
        expression.slice(0, expression.length - lastPart.length) +
        whichButton.value;
    } else if (whichButton.value.match(regex)) {
      expression += whichButton.value + "0";
    } else {
      expression += whichButton.value;
    }
  }

  calculatorDisplay.textContent = expression;
}

// Creating a mutation observer to watch for changes in the DOM
const observer1 = new MutationObserver(() => {
  const parts = expression.split(regex).filter((part) => part !== "");

  if (!isNaN(parts.at(-1))) return (lastPart = parts.at(-1));
});

const observer2 = new MutationObserver(() => {
  if (expression.includes(Infinity) || expression.includes(NaN)) {
    calculatorDisplay.textContent = "Error";

    for (const b of calculatorButton) {
      if (b.id !== "calculator-clear") b.classList.add("disabled");
    }

    for (const b of memoryButton) {
      b.classList.add("disabled");
    }

    activityDisplay[0].innerHTML = "";
  } else {
    for (const b of calculatorButton) {
      b.classList.remove("disabled");
    }

    for (const b of memoryButton) {
      if (b.id !== "memory-clear" && b.id !== "memory-recall")
        b.classList.remove("disabled");
    }
  }
});

observer1.observe(calculatorDisplay, {
  childList: true,
  subtree: true,
});
observer2.observe(calculatorDisplay, {
  childList: true,
  subtree: true,
});
