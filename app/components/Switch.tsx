import * as Haptics from "expo-haptics";
import React, { JSX, useEffect } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  selected: boolean;
  disabled?: boolean;
  onChange?: () => void;
  style?: ViewStyle;
};

export default function Switch({
  selected,
  disabled,
  onChange,
  style,
}: Props): JSX.Element {
  const progress = useSharedValue(selected ? 26 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 26 : 0, { duration: 180 });
  }, [selected, progress]);

  useEffect(() => {
    Haptics.selectionAsync();
  }, [selected]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 26],
      ["#B1BDD1", "#4CAF50"]
    ),
  }));

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onUpdate((event): void => {
      if (onChange) {
        if (
          (event.translationX > 4 && !selected) ||
          (event.translationX < -4 && selected)
        ) {
          onChange();
        }
      }
    })
    .runOnJS(true);

  return (
    <Pressable onPress={onChange} disabled={!onChange || disabled}>
      <Animated.View style={[styles.container, style, containerStyle]}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.switch, thumbStyle]} />
        </GestureDetector>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 58,
    height: 32,
    borderWidth: 3,
    borderColor: "#F5F7FF",
    justifyContent: "center",
    borderRadius: 4,
  },
  switch: {
    top: -2,
    left: 1,
    width: 24,
    height: 24 - 4,
    backgroundColor: "#F5F7FF",
    boxShadow: "0 4px 0px 0 #D6DBE2",
    borderRadius: 2,
  },
});
