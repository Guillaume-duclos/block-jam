import { FlashList } from "@shopify/flash-list";
import React, { useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import LevelItemsList from "../components/LevelItemsList";
import PaginationIndicator from "../components/PaginationIndicator";
import { windowHeight, windowWidth } from "../constants/dimension";
import data from "../data/levels.json";
import { Orientation } from "../enums/orientation.enum";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

export default function Menu() {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const scroll = useSharedValue(0);

  const inputRange = data.map((_, i) => i * windowHeight);

  const outputRange = data.map(
    (_, i) => data[i].color ?? data[data.length - 1].color
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

  const animatedContainerStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scroll.value,
      inputRange,
      outputRange
    );

    return { backgroundColor };
  }, [inputRange, outputRange]);

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {/* LISTE VERTICALE */}
      <AnimatedFlashList
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
      />
    </Animated.View>
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
});
