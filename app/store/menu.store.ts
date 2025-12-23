import { create } from "zustand";

type State = {
  isLoaderShown: boolean;
  setIsLoaderShown: (value: boolean) => void;
};

export const useMenuStore = create<State>((set) => ({
  isLoaderShown: false,
  setIsLoaderShown: (value: boolean) => set({ isLoaderShown: value }),
}));
