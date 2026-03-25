import React, { JSX, memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { menuFooterHeight, windowHeight } from "../constants/dimension";
import { useTheme } from "../providers/ThemeContext";

interface Props {
  levels: any;
  activeViewIndex: number;
  updateActiveIndex: (index: number) => void;
}

const PaginationIndicator = memo(
  ({ levels, activeViewIndex }: Props): JSX.Element => {
    const animatedIndex = useSharedValue(activeViewIndex);

    const colors = useTheme();

    useEffect(() => {
      animatedIndex.value = withSpring(activeViewIndex, {
        damping: 20,
        stiffness: 120,
        mass: 0.3,
      });
    }, [activeViewIndex]);

    return (
      <View style={styles.container}>
        {levels.map((_: any, index: number) => (
          <View
            key={`dot-${index}`}
            style={{
              ...styles.dot,
              backgroundColor: colors.theme.white,
              opacity: activeViewIndex === index ? 1 : 0.4,
            }}
          />
        ))}
      </View>
    );
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
    right: 8,
    width: 12,
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
  verticalDot: {
    right: 3,
    width: 16,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  verticalDotLabel: {
    top: 6.5,
    width: "100%",
    height: "100%",
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "Rubik",
    textAlign: "center",
    position: "absolute",
  },
});

export default PaginationIndicator;
