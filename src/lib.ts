import { IColor } from "./type";

export function getHSL(hue: number, saturation?: number, lightness?: number) {
  return `hsl(${hue}, ${saturation || 100}%, ${lightness || 65}%)`;
}

export function getColorObj(hue: number): IColor {
  const darkest = getHSL(hue, 70, 50);
  const darker = getHSL(hue, 80, 55);
  const dark = getHSL(hue, 90, 60);
  const normal = getHSL(hue);
  const light = getHSL(hue, 100, 70);
  const lighter = getHSL(hue, 100, 75);
  const lightest = getHSL(hue, 100, 80);

  return { darkest, darker, dark, normal, light, lighter, lightest };
}
