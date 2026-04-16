import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DifficultyCard from "../components/difficulty/DifficultyCard";
import DifficultiesMenuHeader from "../components/header/DifficultiesMenuHeader";
import difficulties from "../data/difficulties";
import { StorageKey } from "../enums/storageKey.enum";
import { useStatusBarColor } from "../hooks/useStatusBarColor";
import { useLevelStore } from "../store/level.store";
import { getStorageString } from "../utils/storage";

export default function DifficultiesMenu() {
  const setScores = useLevelStore((value) => value.setScores);

  useStatusBarColor();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);

    if (savedLevelScores) {
      setScores(JSON.parse(savedLevelScores));
    }
  }, []);

  const renderDifficulties = (): JSX.Element[] => {
    return difficulties.map(
      (difficulty, index): JSX.Element => (
        <View key={index} style={styles.cardWrapper}>
          <DifficultyCard difficultyIndex={index} />
        </View>
      ),
    );
  };

  return (
    <View
      style={{
        ...styles.container,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.headerContainer}>
        <DifficultiesMenuHeader difficulty={0} levelsCount={0} />
        <LinearGradient
          colors={["rgba(245, 249, 252, 1)", "rgba(245, 249, 252, 0)"]}
          style={styles.headerGradient}
        />
      </View>

      <ScrollView
        style={{ ...styles.scrollView, paddingBottom: insets.bottom }}
      >
        {renderDifficulties()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F9FC",
  },
  headerContainer: {
    zIndex: 1,
  },
  headerGradient: {
    left: 0,
    right: 0,
    bottom: -30,
    position: "absolute",
    height: 30,
  },
  scrollView: {
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  cardWrapper: {
    paddingHorizontal: 10,
  },
});
