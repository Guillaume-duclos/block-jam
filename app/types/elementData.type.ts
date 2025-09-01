import { Orientation } from "../enums/orientation.enum.js";

type ElementData = {
  label: string;
  range?: number[];
  position: number[];
  orientation?: Orientation;
};

export default ElementData;
