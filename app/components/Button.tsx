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

type Props = {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  children?: JSX.Element;
  style?: ViewStyle;
};

export default function Button({
  label,
  disabled,
  onPress,
  children,
  style,
}: Props): JSX.Element {
  const progress = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value }],
  }));

  const tapGesture: TapGesture = Gesture.Tap()
    .maxDuration(Number.MAX_SAFE_INTEGER)
    .onBegin(() => {
      progress.value = withTiming(6, { duration: 80 });
    })
    .onFinalize(() => {
      progress.value = withTiming(0, { duration: 80 });
    })
    .onEnd(() => {
      if (onPress && !disabled) {
        onPress();
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={{ ...styles.container, ...style }}>
        <View style={styles.blockBottomBorder} />
        <Animated.View style={[styles.block, buttonStyle]}>
          {/* <Text>{label}</Text> */}
          {children}
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
    backgroundColor: "#F5F7FF",
    paddingHorizontal: 20,
    borderRadius: 32,
  },
  blockBottomBorder: {
    width: "100%",
    height: 32,
    bottom: 4,
    position: "absolute",
    backgroundColor: "#D6DBE2",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderCurve: "continuous",
  },
});
