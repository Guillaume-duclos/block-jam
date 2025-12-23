import React, { JSX } from "react";
import { StyleSheet, Text, View } from "react-native";
import ArrowShapeLeftFill from "../assets/icons/ArrowShapeLeftFill";
import Settings from "../assets/icons/GearShapeFill";
import { useDificultyStore } from "../store/dificulty.store";
import PressableView from "./PressableView";

type Props = {
  difficulty: number;
  currentLevel: number;
  levelCount: number;
  goback: () => void;
  openSettings: () => void;
};

const PlaygroundHeader = ({
  difficulty,
  currentLevel,
  levelCount,
  goback,
  openSettings,
}: Props): JSX.Element => {
  const dificultyTheme = useDificultyStore((value) => value.colors);

  return (
    <View style={styles.header}>
      <PressableView onPress={goback}>
        <ArrowShapeLeftFill color={dificultyTheme.white} />
      </PressableView>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{ ...styles.headerDificulty, color: dificultyTheme.white }}
        >
          Difficulté {difficulty + 1}
        </Text>
        <Text style={{ ...styles.headerLevel, color: dificultyTheme.white }}>
          Niveau{" "}
          <Text style={styles.headerCurrentLevelNumber}>{currentLevel}</Text>/
          {levelCount}
        </Text>
      </View>

      <PressableView onPress={openSettings}>
        <Settings color={dificultyTheme.white} />
      </PressableView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerDificulty: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    textAlign: "center",
  },
  headerLevel: {
    fontSize: 17,
    fontWeight: 600,
    fontFamily: "Rubik",

    lineHeight: 27,
  },
  headerCurrentLevelNumber: {
    fontSize: 21,
  },
});

export default PlaygroundHeader;
