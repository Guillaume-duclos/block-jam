import { useNavigation } from "@react-navigation/native";
import React, { JSX } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Settings from "../../assets/icons/GearShapeFill";
import { difficultyMenuHeaderHeight } from "../../constants/dimension";
import { Screen } from "../../enums/screen.enum";
import { useLevelStore } from "../../store/level.store";
import NavigationProp from "../../types/navigation.type";
import PressableView from "../button/PressableView";

type Props = {
  difficulty: number;
  levelsCount: number;
};

const DifficultiesMenuHeader = ({
  difficulty,
  levelsCount,
}: Props): JSX.Element => {
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  const completedLevels = useLevelStore((state) =>
    state.getCompletedLevelsByDificulty(difficulty),
  );

  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.headerTitle}>{t("dificulties")}</Text>
      </View>

      <View style={styles.headerSettingsButtonContainer}>
        <PressableView onPress={openSettings}>
          <Settings color="#FFFFFF" style={styles.settingsButton} />
        </PressableView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: difficultyMenuHeaderHeight,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
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
    right: 16,
    height: "100%",
    position: "absolute",
    justifyContent: "center",
  },
  settingsButton: {
    width: 32,
    height: 32,
  },
});

export default DifficultiesMenuHeader;
