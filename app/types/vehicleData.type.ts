import { Orientation } from "../enums/orientation.enum.js";

type VehicleData = {
  label: string;
  range: number[];
  position: number[];
  orientation: Orientation;
};

export default VehicleData;
