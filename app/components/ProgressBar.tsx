import React, { JSX } from "react";
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

export default function ProgressBar({
  progression,
  style,
}: Props): JSX.Element {
  const width = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  width.value = withTiming(progression, {
    duration: 1000,
    easing: Easing.bezier(0.59, 0.27, 0.45, 0.94),
  });

  return (
    <View style={{ ...styles.container, ...style }}>
      <Animated.View style={[styles.progress, animatedStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CECECE",
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: darken("#D6F5BC"),
  },
});
