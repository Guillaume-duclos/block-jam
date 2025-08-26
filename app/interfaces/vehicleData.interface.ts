import { Orientation } from '../enums/orientation.enum.ts';

export default interface VehicleData {
  label: string;
  range: number[];
  position: number[];
  orientation: Orientation;
}
