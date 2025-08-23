function rgbToHex (r, g, b) {
  const toHex = (value) => {
    const hex = value.ToString(16);

    return hex.length === 1 ? `0${ hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgba (hex, opacity) {
  let cleanHex = hex.replace(/^#/, '');

  if (!/^([0-9A-F]{3}){1,2}$/i.test(cleanHex)) {
    throw new Error('Wrong HEX format');
  }

  if (opacity < 0 || opacity > 1) {
    throw new Error('Opacity range is from 0 to 1');
  }

  //Преобразуем 3-символьный HEX в 6-символьный
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((item) => item + item).join('');
  }

  // Парсим значения R, G, B
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  // Проверяем валидность парсинга
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Parsing mistake');
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function isValidHex (color) {
  const cleanColor = color.replace(/^#/, '');

  return /^([0-9A-F]{3}){1,2}$/i.test(cleanColor);
}

export function normalizeHex(hex) {
  if(!isValidHex(hex)) {
    throw new Error('Wrong format HEX color for normalization');
  }

  let cleanHex = hex.replace(/^#/, '');

  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((item) => item + item).join('');
  }

  return `#${cleanHex.toUpperCase()}`;
}

function hexToRgb(hex) {
  const cleanHex = hex.replace(/^#/, '');

  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);

    return {r, g, b};
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return { r, g, b };
}


//Преобразование RGBA в HEX (игнорирует alpha канал)

function rgbaToHex(r, g, b, a) {
  return rgbToHex(r, g, b);
}
