import React, { JSX, memo } from "react";
import { StyleSheet, View } from "react-native";
import { windowWidth } from "../../constants/dimension";
import data from "../../data/levels";
import { Level } from "../../types/level.type";
import LevelViewer from "./LevelViewer";

type Props = {
  levels: Level[];
  difficultyIndex: number;
};

const LevelItem = memo(({ levels, difficultyIndex }: Props): JSX.Element => {
  return (
    <View style={styles.levelItemsContainer}>
      {levels.map((level: Level) => (
        <LevelViewer
          key={level.scheme}
          levelIndex={level.index}
          difficultyIndex={difficultyIndex}
          locked={difficultyIndex > 0}
          scheme={level.scheme}
          colors={data[difficultyIndex].colors}
          style={styles.levelItem}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  levelItemsContainer: {
    columnGap: 8,
    width: windowWidth,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  levelItem: {
    gap: 2,
    alignItems: "center",
    paddingHorizontal: 2,
  },
});

export default LevelItem;
