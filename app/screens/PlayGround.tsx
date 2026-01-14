import { RouteProp, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PlaygroundHeader from "../components/header/PlaygroundHeader";
import LevelControls from "../components/level/LevelControls";
import LevelPlayground, {
  LevelPlaygroundRef,
} from "../components/level/LevelPlayground";
import LevelScore from "../components/level/LevelScore";
import data from "../data/levels";
import LevelNavigationType from "../enums/levelNavigationType.enum";
import { Screen } from "../enums/screen.enum";
import { useDificultyStore } from "../store/dificulty.store";
import RootStackParamList from "../types/rootStackParamList.type";
import { darken } from "../utils/color";

type playGroundRouteProp = RouteProp<RootStackParamList, Screen.PLAYGROUND>;

const PlayGround = (): JSX.Element => {
  console.log("PlayGround");

  const insets = useSafeAreaInsets();
  const route = useRoute<playGroundRouteProp>();

  const dificultyTheme = useDificultyStore((value) => value.colors);

  const difficultyIndex: number = route.params.difficultyIndex;
  const levelIndex: number = route.params.levelIndex;

  const levelsList = data[difficultyIndex].levels;

  const [activeLevelIndex, setActiveLevelIndex] = useState(levelIndex);

  const levelPlaygroundRef = useRef<LevelPlaygroundRef | null>(null);

  // Redirige vers le viveau sélectionné ou retourne au menu
  const navigateToSelectedLevel = (level: LevelNavigationType): void => {
    const index =
      level === LevelNavigationType.PREVIOUS
        ? activeLevelIndex - 1
        : activeLevelIndex + 1;

    setActiveLevelIndex(index);
  };

  return (
    <LinearGradient
      colors={[darken(dificultyTheme!.primary, 0.4), dificultyTheme!.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.25]}
      style={styles.gradient}
    >
      <View
        style={{
          ...styles.container,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* HEADER */}
        <PlaygroundHeader
          difficulty={difficultyIndex}
          currentLevel={activeLevelIndex + 1}
          levelCount={3}
        />

        {/* LEVEL SCORES */}
        <LevelScore />

        {/* LEVEL PLAYGROUND */}
        <LevelPlayground
          ref={levelPlaygroundRef}
          level={levelsList[activeLevelIndex]}
          levelIndex={activeLevelIndex}
          difficultyIndex={difficultyIndex}
          navigateToNextLevel={navigateToSelectedLevel}
        />

        {/* BUTTONS CONTROLS */}
        <LevelControls
          difficulty={difficultyIndex}
          activeLevelIndex={activeLevelIndex}
          levelPlaygroundRef={levelPlaygroundRef}
          navigateToSelectedLevel={navigateToSelectedLevel}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    gap: 38,
    flex: 1,
    justifyContent: "space-between",
  },
});

export default PlayGround;
