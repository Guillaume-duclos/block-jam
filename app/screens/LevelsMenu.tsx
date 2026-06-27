import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import LevelItemsList from "../components/level/LevelItemsList";
import { windowHeight, windowWidth } from "../constants/dimension";
import data from "../data/levels";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import { FocusProvider } from "../providers/FocusProvider";
import { useLevelStore } from "../store/level.store";
import RootStackParamList from "../types/rootStackParamList.type";
import { darken } from "../utils/color";
import { getStorageString } from "../utils/storage";

type playGroundRouteProp = RouteProp<RootStackParamList, Screen.PLAYGROUND>;

export default function LevelsMenu() {
  const setScores = useLevelStore((value) => value.setScores);

  const route = useRoute<playGroundRouteProp>();

  const levels = data[route.params.difficultyIndex];

  const scroll = useSharedValue(0);

  const scrollRange = useRef(data.map((_, i) => i * windowHeight)).current;

  const startColorRange = useRef(
    data.map(
      (_, i) =>
        darken(data[i].colors.primary) ??
        darken(data[data.length - 1].colors.primary),
    ),
  ).current;

  useEffect(() => {
    const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

    if (savedLevelScores) {
      setScores(JSON.parse(savedLevelScores));
    }
  }, []);

  const backgroundColor = useDerivedValue(() =>
    interpolateColor(scroll.value, scrollRange, startColorRange),
  );

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <FocusProvider>
      <Animated.View style={[styles.container, backgroundStyle]}>
        <LevelItemsList level={levels} />
      </Animated.View>
    </FocusProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    minHeight: windowHeight,
  },
});
