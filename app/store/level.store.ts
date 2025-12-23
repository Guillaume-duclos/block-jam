import { create } from "zustand";

type State = {
  currentCount: number;
  isUndoEnabled: boolean;
  isResetEnabled: boolean;
  setCurrentCount: (value: number) => void;
  setIsUndoEnabled: (value: boolean) => void;
  setIsResetEnabled: (value: boolean) => void;
  resetLevelData: () => void;
};

export const useLevelStore = create<State>((set) => ({
  currentCount: 0,
  isUndoEnabled: false,
  isResetEnabled: false,
  setCurrentCount: (value) => set({ currentCount: value }),
  setIsUndoEnabled: (value) => set({ isUndoEnabled: value }),
  setIsResetEnabled: (value) => set({ isResetEnabled: value }),
  resetLevelData: () =>
    set({
      currentCount: 0,
      isUndoEnabled: false,
      isResetEnabled: false,
    }),
}));
