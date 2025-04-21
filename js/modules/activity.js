import * as calc from "./calculation.js";
import { backdrop, colorEdit } from "./window.js";
import { setCloseActivityWrapper } from "./event.js";

// Getting the necessary DOM elements
export const memoryButton = document.getElementsByClassName("memory-button");
export let memoryLiButton = null;
export const activityOption =
  document.getElementsByClassName("activity-option");
export const activityWrapper = document.querySelector(".activity-wrapper");
export const activityDisplay =
  document.getElementsByClassName("activity-display");
export const activityClear = document.getElementById("activity-clear");

// Setting up global variables
let memory = null;
export const handleMemory = {
  "memory-clear": () => {
    memory = null;

    clearActivity(activityDisplay[1]);
  },

  "memory-li-clear": (targetedLi) => {
    if (activityDisplay[1].querySelector("ul").childElementCount > 1) {
      targetedLi.remove();
    } else {
      activityDisplay[1].innerHTML = "";
    }
  },

  "memory-recall": () => {
    const recall = activityDisplay[1].querySelector("li span").textContent;

    calc.setExpression(recall);
    calc.calculatorDisplay.textContent = calc.expression;
  },

  "memory-sum": () => {
    memory = calc.lastPart === null ? "0" : calc.lastPart;

    if (!activityDisplay[1].querySelector("ul")) {
      storeActivity(memory, null, activityDisplay[1]);
    } else {
      const displayLiSpan = activityDisplay[1].querySelector("li span");
      const sum = (
        parseFloat(displayLiSpan.textContent) + parseFloat(memory)
      ).toString();

      displayLiSpan.textContent = sum;
    }
  },

  "memory-li-sum": (targetedLi) => {
    memory = calc.lastPart === null ? "0" : calc.lastPart;

    const displayLiSpan = targetedLi.querySelector("span");
    const liSum = (
      parseFloat(displayLiSpan.textContent) + parseFloat(memory)
    ).toString();

    displayLiSpan.textContent = liSum;
  },

  "memory-minus": () => {
    memory = calc.lastPart === null ? "0" : calc.lastPart;

    if (!activityDisplay[1].querySelector("ul")) {
      storeActivity(memory, null, activityDisplay[1]);
    } else {
      const displayLiSpan = activityDisplay[1].querySelector("li span");
      const minus = (
        parseFloat(displayLiSpan.textContent) - parseFloat(memory)
      ).toString();

      displayLiSpan.textContent = minus;
    }
  },

  "memory-li-minus": (targetedLi) => {
    memory = calc.lastPart === null ? "0" : calc.lastPart;

    const displayLiSpan = targetedLi.querySelector("span");
    const liMinus = (
      parseFloat(displayLiSpan.textContent) - parseFloat(memory)
    ).toString();

    displayLiSpan.textContent = liMinus;
  },

  "memory-store": () => {
    memory = calc.lastPart === null ? "0" : calc.lastPart;

    storeActivity(memory, null, activityDisplay[1]);
  },

  memory: () => {
    toggleActivityDisplay(memoryButton[5]);

    setTimeout(() => {
      setCloseActivityWrapper(true);
    }, 200);
  },
};

/**
 * Toggles an activityDisplay based on the selected activityOption.
 * @param {HTMLSpanElement} whichOption - The selected activityOption to toggle.
 * @returns {void}
 */
export function toggleActivityDisplay(whichOption) {
  if (screen.width >= 1024) {
    whichOption.classList.add("active");

    if (whichOption.id === "activity-history") {
      activityDisplay[0].classList.remove("hidden");
      activityDisplay[1].classList.add("hidden");
    } else {
      activityDisplay[0].classList.add("hidden");
      activityDisplay[1].classList.remove("hidden");
    }

    for (const o of activityOption) {
      if (o !== whichOption) o.classList.remove("active");
    }
  } else {
    activityWrapper.style.setProperty("display", "flex");

    if (whichOption.id === "toggle-history") {
      activityDisplay[0].classList.remove("hidden");
      activityDisplay[1].classList.add("hidden");
    } else {
      activityDisplay[0].classList.add("hidden");
      activityDisplay[1].classList.remove("hidden");
    }

    backdrop[0].style.setProperty("display", "block");
    colorEdit.style.setProperty("z-index", "-1");
  }
}

