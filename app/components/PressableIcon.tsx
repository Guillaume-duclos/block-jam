import React, { JSX } from "react";
import { ViewStyle } from "react-native";
import {
  Gesture,
  GestureDetector,
  TapGesture,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  children?: JSX.Element;
  style?: ViewStyle;
};

export default function PressableIcon({
  disabled,
  onPress,
  children,
  style,
}: Props): JSX.Element {
  const progress = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
  }));

  const tapGesture: TapGesture = Gesture.Tap()
    .enabled(!disabled)
    .maxDuration(Number.MAX_SAFE_INTEGER)
    .onBegin(() => {
      progress.value = withTiming(0.92, { duration: 100 });
    })
    .onFinalize(() => {
      progress.value = withTiming(1, { duration: 100 });
    })
    .onEnd(() => {
      onPress();
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[style, buttonStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
