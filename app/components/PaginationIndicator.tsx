import React, { JSX, memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { menuFooterHeight, windowHeight } from "../constants/dimension";
import { useTheme } from "../providers/ThemeContext";

interface Props {
  levels: any;
  activeViewIndex: number;
  vertical?: boolean;
}

const PaginationIndicator = memo(
  ({ levels, activeViewIndex, vertical = false }: Props): JSX.Element => {
    const animatedIndex = useSharedValue(activeViewIndex);

    const colors = useTheme();

    useEffect(() => {
      animatedIndex.value = withSpring(activeViewIndex, {
        damping: 20,
        stiffness: 120,
        mass: 0.3,
      });
    }, [activeViewIndex]);

    const dots = levels.map((_: any, index: number) => (
      <View
        key={`dot-${index}`}
        style={{
          ...styles.dot,
          backgroundColor: colors.theme.white,
          opacity: activeViewIndex === index ? 1 : 0.4,
        }}
      />
    ));

    if (vertical) {
      return <View style={styles.verticalContainer}>{dots}</View>;
    }

    return <View style={styles.container}>{dots}</View>;
  },
);

const styles = StyleSheet.create({
  container: {
    gap: 10,
    height: menuFooterHeight,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  verticalContainer: {
    gap: 16,
    right: 8,
    height: windowHeight,
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
  },
  verticalSubContainer: {
    gap: 28,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
});

export default PaginationIndicator;
