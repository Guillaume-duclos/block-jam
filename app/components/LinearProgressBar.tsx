import React, { JSX, useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { darken } from "../utils/color";

type Props = {
  progression: number;
  style?: ViewStyle;
};

export default function LinearProgressBar({
  progression,
  style,
}: Props): JSX.Element {
  const width = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  useEffect(() => {
    width.value = withTiming(progression, {
      duration: 1000,
      easing: Easing.bezier(0.59, 0.27, 0.45, 0.94),
    });
  }, [progression]);

  return (
    <View style={{ ...styles.container, ...style }}>
      <Animated.View style={[styles.progress, animatedStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 14,
    borderRadius: 7,
    backgroundColor: darken("#F5F7FF", 0.1),
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 7,
    backgroundColor: darken("#D6F5BC"),
  },
});
