import { FlashList } from "@shopify/flash-list";
import React, { JSX, memo, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { windowHeight } from "../constants/dimension";
import ScrollInsetPosition from "../enums/scrollInsetPosition.enum";
import { Level, MainLevel } from "../types/level.type";
import LevelItem from "./LevelItem";
import PaginationIndicator from "./PaginationIndicator";
import ScrollInset from "./ScrollInset";

type Props = {
  level: MainLevel;
};

const LevelItemsList = memo(({ level }: Props): JSX.Element => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const levelItemsConfig = useRef({
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any): void => {
    if (viewableItems.length) {
      setActiveViewIndex(viewableItems[0].index);
    }
  }).current;

  const splitLevels = (levels: Level[], split: number): Level[][] => {
    const result: Level[][] = [];
    const chunkSize = Math.ceil(levels.length / split);

    for (let i = 0; i < levels.length; i += chunkSize) {
      const chunk = levels
        .slice(i, i + chunkSize)
        .map((level: Level, index: number) => ({
          ...level,
          index: i + index,
        }));

      result.push(chunk);
    }

    return result;
  };

  const data = useMemo(() => splitLevels(level.levels, 7), [level.levels]);

  return (
    <View>
      {/* LISTE HORIZONTALE DE CHAQUE GRAND NIVEAU */}
      <FlashList
        horizontal
        pagingEnabled
        data={data}
        maxItemsInRecyclePool={3}
        viewabilityConfig={levelItemsConfig}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        renderItem={({ item }) => (
          <LevelItem levels={item} difficultyIndex={level.index} />
        )}
        keyExtractor={(_, index) => `${index}`}
        style={{ height: windowHeight }}
        contentContainerStyle={{
          backgroundColor: level.color,
          justifyContent: "center",
          alignItems: "center",
        }}
        ListHeaderComponent={() => (
          <ScrollInset
            color={level.color}
            position={ScrollInsetPosition.LEFT}
          />
        )}
        ListFooterComponent={() => (
          <ScrollInset
            color={level.color}
            position={ScrollInsetPosition.RIGHT}
          />
        )}
      />

      {/* PAGINATION */}
      <PaginationIndicator levels={data} activeViewIndex={activeViewIndex} />
    </View>
  );
});

export default LevelItemsList;
