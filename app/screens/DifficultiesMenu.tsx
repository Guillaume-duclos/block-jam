import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import DifficultyCard from "../components/difficulty/DifficultyCard";
import DifficultiesMenuHeader from "../components/header/DifficultiesMenuHeader";
import PaginationIndicator from "../components/PaginationIndicator";
import { difficultyMenuHeaderHeight } from "../constants/dimension";
import difficulties from "../data/difficulties";
import { StorageKey } from "../enums/storageKey.enum";
import { useLevelStore } from "../store/level.store";
import { darken } from "../utils/color";
import { getStorageString } from "../utils/storage";

const toTransparent = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},0)`;
};

export default function DifficultiesMenu() {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const listRef = useRef<FlashListRef<any>>(null);
  const setScores = useLevelStore((value) => value.setScores);
  const insets = useSafeAreaInsets();
  const { width, height } = useSafeAreaFrame();

  useEffect(() => {
    const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

    if (savedLevelScores) {
      setScores(JSON.parse(savedLevelScores));
    }
  }, []);

  const pageHeight = height - insets.top - difficultyMenuHeaderHeight;

  const scroll = useSharedValue(0);

  const scrollRange = useRef(
    difficulties.map((_, index) => index * pageHeight),
  ).current;

  const startColors = useRef(
    difficulties.map((d) => darken(d.colors.primary, 0.3)),
  ).current;

  const endColors = useRef(
    difficulties.map((d) => darken(d.colors.primary, 0.3)),
  ).current;

  const startColorsTransparent = useRef(startColors.map(toTransparent)).current;

  const gradientColors = useDerivedValue(() => {
    const start = interpolateColor(scroll.value, scrollRange, startColors);
    const end = interpolateColor(scroll.value, scrollRange, endColors);

    return [start, end];
  });

  const fadeColors = useDerivedValue(() => {
    const opaque = interpolateColor(scroll.value, scrollRange, startColors);
    const transparent = interpolateColor(
      scroll.value,
      scrollRange,
      startColorsTransparent,
    );

    return [opaque, transparent];
  });

  const levelItemsConfig = useRef({
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any): void => {
    if (viewableItems.length) {
      setActiveViewIndex(viewableItems[0].index);
    }
  }).current;

  const fadeY = insets.top + difficultyMenuHeaderHeight;

  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      {/* BACKGROUND */}
      <Canvas style={styles.canvas}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={gradientColors}
          />
        </Rect>
      </Canvas>

      <DifficultiesMenuHeader
        difficulty={activeViewIndex}
        levelsCount={difficulties[activeViewIndex].levelCount}
      />

      <FlashList
        ref={listRef}
        pagingEnabled
        data={difficulties}
        drawDistance={pageHeight * 3}
        viewabilityConfig={levelItemsConfig}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        scrollEventThrottle={16}
        onScroll={(event) => {
          scroll.value = event.nativeEvent.contentOffset.y;
        }}
        renderItem={({ index }) => (
          <View
            style={{ height: pageHeight, ...styles.difficultyCardContainer }}
          >
            <DifficultyCard
              difficultyIndex={index}
              isActive={index === activeViewIndex}
            />
          </View>
        )}
        keyExtractor={(_, index) => `difficulty-${index}`}
        style={styles.list}
      />

      {/* PAGINATION */}
      <PaginationIndicator
        vertical
        levels={difficulties}
        activeViewIndex={activeViewIndex}
      />

      {/* FADE */}
      {/* <Canvas
        style={{ position: "absolute", top: fadeY, left: 0, width, height: 30 }}
        pointerEvents="none"
      >
        <Rect x={0} y={0} width={width} height={30}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, 30)}
            colors={fadeColors}
          />
        </Rect>
      </Canvas> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  list: {
    flex: 1,
  },
  difficultyCardContainer: {
    paddingHorizontal: 30,
    justifyContent: "center",
  },
});
