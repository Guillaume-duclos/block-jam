import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import LevelItemsList from "../components/level/LevelItemsList";
import { windowHeight, windowWidth } from "../constants/dimension";
import data from "../data/levels";
import { StorageKey } from "../enums/storageKey.enum";
import { FocusProvider } from "../providers/FocusProvider";
import { useLevelStore } from "../store/level.store";
import { darken } from "../utils/color";
import { getStorageString } from "../utils/storage";

export default function LevelsMenu() {
  const setScores = useLevelStore((value) => value.setScores);

  const scroll = useSharedValue(0);

  const scrollRange = useRef(data.map((_, i) => i * windowHeight)).current;

  const startColorRange = useRef(
    data.map(
      (_, i) =>
        darken(data[i].colors.primary) ??
        darken(data[data.length - 1].colors.primary),
    ),
  ).current;

  const endColorRange = useRef(
    data.map(
      (_, i) =>
        darken(data[i].colors.primary, 0.34) ??
        darken(data[data.length - 1].colors.primary, 0.34),
    ),
  ).current;

  useEffect(() => {
    const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

    if (savedLevelScores) {
      setScores(JSON.parse(savedLevelScores));
    }
  }, []);

  const gradientColors = useDerivedValue(() => {
    const start = interpolateColor(scroll.value, scrollRange, startColorRange);
    const end = interpolateColor(scroll.value, scrollRange, endColorRange);

    return [start, end];
  });

  return (
    <FocusProvider>
      <View style={styles.container}>
        {/* BACKGROUND GRADIENT */}
        <Canvas style={styles.canvas}>
          <Rect x={0} y={0} width={windowWidth} height={windowHeight}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(windowWidth, windowHeight)}
              colors={gradientColors}
            />
          </Rect>
        </Canvas>

        <LevelItemsList level={data[0]} />
      </View>
    </FocusProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    minHeight: windowHeight,
  },
  list: {
    width: "100%",
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
});
