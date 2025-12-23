import { useNavigation } from "@react-navigation/native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import React, { JSX, memo, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  menuFooterHeight,
  menuHeaderHeight,
  menuLevelHeight,
  menuVerticalPadding,
  windowHeight,
} from "../constants/dimension";
import { Screen } from "../enums/screen.enum";
import { Level, MainLevel } from "../types/level.type";
import NavigationProp from "../types/navigation.type";
import LevelItem from "./LevelItem";
import MenuHeader from "./MenuHeader";
import PaginationIndicator from "./PaginationIndicator";

type Props = {
  level: MainLevel;
};

const LevelItemsList = memo(({ level }: Props): JSX.Element => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();

  const { height } = useSafeAreaFrame();

  const listRef = useRef<FlashListRef<any>>(null);

  // Configuration de la liste
  const levelItemsConfig = useRef({
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Au swipe de la liste
  const viewableItemsChanged = useRef(({ viewableItems }: any): void => {
    // console.log(level.index, "viewableItems");

    if (viewableItems.length) {
      setActiveViewIndex(viewableItems[0].index);
    }
  }).current;

  // Calcule de la hauteur du menu, on enlève 40 pixels de marges verticaux
  const menuHeight =
    height -
    (insets.top +
      insets.bottom +
      menuHeaderHeight +
      menuFooterHeight +
      menuVerticalPadding * 2);

  // Calcule du nombre de lignes possibles
  const rowsCount = Math.floor(menuHeight / menuLevelHeight);

  // Division de la liste des niveaux en plusieurs listes pour la pagination
  const splitLevels = (levels: Level[], rows: number): Level[][] => {
    const result: Level[][] = [];
    const itemsPerPage = rows * 4;

    for (let i = 0; i < levels.length; i += itemsPerPage) {
      const chunk = levels
        .slice(i, i + itemsPerPage)
        .map((level: Level, index: number) => ({
          ...level,
          index: i + index,
        }));

      result.push(chunk);
    }

    return result;
  };

  const data = useMemo(
    () => splitLevels(level.levels, rowsCount),
    [level.levels]
  );

  // Ouvre les paramètres
  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  const updateActiveIndex = (index: number): void => {
    listRef.current?.scrollToIndex({ index, animated: false });
  };

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* HEADER */}
      <MenuHeader difficulty={level.index + 1} openSettings={openSettings} />

      {/* LISTE HORIZONTALE DE CHAQUE GRAND NIVEAU */}
      <FlashList
        ref={listRef}
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
        keyExtractor={(_, index) => `hlist-${level.index}-${index}`}
        contentContainerStyle={styles.contentContainerStyle}
        style={{ ...styles.levelList }}
      />

      {/* PAGINATION */}
      <PaginationIndicator
        levels={data}
        activeViewIndex={activeViewIndex}
        updateActiveIndex={updateActiveIndex}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
  },
  levelList: {
    flex: 1,
  },
  contentContainerStyle: {
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default LevelItemsList;
