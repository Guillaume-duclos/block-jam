import { Dimensions } from "react-native";

// Screen sizes
export const windowWidth = Dimensions.get("window").width;
export const windowHeight = Dimensions.get("window").height;

// Playground margins
export const horizontalMargin: number = (windowWidth - windowWidth * 0.9) / 2;
export const verticalMargin: number = 256.1;

// Grid sizes
export const gridWidth: number = windowWidth * 0.75;
export const gridHeight: number = windowWidth * 0.75;

// Case sizes
export const playgroundSize: number = Dimensions.get("window").width * 0.94;
export const playgroundGridSize: number = playgroundSize - 40;
export const caseSize: number = playgroundGridSize / 6;

// Menu sizes
export const menuHeaderHeight: number = 58;
export const menuFooterHeight: number = 8;
export const menuLevelHeight: number = 96 + 10;
export const menuVerticalPadding: number = 10;
