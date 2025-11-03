import React, { JSX, memo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  menuFooterHeight,
  windowHeight,
  windowWidth,
} from "../constants/dimension";
import { Orientation } from "../enums/orientation.enum";

interface Props {
  levels: any;
  activeViewIndex: number;
  orientation?: Orientation;
}

const PaginationIndicator = memo(
  ({
    levels,
    activeViewIndex,
    orientation = Orientation.HORIZONTAL,
  }: Props): JSX.Element => {
    const pan = Gesture.Pan();

    return (
      <GestureDetector gesture={pan}>
        <View
          style={{
            ...styles.container,
            ...(orientation === Orientation.VERTICAL &&
              styles.verticalContainer),
          }}
        >
          {levels.map((_: any, index: number) => (
            <View
              key={`dot-${index}`}
              style={{
                ...styles.dot,
                opacity: activeViewIndex === index ? 1 : 0.4,
              }}
            />
          ))}
        </View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 10,
    width: windowWidth,
    height: menuFooterHeight,
    flexDirection: "row",
    justifyContent: "center",
  },
  verticalContainer: {
    width: 8,
    right: 10,
    height: windowHeight,
    flexDirection: "column",
    position: "absolute",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
});

export default PaginationIndicator;
