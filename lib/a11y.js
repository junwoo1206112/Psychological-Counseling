export function normalizeHex(hex) {
  if (typeof hex !== 'string') throw new TypeError('hex color must be a string');
  const value = hex.replace('#', '').trim();
  if (![3, 6].includes(value.length)) throw new Error(`unsupported hex color: ${hex}`);
  return value.length === 3
    ? value
        .split('')
        .map((char) => char + char)
        .join('')
    : value;
}

export function hexToRgb(hex) {
  const value = normalizeHex(hex);
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

export function srgbToLinear(channel) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

export function contrastRatio(foreground, background) {
  const first = relativeLuminance(foreground);
  const second = relativeLuminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3;
export const WCAG_AAA_NORMAL = 7;

export function meetsAA(foreground, background, { large = false } = {}) {
  return contrastRatio(foreground, background) >= (large ? WCAG_AA_LARGE : WCAG_AA_NORMAL);
}

export function roundContrast(value) {
  return Math.round(value * 100) / 100;
}
