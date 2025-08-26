import { Orientation } from '../enums/orientation.enum.ts';

export default interface ElementData {
  label: string;
  range?: number[];
  position: number[];
  orientation?: Orientation;
}
