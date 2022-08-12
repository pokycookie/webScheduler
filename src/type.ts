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
