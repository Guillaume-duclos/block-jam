import { BlurView } from "expo-blur";
import React, { Fragment, JSX, useEffect } from "react";
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
import { darken } from "../../utils/color";
import Button from "../button/Button";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedButton = Animated.createAnimatedComponent(Button);

type Props = {
  isOpen: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
  style?: ViewStyle;
};

export default function ValidationModal({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
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
    if (isOpen) {
      animateBlur();
      animateScale();
    }
  }, [isOpen]);

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

  const decline = (): void => {
    resetAnimatedValues();
  };

  const confirm = (): void => {
    resetAnimatedValues(true);
  };

  const resetAnimatedValues = (confirm?: boolean): void => {
    blur.value = withTiming(0, { duration: 200 });
    modalScale.value = withTiming(0.95, { duration: 200 });
    cancelButtonScale.value = withTiming(0.95, { duration: 200 });
    confirmButtonScale.value = withTiming(0.95, { duration: 200 });
    cancelButtonOpacity.value = withTiming(0, { duration: 200 });
    confirmButtonOpacity.value = withTiming(0, { duration: 200 }, () => {
      if (confirm) {
        runOnJS(onConfirm)();
      } else {
        runOnJS(onCancel)();
      }
    });
  };

  return (
    <Fragment>
      {isOpen && (
        <AnimatedBlurView
          tint="systemThinMaterialDark"
          animatedProps={animatedBlurProps}
          pointerEvents={isOpen ? "auto" : "none"}
          style={{ ...styles.container, ...style }}
        >
          <View style={styles.contentContainer}>
            <Animated.View style={animatedModalStyle}>
              <View style={styles.modalBottomBorder} />
              <View style={styles.modal}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
              </View>
            </Animated.View>

            <View style={styles.submitButtonsContainer}>
              <AnimatedButton
                onPress={decline}
                style={[styles.submitButton, animatedCancelButtonStyle]}
                shadowStyle={{ boxShadow: "0 0 10px 0 #686868" }}
                color="#EE7474"
                deep={10}
              >
                <Text
                  style={{
                    ...styles.submitButtonLabel,
                    ...styles.submitCancelButtonLabel,
                  }}
                >
                  Annuler
                </Text>
              </AnimatedButton>

              <AnimatedButton
                onPress={confirm}
                style={[styles.submitButton, animatedConfirmButtonStyle]}
                shadowStyle={{ boxShadow: "0 0 10px 0 #686868" }}
                color="#ECECEC"
                deep={10}
              >
                <Text style={styles.submitButtonLabel}>Confirmer</Text>
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
    paddingVertical: 34,
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
    boxShadow: "0 0 10px 0 #686868",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Rubik",
    textAlign: "center",
    color: darken("#D6F5BC", 0.3),
  },
  description: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Rubik",
    textAlign: "center",
    lineHeight: 22,
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
    fontWeight: 600,
    fontFamily: "Rubik",
    color: darken("#D6F5BC", 0.3),
  },
  submitCancelButtonLabel: {
    color: "#ECECEC",
  },
});
