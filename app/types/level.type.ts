import { ColorValue } from "react-native";

export type MainLevel = {
  index: number;
  color: ColorValue;
  shadowColor: ColorValue;
  levels: [Level[]];
};

export type Level = {
  index: number;
  layout: string;
  minimumMove: number;
};

export type LevelSavedData = {
  done: boolean | undefined;
  scrore: number;
  finishedTime: number;
  moves: number;
};
