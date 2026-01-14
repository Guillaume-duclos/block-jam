import React, { Fragment, JSX, memo, RefObject, useState } from "react";
import { StyleSheet, View } from "react-native";
import ArrowShapeTurnUpLeft from "../../assets/icons/ArrowShapeTurnUpLeft";
import ArrowTriangleHead2ClockwiseRotate90 from "../../assets/icons/ArrowTriangleHead2ClockwiseRotate90";
import data from "../../data/levels";
import LevelNavigationType from "../../enums/levelNavigationType.enum";
import { useDificultyStore } from "../../store/dificulty.store";
import { useLevelStore } from "../../store/level.store";
import { darken } from "../../utils/color";
import Button from "../button/Button";
import NextLevelButton from "../button/NextLevelButton";
import PreviousLevelButton from "../button/PreviousLevelButton";
import ModalValidation from "../modal/ValidationModal";
import { LevelPlaygroundRef } from "./LevelPlayground";

type Props = {
  levelPlaygroundRef: RefObject<LevelPlaygroundRef | null>;
  activeLevelIndex: number;
  difficulty: number;
  navigateToSelectedLevel: (levelNavigationType: LevelNavigationType) => void;
};

const LevelControls = memo(
  ({
    levelPlaygroundRef,
    activeLevelIndex,
    difficulty,
    navigateToSelectedLevel,
  }: Props): JSX.Element | undefined => {
    console.log("LevelControls", Date.now());

    const levelsList = data[difficulty].levels;

    const dificultyTheme = useDificultyStore((value) => value.colors);
    const isResetEnabled = useLevelStore((value) => value.isResetEnabled);
    const isUndoEnabled = useLevelStore((value) => value.isUndoEnabled);

    const [showConfirmationModal, setShowConfirmationModal] = useState<
      LevelNavigationType | undefined
    >();

    const isPreviousLevelDisabled = activeLevelIndex === 0;
    const isNextLevelDisabled = activeLevelIndex === levelsList.length - 1;

    // Réinitialise le niveau
    const reset = (): void => {
      levelPlaygroundRef?.current?.reset();
    };

    // Annule le dernier mouvement
    const undo = (): void => {
      levelPlaygroundRef?.current?.undo();
    };

    // Redirige vers le viveau sélectionné
    const confirmLevelNavigation = (): void => {
      navigateToSelectedLevel(showConfirmationModal as LevelNavigationType);
    };

    // Annule la redirection vers le niveau sélectionné
    const cancelLevelNavigation = (): void => {
      setShowConfirmationModal(undefined);
    };

    // Affiche le niveau préscédent ou la modale de confirmation de changement de miveau
    const previousLevel = (): void => {
      if (isResetEnabled) {
        setShowConfirmationModal(LevelNavigationType.PREVIOUS);
      } else {
        navigateToSelectedLevel(LevelNavigationType.PREVIOUS);
      }
    };

    // Affiche le niveau suivant ou la modale de confirmation de changement de miveau
    const nextLevel = (): void => {
      if (isResetEnabled) {
        setShowConfirmationModal(LevelNavigationType.NEXT);
      } else {
        navigateToSelectedLevel(LevelNavigationType.NEXT);
      }
    };

    return (
      <Fragment>
        {/* BUTTONS CONTROLS */}
        <View style={styles.footerButtonsContainer}>
          <PreviousLevelButton
            onPress={previousLevel}
            disabled={isPreviousLevelDisabled}
            style={styles.footerButton}
            color={dificultyTheme.frame}
          />

          <View style={styles.gamePlayButtonsContainer}>
            <Button
              onPress={reset}
              style={styles.gamePlayButton}
              disabled={!isResetEnabled}
              color={dificultyTheme.frame}
            >
              <ArrowTriangleHead2ClockwiseRotate90
                color={darken(dificultyTheme.frame, 0.3)}
              />
            </Button>

            <Button
              onPress={undo}
              style={styles.gamePlayButton}
              disabled={!isUndoEnabled}
              color={dificultyTheme.frame}
            >
              <ArrowShapeTurnUpLeft
                style={{ top: -1, left: -1 }}
                color={darken(dificultyTheme.frame, 0.3)}
              />
            </Button>
          </View>

          <NextLevelButton
            onPress={nextLevel}
            disabled={isNextLevelDisabled}
            style={styles.footerButton}
            color={dificultyTheme.frame}
          />
        </View>

        {/* MODAL */}
        <ModalValidation
          isOpen={!!showConfirmationModal}
          onConfirm={confirmLevelNavigation}
          onCancel={cancelLevelNavigation}
          title="Confirmation"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      </Fragment>
    );
  }
);

const styles = StyleSheet.create({
  footerButtonsContainer: {
    gap: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  footerButton: {
    width: 64 - 10,
  },
  gamePlayButtonsContainer: {
    gap: 8,
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
  },
  gamePlayButton: {
    flex: 1,
  },
  button: {
    padding: 10,
  },
  leftFooterButtonIcon: {
    left: -2,
  },
  rightFooterButtonIcon: {
    right: -2,
  },
});

export default LevelControls;
