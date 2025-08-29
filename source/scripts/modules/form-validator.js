function validateNumberInput(input, min, max, errorElement, fieldName) {
  const value = parseFloat(input.value);
  let isValid = true;
  let errorMessage = '';

  if (input.value.trim() === '') {
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
    input.parentElement.classList.toggle('generator__input-wrapper--error', !isValid);
  }

  return isValid;
}

function validateColorInput(textInput, errorElement, fieldName) {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  let isValid = true;
  let errorMessage = '';

  if (!textInput.value.trim()) {
    isValid = false;
    errorMessage = `${fieldName} is required`;
  } else if (!hexColorRegex.test(textInput.value)) {
    isValid = false;
    errorMessage = `${fieldName} must be a valid hex color (e.g., #FF0000)`;
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
    textInput.parentElement.classList.toggle('.generator__general-color-wrapper--error', !isValid);
  }

  return isValid;
}

function validateOpacityInput(input, errorElement) {
  const value = parseFloat(input.value);
  let isValid = true;
  let errorMessage = '';

  if (input.value.trim() === '') {
    isValid = false;
    errorMessage = 'Opacity is required';
  } else if (isNaN(value)) {
    isValid = false;
    errorMessage = 'Opacity must be a number';
  } else if (value < 0) {
    isValid = false;
    errorMessage = 'Opacity must be at least 0';
  } else if (value > 1) {
    isValid = false;
    errorMessage = 'Opacity must be at most 1';
  }

  if (errorElement) {
    errorElement.textContent = errorMessage;
    input.parentElement.classList.toggle('.generator__input-wrapper--error', !isValid);
  }

  return isValid;
}

export function validateFormField(fieldType, input, errorElement, fieldName, min, max) {
  switch (fieldType) {
    case 'number':
      return validateNumberInput(input, min, max, errorElement, fieldName);
    case 'color':
      return validateColorInput(input, errorElement, fieldName);
    case 'opacity':
      return validateOpacityInput(input, errorElement);
    default:
      return true;
  }
}
