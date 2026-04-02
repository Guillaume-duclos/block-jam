import React, { JSX } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DifficultyViewer from "../components/difficulty/DifficultyViewer";
import DifficultiesMenuHeader from "../components/header/DifficultiesMenuHeader";
import difficulties from "../data/difficulties";

export default function DifficultiesMenu() {
  const renderDifficulties = (): any => {
    return difficulties.map(
      (difficulty, index): JSX.Element => (
        <DifficultyViewer key={index} difficultyIndex={index} />
      ),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <DifficultiesMenuHeader
          difficulty={0}
          levelsCount={0}
          openSettings={() => {}}
        />
        {renderDifficulties()}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 34,
  },
  safeArea: {
    gap: 50,
  },
});
