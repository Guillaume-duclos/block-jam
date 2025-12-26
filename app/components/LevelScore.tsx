import React, { JSX, memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDificultyStore } from "../store/dificulty.store";
import { useLevelStore } from "../store/level.store";
import { darken } from "../utils/color";

type Props = {};

const LevelScore = memo(({}: Props): JSX.Element | undefined => {
  console.log("LevelScore", Date.now());

  const dificultyTheme = useDificultyStore((value) => value.colors);
  const mainColor = dificultyTheme?.primary!;

  const currentCount = useLevelStore((value) => value.currentCount);

  return (
    <View style={styles.container}>
      <View style={styles.scoresSubContainer}>
        {/* CURRENT COUNT */}
        <View style={{ ...styles.scoreContainer }}>
          <Text
            style={{ ...styles.scoreTitle, color: darken(mainColor, 0.28) }}
          >
            Coups
          </Text>

          <View style={{ borderWidth: 0 }}>
            <Text
              style={{ ...styles.count, color: darken(mainColor, 0.33) }}
              // adjustsFontSizeToFit
              // minimumFontScale={0.5}
              // numberOfLines={1}
            >
              {currentCount}
            </Text>
          </View>
        </View>

        {/* PREVIOUS SCORES */}
        <View
          style={{
            ...styles.scoreContainer,
            ...styles.previousScoreContainer,
          }}
        >
          <Text
            adjustsFontSizeToFit
            numberOfLines={2}
            minimumFontScale={0.5}
            style={{ ...styles.scoreTitle, color: darken(mainColor, 0.28) }}
          >
            Scores précédents
          </Text>

          <View style={styles.previousScoreLabelContainer}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                ...styles.previousScoreLabel,
                color: darken(mainColor, 0.33),
              }}
            >
              Coups : 34
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                ...styles.previousScoreLabel,
                color: darken(mainColor, 0.33),
              }}
            >
              Temps : 2:03
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  scoresSubContainer: {
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    flexDirection: "row",
    borderWidth: 0,
  },
  scoreContainer: {
    width: "48%",
    justifyContent: "space-between",
    borderWidth: 0,
  },
  previousScoreContainer: {
    gap: 6,
    justifyContent: "space-between",
  },
  scoreTitle: {
    fontSize: 30,
    fontWeight: 700,
    textTransform: "uppercase",
    fontFamily: "Rubik",
    borderWidth: 0,
  },
  count: {
    height: 110,
    fontSize: 120,
    fontWeight: 600,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    marginBottom: 1,
    borderWidth: 0,
    borderColor: "red",
    lineHeight: 134,
  },
  previousScoreLabelContainer: {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    borderWidth: 0,
  },
  previousScoreLabel: {
    fontSize: 30,
    fontWeight: 800,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    borderWidth: 0,
  },
});

export default LevelScore;
