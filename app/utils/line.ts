import { Orientation } from '../enums/orientation.enum.ts';
import { gridCount } from '../config/config.ts';

// Calcule la position de la première case de la ligne
export const firstLineCaseIndex = (
  position: number[],
  orientation: Orientation,
): number => {
  if (orientation === Orientation.HORIZONTAL) {
    return Math.floor(position[0] / gridCount) * gridCount;
  }

  return position[0] - Math.floor(position[0] / gridCount) * gridCount;
};

// Calcule la position de la dernière case de la ligne
export const lastLineCaseIndex = (
  position: number[],
  orientation: Orientation,
): number => {
  if (orientation === Orientation.HORIZONTAL) {
    return firstLineCaseIndex(position, orientation) + 5;
  }

  return firstLineCaseIndex(position, orientation) + 30;
};
