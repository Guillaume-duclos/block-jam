import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo } from "react";
import { StyleSheet, View } from "react-native";
import { windowWidth } from "../../constants/dimension";
import data from "../../data/levels";
import { Screen } from "../../enums/screen.enum";
import { usePreventDoublePress } from "../../hooks/usePreventDoublePress";
import { useDificultyStore } from "../../store/dificulty.store";
import { Level } from "../../types/level.type";
import RootStackParamList from "../../types/rootStackParamList.type";
import LevelViewer from "./LevelViewer";

type Props = {
  levels: Level[];
  difficultyIndex: number;
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LevelItem = memo(({ levels, difficultyIndex }: Props): JSX.Element => {
  const navigation = useNavigation<levelItemNavigationProp>();

  const canPress = usePreventDoublePress();

  const setDificultyColors = useDificultyStore((value) => value.setColors);

  // Redirection vers le niveau
  const navigateToPlayground = (levelIndex: number): void => {
    setDificultyColors(data[difficultyIndex].colors);

    const canNavigate = canPress();

    if (canNavigate) {
      navigation.push(Screen.PLAYGROUND, {
        levelIndex,
        difficultyIndex,
      });
    }
  };

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
          // onPress={navigateToPlayground}
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
