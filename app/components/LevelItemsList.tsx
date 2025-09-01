import { FlashList } from "@shopify/flash-list";
import React, { JSX, memo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { windowHeight } from "../constants/dimension";
import ScrollInsetPosition from "../enums/scrollInsetPosition.enum";
import LevelItem from "./LevelItem";
import PaginationIndicator from "./PaginationIndicator";
import ScrollInset from "./ScrollInset";

type Props = {
  level: any;
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

  return (
    <View>
      {/* LISTE HORIZONTALE DE CHAQUE GRAND NIVEAU */}
      <FlashList
        horizontal
        pagingEnabled
        data={level.levels}
        maxItemsInRecyclePool={3}
        viewabilityConfig={levelItemsConfig}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        renderItem={({ item }) => <LevelItem item={item} />}
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
      <PaginationIndicator
        levels={level.levels}
        activeViewIndex={activeViewIndex}
      />
    </View>
  );
});

const styles = StyleSheet.create({});

export default LevelItemsList;
