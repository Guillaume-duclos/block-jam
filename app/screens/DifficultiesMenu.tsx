import React, { JSX } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DifficultyCard from "../components/difficulty/DifficultyCard";
import DifficultiesMenuHeader from "../components/header/DifficultiesMenuHeader";
import difficulties from "../data/difficulties";

export default function DifficultiesMenu() {
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
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <DifficultiesMenuHeader difficulty={0} levelsCount={0} />
        <View style={styles.cardWrapperContainer}>{renderDifficulties()}</View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  safeArea: {
    gap: 20,
  },
  cardWrapperContainer: {
    rowGap: 40,
    paddingBottom: 30,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardWrapper: {
    width: "50%",
    paddingHorizontal: 10,
  },
});
