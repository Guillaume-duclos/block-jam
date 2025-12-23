import { create } from "zustand";
import DificultyColors from "../types/dificultyColors.type";

type State = {
  colors: DificultyColors | undefined;
  setColors: (value: DificultyColors) => void;
};

export const useDificultyStore = create<State>((set) => ({
  colors: undefined,
  setColors: (value: DificultyColors) => set({ colors: value }),
}));
