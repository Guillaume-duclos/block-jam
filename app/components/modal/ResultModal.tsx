import { BlurView } from "expo-blur";
import React, { Fragment, JSX, useEffect, useMemo } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/spring";
import { runOnJS } from "react-native-worklets";
import Star from "../../assets/icons/Star";
import StarFill from "../../assets/icons/StarFill";
import StarSemiFill from "../../assets/icons/StarSemiFill";
import { ResultModalAction } from "../../enums/resultModalAction.enum";
import { darken } from "../../utils/color";
import { formatScore } from "../../utils/format";
import Button from "../button/Button";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedButton = Animated.createAnimatedComponent(Button);

type Props = {
  score: number | undefined;
  replay: () => void;
  nextLevel: () => void;
  style?: ViewStyle;
};

export default function ResultModal({
  score,
  replay,
  nextLevel,
  style,
}: Props): JSX.Element {
  const blur = useSharedValue(0);
  const modalScale = useSharedValue(0.95);
  const cancelButtonScale = useSharedValue(0.95);
  const cancelButtonOpacity = useSharedValue(0);
  const confirmButtonScale = useSharedValue(0.95);
  const confirmButtonOpacity = useSharedValue(0);

  const animationConfig: SpringConfig = {
    mass: 1,
    damping: 15,
    stiffness: 240,
    overshootClamping: false,
  };

  useEffect(() => {
    if (score) {
      animateBlur();
      animateScale();
    }
  }, [score]);

  const animatedBlurProps = useAnimatedProps(() => ({
    intensity: Math.round(blur.value),
  }));

  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: blur.value / 50,
    transform: [{ scale: modalScale.value }],
  }));

  const animatedCancelButtonStyle = useAnimatedStyle(() => ({
    opacity: cancelButtonOpacity.value,
    transform: [{ scale: cancelButtonScale.value }],
  }));

  const animatedConfirmButtonStyle = useAnimatedStyle(() => ({
    opacity: confirmButtonOpacity.value,
    transform: [{ scale: confirmButtonScale.value }],
  }));

  const animateBlur = (): void => {
    blur.value = withTiming(50, { duration: 200 });
  };

  const animateScale = (): void => {
    modalScale.value = withSpring(1, animationConfig);
    cancelButtonScale.value = withDelay(80, withSpring(1, animationConfig));
    cancelButtonOpacity.value = withDelay(80, withSpring(1, animationConfig));
    confirmButtonScale.value = withDelay(130, withSpring(1, animationConfig));
    confirmButtonOpacity.value = withDelay(130, withSpring(1, animationConfig));
  };

  const onReplay = (): void => {
    resetAnimatedValues(ResultModalAction.REPLAY);
  };

  const onNextLevel = (): void => {
    resetAnimatedValues(ResultModalAction.NEXT_LEVEL);
  };

  const resetAnimatedValues = (action: ResultModalAction): void => {
    blur.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.95, { duration: 200 });
    cancelButtonScale.value = withTiming(0.95, { duration: 200 });
    confirmButtonScale.value = withTiming(0.95, { duration: 200 });
    cancelButtonOpacity.value = withTiming(0, { duration: 200 });
    confirmButtonOpacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(action === ResultModalAction.REPLAY ? replay : nextLevel)();
    });
  };

  const stars = useMemo(() => {
    const clamped = Math.max(0, Math.min(1, score ?? 0));

    let units = Math.round(clamped * 6);

    const result = [];

    for (let i = 0; i < 3; i++) {
      if (units >= 2) {
        result.push(<StarFill key={i} color="#e5be74" style={styles.star} />);
        units -= 2;
      } else if (units === 1) {
        result.push(
          <StarSemiFill key={i} color="#e5be74" style={styles.star} />
        );
        units -= 1;
      } else {
        result.push(<Star key={i} color="#474746ff" style={styles.star} />);
      }
    }

    return result;
  }, [score]);

  return (
    <Fragment>
      {score && (
        <AnimatedBlurView
          tint="systemThinMaterialDark"
          animatedProps={animatedBlurProps}
          pointerEvents={score ? "auto" : "none"}
          style={{ ...styles.container, ...style }}
        >
          <View style={styles.contentContainer}>
            <Animated.View style={animatedModalStyle}>
              <View style={styles.modalBottomBorder} />
              <View style={styles.modal}>
                <Text style={styles.title}>Level completed</Text>
                <View style={styles.starsContainer}>{stars}</View>
                <Text style={styles.score}>
                  Score : {formatScore((score * 1000).toFixed(0))}
                </Text>
              </View>
            </Animated.View>

            <View style={styles.submitButtonsContainer}>
              <AnimatedButton
                onPress={onReplay}
                style={[styles.submitButton, animatedCancelButtonStyle]}
                shadowStyle={{ boxShadow: "0 0 14px 0 #878787" }}
                color="#ECECEC"
                deep={10}
              >
                <Text style={styles.submitButtonLabel}>Rejouer</Text>
              </AnimatedButton>

              <AnimatedButton
                onPress={onNextLevel}
                style={[styles.submitButton, animatedConfirmButtonStyle]}
                shadowStyle={{ boxShadow: "0 0 14px 0 #878787" }}
                color="#ECECEC"
                deep={10}
              >
                <Text style={styles.submitButtonLabel}>Suivant</Text>
              </AnimatedButton>
            </View>
          </View>
        </AnimatedBlurView>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    flex: 1,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    gap: 20,
    width: "84%",
  },
  modal: {
    gap: 22,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 30,
    backgroundColor: "#ECECEC",
  },
  modalBottomBorder: {
    left: 0,
    right: 0,
    bottom: -8,
    height: "50%",
    position: "absolute",
    borderCurve: "continuous",
    backgroundColor: darken("#ECECEC", 0.15),
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    boxShadow: "0 0 14px 0 #878787",
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    fontFamily: "Rubik",
    textAlign: "center",
    color: darken("#D6F5BC", 0.3),
  },
  starsContainer: {
    gap: 20,
    justifyContent: "center",
    flexDirection: "row",
  },
  star: {
    width: 46,
    height: 46,
  },
  score: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "Rubik",
    textAlign: "center",
    color: darken("#D6F5BC", 0.3),
  },
  submitButtonsContainer: {
    gap: 10,
    width: "100%",
    flexDirection: "row",
  },
  submitButton: {
    flex: 1,
  },
  submitButtonLabel: {
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: 800,
    fontFamily: "Rubik",
    color: darken("#D6F5BC", 0.3),
    textAlign: "center",
  },
});
