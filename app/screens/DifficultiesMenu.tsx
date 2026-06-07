import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import { difficultyMenuHeaderHeight } from "../constants/dimension";
import difficulties from "../data/difficulties";
import { StorageKey } from "../enums/storageKey.enum";
import { useLevelStore } from "../store/level.store";
import { darken } from "../utils/color";
import { getStorageString } from "../utils/storage";

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

  const gradientColors = useDerivedValue(() => {
    const start = interpolateColor(scroll.value, scrollRange, startColors);
    const end = interpolateColor(scroll.value, scrollRange, endColors);

    return [start, end];
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

  const updateActiveIndex = (index: number): void => {
    listRef.current?.scrollToIndex({ index, animated: false });
  };

  return (
    <View style={{ ...styles.container, paddingTop: insets.top }}>
      {/* BACKGROUND */}
      <Canvas style={styles.background}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, height)}
            colors={gradientColors}
          />
        </Rect>
      </Canvas>

      {/* HEADER */}
      <DifficultiesMenuHeader
        difficulty={activeViewIndex}
        levelsCount={difficulties[activeViewIndex].levelCount}
      />

      {/* LIST */}
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
          <View style={{ height: pageHeight, ...styles.difficultyContainer }}>
            <Text style={styles.difficultyNumber}>0{index + 1}</Text>

            <View style={styles.difficultyCardContainer}>
              <DifficultyCard
                difficultyIndex={index}
                isActive={index === activeViewIndex}
              />
            </View>
            {/* <View style={styles.nextDifficultyContainer}>
              <Text style={styles.nextDifficulty}>Difficulté {index + 2}</Text>
              <ArrowTriangleDownFill
                color="#FFFFFF"
                style={{ width: 12, height: 12 }}
              />
            </View> */}
          </View>
        )}
        keyExtractor={(_, index) => `difficulty-${index}`}
        style={styles.list}
      />

      {/* PAGINATION */}
      {/* <PaginationIndicator
        vertical
        levels={difficulties}
        activeViewIndex={activeViewIndex}
        updateActiveIndex={updateActiveIndex}
        pressColor={difficulties[activeViewIndex]?.colors?.primary}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  list: {
    flex: 1,
  },
  difficultyContainer: {
    paddingHorizontal: 24,
    justifyContent: "space-between",
    borderColor: "red",
    borderWidth: 0,
  },
  difficultyNumber: {
    fontSize: 120,
    fontWeight: "600",
    fontFamily: "Rubik",
    color: darken("#D6F5BC", 0.4),
    position: "absolute",
    left: 24,
    top: 14,
  },
  difficultyCardContainer: {
    flex: 1,
    borderWidth: 0,
    justifyContent: "center",
  },
  nextDifficultyContainer: {
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    bottom: 10,
  },
  nextDifficulty: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Rubik",
    color: "#FFFFFF",
  },
  nextDifficultyIcon: {
    transform: [{ rotate: "-30deg" }],
  },
});
