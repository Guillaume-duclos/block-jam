import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo } from "react";
import { ColorValue, Pressable, StyleSheet, View } from "react-native";
import { windowWidth } from "../constants/dimension";
import { Screen } from "../enums/screen.enum";
import { usePreventDoublePress } from "../hooks/usePreventDoublePress";
import { Level } from "../types/level.type";
import RootStackParamList from "../types/rootStackParamList.type";
import LevelViewer from "./LevelViewer";

type Props = {
  color: ColorValue;
  levels: Level[];
  difficultyIndex: number;
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LevelItem = memo(
  ({ color, levels, difficultyIndex }: Props): JSX.Element => {
    const navigation = useNavigation<levelItemNavigationProp>();

    const canPress = usePreventDoublePress();

    // Redirection vers le niveau
    const navigateToPlayground = (level: Level): void => {
      const canNavigate = canPress();

      if (canNavigate) {
        navigation.push(Screen.PLAYGROUND, {
          level,
          difficultyIndex,
        });
      }
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
                index={String(level.index + 1)}
                locked={difficultyIndex > 0}
                layout={level.layout}
                color={color}
              />
            </Pressable>
          );
        })}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  levelItemsContainer: {
    columnGap: 10,
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
