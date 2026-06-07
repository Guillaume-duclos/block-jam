import React, { JSX, useEffect } from "react";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { darken } from "../utils/color";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

type Props = {
  progression: number;
  style?: ViewStyle;
};

export default function LinearProgressBar({
  progression,
  style,
}: Props): JSX.Element {
  const width = useSharedValue(0);
  const containerWidth = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  const whiteClipStyle = useAnimatedStyle(() => ({
    width: (width.value / 100) * containerWidth.value,
  }));

  const whiteTextStyle = useAnimatedStyle(() => ({
    width: containerWidth.value,
  }));

  const animatedTextProps = useAnimatedProps(() => ({
    text: `${Math.round(width.value)}%`,
    defaultValue: `${progression}%`,
  }));

  useEffect(() => {
    width.value = withTiming(progression, {
      duration: 1000,
      easing: Easing.bezier(0.59, 0.27, 0.45, 0.94),
    });
  }, [progression]);

  return (
    <View
      style={{ ...styles.container, ...style }}
      onLayout={(e) => {
        containerWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <Animated.View style={[styles.progress, animatedStyles]} />

      {/* Texte vert — visible hors de la barre */}
      <AnimatedTextInput
        editable={false}
        caretHidden
        animatedProps={animatedTextProps}
        style={[styles.progressValue, styles.greenProgressValue]}
      />

      {/* Texte blanc — clipé à la largeur de la barre */}
      <Animated.View style={[styles.whiteClip, whiteClipStyle]}>
        <AnimatedTextInput
          editable={false}
          caretHidden
          animatedProps={animatedTextProps}
          style={[
            styles.progressValue,
            styles.whiteProgressValue,
            whiteTextStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 28,
    borderRadius: 16,
    backgroundColor: darken("#F5F7FF", 0.1),
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 16,
    backgroundColor: darken("#D6F5BC"),
  },
  progressValue: {
    position: "absolute",
    width: "100%",
    height: 28,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Rubik",
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  greenProgressValue: {
    color: darken("#D6F5BC"),
  },
  whiteClip: {
    position: "absolute",
    height: "100%",
    overflow: "hidden",
    left: 0,
    top: 0,
  },
  whiteProgressValue: {
    color: "white",
  },
});