/**
 * Stores the last operation performed in the calculator or adds a number to memory.
 * @param {string} firstPart - The first part to be stored/added.
 * @param {string} secondPart - The second part to be stored.
 * @param {HTMLDivElement} whichDisplay - The chosen display to be stored/checked.
 * @returns {void}
 */
export function storeActivity(firstPart, secondPart, whichDisplay) {
  let displayUl = whichDisplay.querySelector("ul");
  const displayLi = document.createElement("li");

  if (!displayUl) {
    const newDisplayUl = document.createElement("ul");

    displayUl = newDisplayUl;

    whichDisplay.appendChild(displayUl);
  }

  if (whichDisplay === activityDisplay[0]) {
    displayLi.textContent = `${firstPart}=${secondPart}`;
  } else {
    displayLi.innerHTML = `
    <span>${firstPart}</span>
    <div class="memory-li-controls">
      <button
        type="button"
        id="memory-li-clear"
        class="memory-li-button"
        title="Memory clear"
      >
        MC
      </button>
      <button
        type="button"
        id="memory-li-sum"
        class="memory-li-button"
        title="Memory addition"
      >
        M+
      </button>
      <button
        type="button"
        id="memory-li-minus"
        class="memory-li-button"
        title="Memory subtraction"
      >
        M-
      </button>
    </div>
    `;
  }

  memoryLiButton = displayLi.getElementsByClassName("memory-li-button");

  displayUl.insertBefore(displayLi, displayUl.firstChild);
}

/**
 * Clear all content from a given display.
 * @param {HTMLDivElement} whichDisplay - The chosen display to be cleared/checked.
 * @returns {void}
 */
export const clearActivity = (whichDisplay) => {
  whichDisplay.innerHTML = "";
};

// Creating a mutation observer to watch for changes in the DOM
const observer1 = new MutationObserver(() => {
  observer1.disconnect();

  const historyText = activityDisplay[0].querySelector("p");
  const memoryText = activityDisplay[1].querySelector("p");

  if (historyText && activityDisplay[0].querySelector("ul")) {
    historyText.remove();
  } else if (!activityDisplay[0].querySelector("ul")) {
    activityDisplay[0].innerHTML = `<p aria-live="polite">No history yet.</p>`;
  }

  if (memoryText && activityDisplay[1].querySelector("ul")) {
    memoryText.remove();

    memoryButton[0].classList.remove("disabled");
    memoryButton[1].classList.remove("disabled");
  } else if (!activityDisplay[1].querySelector("ul")) {
    activityDisplay[1].innerHTML = `<p aria-live="polite">No memory yet.</p>`;

    memoryButton[0].classList.add("disabled");
    memoryButton[1].classList.add("disabled");
  }

  for (const d of activityDisplay) {
    observer1.observe(d, {
      childList: true,
      subtree: true,
    });
  }
});

const observer2 = new MutationObserver(() => {
  if (
    !activityDisplay[0].classList.contains("hidden") &&
    activityDisplay[0].querySelector("ul")
  ) {
    activityClear.classList.remove("hidden");
  } else if (
    !activityDisplay[1].classList.contains("hidden") &&
    activityDisplay[1].querySelector("ul")
  ) {
    activityClear.classList.remove("hidden");
  } else {
    activityClear.classList.add("hidden");
  }
});

const observer3 = new MutationObserver(() => {
  if (screen.width >= 1024) {
    let colorEditPosition = null;

    if (activityClear.classList.contains("hidden")) {
      colorEditPosition = "var(--default-rem)";
    } else {
      colorEditPosition = "5rem";
    }

    colorEdit.style.setProperty("right", colorEditPosition);
  }
});

for (const d of activityDisplay) {
  observer1.observe(d, {
    childList: true,
    subtree: true,
  });
  observer2.observe(d, {
    attributeFilter: ["class"],
    childList: true,
    subtree: true,
  });
}
observer3.observe(activityClear, {
  attributeFilter: ["class"],
});
