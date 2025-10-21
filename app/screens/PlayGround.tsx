import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowShapeLeftFill from "../assets/icons/ArrowShapeLeftFill";
import ArrowShapeTurnUpLeft from "../assets/icons/ArrowShapeTurnUpLeft";
import ArrowTriangleHead2ClockwiseRotate90 from "../assets/icons/ArrowTriangleHead2ClockwiseRotate90";
import ArrowTriangleLeft from "../assets/icons/ArrowTriangleLeft";
import ArrowTriangleRight from "../assets/icons/ArrowTriangleRight";
import Settings from "../assets/icons/GearShapeFill";
import Button from "../components/Button";
import LevelPlayground, {
  LevelPlaygroundRef,
} from "../components/LevelPlayground";
import Modal from "../components/Modal";
import PressableView from "../components/PressableView";
import data from "../data/levels.json";
import LevelNavigationType from "../enums/levelNavigationType.enum";
import { Screen } from "../enums/screen.enum";
import { StorageKey } from "../enums/storageKey.enum";
import { useLevelStore } from "../store/level";
import { Level } from "../types/level.type";
import LevelScore from "../types/levelScore";
import NavigationProp from "../types/navigation.type";
import RootStackParamList from "../types/rootStackParamList.type";
import { darken } from "../utils/color";
import { getStorageString, setStorageObject } from "../utils/storage";

type playGroundRouteProp = RouteProp<RootStackParamList, Screen.PLAYGROUND>;

