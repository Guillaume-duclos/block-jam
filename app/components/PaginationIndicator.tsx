import * as Haptics from "expo-haptics";
import React, { JSX, memo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { windowHeight } from "../constants/dimension";
import { useTheme } from "../providers/ThemeContext";
import { darken } from "../utils/color";

const DOT_SIZE = 12;
const GAP_VERTICAL = 16;
const GAP_HORIZONTAL = 10;

interface Props {
  levels: any[];
  activeViewIndex: number;
  pressColor: string;
  updateActiveIndex?: (index: number) => void;
  vertical?: boolean;
}

const PaginationIndicator = memo(
  ({
    levels,
    activeViewIndex,
    updateActiveIndex,
    vertical = false,
    pressColor,
  }: Props): JSX.Element => {
    const colors = useTheme();
    const lastHapticIndex = useRef(activeViewIndex);
    const pressProgress = useSharedValue(0);

    const backgroundColor = darken(pressColor, 0.4);

    const overlayStyle = useAnimatedStyle(() => ({
      opacity: pressProgress.value,
    }));

    const startPressAnimation = () => {
      pressProgress.value = withTiming(1, { duration: 250 });
    };

    const endPressAnimation = () => {
      pressProgress.value = withTiming(0, { duration: 250 });
    };

    const navigate = (index: number) => {
      const clamped = Math.max(0, Math.min(levels.length - 1, index));

      if (clamped !== lastHapticIndex.current) {
        lastHapticIndex.current = clamped;
        Haptics.selectionAsync();
      }

      updateActiveIndex?.(clamped);
    };

    const dotStep = vertical
      ? DOT_SIZE + GAP_VERTICAL
      : DOT_SIZE + GAP_HORIZONTAL;

    // Runs on JS thread — safe to access levels.length and other JS objects.
    // e.y/e.x (relative to the container) are passed from the UI thread.
    const navigateFromPos = (relPos: number) => {
      let index: number;

      if (vertical) {
        const totalDotsHeight =
          levels.length * DOT_SIZE + (levels.length - 1) * GAP_VERTICAL;
        const firstDotTop = (windowHeight - totalDotsHeight) / 2;

        index = Math.round((relPos - firstDotTop) / dotStep);
      } else {
        index = Math.round(relPos / dotStep);
      }

      navigate(index);
    };

    const panGesture = Gesture.Pan()
      .minDistance(0)
      .onBegin(() => {
        runOnJS(startPressAnimation)();
      })
      .onStart((event) => {
        runOnJS(navigateFromPos)(vertical ? event.y : event.x);
      })
      .onUpdate((event) => {
        runOnJS(navigateFromPos)(vertical ? event.y : event.x);
      })
      .onFinalize(() => {
        runOnJS(endPressAnimation)();
      });

    const tapGesture = Gesture.Tap()
      .maxDuration(30000)
      .onEnd(() => {
        runOnJS(endPressAnimation)();
      });

    const gesture = Gesture.Simultaneous(panGesture, tapGesture);

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

    const overlay = (
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor, borderRadius: 8 },
          overlayStyle,
        ]}
      />
    );

    if (vertical) {
      return (
        <GestureDetector gesture={gesture}>
          <View style={styles.verticalContainer}>
            {overlay}
            {dots}
          </View>
        </GestureDetector>
      );
    }

    return (
      <GestureDetector gesture={gesture}>
        <View style={styles.container}>
          {overlay}
          <View style={styles.dotsContainer}>{dots}</View>
        </View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    borderCurve: "continuous",
    borderRadius: 8,
  },
  dotsContainer: {
    gap: GAP_HORIZONTAL,
    padding: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  verticalContainer: {
    gap: GAP_VERTICAL,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 8,
    height: windowHeight,
    flexDirection: "column",
    justifyContent: "center",
    position: "absolute",
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: 3,
  },
});

export default PaginationIndicator;
