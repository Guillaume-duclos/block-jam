import { useNavigation } from "@react-navigation/native";
import { JSX, useCallback, useLayoutEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "../components/button/Button";
import PressableView from "../components/button/PressableView";
import LevelPlaygroundTutorial from "../components/level/LevelPlaygroundTutorial";
import levels from "../data/levels";
import { Screen } from "../enums/screen.enum";
import { useStatusBarColor } from "../hooks/useStatusBarColor";
import { useDificultyStore } from "../store/dificulty.store";
import NavigationProp from "../types/navigation.type";

type Props = { onMount?: () => void };

export default function Tutorial({ onMount }: Props): JSX.Element {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const setColors = useDificultyStore((score) => score.setColors);

  const onMountCalled = useRef(false);

  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  useStatusBarColor();

  const onLayout = useCallback(() => {
    if (!onMountCalled.current) {
      onMountCalled.current = true;
      onMount?.();
    }
  }, [onMount]);

  useLayoutEffect(() => {
    setColors({ ...levels[0].colors, primary: "#a2d29e" });
    setReady(true);
  }, []);

  const navigateToDiffictiesMenu = (): void => {
    // setStorageItem(StorageKey.TUTORIAL_SCREEN_VIEWED, true);
    navigation.navigate(Screen.DIFFICULTIES_MENU);
  };

  return (
    <View
      onLayout={onLayout}
      style={{
        ...styles.container,
        paddingTop: insets.top + 10,
        paddingBottom: insets.bottom,
      }}
    >
      {/* TITLE */}
      <View style={styles.headerContainer}>
        <View style={styles.headerSubContainer}>
          <Text style={styles.headeTitle}>Welcome!</Text>

          <PressableView
            style={styles.skipButtonContainer}
            onPress={navigateToDiffictiesMenu}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </PressableView>
        </View>

        <Text style={styles.headeSubTitle}>
          Let's take a tour of the game play
        </Text>
      </View>

      <View style={styles.directionContainer}>
        <Text
          numberOfLines={1}
          minimumFontScale={0.1}
          adjustsFontSizeToFit
          style={styles.direction}
        >
          Move the bloc {step + 1} to left
        </Text>
      </View>

      {ready && (
        <>
          {/* LEVEL PLAYGROUND */}
          <LevelPlaygroundTutorial
            level={levels[0].levels[0]}
            levelIndex={0}
            difficultyIndex={0}
            onStepChange={setStep}
          />

          {/* BUTTONS CONTROLS */}
          <View style={styles.continueButton}>
            <Button onPress={navigateToDiffictiesMenu} disabled={step < 3}>
              <Text style={styles.continueButtonLabel}>Continuer</Text>
            </Button>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#F5F9FC",
  },
  headerContainer: {
    gap: 12,
    paddingHorizontal: 20,
  },
  headerSubContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headeTitle: {
    fontSize: 38,
    fontWeight: "800",
    fontFamily: "Rubik",
    color: "#607889",
    textTransform: "uppercase",
  },
  headeSubTitle: {
    fontSize: 32,
    lineHeight: 32,
    fontWeight: "700",
    fontFamily: "Rubik",
    color: "#89a0b0",
    textTransform: "uppercase",
  },
  skipButtonContainer: {
    gap: 6,
    alignItems: "center",
    flexDirection: "row",
  },
  skipButtonText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Rubik",
    color: "#607889",
    textTransform: "uppercase",
  },
  skipButtonIcon: {
    width: 26,
    height: 26,
  },
  directionContainer: {
    paddingHorizontal: 20,
  },
  direction: {
    fontSize: 40,
    lineHeight: 40,
    fontWeight: "700",
    fontFamily: "Rubik",
    color: "#607889",
  },
  continueButton: {
    paddingHorizontal: 20,
  },
  continueButtonLabel: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Rubik",
    color: "#607889",
  },
});
