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
export const playgroundSize: number = Dimensions.get("window").width * 0.9;
export const caseSize: number = playgroundSize / 6;

// Vehicle sizes
export const vehicleScaleY: number = 1.16;
export const vehicleSize: number = caseSize * 1.6;
