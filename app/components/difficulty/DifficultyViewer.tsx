import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo, Ref } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { Screen } from "../../enums/screen.enum";
import RootStackParamList from "../../types/rootStackParamList.type";
import { darken } from "../../utils/color";

type Props = {
  ref?: Ref<View> | undefined;
  disabled?: boolean;
  deep?: number;
  color?: string;
  borderColor?: string;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DifficultyViewer = memo(
  ({
    ref,
    disabled = false,
    deep = 12,
    color = "#F5F7FF",
    borderColor,
    style,
    contentContainerStyle,
  }: Props): JSX.Element => {
    const navigation = useNavigation<levelItemNavigationProp>();

    const progress = useSharedValue(0);

    const buttonStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: progress.value }],
    }));

    const redirectToLevel = (): void => {
      navigation.navigate(Screen.LEVELS_MENU);
    };

    const tapGesture = Gesture.Tap()
      .enabled(!disabled)
      .maxDuration(Number.MAX_SAFE_INTEGER)
      .onBegin(() => {
        "worklet";
        progress.value = withTiming(deep - deep / 1.5, { duration: 80 });
      })
      .onTouchesCancelled(() => {
        "worklet";
        progress.value = withTiming(0, { duration: 80 });
      })
      .onFinalize(() => {
        "worklet";
        progress.value = withTiming(0, { duration: 80 });
      })
      .onTouchesUp(() => {
        "worklet";
        progress.value = withTiming(0, { duration: 80 });
      })
      .onEnd(() => {
        "worklet";
        runOnJS(redirectToLevel)();
      });

    return (
      <GestureDetector gesture={tapGesture}>
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
              backgroundColor: darken(color, 0.4),
              height: "50%",
            }}
          />
          <Animated.View
            style={[
              styles.block,
              contentContainerStyle,
              {
                backgroundColor: darken(color, 0.2),
              },
              buttonStyle,
            ]}
          ></Animated.View>
        </View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
  },
  block: {
    minHeight: 100,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  blockBottomBorder: {
    left: 0,
    right: 0,
    bottom: -8,
    position: "absolute",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
});

export default DifficultyViewer;
