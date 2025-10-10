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
import SparkleMagnifyingGlass from "../assets/icons/SparkleMagnifyingGlass";
import Button from "../components/Button";
import LevelPlayground, {
  LevelPlaygroundRef,
} from "../components/LevelPlayground";
import Modal from "../components/Modal";
import PressableView from "../components/PressableView";
import data from "../data/levels.json";
import { Screen } from "../enums/screen.enum";
import { useLevelStore } from "../store/level";
import { Level } from "../types/level.type";
import NavigationProp from "../types/navigation.type";
import RootStackParamList from "../types/rootStackParamList.type";
import { darken } from "../utils/color";

type playGroundRouteProp = RouteProp<RootStackParamList, Screen.PLAYGROUND>;

export default function PlayGround(): JSX.Element {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<playGroundRouteProp>();

  const isResetEnabled = useLevelStore((value) => value.isResetEnabled);
  const isUndoEnabled = useLevelStore((value) => value.isUndoEnabled);

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
    navigation.goBack();
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

  // Display previous level
  const previousLevel = (): void => {
    setIsPreviousLevelDisabled(true);
    setIsNextLevelDisabled(true);
    levelsListRef.current.scrollToIndex({ index: activeLevelIndex - 1 });
  };

  // Display next level
  const nextLevel = (): void => {
    setIsPreviousLevelDisabled(true);
    setIsNextLevelDisabled(true);
    levelsListRef.current.scrollToIndex({ index: activeLevelIndex + 1 });
  };

  return (
    <LinearGradient
      colors={[topColor, "#D6F5BC"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      locations={[0, 0.25]}
      style={{ flex: 1 }}
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
            <LevelPlayground ref={levelPlaygroundRef} level={item} />
          )}
          style={styles.levelList}
        />

        {/* BUTTONS CRONTROLS */}
        <View style={styles.buttonsContainer}>
          <Button
            onPress={previousLevel}
            style={{ width: 64 - 10 }}
            disabled={isPreviousLevelDisabled}
          >
            <ArrowTriangleLeft
              style={{ left: -2 }}
              color={darken(mainColor, 0.3)}
            />
          </Button>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              flex: 1,
              gap: 6,
            }}
          >
            <Button
              onPress={reset}
              style={{ flex: 1 }}
              disabled={!isResetEnabled}
            >
              <ArrowTriangleHead2ClockwiseRotate90
                color={darken(mainColor, 0.3)}
              />
            </Button>

            <Button
              onPress={undo}
              style={{ flex: 1 }}
              disabled={!isUndoEnabled}
            >
              <ArrowShapeTurnUpLeft
                style={{ top: -1, left: -1 }}
                color={darken(mainColor, 0.3)}
              />
            </Button>

            <Button onPress={undo} style={{ flex: 1 }} disabled>
              <SparkleMagnifyingGlass color={darken(mainColor, 0.3)} />
            </Button>
          </View>

          <Button
            onPress={nextLevel}
            style={{ width: 64 - 10 }}
            disabled={isNextLevelDisabled}
          >
            <ArrowTriangleRight
              style={{ right: -2 }}
              color={darken(mainColor, 0.3)}
            />
          </Button>
        </View>

        <Modal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          title="Confirmation"
          description="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  buttonsContainer: {
    gap: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  button: {
    padding: 10,
    backgroundColor: "#CDCDCD",
  },
});
