import * as Haptics from "expo-haptics";
import React, {
  Fragment,
  JSX,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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

type BoxRange = {
  start: number;
  end: number;
};

interface Props {
  levels: any;
  activeViewIndex: number;
  orientation?: Orientation;
  updateActiveIndex: (index: number) => void;
}

const DOT_GAP = 10;
const DOT_WIDTH = 12;
const HAPTIC_MIN_MS = 80;

const PaginationIndicator = memo(
  ({
    levels,
    activeViewIndex,
    orientation = Orientation.HORIZONTAL,
    updateActiveIndex,
  }: Props): JSX.Element => {
    const animatedIndex = useSharedValue(activeViewIndex);
    const sharedActiveIndex = useSharedValue<number>(-1);
    const lastHapticAtRef = useRef<number>(0);

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

    const ranges = useMemo((): BoxRange[] => {
      const unit = DOT_WIDTH + DOT_GAP;
      const ranges: BoxRange[] = [];

      for (let i = 0; i < levels.length; i++) {
        const start = i * unit;
        const end = start + DOT_WIDTH;
        ranges.push({ start, end });
      }

      return ranges;
    }, [levels]);

    useEffect(() => {
      animatedIndex.value = withSpring(activeViewIndex, {
        damping: 20,
        stiffness: 120,
        mass: 0.3,
      });
    }, [activeViewIndex]);

    const handleIndexChange = useCallback(
      (index: number) => {
        updateActiveIndex(index);

        const now = Date.now();

        if (now - lastHapticAtRef.current > HAPTIC_MIN_MS) {
          lastHapticAtRef.current = now;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      },
      [updateActiveIndex]
    );

    const pan = Gesture.Pan()
      .onUpdate((event) => {
        let index;

        if (orientation === Orientation.HORIZONTAL) {
          index = ranges.findIndex(
            (range) => event.x >= range.start && event.x <= range.end
          );
        } else {
          index = ranges.findIndex(
            (range) => event.y >= range.start && event.y <= range.end
          );
        }

        if (index !== -1 && sharedActiveIndex.value !== index) {
          sharedActiveIndex.value = index;
          handleIndexChange(index);
        }
      })
      .runOnJS(true);

    return (
      <Fragment>
        {orientation === Orientation.HORIZONTAL ? (
          <GestureDetector gesture={pan}>
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
          </GestureDetector>
        ) : (
          <View style={styles.verticalContainer}>
            <GestureDetector gesture={pan}>
              <View style={styles.verticalSubContainer}>
                {levels.map((_: any, index: number) => {
                  const animatedStyle = useAnimatedStyle(() => {
                    const opacity = interpolate(
                      animatedIndex.value,
                      [index - 1, index, index + 1],
                      [0.4, 1, 0.4],
                      Extrapolation.CLAMP
                    );

                    const scale = interpolate(
                      animatedIndex.value,
                      [index - 1, index, index + 1],
                      [0.8, 1, 0.8],
                      Extrapolation.CLAMP
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
            </GestureDetector>
          </View>
        )}
      </Fragment>
    );
  }
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
