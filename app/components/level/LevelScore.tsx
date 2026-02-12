import React, { JSX, memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import { darken } from "../../utils/color";

type Props = {
  levelIndex: number;
  difficultyIndex: number;
};

const LevelScore = memo(
  ({ levelIndex, difficultyIndex }: Props): JSX.Element => {
    const scale = useSharedValue(1);

    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainColor = dificultyTheme?.primary!;

    const score = useLevelStore((state) =>
      state.getScore(difficultyIndex, levelIndex)
    );

    const count = useLevelStore((value) => value.count);

    useEffect(() => {
      if (count > 0) {
        scale.value = withSequence(
          withTiming(1.05, { duration: 50 }),
          withTiming(1, { duration: 50 })
        );
      }
    }, [count]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

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

            <Animated.View style={[animatedStyle, { borderWidth: 0 }]}>
              <Text style={{ ...styles.count, color: darken(mainColor, 0.33) }}>
                {count}
              </Text>
            </Animated.View>
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
                Coups : {score?.count || "--"}
              </Text>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{
                  ...styles.previousScoreLabel,
                  color: darken(mainColor, 0.33),
                }}
              >
                Temps : {score?.time || "--:--"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
);

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
