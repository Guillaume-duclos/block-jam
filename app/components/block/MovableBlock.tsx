import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { JSX, memo, Ref, RefObject, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  PanGesture,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import ArrowTriangleDownFill from "../../assets/icons/ArrowTriangleDownFill";
import ArrowTriangleLeftFill from "../../assets/icons/ArrowTriangleLeftFill";
import ArrowTriangleRightFill from "../../assets/icons/ArrowTriangleRightFill";
import ArrowTriangleUpFill from "../../assets/icons/ArrowTriangleUpFill";
import { animationDuration, gridCount } from "../../config/config";
import { caseSize } from "../../constants/dimension";
import { BlockType } from "../../enums/blockType.enum";
import { Orientation } from "../../enums/orientation.enum";
import { useDificultyStore } from "../../store/dificulty.store";
import { darken } from "../../utils/color";

type Props = {
  ref?: Ref<View> | undefined;
  index: number;
  label: string;
  range: number[];
  position: number[];
  orientation: Orientation;
  hapticEnable?: boolean;
  animatabled?: boolean;
  updatePosition: (
    label: string,
    position: number[],
    addToHistory?: boolean
  ) => void;
};

const MovableBlock = memo(
  ({
    index,
    label,
    range,
    position,
    orientation,
    hapticEnable,
    animatabled,
    updatePosition,
  }: Props): JSX.Element => {
    // console.log("MovableBlock", Date.now());

    const dificultyTheme = useDificultyStore((value) => value.colors);
    const mainBlockColor = dificultyTheme?.mainBlock;
    const color = dificultyTheme?.secondary;

    const x: SharedValue<number> = useSharedValue(0);
    const y: SharedValue<number> = useSharedValue(0);
    const blockScale: SharedValue<number> = useSharedValue(0.9);
    const blockOpacity: SharedValue<number> = useSharedValue(0);
    const localPosition: RefObject<number[]> = useRef(position);
    const vibrationEnable: RefObject<boolean> = useRef(true);
    const startX = useRef<number>(0);
    const startY = useRef<number>(0);

    const progress = useSharedValue(0);

    const arrowStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
    }));

    const blockStyle = useAnimatedStyle(() => ({
      opacity: blockOpacity.value,
      transform: [{ scale: blockScale.value }],
    }));

    const mainBlock = label === BlockType.MAIN_BLOCK ? mainBlockColor : color;
    const secondBlockColor = darken(mainBlock!, 0.08);
    const arrowColor = darken(mainBlock!, 0.2);

    useEffect(() => {
      if (animatabled) {
        const totalDelay = 500 + index * 30;

        blockScale.value = withDelay(
          totalDelay,
          withSpring(1, {
            mass: 1,
            damping: 15,
            stiffness: 240,
          })
        );

        blockOpacity.value = withDelay(
          totalDelay,
          withSpring(1, {
            mass: 1,
            damping: 15,
            stiffness: 240,
          })
        );
      } else {
        blockScale.value = 1;
        blockOpacity.value = 1;
      }
    }, []);

    useEffect(() => {
      const px =
        (position[0] - gridCount * Math.floor(position[0] / gridCount)) *
        caseSize;
      const py = Math.floor(position[0] / gridCount) * caseSize;

      if (animatabled) {
        x.value = withTiming(px, { duration: animationDuration });
        y.value = withTiming(py, { duration: animationDuration });
      } else {
        x.value = px;
        y.value = py;
      }
    }, [position, animatabled]);

    // Calcule les dimensions du véhicule
    const vehicleDimensions = () => {
      let width: number;
      let height: number;

      if (orientation === Orientation.HORIZONTAL) {
        width = caseSize * position.length;
        height = caseSize;
      } else {
        width = caseSize;
        height = caseSize * position.length;
      }

      return { height: height - 4, width: width - 4 };
    };

    // Calcule la tranche de la grille la plus proche en fonction de la position courante
    const getNearestPosition = (translation: number): void => {
      const nearestUnit = Math.round(translation / caseSize);
      const clampedUnit = Math.max(0, Math.min(gridCount - 1, nearestUnit));

      // On calcule la nouvelle position en pixel
      const nearestPositionInPixels = clampedUnit * caseSize;

      // On récupère la nouvelle position au format index (entre 0 et 5)
      const nearestPositionInUnit = clampedUnit;

      // On vérifie si la position à changer
      let currentPosition: number;

      // On récupère la nouvelle position, on quitte la fonction si la position n'a pas changé
      if (orientation === Orientation.HORIZONTAL) {
        const line = Math.floor(localPosition.current[0] / gridCount);
        currentPosition = line * gridCount + nearestPositionInUnit;

        if (currentPosition === localPosition.current[0]) {
          return;
        }
      } else {
        const column = localPosition.current[0] % gridCount;
        currentPosition = column + gridCount * nearestPositionInUnit;

        if (currentPosition === localPosition.current[0]) {
          return;
        }
      }

      // Si on se trouve sur une nouvelle case, alors on met à jour la position du véhicule
      const newPositions: number[] = [];

      if (orientation === Orientation.HORIZONTAL) {
        for (let i = 0; i < position.length; i++) {
          newPositions.push(currentPosition + i);
        }

        localPosition.current = newPositions;
        x.value = withTiming(nearestPositionInPixels, {
          duration: animationDuration,
        });
      } else {
        for (let i = 0; i < position.length; i++) {
          newPositions.push(currentPosition + i * gridCount);
        }

        localPosition.current = newPositions;
        y.value = withTiming(nearestPositionInPixels, {
          duration: animationDuration,
        });
      }

      if (hapticEnable) {
        moveFeedback();
      }

      vibrationEnable.current = true;
    };

    // Calcule la position du véhicule
    const vehiclePosition = useAnimatedStyle(() => {
      if (orientation === Orientation.HORIZONTAL) {
        const positionX: number = interpolate(
          x.value,
          [
            range[0] * caseSize,
            range[1] * caseSize - (position.length - 1) * caseSize,
          ],
          [
            range[0] * caseSize,
            range[1] * caseSize - (position.length - 1) * caseSize,
          ]
        );

        return {
          transform: [{ translateX: positionX }, { translateY: y.value }],
        };
      } else {
        const positionY: number = interpolate(
          y.value,
          [
            range[0] * caseSize,
            range[1] * caseSize - (position.length - 1) * caseSize,
          ],
          [
            range[0] * caseSize,
            range[1] * caseSize - (position.length - 1) * caseSize,
          ]
        );

        return {
          transform: [{ translateX: x.value }, { translateY: positionY }],
        };
      }
    }, [range]);

    // Active le retour haptic pour les déplacements
    const moveFeedback = (): void => {
      Haptics.selectionAsync();
    };

    // Gestion des événements lorsque l'utilisateur appuis longtemps
    const longPressGesture = Gesture.LongPress()
      .minDuration(1000)
      .onStart(() => {
        progress.value = withTiming(1, { duration: 150 });
      })
      .onEnd(() => {
        progress.value = withTiming(0, { duration: 150 });
      })
      .runOnJS(true);

    // Gestion des événements lorsque l'utilisateur déplace un bloc
    const panGesture: PanGesture = Gesture.Pan()
      .onStart(() => {
        startX.current = x.value;
        startY.current = y.value;
        vibrationEnable.current = true;
      })
      .onUpdate((event): void => {
        if (orientation === Orientation.HORIZONTAL) {
          const minRange = range[0] * caseSize;
          const maxRange =
            range[1] * caseSize - (position.length - 1) * caseSize;

          const virtualPx = startX.current + event.translationX;
          const clampedPx = Math.max(minRange, Math.min(maxRange, virtualPx));

          getNearestPosition(clampedPx);
        } else {
          const minRange = range[0] * caseSize;
          const maxRange =
            range[1] * caseSize - (position.length - 1) * caseSize;

          const virtualPx = startY.current + event.translationY;
          const clampedPx = Math.max(minRange, Math.min(maxRange, virtualPx));

          getNearestPosition(clampedPx);
        }
      })
      .onEnd((): void => {
        if (localPosition.current[0] !== position[0]) {
          updatePosition(localPosition.current, label, true);
        }

        vibrationEnable.current = true;
      })
      .runOnJS(true);

    const composedGesure = Gesture.Simultaneous(longPressGesture, panGesture);

    return (
      <GestureDetector gesture={composedGesure}>
        <Animated.View
          style={[
            vehicleDimensions(),
            styles.blockContainer,
            { boxShadow: `0 1px 3px 0 ${darken(color!, 0.3)}` },
            vehiclePosition,
          ]}
        >
          <Animated.View style={[styles.blockSubContainer, blockStyle]}>
            <View
              style={{
                ...styles.blockBottomBorder,
                backgroundColor: darken(mainBlock!, 0.12),
              }}
            />

            <LinearGradient
              colors={[secondBlockColor, mainBlock!]}
              style={{
                ...styles.block,
                ...(label === BlockType.MAIN_BLOCK && styles.mainBlock),
              }}
            />

            {orientation === Orientation.HORIZONTAL && (
              <Animated.View
                style={[
                  styles.arrowContainer,
                  styles.arrowHorizontalContainer,
                  arrowStyle,
                ]}
              >
                <ArrowTriangleLeftFill
                  style={styles.arrow}
                  color={arrowColor}
                />
                <ArrowTriangleRightFill
                  style={styles.arrow}
                  color={arrowColor}
                />
              </Animated.View>
            )}

            {orientation === Orientation.VERTICAL && (
              <Animated.View
                style={[
                  styles.arrowContainer,
                  styles.arrowVerticaleContainer,
                  arrowStyle,
                ]}
              >
                <ArrowTriangleUpFill style={styles.arrow} color={arrowColor} />
                <ArrowTriangleDownFill
                  style={styles.arrow}
                  color={arrowColor}
                />
              </Animated.View>
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  blockContainer: {
    top: 2,
    left: 2,
    borderRadius: 10,
    position: "absolute",
  },
  blockSubContainer: {
    width: "100%",
    height: "100%",
    paddingBottom: 5,
  },
  block: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  blockBottomBorder: {
    width: "100%",
    height: 20,
    bottom: 0,
    position: "absolute",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  mainBlock: {
    backgroundColor: "#DA6C6C",
  },
  arrowContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "space-between",
  },
  arrowHorizontalContainer: {
    flexDirection: "row",
    paddingHorizontal: 6,
  },
  arrowVerticaleContainer: {
    paddingVertical: 6,
  },
  arrow: {
    alignSelf: "center",
    alignContent: "center",
    transform: [{ scale: 0.6 }],
    opacity: 0.7,
  },
});

export default MovableBlock;
