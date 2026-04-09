import React, { JSX, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import ArrowCounterClockWise from "../../assets/icons/ArrowCounterClockWise";
import FlagPatternCheckered from "../../assets/icons/FlagPatternCheckered";
import TrophyFillHeavy from "../../assets/icons/TrophyFillHeavy";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import { darken } from "../../utils/color";

type Props = {
  levelIndex: number;
  difficultyIndex: number;
};

const LevelScore = memo(
  ({ levelIndex, difficultyIndex }: Props): JSX.Element => {
    const { t } = useTranslation();
    const scale = useSharedValue(1);

    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainColor = dificultyTheme?.primary!;

    const score = useLevelStore((state) =>
      state.getScore(difficultyIndex, levelIndex),
    );

    const count = useLevelStore((value) => value.count);

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
        <View style={styles.scoresSubContainer}>
          {/* CURRENT COUNT */}
          <View style={{ ...styles.scoreContainer }}>
            <Text
              style={{ ...styles.scoreTitle, color: darken(mainColor, 0.28) }}
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
                {/* {count} */}000
              </Text>
            </Animated.View>
          </View>

          {/* PREVIOUS SCORES */}
          <View style={styles.scoreHistoricContainer}>
            <View
              style={{
                gap: 6,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 0,
              }}
            >
              <ArrowCounterClockWise
                color={darken(mainColor, 0.28)}
                style={{ width: 28, height: 28 }}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={{ ...styles.scoreLabel, color: darken(mainColor, 0.28) }}
              >
                Précédent : <Text style={{ fontSize: 32 }}>52</Text>
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <TrophyFillHeavy
                color={darken(mainColor, 0.28)}
                style={{ width: 28, height: 28 }}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={{ ...styles.scoreLabel, color: darken(mainColor, 0.28) }}
              >
                Meilleur : <Text style={{ fontSize: 32 }}>43</Text>
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <FlagPatternCheckered
                color={darken(mainColor, 0.28)}
                style={{ width: 28, height: 28 }}
              />
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
                style={{ ...styles.scoreLabel, color: darken(mainColor, 0.28) }}
              >
                Minimum : <Text style={{ fontSize: 32 }}>32</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  },
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
    flex: 1,
    maxWidth: "49%",
    justifyContent: "space-between",
    borderWidth: 0.5,
  },
  scoreHistoricContainer: {
    gap: 18,
    flex: 1,
    justifyContent: "center",
    borderWidth: 0.5,
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
  scoreLabel: {
    flex: 1,
    fontSize: 26,
    fontWeight: 700,
    textTransform: "uppercase",
    fontFamily: "Rubik",
    borderWidth: 0,
    top: 3,
    textAlign: "right",
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
