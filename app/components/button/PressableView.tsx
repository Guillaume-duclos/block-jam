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
import { runOnJS } from "react-native-worklets";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  children?: JSX.Element;
  minimumScale?: number;
  style?: ViewStyle;
};

export default function PressableView({
  disabled,
  onPress,
  children,
  minimumScale = 0.92,
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
      "worklet";
      progress.value = withTiming(minimumScale, { duration: 100 });
    })
    .onFinalize(() => {
      "worklet";
      progress.value = withTiming(1, { duration: 100 });
    })
    .onTouchesUp(() => {
      "worklet";
      progress.value = withTiming(1, { duration: 100 });
    })
    .onEnd(() => {
      "worklet";
      runOnJS(onPress)();
    });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[style, buttonStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
