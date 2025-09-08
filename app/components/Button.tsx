import React, { JSX } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Button({
  label,
  disabled,
  onPress,
  style,
}: Props): JSX.Element {
  const progress = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value }],
  }));

  const tapGesture = Gesture.Tap()
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
          <Text>{label}</Text>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    minWidth: 50,
    alignItems: "center",
    borderRadius: 10,
    boxShadow: "0 3px 10px 0 #00000030",
  },
  block: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    backgroundColor: "#F5F7FF",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  blockBottomBorder: {
    width: "100%",
    height: 20,
    bottom: 0,
    position: "absolute",
    backgroundColor: "#D6DBE2",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
