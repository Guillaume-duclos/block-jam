import { BlurView } from "expo-blur";
import React, { JSX, useEffect } from "react";
import { ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type Props = {
  isShown: boolean;
  style?: ViewStyle;
};

export default function Loader({ isShown, style }: Props): JSX.Element {
  const blur = useSharedValue(0);

  useEffect(() => {
    if (isShown) {
      animateBlur();
    }
  }, [isShown]);

  const animatedBlurProps = useAnimatedProps(() => ({
    intensity: Math.round(blur.value),
  }));

  const animateBlur = (): void => {
    blur.value = withTiming(50, { duration: 200 });
  };

  return (
    <AnimatedBlurView
      tint="systemThinMaterialDark"
      animatedProps={animatedBlurProps}
      pointerEvents={isShown ? "auto" : "none"}
      style={{ ...styles.container, ...style }}
    >
      <ActivityIndicator size="large" color="#FFFFFF" />
    </AnimatedBlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
});
