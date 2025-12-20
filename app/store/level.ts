import { create } from "zustand";

type State = {
  currentCount: number;
  isResetEnabled: boolean;
  isUndoEnabled: boolean;
  setCurrentCount: (value: number) => void;
  setIsResetEnabled: (value: boolean) => void;
  setIsUndoEnabled: (value: boolean) => void;
};

export const useLevelStore = create<State>((set) => ({
  currentCount: 0,
  isResetEnabled: false,
  isUndoEnabled: false,
  setCurrentCount: (value) => set({ currentCount: value }),
  setIsResetEnabled: (value) => set({ isResetEnabled: value }),
  setIsUndoEnabled: (value) => set({ isUndoEnabled: value }),
}));
