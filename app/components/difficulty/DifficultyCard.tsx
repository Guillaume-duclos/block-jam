import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { JSX, memo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { runOnJS } from "react-native-worklets";
import { Screen } from "../../enums/screen.enum";
import RootStackParamList from "../../types/rootStackParamList.type";
import { darken } from "../../utils/color";
import ProgressBar from "../ProgressBar";
import LevelViewerLight from "../level/LevelViewerLight";

type Props = {
  difficultyIndex: number;
  disabled?: boolean;
  color?: string;
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
};

type levelItemNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const DifficultyCard = memo(
  ({
    difficultyIndex,
    disabled = false,
    color = "#F5F7FF",
    style,
    contentContainerStyle,
  }: Props): JSX.Element => {
    const navigation = useNavigation<levelItemNavigationProp>();

    const { t } = useTranslation();

    const progress = useSharedValue(0);

    const buttonStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: progress.value }],
    }));

    const redirectToLevel = (): void => {
      navigation.navigate(Screen.LEVELS_MENU, { difficultyIndex });
    };

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
        runOnJS(redirectToLevel)();
      });

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
              backgroundColor: darken(color, 0.12),
              height: "50%",
            }}
          />
          <Animated.View
            style={[
              styles.block,
              contentContainerStyle,
              { backgroundColor: color },
              buttonStyle,
            ]}
          >
            <View style={styles.levelViewerContainer}>
              <LevelViewerLight
                style={styles.levelViewer3}
                scheme="BBBoxoooJDDMAAJoLMIoEELoIooKFFxooKHH"
                colors={{
                  primary: "#D6F5BC",
                  secondary: "#F5F7FF",
                  mainBlock: "#DA6C6C",
                  fixedBlock: "#939EB0",
                  frame: "#F5F7FF",
                  white: "#FFFFFF",
                }}
              />

              <LevelViewerLight
                style={styles.levelViewer2}
                scheme="BBBoxoooJDDMAAJoLMIoEELoIooKFFxooKHH"
                colors={{
                  primary: "#D6F5BC",
                  secondary: "#F5F7FF",
                  mainBlock: "#DA6C6C",
                  fixedBlock: "#939EB0",
                  frame: "#F5F7FF",
                  white: "#FFFFFF",
                }}
              />

              <LevelViewerLight
                style={styles.levelViewer1}
                scheme="BBBoxoooJDDMAAJoLMIoEELoIooKFFxooKHH"
                colors={{
                  primary: "#D6F5BC",
                  secondary: "#F5F7FF",
                  mainBlock: "#DA6C6C",
                  fixedBlock: "#939EB0",
                  frame: "#F5F7FF",
                  white: "#FFFFFF",
                }}
              />
            </View>
            <Text style={styles.difficulty}>Difficulté 1</Text>
            <View>
              <Text style={styles.progression}>
                <Text style={styles.progressionCount}>122</Text>/200
              </Text>

              <ProgressBar progression={20} />

              <Text style={styles.completedLevel}>niveaux complétés</Text>
            </View>

            {/* <Button onPress={() => {}} deep={0}>
              <Text>Commencer</Text>
            </Button> */}
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
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  blockBottomBorder: {
    left: 0,
    right: 0,
    bottom: -8,
    position: "absolute",
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  difficulty: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    color: darken("#D6F5BC"),
    textAlign: "center",
  },
  progression: {
    fontSize: 22,
    fontWeight: 700,
    fontFamily: "Rubik",
    color: darken("#D6F5BC"),
  },
  progressionCount: {
    fontSize: 34,
    fontWeight: 800,
  },
  completedLevel: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "Rubik",
    textTransform: "uppercase",
    color: darken("#D6F5BC"),
    marginTop: 4,
  },
  levelViewerContainer: {
    borderWidth: 0,
    alignSelf: "center",
  },
  levelViewer1: {
    marginTop: 20,
  },
  levelViewer2: {
    top: 6,
    position: "absolute",
    transform: [{ scale: 0.9 }],
  },
  levelViewer3: {
    top: -7,
    position: "absolute",
    transform: [{ scale: 0.8 }],
  },
});

export default DifficultyCard;
