import { useNavigation } from "@react-navigation/native";
import React, { Fragment, JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import ArrowShapeLeftFill from "../../assets/icons/ArrowShapeLeftFill";
import Door from "../../assets/icons/Door";
import Settings from "../../assets/icons/GearShapeFill";
import { Screen } from "../../enums/screen.enum";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import NavigationProp from "../../types/navigation.type";
import PressableView from "../button/PressableView";
import ModalValidation from "../modal/ValidationModal";

type Props = {
  difficulty: number;
  currentLevel: number;
  levelCount: number;
};

const PlaygroundHeader = ({
  difficulty,
  currentLevel,
  levelCount,
}: Props): JSX.Element => {
  const navigation = useNavigation<NavigationProp>();

  const { t } = useTranslation();
  const dificultyTheme = useDificultyStore((value) => value.colors);
  const resetLevelData = useLevelStore((value) => value.resetLevelData);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Ouvre les paramètres
  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  // Vérifie si l'utilisateur peut revenur au menu
  const confirmGoBack = (): void => {
    const count = useLevelStore.getState().count;

    if (count) {
      setShowConfirmationModal(true);
    } else {
      goBack();
    }
  };

  // Redirige vers le menu
  const goBack = (): void => {
    resetLevelData();
    navigation.goBack();
  };

  // Annule la redirection vers le niveau sélectionné
  const cancelGoBack = (): void => {
    setShowConfirmationModal(false);
  };

  return (
    <Fragment>
      {/* HEADER */}
      <View style={styles.header}>
        <PressableView onPress={confirmGoBack}>
          <ArrowShapeLeftFill color={dificultyTheme.white} />
        </PressableView>

        <View style={{ alignItems: "center" }}>
          <Text
            style={{ ...styles.headerDificulty, color: dificultyTheme.white }}
          >
            {t("dificulty")} {difficulty + 1}
          </Text>
          <Text style={{ ...styles.headerLevel, color: dificultyTheme.white }}>
            {t("level")}{" "}
            <Text style={styles.headerCurrentLevelNumber}>{currentLevel}</Text>/
            {levelCount}
          </Text>
        </View>

        <PressableView onPress={openSettings}>
          <Settings color={dificultyTheme.white} />
        </PressableView>
      </View>

      {/* MODAL */}
      <ModalValidation
        isOpen={showConfirmationModal}
        icon={Door}
        onConfirm={goBack}
        onCancel={cancelGoBack}
        title={t("confirmation")}
        description={t("confirmationDescription")}
        style={styles.modal}
      />
    </Fragment>
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
  modal: {
    zIndex: 1,
  },
});

export default PlaygroundHeader;
