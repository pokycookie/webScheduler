export interface IData {
  _id?: number;
  checked: boolean;
  content: string;
  updated: Date;
  start?: Date;
  end?: Date;
}

export interface IUpdateOptions {
  checked?: boolean;
  content?: string;
  updated?: Date;
  start?: Date;
  end?: Date;
}

export interface IColor {
  darkest: string;
  darker: string;
  dark: string;
  normal: string;
  light: string;
  lighter: string;
  lightest: string;
}

export interface IHSL {
  hue: number;
  saturation: number;
  lightness: number;
}
