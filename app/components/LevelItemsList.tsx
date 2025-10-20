import { FlashList } from "@shopify/flash-list";
import React, { JSX, memo, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
import ScrollInsetPosition from "../enums/scrollInsetPosition.enum";
import { Level, MainLevel } from "../types/level.type";
import { darken } from "../utils/color";
import LevelItem from "./LevelItem";
import PaginationIndicator from "./PaginationIndicator";
import ScrollInset from "./ScrollInset";

type Props = {
  level: MainLevel;
};

const LevelItemsList = memo(({ level }: Props): JSX.Element => {
  const [activeViewIndex, setActiveViewIndex] = useState(0);

  const insets = useSafeAreaInsets();

  const { height } = useSafeAreaFrame();

  // Configuration de la liste
  const levelItemsConfig = useRef({
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Au swipe de la liste
  const viewableItemsChanged = useRef(({ viewableItems }: any): void => {
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

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: darken(level.color, 0.2),
      }}
    >
      {/* LEVEL DIFICULTY */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Dificulty {level.index + 1}</Text>
        <View style={styles.headerProgressionContainer}>
          <Text style={styles.headerProgression}>
            <Text style={styles.headerProgressionCount}>2</Text>/156 completed
          </Text>
        </View>
      </View>

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
        style={{ ...styles.levelList }}
        contentContainerStyle={styles.contentContainerStyle}
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

const styles = StyleSheet.create({
  container: {
    height: windowHeight,
  },
  headerContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    color: "#FFFFFF",
  },
  headerProgressionContainer: {
    gap: 10,
    alignItems: "center",
    flexDirection: "row",
    borderWidth: 0,
  },
  headerProgression: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "Rubik",
    color: "#FFFFFF",
  },
  headerProgressionCount: {
    fontSize: 20,
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
