import React, { Fragment, JSX, memo, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Dumbbell1 from "../assets/icons/Dumbbell1";
import Dumbbell2 from "../assets/icons/Dumbbell2";
import Dumbbell3 from "../assets/icons/Dumbbell3";
import Dumbbell4 from "../assets/icons/Dumbbell4";
import Dumbbell5 from "../assets/icons/Dumbbell5";
import Dumbbell6 from "../assets/icons/Dumbbell6";
import { menuFooterHeight, windowHeight } from "../constants/dimension";
import { Orientation } from "../enums/orientation.enum";
import { useTheme } from "../providers/themeContext";

interface Props {
  levels: any;
  activeViewIndex: number;
  orientation?: Orientation;
  updateActiveIndex: (index: number) => void;
}

const PaginationIndicator = memo(
  ({
    levels,
    activeViewIndex,
    orientation = Orientation.HORIZONTAL,
  }: Props): JSX.Element => {
    const animatedIndex = useSharedValue(activeViewIndex);

    const difficultyIcons = useMemo(() => {
      return [
        <Dumbbell1 style={{ width: 18, height: 24 }} />,
        <Dumbbell2 style={{ width: 18, height: 24 }} />,
        <Dumbbell3 style={{ width: 18, height: 24 }} />,
        <Dumbbell4 style={{ width: 18, height: 24 }} />,
        <Dumbbell5 style={{ width: 18, height: 24 }} />,
        <Dumbbell6 style={{ width: 18, height: 24 }} />,
      ];
    }, []);

    const colors = useTheme();

    useEffect(() => {
      animatedIndex.value = withSpring(activeViewIndex, {
        damping: 20,
        stiffness: 120,
        mass: 0.3,
      });
    }, [activeViewIndex]);

    return (
      <Fragment>
        {orientation === Orientation.HORIZONTAL ? (
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
        ) : (
          <View style={styles.verticalContainer}>
            <View style={styles.verticalSubContainer}>
              {levels.map((_: any, index: number) => {
                const animatedStyle = useAnimatedStyle(() => {
                  const opacity = interpolate(
                    animatedIndex.value,
                    [index - 1, index, index + 1],
                    [0.4, 1, 0.4],
                    Extrapolation.CLAMP,
                  );

                  const scale = interpolate(
                    animatedIndex.value,
                    [index - 1, index, index + 1],
                    [0.8, 1, 0.8],
                    Extrapolation.CLAMP,
                  );

                  return { opacity, transform: [{ scale }] };
                });

                return (
                  <Animated.View
                    key={`dot-${index}`}
                    style={[styles.dot, styles.verticalDot, animatedStyle]}
                  >
                    {difficultyIcons[index]}
                  </Animated.View>
                );
              })}
            </View>
          </View>
        )}
      </Fragment>
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
