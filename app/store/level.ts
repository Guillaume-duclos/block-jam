import { create } from "zustand";

type State = {
  isResetEnabled: boolean;
  isUndoEnabled: boolean;
  setIsResetEnabled: (value: boolean) => void;
  setIsUndoEnabled: (value: boolean) => void;
};

export const useLevelStore = create<State>((set) => ({
  isResetEnabled: false,
  isUndoEnabled: false,
  setIsResetEnabled: (value) => set({ isResetEnabled: value }),
  setIsUndoEnabled: (value) => set({ isUndoEnabled: value }),
}));
