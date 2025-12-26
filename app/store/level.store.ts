import { create } from "zustand";

type State = {
  count: number;
  isUndoEnabled: boolean;
  isResetEnabled: boolean;
  setCount: (value: number) => void;
  incrementCount: () => void;
  setIsUndoEnabled: (value: boolean) => void;
  setIsResetEnabled: (value: boolean) => void;
  resetLevelData: () => void;
};

export const useLevelStore = create<State>((set) => ({
  count: 0,
  isUndoEnabled: false,
  isResetEnabled: false,
  setCount: (value) => set({ count: value }),
  incrementCount: () => set((state) => ({ count: state.count + 1 })),
  setIsUndoEnabled: (value) => set({ isUndoEnabled: value }),
  setIsResetEnabled: (value) => set({ isResetEnabled: value }),
  resetLevelData: () =>
    set({
      count: 0,
      isUndoEnabled: false,
      isResetEnabled: false,
    }),
}));
