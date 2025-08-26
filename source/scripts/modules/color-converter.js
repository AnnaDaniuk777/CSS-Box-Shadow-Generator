export function hexToRgba (hex, opacity) {
  const cleanHex = hex.replace(/^#/, '');

  if (opacity < 0 || opacity > 1) {
    throw new Error('Opacity range is from 0 to 1');
  }

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
