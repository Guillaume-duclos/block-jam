import React, { ComponentRef, forwardRef } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { darken } from "../utils/color";

type Props = {
  disabled?: boolean;
  onPress: () => void;
  children?: React.ReactNode;
  deep?: number;
  color?: string;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
};

type ViewRef = ComponentRef<typeof View>;

const Button = forwardRef<ViewRef, Props>(
  (
    {
      disabled = false,
      onPress,
      children,
      deep = 12,
      color = "#F5F7FF",
      style,
      contentContainerStyle,
    }: Props,
    ref
  ) => {
    const progress = useSharedValue(0);

    const buttonStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: progress.value }],
    }));

    const tap = Gesture.Tap()
      .enabled(!disabled)
      .maxDuration(Number.MAX_SAFE_INTEGER)
      .onBegin(() => {
        progress.value = withTiming(deep - deep / 1.5, { duration: 80 });
      })
      .onFinalize(() => {
        progress.value = withTiming(0, { duration: 80 });
      })
      .onEnd(() => {
        onPress();
      })
      .runOnJS(true);

    return (
      <GestureDetector gesture={tap}>
        <View
          ref={ref}
          style={[
            styles.container,
            ...(Array.isArray(style) ? style : [style]),
          ]}
        >
          <View
            style={{
              ...styles.blockBottomBorder,
              backgroundColor: darken(color, 0.15),
              bottom: 16 - deep,
              height: "50%",
            }}
          />
          <Animated.View
            style={[
              styles.block,
              contentContainerStyle,
              { backgroundColor: color },
              buttonStyle,
            ]}
          >
            <View style={{ opacity: disabled ? 0.4 : 1 }}>{children}</View>
          </Animated.View>
        </View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    height: 64,
    borderRadius: 32,
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
    left: 0,
    right: 0,
    position: "absolute",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});

export default Button;
