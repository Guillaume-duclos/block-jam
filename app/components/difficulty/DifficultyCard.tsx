import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import TrophyFill from "../../assets/icons/TrophyFill";
import difficulties from "../../data/difficulties";
import { Screen } from "../../enums/screen.enum";
import { useLevelStore } from "../../store/level.store";
import RootStackParamList from "../../types/rootStackParamList.type";
import { darken } from "../../utils/color";
import Button from "../button/Button";
import CircularProgressBar from "../CircularProgressBar";
import LevelViewerLight from "../level/LevelViewerLight";
import ProgressBar from "../LinearProgressBar";

type Props = {
  difficultyIndex: number;
  isActive?: boolean;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Taille d'un item (72) + gap (16)
const ITEM_STEP = 72 + 16;
const ROW_SCHEMES_1 = [
  "oooJBBxDDJKLoHAAKLoHEEKMooIFFMGGIooo",
  "BBoLooIooLCCIJAAMNIJDDMNEEKooxGGKoxo",
  "IBBxoxIEELooAAKLoNJoKFFNJoGGMoHHooMo",
  "ooxCCoDDoKooAAoKMNHIEEMNHIJLFFGGJLoo",
  "oBBCCoooKxEEAAKoMNIJFFMNIJoLGGHHoLoo",
];
const ROW_SCHEMES_2 = [
  "oBBJLMoGHJLMoGHAAMCCIoooFoIKDDFEEKoo",
  "HBBLoxHoJLDDAAJoMNoIEEMNoIKFFNGGKooo",
  "oooxxooDDoMoAAJLMoHIJLEEHIKFFNGGKooN",
  "oBBBoxooJDDMAAJKLMIEEKLoIooKFFxoHHoo",
  "BBooLxooxKLoAAoKMoHIEEMNHIJFFNGGJooo",
];

const SCORE_COLORS = ["#CD7F32", "#ABABAB", "#C9A22A"];

// Largeur d'un set = n items × step - 1 gap (dernier item n'a pas de gap après)
const ROW_WIDTH = ROW_SCHEMES_1.length * ITEM_STEP;
const MARQUEE_DURATION = 40000;

const DifficultyCard = memo(
  ({
    difficultyIndex,
    isActive = false,
    disabled = false,
    color = "#F5F7FF",
    style,
    contentContainerStyle,
  }: Props): JSX.Element => {
    const navigation = useNavigation<levelItemNavigationProp>();

    const { t } = useTranslation();

    const progress = useSharedValue(0);
    const translateX1 = useSharedValue(0);
    const translateX2 = useSharedValue(-ROW_WIDTH / 2);

    const levelsCount = difficulties[difficultyIndex].levelCount;

    const completedLevels = useLevelStore((state) =>
      state.getCompletedLevelsByDificulty(difficultyIndex),
    );

    const bronzeCount = useLevelStore(
      (state) =>
        state.scores.filter(
          (score) => score.difficulty === difficultyIndex && score.score < 0.33,
        ).length,
    );

    const silverCount = useLevelStore(
      (state) =>
        state.scores.filter(
          (score) =>
            score.difficulty === difficultyIndex &&
            score.score >= 0.33 &&
            score.score < 0.66,
        ).length,
    );

    const goldCount = useLevelStore(
      (state) =>
        state.scores.filter(
          (score) =>
            score.difficulty === difficultyIndex && score.score >= 0.66,
        ).length,
    );
    const scoreCounts = [bronzeCount, silverCount, goldCount];

    const progression = ((completedLevels || 0) * 100) / levelsCount;

    const difficultyColors = difficulties[difficultyIndex].colors;

    useEffect(() => {
      if (isActive) {
        translateX1.value = 0;
        translateX2.value = -ROW_WIDTH / 2;
        translateX1.value = withRepeat(
          withTiming(-ROW_WIDTH, {
            duration: MARQUEE_DURATION,
            easing: Easing.linear,
          }),
          -1,
          false,
        );
        translateX2.value = withRepeat(
          withTiming(-ROW_WIDTH / 2 - ROW_WIDTH, {
            duration: MARQUEE_DURATION,
            easing: Easing.linear,
          }),
          -1,
          false,
        );
      } else {
        cancelAnimation(translateX1);
        cancelAnimation(translateX2);
      }

      return () => {
        cancelAnimation(translateX1);
        cancelAnimation(translateX2);
      };
    }, [isActive]);

    const marqueeStyle1 = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX1.value }],
    }));

    const marqueeStyle2 = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX2.value }],
    }));

    const buttonStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: progress.value }],
    }));

    const redirectToLevelsMenu = (): void => {
      navigation.navigate(Screen.LEVELS_MENU, { difficultyIndex });
    };

    const redirectToNextLevel = (): void => {};

    const tapGesture = Gesture.Tap()
      .enabled(!disabled)
      .maxDuration(Number.MAX_SAFE_INTEGER)
      .onBegin(() => {
        "worklet";
        progress.value = withTiming(12 - 12 / 1.5, { duration: 80 });
      })
      .onTouchesCancelled(() => {
        "worklet";
        progress.value = withTiming(0, { duration: 80 });
      })
      .onFinalize(() => {
        "worklet";
        progress.value = withTiming(0, { duration: 80 });
      })
      .onTouchesUp(() => {
        "worklet";
        progress.value = withTiming(0, { duration: 80 });
      })
      .onEnd(() => {
        "worklet";
      });

    const renderRow = (schemes: string[]) =>
      [...schemes, ...schemes, ...schemes].map((scheme, index) => (
        <LevelViewerLight
          key={index}
          scheme={scheme}
          colors={difficultyColors}
        />
      ));

    return (
      <GestureDetector gesture={tapGesture}>
        <View
          style={[
            styles.container,
            ...(Array.isArray(style) ? style : [style]),
          ]}
        >
          <View
            style={{
              ...styles.blockBottomBorder,
              backgroundColor: darken(color, 0.15),
              height: "50%",
            }}
          />
          <Animated.View
            style={[
              styles.block,
              contentContainerStyle,
              { backgroundColor: darken(color, 0) },
              buttonStyle,
            ]}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                fontFamily: "Rubik",
                color: darken("#D6F5BC"),
                textTransform: "uppercase",
              }}
            >
              Difficulté
            </Text>
            <Text
              style={{
                fontSize: 38,
                fontWeight: "800",
                fontFamily: "Rubik",
                color: darken("#D6F5BC"),
                textTransform: "uppercase",
                top: -6,
              }}
            >
              Découverte
            </Text>

            {/* PROGRESSION DES NIVEAUX TERMINÉS */}
            <View style={styles.progressionContainer}>
              <Text style={styles.progression}>
                <Text style={styles.progressionCount}>{completedLevels}</Text>/
                {levelsCount} complétés
              </Text>
              <ProgressBar progression={progression} />
            </View>

            {/* STATISTIQUES DES SCORES */}
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Statistiques des cores :</Text>
              <View style={styles.statsProgressionContainer}>
                {SCORE_COLORS.map((scoreColor, index) => (
                  <View key={scoreColor} style={styles.statsProgression}>
                    <CircularProgressBar
                      progression={(scoreCounts[index] / levelsCount) * 100}
                      color={scoreColor}
                    >
                      <TrophyFill
                        color={scoreColor}
                        style={styles.trophyIcon}
                      />
                    </CircularProgressBar>
                    <Text style={[styles.statsNumber, { color: scoreColor }]}>
                      {scoreCounts[index]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* BOUTONS DE NAVIGATION */}
            <View style={styles.buttonsContainer}>
              <Button
                onPress={redirectToLevelsMenu}
                color={darken("#D6F5BC")}
                deep={8}
              >
                <Text style={styles.buttonText}>Voir tous les niveaux</Text>
              </Button>

              <Button
                onPress={redirectToNextLevel}
                color={darken("#D6F5BC")}
                deep={8}
              >
                <Text style={styles.buttonText}>Continuer</Text>
              </Button>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
  },
  block: {
    gap: 10,
    width: "100%",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 10,
    borderColor: darken("#F5F7FF", 0.05),
  },
  blockBottomBorder: {
    left: 0,
    right: 0,
    bottom: -8,
    position: "absolute",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    boxShadow: `0 6px 20px ${darken("#D6F5BC", 0.4)}`,
  },
  difficultyNumber: {
    fontSize: 340,
    lineHeight: 340,
    fontWeight: "500",
    fontFamily: "Rubik",
    color: darken("#D6F5BC"),
    position: "absolute",
    opacity: 0.3,
    left: 10,
    top: 0,
  },
  difficultyIconsContainer: {
    gap: 8,
    top: -5,
    right: -5,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderWidth: 0,
  },
  difficultyBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darken("#F5F7FF", 0.05),
    boxShadow: `0 4px 0 ${darken("#F5F7FF", 0.15)}`,
  },
  marqueeContainer: {
    marginTop: 30,
    marginHorizontal: -20,
  },
  marqueeRow: {
    overflow: "hidden",
    paddingBottom: 16,
    borderWidth: 0,
  },
  marqueeTrack: {
    gap: 16,
    flexDirection: "row",
    paddingBottom: 3,
    borderWidth: 0,
  },
  progressionContainer: {
    gap: 2,
  },
  progression: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "Rubik",
    color: darken("#D6F5BC"),
  },
  progressionCount: {
    fontSize: 32,
    fontWeight: 800,
  },
  statsContainer: {
    gap: 10,
    marginTop: 10,
    borderWidth: 0,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "Rubik",
    color: darken("#D6F5BC"),
  },
  statsProgressionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsProgression: {
    gap: 3,
    alignItems: "center",
  },
  trophyIcon: {
    width: 26,
    height: 26,
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "Rubik",
    color: darken("#D6F5BC"),
  },
  buttonsContainer: {
    marginTop: 20,
    // flexDirection: "row",
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 600,
    fontFamily: "Rubik",
    color: "#FFFFFF",
  },
});

export default DifficultyCard;
