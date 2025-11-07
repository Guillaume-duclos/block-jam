import * as Haptics from "expo-haptics";
import React, {
  Fragment,
  JSX,
  memo,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import { menuFooterHeight, windowHeight } from "../constants/dimension";
import { Orientation } from "../enums/orientation.enum";

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
    const sharedActiveIndex = useSharedValue<number>(-1);
    const lastHapticAtRef = useRef<number>(0);

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
          runOnJS(handleIndexChange)(index);
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
    gap: 10,
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
