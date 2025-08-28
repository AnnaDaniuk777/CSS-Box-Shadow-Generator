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

// source/scripts/modules/shadow-generator.js
function initShadowGenerator() {
  const elements = getDOMElements();
  setInitialValues(elements);
  setupEventListeners(elements);
  updateShadowPreview(elements);
}
function getDOMElements() {
  return {
    horizontalInput: document.getElementById("horizontal"),
    horizontalRange: document.getElementById("h-length"),
    verticalInput: document.getElementById("vertical"),
    verticalRange: document.getElementById("v-length"),
    blurInput: document.getElementById("blur"),
    blurRange: document.getElementById("blur-radius"),
    spreadInput: document.getElementById("spread"),
    spreadRange: document.getElementById("spread-radius"),
    opacityInput: document.getElementById("opacity"),
    opacityRange: document.getElementById("opacity-range"),
    shadowColorPicker: document.getElementById("shadow"),
    shadowColorText: document.getElementById("shadow-color"),
    backgroundColorPicker: document.getElementById("background"),
    backgroundColorText: document.getElementById("background-color"),
    boxColorPicker: document.getElementById("box"),
    boxColorText: document.getElementById("box-color"),
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
function syncRangeAndNumber(range, number) {
  range.value = number.value;
}
function syncColorInputs(picker, text) {
  picker.value = text.value;
}
function setInitialValues(elements) {
  syncRangeAndNumber(elements.horizontalRange, elements.horizontalInput);
  syncRangeAndNumber(elements.verticalRange, elements.verticalInput);
  syncRangeAndNumber(elements.blurRange, elements.blurInput);
  syncRangeAndNumber(elements.spreadRange, elements.spreadInput);
  syncRangeAndNumber(elements.opacityRange, elements.opacityInput);
  syncColorInputs(elements.shadowColorPicker, elements.shadowColorText);
  syncColorInputs(elements.backgroundColorPicker, elements.backgroundColorText);
  syncColorInputs(elements.boxColorPicker, elements.boxColorText);
}
function setupRangeNumberSync(rangeElement, numberElement) {
  rangeElement.addEventListener("input", () => {
    numberElement.value = rangeElement.value;
  });
  numberElement.addEventListener("input", () => {
    rangeElement.value = numberElement.value;
  });
}
function setupColorSync(colorPicker, colorText) {
  colorPicker.addEventListener("input", () => {
    colorText.value = colorPicker.value;
  });
  colorText.addEventListener("input", () => {
    colorPicker.value = colorText.value;
  });
}
function setupEventListeners(elements) {
  setupRangeNumberSync(elements.horizontalRange, elements.horizontalInput);
  setupRangeNumberSync(elements.verticalRange, elements.verticalInput);
  setupRangeNumberSync(elements.blurRange, elements.blurInput);
  setupRangeNumberSync(elements.spreadRange, elements.spreadInput);
  setupRangeNumberSync(elements.opacityRange, elements.opacityInput);
  setupColorSync(elements.shadowColorPicker, elements.shadowColorText);
  setupColorSync(elements.backgroundColorPicker, elements.backgroundColorText);
  setupColorSync(elements.boxColorPicker, elements.boxColorText);
  elements.getCodeButton.addEventListener("click", () => showCodePreview(elements));
  elements.closeCodeButton.addEventListener("click", () => hideCodePreview(elements));
  elements.copyButton.addEventListener("click", () => copyCodeToClipboard(elements));
  const updateValues = [
    elements.horizontalInput,
    elements.horizontalRange,
    elements.verticalInput,
    elements.verticalRange,
    elements.blurInput,
    elements.blurRange,
    elements.spreadInput,
    elements.spreadRange,
    elements.opacityInput,
    elements.opacityRange,
    elements.shadowColorPicker,
    elements.shadowColorText,
    elements.boxColorPicker,
    elements.boxColorText,
    elements.shadowTypeToggle,
    elements.backgroundColorPicker,
    elements.backgroundColorText
  ];
  updateValues.forEach((element) => {
    element.addEventListener("input", () => updateShadowPreview(elements));
  });
}
function updateShadowPreview(elements) {
  const horizontal = elements.horizontalInput.value;
  const vertical = elements.verticalInput.value;
  const blur = elements.blurInput.value;
  const spread = elements.spreadInput.value;
  const shadowColor = elements.shadowColorPicker.value;
  const boxColor = elements.boxColorPicker.value;
  const backgroundColor = elements.backgroundColorPicker.value;
  const opacity = elements.opacityInput.value;
  const shadowType = elements.shadowTypeToggle.checked ? "inset" : "outline";
  elements.shadowBox.style.backgroundColor = backgroundColor;
  elements.boxView.style.backgroundColor = boxColor;
  const shadowColorWithOpacity = hexToRgba(shadowColor, opacity);
  const shadowValue = `${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColorWithOpacity} ${shadowType === "inset" ? "inset" : ""}`;
  elements.boxView.style.boxShadow = shadowValue;
}
function showCodePreview(elements) {
  const horizontal = elements.horizontalInput.value;
  const vertical = elements.verticalInput.value;
  const blur = elements.blurInput.value;
  const spread = elements.spreadInput.value;
  const shadowColor = elements.shadowColorPicker.value;
  const boxColor = elements.boxColorPicker.value.toUpperCase();
  const opacity = elements.opacityInput.value;
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
  } catch {
    throw new Error("Failed to copy CSS code");
  }
}

// source/scripts/main.js
initShadowGenerator();
//# sourceMappingURL=main.js.map
