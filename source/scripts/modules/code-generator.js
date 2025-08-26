import { hexToRgba } from './color-converter.js';

export function generateCSSCode (horizontal, vertical, blur, spread, shadowColor, boxColor, opacity, shadowType) {
  const shadowColorWithOpacity = hexToRgba(shadowColor, opacity);

  const shadowValue = `${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColorWithOpacity}
  ${shadowType === 'inset' ? 'inset' : ''}`;

  const cssCode = `.box {
    background: ${boxColor};
    box-shadow: ${shadowValue};
  }`;

  return cssCode;
}
