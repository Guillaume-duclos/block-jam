import { RouteProp, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LevelControls from "../components/LevelControls";
import LevelPlayground, {
  LevelPlaygroundRef,
} from "../components/LevelPlayground";
import LevelScore from "../components/LevelScore";
import PlaygroundHeader from "../components/PlaygroundHeader";
import data from "../data/levels.json";
import LevelNavigationType from "../enums/levelNavigationType.enum";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import { useDificultyStore } from "../store/dificulty.store";
import RootStackParamList from "../types/rootStackParamList.type";
import { darken } from "../utils/color";
import { getStorageString } from "../utils/storage";

type playGroundRouteProp = RouteProp<RootStackParamList, Screen.PLAYGROUND>;

const PlayGround = (): JSX.Element => {
  console.log("PlayGround");

  const insets = useSafeAreaInsets();
  const route = useRoute<playGroundRouteProp>();

  const dificultyTheme = useDificultyStore((value) => value.colors);

  const difficulty: number = route.params.difficultyIndex;
  const levelIndex: number = route.params.level.index;

  const levelsList = data[difficulty].levels;

  const [activeLevelIndex, setActiveLevelIndex] = useState(levelIndex);

  const levelPlaygroundRef = useRef<LevelPlaygroundRef | null>(null);

  useEffect(() => {
    const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

    if (savedLevelScores) {
      console.log("==> ", JSON.parse(savedLevelScores));
    } else {
      console.log("NO LEVEL SCORE DATA SAVED");
    }
  }, []);

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
      colors={[darken(dificultyTheme.primary, 0.4), dificultyTheme.primary]}
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
          difficulty={difficulty}
          currentLevel={activeLevelIndex + 1}
          levelCount={data[difficulty].levels.length}
        />

        {/* LEVEL SCORES */}
        <LevelScore />

        {/* LEVEL PLAYGROUND */}
        <LevelPlayground
          ref={levelPlaygroundRef}
          level={levelsList[activeLevelIndex]}
          levelIndex={activeLevelIndex}
          difficulty={difficulty}
        />

        {/* BUTTONS CONTROLS */}
        <LevelControls
          difficulty={difficulty}
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
    alignItems: "center",
  },
});

export default PlayGround;
