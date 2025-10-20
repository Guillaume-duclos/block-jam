import React, { JSX, memo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { windowHeight, windowWidth } from "../constants/dimension";
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
    const insets = useSafeAreaInsets();

    return (
      <View
        style={{
          ...styles.container,
          ...(orientation === Orientation.VERTICAL && styles.verticalContainer),
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
    );
  }
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: windowWidth,
    height: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  verticalContainer: {
    width: 8,
    right: 5,
    height: windowHeight,
    flexDirection: "column",
    position: "absolute",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
});

export default PaginationIndicator;
