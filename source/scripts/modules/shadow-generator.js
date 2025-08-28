import { hexToRgba } from './color-converter.js';
import { generateCSSCode } from './code-generator.js';
import { validateNumberInput, validateColorInput, validateOpacityInput, validateAllFields } from './form-validator.js';

export function initShadowGenerator() {
  const elements = getDOMElements();

  setInitialValues(elements);
  setupEventListeners(elements);
  updateShadowPreview(elements);
}

function getDOMElements() {
  const sizeWrappers = document.querySelectorAll('.generator__input-size');
  const colorWrappers = document.querySelectorAll('.generator__input-color');

  // const validColorWrappers = Array.from(colorWrappers).filter((wrapper) =>
  //   wrapper.querySelector('input[type="color"]') && wrapper.querySelector('input[type="text"]')
  // );

  return {
    sizeControls: Array.from(sizeWrappers).map((wrapper) => ({
      input: wrapper.querySelector('input[type="number"]'),
      range: wrapper.querySelector('input[type="range"]'),
      error: wrapper.querySelector('.generator__error')
    })),

    colorControls: Array.from(colorWrappers).map((wrapper) => ({
      picker: wrapper.querySelector('input[type="color"]'),
      text: wrapper.querySelector('input[type="text"]'),
      error: wrapper.querySelector('.generator__error')
    })),

    shadowTypeToggle: document.getElementById('toggle'),
    getCodeButton: document.querySelector('.generator__get-button'),
    closeCodeButton: document.querySelector('.generator__close-button'),
    copyButton: document.querySelector('.generator__copy-button'),
    boxView: document.querySelector('.generator__box-view'),
    shadowBox: document.querySelector('.generator__shadow-box'),
    codePreview: document.querySelector('.generator__code-preview'),
    codeContent: document.querySelector('.generator__code-content')
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

function setupRangeNumberSync(control, elements) {
  control.range.addEventListener('input', () => {
    control.input.value = control.range.value;
    updateShadowPreview(elements);
  });

  control.input.addEventListener('input', () => {
    control.range.value = control.input.value;
    updateShadowPreview(elements);
  });
}

function setupColorSync(control, elements) {
  control.picker.addEventListener('input', () => {
    control.text.value = control.picker.value;
    updateShadowPreview(elements);
  });

  control.text.addEventListener('input', () => {
    control.picker.value = control.text.value;
    updateShadowPreview(elements);
  });
}

function setupEventListeners(elements) {
  elements.sizeControls.forEach((control) => setupRangeNumberSync(control, elements));
  elements.colorControls.forEach((control) => setupColorSync(control, elements));

  elements.getCodeButton.addEventListener('click', () => showCodePreview(elements));
  elements.closeCodeButton.addEventListener('click', () => hideCodePreview(elements));
  elements.copyButton.addEventListener('click', () => copyCodeToClipboard(elements));
}

function updateShadowPreview(elements) {
  const horizontal = document.getElementById('horizontal').value;
  const vertical = document.getElementById('vertical').value;
  const blur = document.getElementById('blur').value;
  const spread = document.getElementById('spread').value;
  const opacity = document.getElementById('opacity').value;
  const shadowColor = document.getElementById('shadow').value;
  const backgroundColor = document.getElementById('background').value;
  const boxColor = document.getElementById('box').value.toUpperCase();
  const shadowType = elements.shadowTypeToggle.checked ? 'inset' : 'outline';

  elements.shadowBox.style.backgroundColor = backgroundColor;
  elements.boxView.style.backgroundColor = boxColor;

  const shadowColorWithOpacity = hexToRgba(shadowColor, opacity);
  const shadowValue = `${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColorWithOpacity} ${shadowType === 'inset' ? 'inset' : ''}`;

  elements.boxView.style.boxShadow = shadowValue;
}

function showCodePreview(elements) {
  const horizontal = document.getElementById('horizontal').value;
  const vertical = document.getElementById('vertical').value;
  const blur = document.getElementById('blur').value;
  const spread = document.getElementById('spread').value;
  const opacity = document.getElementById('opacity').value;
  const shadowColor = document.getElementById('shadow').value;
  const boxColor = document.getElementById('box').value.toUpperCase();
  const shadowType = elements.shadowTypeToggle.checked ? 'inset' : 'outline';

  const cssCode = generateCSSCode(horizontal, vertical, blur, spread, shadowColor, boxColor, opacity, shadowType);

  elements.codeContent.textContent = cssCode;
  elements.codePreview.style.zIndex = '7';
}

function hideCodePreview(elements) {
  elements.codePreview.style.display = 'none';
}

async function copyCodeToClipboard(elements) {
  const code = elements.codeContent.textContent;
  const buttonTextElement = elements.copyButton.querySelector('.generator__copy-button-text');

  try {
    await navigator.clipboard.writeText(code);
    buttonTextElement.textContent = 'Copied!';
  } catch {
    throw new Error('Failed to copy CSS code');
  }
}
