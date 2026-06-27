import * as Haptics from "expo-haptics";
import { JSX, useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Grab from "../../assets/icons/Grab";
import { darken } from "../../utils/color";

const HAPTIC_STYLES = [
  Haptics.ImpactFeedbackStyle.Light,
  Haptics.ImpactFeedbackStyle.Medium,
  Haptics.ImpactFeedbackStyle.Heavy,
];

type Props = {
  value: number;
  steps: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  style?: ViewStyle;
};

const THUMB_WIDTH = 40;
const THUMB_HEIGHT = 18;
const PADDING = 2;
const BORDER_WIDTH = 3;
const DOT_WIDTH = 4;
const DOT_HEIGHT = 10;

export default function Slider({
  value,
  steps,
  disabled,
  onChange,
  style,
}: Props): JSX.Element {
  const [displayStep, setDisplayStep] = useState(value);
  const [thumbX, setThumbX] = useState(0);
  const [fillWidth, setFillWidth] = useState(0);

  const containerWidth = useRef(0);
  const currentPosition = useRef(0);
  const startPosition = useRef(0);
  const lastStep = useRef(value);
  const lastHapticTime = useRef(0);

  const getTravel = (): number =>
    containerWidth.current - 2 * BORDER_WIDTH - THUMB_WIDTH - 2 * PADDING;

  const getStepWidth = (): number =>
    steps > 1 ? getTravel() / (steps - 1) : 0;

  const applyStep = (step: number): void => {
    const pos = step * getStepWidth();
    currentPosition.current = pos;
    setThumbX(pos);
    setFillWidth(pos + THUMB_WIDTH / 2);
  };

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent): void => {
    containerWidth.current = nativeEvent.layout.width;
    applyStep(value);
  };

  useEffect(() => {
    applyStep(value);
    setDisplayStep(value);
  }, [value, steps]);

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onBegin(() => {
      startPosition.current = currentPosition.current;
      const sw = getStepWidth();
      lastStep.current = sw > 0 ? Math.round(currentPosition.current / sw) : 0;
    })
    .onUpdate((event) => {
      const travel = getTravel();
      const sw = getStepWidth();
      const clampedX = Math.max(
        0,
        Math.min(travel, startPosition.current + event.translationX),
      );
      const step = sw > 0 ? Math.round(clampedX / sw) : 0;

      applyStep(step);

      if (step !== lastStep.current) {
        lastStep.current = step;

        setDisplayStep(step);

        const now = Date.now();

        if (now - lastHapticTime.current >= 100) {
          lastHapticTime.current = now;

          Haptics.impactAsync(
            HAPTIC_STYLES[step] ?? Haptics.ImpactFeedbackStyle.Medium,
          );
        }
      }
    })
    .onEnd((event) => {
      const travel = getTravel();
      const sw = getStepWidth();
      const clampedX = Math.max(
        0,
        Math.min(travel, startPosition.current + event.translationX),
      );
      const step = sw > 0 ? Math.round(clampedX / sw) : 0;

      applyStep(step);
      onChange(step);
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={panGesture}>
      <View style={[styles.wrapper, style]}>
        <View style={styles.container} onLayout={handleLayout}>
          <View style={[styles.fill, { width: fillWidth }]} />
          <View style={styles.dotsRow}>
            {Array.from({ length: steps }, (_, index) => (
              <View
                key={index}
                style={[styles.dot, index < displayStep && styles.dotActive]}
              />
            ))}
          </View>
          <View style={[styles.thumb, { transform: [{ translateX: thumbX }] }]}>
            <Grab color="#D6DBE2" style={styles.thumbGrab} />
          </View>
        </View>
      </View>
    </GestureDetector>
  );
}

const DOT_PADDING = PADDING + THUMB_WIDTH / 2 - DOT_WIDTH / 2;

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 150,
  },
  container: {
    height: 32,
    borderWidth: BORDER_WIDTH,
    borderColor: darken("#F5F7FF", 0.1),
    justifyContent: "center",
    borderCurve: "continuous",
    borderRadius: 10,
    backgroundColor: "#B1BDD1",
  },
  fill: {
    position: "absolute",
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: 6,
    backgroundColor: "#70B843",
  },
  dotsRow: {
    inset: 0,
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: DOT_PADDING,
  },
  dot: {
    width: DOT_WIDTH,
    height: DOT_HEIGHT,
    borderRadius: 1.5,
    backgroundColor: darken("#B1BDD1", 0.1),
  },
  dotActive: {
    backgroundColor: darken("#70B843", 0.2),
  },
  thumb: {
    top: -2,
    left: PADDING,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    backgroundColor: "#F5F7FF",
    boxShadow: "0 4px 0px 0 #D6DBE2",
    borderCurve: "continuous",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbGrab: {
    width: 14,
  },
});
