import { hexToRgba } from './color-converter.js';

export function generateCSSCode (horizontal, vertical, blur, spread, shadowColor, boxColor, opacity, shadowType) {
  const shadowColorWithOpacity = hexToRgba(shadowColor, opacity / 100);

  const shadowValue = `${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColorWithOpacity}
  ${shadowType === 'inset' ? 'inset' : 'outline'}`;

  const cssCode = `.element {
    background: ${boxColor};
    box-shadow: ${shadowValue};
  }`;

  return cssCode;
}
