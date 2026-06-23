import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import ArrowShapeLeftFill from "../../assets/icons/ArrowShapeLeftFill";
import GearShapeFill from "../../assets/icons/GearShapeFill";
import { difficultyMenuHeaderHeight } from "../../constants/dimension";
import { Screen } from "../../enums/screen.enum";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import NavigationProp from "../../types/navigation.type";
import PressableView from "../button/PressableView";

type Props = {
  difficulty: number;
  levelsCount: number;
};

const LevelsMenuHeader = ({ difficulty, levelsCount }: Props): JSX.Element => {
  const navigation = useNavigation<NavigationProp>();
  const dificultyTheme = useDificultyStore((value) => value.colors);

  const { t } = useTranslation();

  const completedLevels = useLevelStore((state) =>
    state.getCompletedLevelsByDificulty(difficulty),
  );

  // Redirige vers le menu des difficultés
  const goBack = (): void => {
    navigation.goBack();
  };

  // Ouvre les paramètres
  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  return (
    <View style={styles.container}>
      <PressableView onPress={goBack}>
        <ArrowShapeLeftFill
          color={dificultyTheme?.white ?? "#FFFFFF"}
          style={styles.backButton}
        />
      </PressableView>

      <View style={styles.contentContainer}>
        <Text style={styles.headerTitle}>
          {t("dificulty")} {difficulty + 1}
        </Text>
        <Text style={styles.headerProgression}>
          <Text style={styles.headerProgressionCount}>{completedLevels}</Text>/
          {levelsCount} {t("completed")}
        </Text>
      </View>

      <View style={styles.headerSettingsButtonContainer}>
        <PressableView onPress={openSettings}>
          <GearShapeFill color="#FFFFFF" style={styles.settingsButton} />
        </PressableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: difficultyMenuHeaderHeight,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  backButton: {
    width: 32,
    height: 32,
  },
  settingsButton: {
    width: 32,
    height: 32,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    textAlign: "center",
    color: "#FFFFFF",
  },
  headerProgression: {
    fontSize: 17,
    fontWeight: 600,
    fontFamily: "Rubik",
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: 27,
  },
  headerProgressionCount: {
    fontSize: 21,
  },
  headerSettingsButtonContainer: {
    justifyContent: "center",
  },
});

export default LevelsMenuHeader;
