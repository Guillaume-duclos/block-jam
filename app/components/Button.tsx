import React, { JSX } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
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
import { darken } from "../utils/color";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  children?: JSX.Element;
  color?: string;
  style?: ViewStyle;
};

export default function Button({
  disabled,
  onPress,
  children,
  color = "#F5F7FF",
  style,
}: Props): JSX.Element {
  const progress = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value }],
  }));

  const tapGesture: TapGesture = Gesture.Tap()
    .enabled(!disabled)
    .maxDuration(Number.MAX_SAFE_INTEGER)
    .onBegin(() => {
      progress.value = withTiming(6, { duration: 80 });
    })
    .onFinalize(() => {
      progress.value = withTiming(0, { duration: 80 });
    })
    .onEnd(() => {
      onPress();
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={{ ...styles.container, ...style }}>
        <View
          style={{
            ...styles.blockBottomBorder,
            backgroundColor: darken(color, 0.15),
          }}
        />
        <Animated.View
          style={[styles.block, { backgroundColor: color }, buttonStyle]}
        >
          <View style={{ opacity: disabled ? 0.4 : 1 }}>{children}</View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderRadius: 32,
    borderCurve: "continuous",
    // boxShadow: "0 3px 10px 0 #00000030",
  },
  block: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 32,
  },
  blockBottomBorder: {
    width: "100%",
    height: 32,
    bottom: 4,
    position: "absolute",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderCurve: "continuous",
  },
});
