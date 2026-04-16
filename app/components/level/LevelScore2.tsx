import React, { JSX, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import levels from "../../data/levels";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import { darken } from "../../utils/color";

type Props = {
  levelIndex: number;
  difficultyIndex: number;
};

const LevelScore2 = memo(
  ({ levelIndex, difficultyIndex }: Props): JSX.Element => {
    const { t } = useTranslation();
    const scale = useSharedValue(1);

    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainColor = dificultyTheme?.primary!;

    const score = useLevelStore((state) =>
      state.getScore(difficultyIndex, levelIndex),
    );

    const count = useLevelStore((value) => value.count);
    const minMoves = levels[difficultyIndex].levels[levelIndex].minimumMoves;

    useEffect(() => {
      if (count > 0) {
        scale.value = withSequence(
          withTiming(1.05, { duration: 50 }),
          withTiming(1, { duration: 50 }),
        );
      }
    }, [count]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          {/* CURRENT COUNT */}
          <View style={{ ...styles.countContainer }}>
            <Text
              style={{ ...styles.countLabel, color: darken(mainColor, 0.28) }}
            >
              {t("moves")}
            </Text>

            <Animated.View style={[animatedStyle, { borderWidth: 0 }]}>
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={{ ...styles.count, color: darken(mainColor, 0.33) }}
              >
                {count}
              </Text>
            </Animated.View>
          </View>

          {/* PREVIOUS SCORES */}
          <View style={styles.scoreHistoricContainer}></View>

          {/* <View style={styles.scoreHistoricContainer}>
            <View
              style={{
                ...styles.scoreLabelContainer,
                backgroundColor: darken(mainColor, 0.28),
              }}
            >
              <ArrowCounterClockWise
                color="white"
                style={{ width: 36, height: 36 }}
              />

              <Text style={styles.scoreCount}>{score?.count || "--"}</Text>

              <Text
                numberOfLines={2}
                style={{ ...styles.scoreLabel, color: "white" }}
              >
                Coups Précédent
              </Text>
            </View>

            <View
              style={{
                ...styles.scoreLabelContainer,
                backgroundColor: darken(mainColor, 0.28),
              }}
            >
              <TrophyFillHeavy
                color="white"
                style={{ width: 35, height: 35 }}
              />

              <Text style={styles.scoreCount}>{minMoves}</Text>

              <Text style={{ ...styles.scoreLabel, color: "white" }}>
                {"Meilleur\nscore"}
              </Text>
            </View>
          </View> */}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  subContainer: {
    gap: 20,
    height: 160,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "baseline",
    paddingHorizontal: 20,
    borderWidth: 0.5,
  },
  countContainer: {
    // alignItems: "baseline",
    justifyContent: "space-between",
    borderWidth: 0,
  },
  countLabel: {
    fontSize: 30,
    fontWeight: 700,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "Rubik",
    borderWidth: 0,
  },
  count: {
    fontSize: 130,
    fontWeight: 600,
    // lineHeight: 150,
    // textAlign: "center",
    // transform: [{ scale: 1.4 }],
    transformOrigin: "left",
    fontFamily: "Rubik",
    textTransform: "uppercase",
    // fontVariant: ["tabular-nums"],
    borderWidth: 0.5,
  },
  scoreHistoricContainer: {
    flex: 1,
    gap: 10,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 0.5,
  },
  scoreLabelContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderCurve: "continuous",
    borderRadius: 16,
  },
  scoreCount: {
    fontSize: 30,
    fontWeight: 700,
    fontFamily: "Rubik",
    color: "white",
  },
  scoreLabel: {
    // flex: 1,
    fontSize: 12,
    fontWeight: 600,
    textAlign: "center",
    textTransform: "uppercase",
    fontFamily: "Rubik",
    borderWidth: 0,
  },
});

export default LevelScore2;
