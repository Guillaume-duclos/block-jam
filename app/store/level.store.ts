import { create } from "zustand";
import Score from "../types/score.type";

type State = {
  count: number;
  isUndoEnabled: boolean;
  isResetEnabled: boolean;
  scores: Score[];
  getScore: (difficulty: number, level: number) => Score | undefined;
  setCount: (value: number) => void;
  incrementCount: () => void;
  setIsUndoEnabled: (value: boolean) => void;
  setIsResetEnabled: (value: boolean) => void;
  setScores: (value: Score[]) => void;
  resetScores: () => void;
  refresh: () => void;
  resetLevelData: () => void;
};

export const useLevelStore = create<State>((set, get) => ({
  count: 0,

  isUndoEnabled: false,

  isResetEnabled: false,

  scores: [],

  getScore: (difficulty: number, level: number) => {
    return get().scores.find(
      (score) => score.difficulty === difficulty && score.level === level
    );
  },

  setCount: (value) => set({ count: value }),

  incrementCount: () => set((state) => ({ count: state.count + 1 })),

  setIsUndoEnabled: (value) => set({ isUndoEnabled: value }),

  setIsResetEnabled: (value) => set({ isResetEnabled: value }),

  setScores: (value) => set({ scores: value }),

  resetScores: () => set({ scores: [] }),

  refresh: () => set((state) => ({ scores: [...state.scores] })),

  resetLevelData: () =>
    set({
      count: 0,
      isUndoEnabled: false,
      isResetEnabled: false,
    }),
}));
