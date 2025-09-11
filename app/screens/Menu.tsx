import { FlashList } from "@shopify/flash-list";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import LevelItemsList from "../components/LevelItemsList";
import PaginationIndicator from "../components/PaginationIndicator";
import ScrollInset from "../components/ScrollInset";
import { windowHeight, windowWidth } from "../constants/dimension";
import data from "../data/levels.json";
import { Orientation } from "../enums/orientation.enum";
import ScrollInsetPosition from "../enums/scrollInsetPosition.enum";

export default function Menu() {
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
    <View style={styles.container}>
      {/* LISTE VERTICALE */}
      <FlashList
        data={data}
        pagingEnabled
        style={styles.list}
        maxItemsInRecyclePool={3}
        viewabilityConfig={levelItemsConfig}
        onViewableItemsChanged={viewableItemsChanged}
        renderItem={({ item }) => <LevelItemsList level={item} />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, index) => `${index}`}
        ListHeaderComponent={() => <ScrollInset color={data[0].color} />}
        ListFooterComponent={() => (
          <ScrollInset
            color={data[data.length - 1].color}
            position={ScrollInsetPosition.BOTTOM}
          />
        )}
      />

      {/* PAGINATION */}
      <PaginationIndicator
        levels={data}
        activeViewIndex={activeViewIndex}
        orientation={Orientation.VERTICAL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    minHeight: windowHeight,
    borderColor: "red",
    borderWidth: 0,
  },
  list: {
    width: "100%",
  },
});
