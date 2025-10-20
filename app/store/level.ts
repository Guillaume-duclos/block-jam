import { create } from "zustand";

type State = {
  currentCount: number;
  isUndoEnabled: boolean;
  setCurrentCount: (value: number) => void;
  setIsUndoEnabled: (value: boolean) => void;
};

export const useLevelStore = create<State>((set) => ({
  currentCount: 0,
  isUndoEnabled: false,
  setCurrentCount: (value) => set({ currentCount: value }),
  setIsUndoEnabled: (value) => set({ isUndoEnabled: value }),
}));
