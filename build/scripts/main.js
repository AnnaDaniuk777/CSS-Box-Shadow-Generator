// source/scripts/modules/color-converter.js
function hexToRgba(hex, opacity) {
  const cleanHex = hex.replace(/^#/, "");
  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity range is from 0 to 1");
  }
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// source/scripts/modules/code-generator.js
function generateCSSCode(horizontal, vertical, blur, spread, shadowColor, boxColor, opacity, shadowType) {
  const shadowColorWithOpacity = hexToRgba(shadowColor, opacity);
  const shadowValue = `${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColorWithOpacity}
  ${shadowType === "inset" ? "inset" : ""}`;
  const cssCode = `.box {
    background: ${boxColor};
    box-shadow: ${shadowValue};
  }`;
  return cssCode;
}

// source/scripts/modules/form-validator.js
function validateNumberInput(input, min, max, errorElement, fieldName) {
  const value = parseFloat(input.value);
  let isValid = true;
  let errorMessage = "";
  if (input.value.trim() === "") {
    isValid = false;
    errorMessage = `${fieldName} is required`;
  } else if (isNaN(value)) {
    isValid = false;
    errorMessage = `${fieldName} must be a number`;
  } else if (value < min) {
    isValid = false;
    errorMessage = `${fieldName} must be at least ${min}`;
  } else if (value > max) {
    isValid = false;
    errorMessage = `${fieldName} must be at most ${max}`;
  }
  if (errorElement) {
    errorElement.textContent = errorMessage;
    input.parentElement.classList.toggle("generator__input-wrapper--error", !isValid);
  }
  return isValid;
}
function validateColorInput(textInput, errorElement, fieldName) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  let isValid = true;
  let errorMessage = "";
  if (!textInput.value.trim()) {
    isValid = false;
    errorMessage = `${fieldName} is required`;
  } else if (!hexColorRegex.test(textInput.value)) {
    isValid = false;
    errorMessage = `${fieldName} must be a valid hex color (e.g., #FF0000)`;
  }
  if (errorElement) {
    errorElement.textContent = errorMessage;
    textInput.parentElement.classList.toggle(".generator__general-color-wrapper--error", !isValid);
  }
  return isValid;
}
function validateOpacityInput(input, errorElement) {
  const value = parseFloat(input.value);
  let isValid = true;
  let errorMessage = "";
  if (input.value.trim() === "") {
    isValid = false;
    errorMessage = "Opacity is required";
  } else if (isNaN(value)) {
    isValid = false;
    errorMessage = "Opacity must be a number";
  } else if (value < 0) {
    isValid = false;
    errorMessage = "Opacity must be at least 0";
  } else if (value > 1) {
    isValid = false;
    errorMessage = "Opacity must be at most 1";
  }
  if (errorElement) {
    errorElement.textContent = errorMessage;
    input.parentElement.classList.toggle(".generator__input-wrapper--error", !isValid);
  }
  return isValid;
}
function validateFormField(fieldType, input, errorElement, fieldName, min, max) {
  switch (fieldType) {
    case "number":
      return validateNumberInput(input, min, max, errorElement, fieldName);
    case "color":
      return validateColorInput(input, errorElement, fieldName);
    case "opacity":
      return validateOpacityInput(input, errorElement);
    default:
      return true;
  }
}