export default function PlayGround(): JSX.Element {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<playGroundRouteProp>();

  const currentCount = useLevelStore((value) => value.currentCount);
  const isUndoEnabled = useLevelStore((value) => value.isUndoEnabled);
  const setCurrentCount = useLevelStore((value) => value.setCurrentCount);

  const difficulty: number = route.params.difficultyIndex;
  const level: number = route.params.level.index;

  const mainColor: string = "#FAF7F2";
  const topColor: string = darken("#D6F5BC", 0.3) || "";

  const levelsList = data[difficulty].levels;

  const [activeLevelIndex, setActiveLevelIndex] = useState(level);
  const [isResetDisabled, setIsResetDisabled] = useState(false);
  const [isUndoDisabled, setIsUndoDisabled] = useState(false);
  const [isPreviousLevelDisabled, setIsPreviousLevelDisabled] = useState(
    activeLevelIndex === 0
  );
  const [isNextLevelDisabled, setIsNextLevelDisabled] = useState(
    activeLevelIndex === levelsList.length - 1
  );
  const [showConfirmationModal, setShowConfirmationModal] = useState<
    LevelNavigationType | undefined
  >();

  const levelsListRef = useRef<FlashListRef<Level>>(null);
  const levelPlaygroundRef = useRef<LevelPlaygroundRef | null>(null);

  // Configuration de la liste
  const levelListConfig = useRef({
    minimumViewTime: 0,
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Lorsque le scroll de la liste des niveau est terminé
  const onMomentumScrollEnd = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const index = Math.round(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width
    );

    setActiveLevelIndex(index);
    setIsPreviousLevelDisabled(index === 0);
    setIsNextLevelDisabled(index === levelsList.length - 1);
  };

  // Retour au menu
  const goback = (): void => {
    if (currentCount) {
      setShowConfirmationModal(LevelNavigationType.GO_BACK);
    } else {
      navigation.goBack();
    }
  };

  // Ouvre les paramètres
  const openSettings = (): void => {
    navigation.navigate(Screen.SETTINGS);
  };

  // Réinitialise le niveau
  const reset = (): void => {
    levelPlaygroundRef?.current?.reset();
  };

  // Annule le dernier mouvement
  const undo = (): void => {
    levelPlaygroundRef?.current?.undo();
  };

  // Display previous level or display confirmation modal
  const previousLevel = (): void => {
    if (currentCount) {
      setShowConfirmationModal(LevelNavigationType.PREVIOUS);
    } else {
      navigateToSelectedLevel(LevelNavigationType.PREVIOUS);
    }
  };

  // Display next level or display confirmation modal
  const nextLevel = (): void => {
    if (currentCount) {
      setShowConfirmationModal(LevelNavigationType.NEXT);
    } else {
      navigateToSelectedLevel(LevelNavigationType.NEXT);
    }
  };

  // Redirige vers le viveau sélectionné
  const confirmLevelNavigation = (): void => {
    navigateToSelectedLevel(showConfirmationModal as LevelNavigationType);
  };

  // Redirige vers le viveau sélectionné
  const navigateToSelectedLevel = (level: LevelNavigationType): void => {
    if (level === LevelNavigationType.GO_BACK) {
      navigation.goBack();
    } else {
      const index =
        level === LevelNavigationType.PREVIOUS
          ? activeLevelIndex - 1
          : activeLevelIndex + 1;

      levelsListRef?.current?.scrollToIndex({ index });

      setIsPreviousLevelDisabled(true);
      setIsNextLevelDisabled(true);
      setShowConfirmationModal(undefined);
    }

    setCurrentCount(0);
  };

  // Annule la redirection vers le niveau sélectionné
  const cancelLevelNavigation = (): void => {
    setShowConfirmationModal(undefined);
  };

  // Sauvegarde le score du niveau joué
  const saveLevelScore = (score: number): void => {
    const savedLevelScores = getStorageString(StorageKey.LEVEL_SCORE);
    let levelScores: LevelScore[] = [];

    try {
      levelScores = savedLevelScores ? JSON.parse(savedLevelScores) : [];
    } catch (_) {
      levelScores = [];
    }

    const newLevelScore: LevelScore = {
      difficulty,
      level,
      count: score,
    };

    // Vérifie si le score existe déjà (même difficulté et niveau)
    const existingIndex = levelScores.findIndex(
      (score) => score.difficulty === difficulty && score.level === level
    );

    if (existingIndex !== -1) {
      levelScores[existingIndex] = newLevelScore;
    } else {
      levelScores.push(newLevelScore);
    }

    setStorageObject(StorageKey.LEVEL_SCORE, levelScores);
  };

  return (
    <LinearGradient
      colors={[topColor, "#D6F5BC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.25]}
      style={styles.gradient}
    >
      <View
        style={{
          ...styles.container,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <PressableView onPress={goback}>
            <ArrowShapeLeftFill color="#FFFFFF" />
          </PressableView>

          <View style={{ alignItems: "center" }}>
            <Text style={styles.headerDificulty}>
              Difficulté {difficulty + 1}
            </Text>
            <Text style={styles.headerLevel}>
              Niveau{" "}
              <Text style={styles.headerLevelNumber}>
                {activeLevelIndex + 1}/{data[difficulty].levels.length}
              </Text>
            </Text>
          </View>

          <PressableView onPress={openSettings}>
            <Settings color="#FFFFFF" />
          </PressableView>
        </View>

        <FlashList
          ref={levelsListRef}
          data={levelsList}
          horizontal={true}
          pagingEnabled={true}
          scrollEnabled={false}
          maxItemsInRecyclePool={3}
          initialScrollIndex={level}
          viewabilityConfig={levelListConfig}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onMomentumScrollEnd}
          renderItem={({ item }) => (
            <LevelPlayground
              ref={levelPlaygroundRef}
              level={item}
              onLevelFinish={saveLevelScore}
            />
          )}
          style={styles.levelList}
        />

        {/* BUTTONS CRONTROLS */}
        <View style={styles.footerButtonsContainer}>
          <Button
            onPress={previousLevel}
            style={styles.footerButton}
            disabled={isPreviousLevelDisabled}
          >
            <ArrowTriangleLeft
              style={styles.leftFooterButtonIcon}
              color={darken(mainColor, 0.3)}
            />
          </Button>

          <View style={styles.gamePlayButtonsContainer}>
            <Button
              onPress={reset}
              style={styles.gamePlayButton}
              disabled={currentCount === 0}
            >
              <ArrowTriangleHead2ClockwiseRotate90
                color={darken(mainColor, 0.3)}
              />
            </Button>

            <Button
              onPress={undo}
              style={styles.gamePlayButton}
              disabled={!isUndoEnabled}
            >
              <ArrowShapeTurnUpLeft
                style={{ top: -1, left: -1 }}
                color={darken(mainColor, 0.3)}
              />
            </Button>
          </View>

          <Button
            onPress={nextLevel}
            style={styles.footerButton}
            disabled={isNextLevelDisabled}
          >
            <ArrowTriangleRight
              style={styles.rightFooterButtonIcon}
              color={darken(mainColor, 0.3)}
            />
          </Button>
        </View>

        <Modal
          isOpen={!!showConfirmationModal}
          onConfirm={confirmLevelNavigation}
          onCancel={cancelLevelNavigation}
          title="Confirmation"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerDificulty: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "Rubik",
    color: "#FFFFFF",
  },
  headerLevel: {
    fontSize: 17,
    fontWeight: 600,
    fontFamily: "Rubik",
    color: "#FFFFFF",
    lineHeight: 27,
  },
  headerLevelNumber: {
    fontSize: 20,
  },
  levelList: {
    flex: 1,
  },
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
    backgroundColor: "#CDCDCD",
  },
  leftFooterButtonIcon: {
    left: -2,
  },
  rightFooterButtonIcon: {
    right: -2,
  },
});
