import React, { JSX, useEffect } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
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

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  return (
    <Pressable
      onPress={onChange}
      disabled={!onChange || disabled}
      style={{ ...styles.container, ...style }}
    >
      <Animated.View style={[styles.switch, thumbStyle]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 58,
    height: 32,
    borderWidth: 2,
    justifyContent: "center",
  },
  switch: {
    left: 1,
    width: 26,
    height: 26,
    backgroundColor: "#000000",
  },
});
