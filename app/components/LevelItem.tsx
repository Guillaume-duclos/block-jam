import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { windowWidth } from "../constants/dimension";
import { Screen } from "../enums/screen.enum";
import { Level } from "../types/level.type";
import RootStackParamList from "../types/rootStackParamList.type";
import LevelViewer from "./LevelViewer";

type Props = {
  levels: Level[];
  difficultyIndex: number;
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LevelItem = memo(({ levels, difficultyIndex }: Props): JSX.Element => {
  const navigation = useNavigation<levelItemNavigationProp>();

  // Redirection vers le niveau
  const navigateToPlayground = (level: Level): void => {
    navigation.replace(Screen.PLAYGROUND, {
      level,
      difficultyIndex,
    });
  };

  return (
    <View style={styles.levelItemsContainer}>
      {levels.map((level: Level, index: number) => {
        return (
          <Pressable
            key={index}
            onPress={() => navigateToPlayground(level)}
            style={styles.levelItem}
          >
            <LevelViewer
              locked={difficultyIndex > 0}
              index={String(level.index + 1)}
              layout={level.layout}
            />
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  levelItemsContainer: {
    gap: 10,
    width: windowWidth,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  levelItem: {
    gap: 2,
    alignItems: "center",
    paddingHorizontal: 1,
  },
});

export default LevelItem;
