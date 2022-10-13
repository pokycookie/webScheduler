import { IColor } from "./type";

export function getHSL(hue: number, saturation?: number, lightness?: number) {
  return `hsl(${hue}, ${saturation || 100}%, ${lightness || 65}%)`;
}

export function getColorObj(hue: number, saturation: number, lightness: number): IColor {
  const darkest = getHSL(hue, saturation - 30, lightness - 15);
  const darker = getHSL(hue, saturation - 20, lightness - 10);
  const dark = getHSL(hue, saturation - 10, lightness - 5);
  const normal = getHSL(hue, saturation, lightness);
  const light = getHSL(hue, saturation, lightness + 5);
  const lighter = getHSL(hue, saturation, lightness + 10);
  const lightest = getHSL(hue, saturation, lightness + 15);

  return { darkest, darker, dark, normal, light, lighter, lightest };
}
