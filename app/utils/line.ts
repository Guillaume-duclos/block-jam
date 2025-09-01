import { Orientation } from "../enums/orientation.enum";

// Calcule la position de la première case de la ligne
export const firstLineCaseIndex = (
  position: number[],
  orientation: Orientation
): number => {
  if (orientation === Orientation.HORIZONTAL) {
    return Math.floor(position[0] / 6) * 6;
  }

  return position[0] - Math.floor(position[0] / 6) * 6;
};

// Calcule la position de la dernière case de la ligne
export const lastLineCaseIndex = (
  position: number[],
  orientation: Orientation
): number => {
  if (orientation === Orientation.HORIZONTAL) {
    return firstLineCaseIndex(position, orientation) + 5;
  }

  return firstLineCaseIndex(position, orientation) + 30;
};
