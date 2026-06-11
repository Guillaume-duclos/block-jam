import { useNavigation } from "@react-navigation/native";
import React, { JSX, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LevelControlsTutorial from "../components/level/LevelControlsTutorial";
import { LevelPlaygroundRef } from "../components/level/LevelPlayground";
import LevelPlaygroundTutorial from "../components/level/LevelPlaygroundTutorial";
import levels from "../data/levels";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import { useStatusBarColor } from "../hooks/useStatusBarColor";
import { useDificultyStore } from "../store/dificulty.store";
import NavigationProp from "../types/navigation.type";
import { setStorageItem } from "../utils/storage";

export default function Tutorial(): JSX.Element {
  const levelPlaygroundRef = useRef<LevelPlaygroundRef | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const setColors = useDificultyStore((s) => s.setColors);
  const [ready, setReady] = useState(false);

  useStatusBarColor();

  useLayoutEffect(() => {
    setColors(levels[0].colors);
    setReady(true);
  }, []);

  const navigateToDiffictiesMenu = (): void => {
    setStorageItem(StorageKey.TUTORIAL_SCREEN_VIEWED, true);
    navigation.navigate(Screen.DIFFICULTIES_MENU);
  };

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* TITLE */}
      <Text></Text>

      {ready && (
        <>
          {/* LEVEL PLAYGROUND */}
          <LevelPlaygroundTutorial
            ref={levelPlaygroundRef}
            level={levels[0].levels[0]}
            levelIndex={0}
            difficultyIndex={0}
            navigateToNextLevel={() => {}}
          />

          {/* BUTTONS CONTROLS */}
          <LevelControlsTutorial
            levelPlaygroundRef={levelPlaygroundRef}
            activeLevelIndex={0}
            difficulty={0}
            navigateToSelectedLevel={() => {}}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