// source/scripts/modules/shadow-generator.js
function initShadowGenerator() {
  const elements = getDOMElements();
  setInitialValues(elements);
  setupEventListeners(elements);
  updateShadowPreview(elements);
}
function getDOMElements() {
  const sizeWrappers = document.querySelectorAll(".generator__input-size");
  const colorWrappers = document.querySelectorAll(".generator__input-color");
  return {
    sizeControls: Array.from(sizeWrappers).map((wrapper) => ({
      input: wrapper.querySelector('input[type="number"]'),
      range: wrapper.querySelector('input[type="range"]'),
      error: wrapper.querySelector(".generator__error")
    })),
    colorControls: Array.from(colorWrappers).map((wrapper) => ({
      picker: wrapper.querySelector('input[type="color"]'),
      text: wrapper.querySelector('input[type="text"]'),
      error: wrapper.querySelector(".generator__error")
    })),
    shadowTypeToggle: document.getElementById("toggle"),
    getCodeButton: document.querySelector(".generator__get-button"),
    closeCodeButton: document.querySelector(".generator__close-button"),
    copyButton: document.querySelector(".generator__copy-button"),
    boxView: document.querySelector(".generator__box-view"),
    shadowBox: document.querySelector(".generator__shadow-box"),
    codePreview: document.querySelector(".generator__code-preview"),
    codeContent: document.querySelector(".generator__code-content")
  };
}
function syncRangeAndNumber(control) {
  control.range.value = control.input.value;
}
function syncColorInputs(control) {
  control.picker.value = control.text.value;
}
function setInitialValues(elements) {
  elements.sizeControls.forEach((control) => syncRangeAndNumber(control));
  elements.colorControls.forEach((control) => syncColorInputs(control));
}
function setupRangeNumberSync(control, elements, index) {
  const fieldConfigs = [
    { type: "number", name: "Horizontal Length", min: 0, max: 100 },
    { type: "number", name: "Vertical Length", min: 0, max: 100 },
    { type: "number", name: "Blur Radius", min: 0, max: 100 },
    { type: "number", name: "Spread Radius", min: 0, max: 100 },
    { type: "opacity", name: "Opacity" }
  ];
  const config = fieldConfigs[index];
  control.range.addEventListener("input", () => {
    control.input.value = control.range.value;
    validateFormField(config.type, control.input, control.error, config.name, config.min, config.max);
    updateShadowPreview(elements);
  });
  control.input.addEventListener("input", () => {
    control.range.value = control.input.value;
    validateFormField(config.type, control.input, control.error, config.name, config.min, config.max);
    updateShadowPreview(elements);
  });
}
function setupColorSync(control, elements, index) {
  const fieldNames = ["Shadow Color", "Background Color", "Box Color"];
  control.picker.addEventListener("input", () => {
    control.text.value = control.picker.value;
    validateFormField("color", control.text, control.error, fieldNames[index]);
    updateShadowPreview(elements);
  });
  control.text.addEventListener("input", () => {
    control.picker.value = control.text.value;
    validateFormField("color", control.text, control.error, fieldNames[index]);
    updateShadowPreview(elements);
  });
}
function validateAllFields(elements) {
  let isValid = true;
  const sizeFieldConfigs = [
    { type: "number", name: "Horizontal Length", min: 0, max: 100 },
    { type: "number", name: "Vertical Length", min: 0, max: 100 },
    { type: "number", name: "Blur Radius", min: 0, max: 100 },
    { type: "number", name: "Spread Radius", min: 0, max: 100 },
    { type: "opacity", name: "Opacity" }
  ];
  const colorFieldNames = ["Shadow Color", "Background Color", "Box Color"];
  elements.sizeControls.forEach((control, index) => {
    const config = sizeFieldConfigs[index];
    const fieldValid = validateFormField(
      config.type,
      control.input,
      control.error,
      config.name,
      config.min,
      config.max
    );
    if (!fieldValid) {
      isValid = false;
    }
  });
  elements.colorControls.forEach((control, index) => {
    const fieldValid = validateFormField(
      "color",
      control.text,
      control.error,
      colorFieldNames[index]
    );
    if (!fieldValid) {
      isValid = false;
    }
  });
  return isValid;
}
function setupEventListeners(elements) {
  elements.sizeControls.forEach((control, index) => setupRangeNumberSync(control, elements, index));
  elements.colorControls.forEach((control, index) => setupColorSync(control, elements, index));
  elements.getCodeButton.addEventListener("click", () => {
    if (validateAllFields(elements)) {
      showCodePreview(elements);
    }
  });
  elements.shadowTypeToggle.addEventListener("change", () => updateShadowPreview(elements));
  elements.closeCodeButton.addEventListener("click", () => hideCodePreview(elements));
  elements.copyButton.addEventListener("click", () => copyCodeToClipboard(elements));
}
function updateShadowPreview(elements) {
  const horizontal = document.getElementById("horizontal").value;
  const vertical = document.getElementById("vertical").value;
  const blur = document.getElementById("blur").value;
  const spread = document.getElementById("spread").value;
  const opacity = document.getElementById("opacity").value;
  const shadowColor = document.getElementById("shadow").value;
  const backgroundColor = document.getElementById("background").value;
  const boxColor = document.getElementById("box").value.toUpperCase();
  const shadowType = elements.shadowTypeToggle.checked ? "inset" : "outline";
  elements.shadowBox.style.backgroundColor = backgroundColor;
  elements.boxView.style.backgroundColor = boxColor;
  const shadowColorWithOpacity = hexToRgba(shadowColor, opacity);
  const shadowValue = `${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColorWithOpacity} ${shadowType === "inset" ? "inset" : ""}`;
  elements.boxView.style.boxShadow = shadowValue;
}
function showCodePreview(elements) {
  const horizontal = document.getElementById("horizontal").value;
  const vertical = document.getElementById("vertical").value;
  const blur = document.getElementById("blur").value;
  const spread = document.getElementById("spread").value;
  const opacity = document.getElementById("opacity").value;
  const shadowColor = document.getElementById("shadow").value;
  const boxColor = document.getElementById("box").value.toUpperCase();
  const shadowType = elements.shadowTypeToggle.checked ? "inset" : "outline";
  const cssCode = generateCSSCode(horizontal, vertical, blur, spread, shadowColor, boxColor, opacity, shadowType);
  elements.codeContent.textContent = cssCode;
  elements.codePreview.style.zIndex = "7";
}
function hideCodePreview(elements) {
  elements.codePreview.style.display = "none";
}
async function copyCodeToClipboard(elements) {
  const code = elements.codeContent.textContent;
  const buttonTextElement = elements.copyButton.querySelector(".generator__copy-button-text");
  try {
    await navigator.clipboard.writeText(code);
    buttonTextElement.textContent = "Copied!";
    setTimeout(() => {
      buttonTextElement.textContent = "Copy to Clipboard";
    }, 2e3);
  } catch {
    buttonTextElement.textContent = "Copy Failed!";
    throw new Error("Failed to copy CSS code");
  }
}

// source/scripts/main.js
initShadowGenerator();
//# sourceMappingURL=main.js.map
