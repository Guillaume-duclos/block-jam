import { FlashList, FlashListRef } from "@shopify/flash-list";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import LevelItemsList from "../components/LevelItemsList";
import PaginationIndicator from "../components/PaginationIndicator";
import { windowHeight, windowWidth } from "../constants/dimension";
import data from "../data/levels.json";
import { Orientation } from "../enums/orientation.enum";
import { darken } from "../utils/color";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function Menu() {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const scroll = useSharedValue(0);

  const listRef = useRef<FlashListRef<any>>(null);

  const scrollRange = data.map((_, i) => i * windowHeight);

  const startColorRange = data.map(
    (_, i) => data[i].color ?? data[data.length - 1].color
  );

  const endColorRange = data.map(
    (_, i) => darken(data[i].color) ?? darken(data[data.length - 1].color)
  );

  const setActiveIndex = (y: number) => {
    const id = Math.round(y / windowHeight);
    const clamped = Math.max(0, Math.min(id, data.length - 1));

    setActiveViewIndex(clamped);
  };

  const levelItemsConfig = useRef({
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any): void => {
    if (viewableItems.length) {
      setActiveViewIndex(viewableItems[0].index);
    }
  }).current;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scroll.value = event.contentOffset.y;
      runOnJS(setActiveIndex)(event.contentOffset.y);
    },
  });

  const updateActiveIndex = (index: number): void => {
    listRef.current?.scrollToIndex({ index, animated: false });
  };

  const gradientColors = useDerivedValue(() => {
    const start = interpolateColor(scroll.value, scrollRange, startColorRange);
    const end = interpolateColor(scroll.value, scrollRange, endColorRange);

    return [start, end];
  });

  return (
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

      {/* LISTE VERTICALE */}
      <AnimatedFlashList
        ref={listRef}
        data={data}
        pagingEnabled
        style={styles.list}
        maxItemsInRecyclePool={6}
        viewabilityConfig={levelItemsConfig}
        onViewableItemsChanged={viewableItemsChanged}
        renderItem={({ item }) => <LevelItemsList level={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `vlist-${index}`}
        scrollEventThrottle={16}
        onScroll={onScroll}
      />

      {/* PAGINATION */}
      <PaginationIndicator
        levels={data}
        activeViewIndex={activeViewIndex}
        orientation={Orientation.VERTICAL}
        updateActiveIndex={updateActiveIndex}
      />
    </View>
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
