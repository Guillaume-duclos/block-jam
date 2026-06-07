import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { JSX, useEffect, useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { darken } from "../utils/color";

type Props = {
  progression: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  style?: ViewStyle;
};

export default function CircularProgressBar({
  progression,
  color = darken("#D6F5BC"),
  size = 72,
  strokeWidth = 9,
  children,
  style,
}: Props): JSX.Element {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(progression, {
      duration: 1000,
      easing: Easing.bezier(0.59, 0.27, 0.45, 0.94),
    });
  }, [progression]);

  const oval = useMemo(
    () => ({
      x: strokeWidth / 2 + 1,
      y: strokeWidth / 2 + 1,
      width: size - strokeWidth - 2,
      height: size - strokeWidth - 2,
    }),
    [size, strokeWidth],
  );

  const trackPath = useMemo(() => {
    const path = Skia.Path.Make();
    path.addOval(oval);
    return path;
  }, [oval]);

  const progressPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    path.addArc(oval, -90, (progress.value / 100) * 360);
    return path;
  });

  return (
    <View style={[{ width: size, height: size }, style]}>
      <Canvas style={{ width: size, height: size }}>
        <Path
          path={trackPath}
          color={`${color}40`}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
        <Path
          path={progressPath}
          color={color}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
        />
      </Canvas>

      {children && (
        <View
          style={[StyleSheet.absoluteFill, styles.center]}
          pointerEvents="none"
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
