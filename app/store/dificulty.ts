import { create } from "zustand";

type State = {
  colors: any;
  setColors: (value: number) => void;
};

export const useDificultyStore = create<State>((set) => ({
  colors: {},
  setColors: (value) => set({ colors: value }),
}));
