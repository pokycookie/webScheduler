import { IColor } from "./type";

export function getHSL(hue: number, saturation?: number, lightness?: number) {
  return `hsl(${hue}, ${saturation || 100}%, ${lightness || 65}%)`;
}

export function getColorObj(hue: number, saturation: number, lightness: number): IColor {
  const darkest = getHSL(hue, noZeroPoint(saturation - 30), noZeroPoint(lightness - 15));
  const darker = getHSL(hue, noZeroPoint(saturation - 20), noZeroPoint(lightness - 10));
  const dark = getHSL(hue, noZeroPoint(saturation - 10), noZeroPoint(lightness - 5));
  const normal = getHSL(hue, noZeroPoint(saturation), noZeroPoint(lightness));
  const light = getHSL(hue, noZeroPoint(saturation), noZeroPoint(lightness + 5));
  const lighter = getHSL(hue, noZeroPoint(saturation), noZeroPoint(lightness + 10));
  const lightest = getHSL(hue, noZeroPoint(saturation), noZeroPoint(lightness + 15));

  return { darkest, darker, dark, normal, light, lighter, lightest };
}

function noZeroPoint(value: number) {
  if (value > 0) return value;
  else return 1;
}
