import * as Haptics from "expo-haptics";
import React, { JSX, RefObject, useEffect, useRef } from "react";
import { StyleSheet, Text, useWindowDimensions } from "react-native";
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
  withTiming,
} from "react-native-reanimated";
import { animationDuration, gridCount } from "../config/config";
import { caseSize, horizontalMargin } from "../constants/dimension";
import { Orientation } from "../enums/orientation.enum";

type Props = {
  grid: number[];
  label: string;
  range: number[];
  position: number[];
  orientation: Orientation;
  updatePosition: (
    label: string,
    position: number[],
    addToHistory?: boolean
  ) => void;
};

export default function MovableBlock({
  grid,
  label,
  range,
  position,
  orientation,
  updatePosition,
}: Props): JSX.Element {
  const x: SharedValue<number> = useSharedValue(0);
  const y: SharedValue<number> = useSharedValue(0);
  const localPosition: RefObject<number[]> = useRef(position);
  const vibrationEnable: RefObject<boolean> = useRef(true);

  const dimensions = useWindowDimensions();

  useEffect(() => {
    console.log({ position });
    console.log({ range });
  }, [position, range]);

  useEffect(() => {
    if (orientation === Orientation.HORIZONTAL) {
      x.value = withTiming(position[0], { duration: animationDuration });
    } else {
      y.value = withTiming(position[0], { duration: animationDuration });
    }
  }, [position]);

  // Calcule de la position du véhicule
  useEffect((): void => {
    x.value =
      (position[0] - gridCount * Math.floor(position[0] / gridCount)) *
      caseSize;
    y.value = Math.floor(position[0] / gridCount) * caseSize;
  }, [position]);

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

    return { height, width };
  };

  // Calcule la tranche de la grille la plus proche en fonction de la position courante
  const getNearestPosition = (translation: number): void => {
    // On calcule la nouvelle position en pixel
    const nearestPosition: number = grid.reduce(
      (previous: number, current: number): number =>
        Math.abs(current - translation) < Math.abs(previous - translation)
          ? current
          : previous
    );

    // On récupère la nouvelle position au format index (entre 0 et 5)
    const nearestPositionInUnit: number = grid.indexOf(nearestPosition);

    // On vérifie si la position à changer
    let currentPosition: number;

    // On récupère la nouvelle position, on quitte la fonction si la position n'a pas changé
    if (orientation === Orientation.HORIZONTAL) {
      const line: number = Math.floor(localPosition.current[0] / gridCount);
      currentPosition = line * gridCount + nearestPositionInUnit;

      if (currentPosition === localPosition.current[0]) {
        return;
      }
    } else {
      const column: number =
        localPosition.current[0] -
        Math.floor(localPosition.current[0] / gridCount) * 6;

      currentPosition = column + gridCount * nearestPositionInUnit;

      if (currentPosition === localPosition.current[0]) {
        return;
      }
    }

    // Si on se trouve sur une nouvelle case, alors on met à jour la position du véhicule
    const newPositions: number[] = [];

    if (orientation === Orientation.HORIZONTAL) {
      for (let i: number = 0; i < position.length; i++) {
        newPositions.push(currentPosition + i);
      }
    } else {
      for (let i: number = 0; i < position.length * gridCount; i += gridCount) {
        newPositions.push(currentPosition + i);
      }
    }

    // On met à jour la position sauvegardé en locale
    localPosition.current = newPositions;

    // On met à jour la valeur de l'axe x ou y en fonction de l'orientation du véhicule
    if (orientation === Orientation.HORIZONTAL) {
      x.value = withTiming(nearestPosition, { duration: animationDuration });
    } else {
      y.value = withTiming(nearestPosition, { duration: animationDuration });
    }

    moveFeedback();
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

  // Active le retour haptic du warning
  const outboxFeedback = (): void => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  // Active le retour haptic pour les déplacements
  const moveFeedback = (): void => {
    Haptics.selectionAsync();
  };

  // Gestion des événements lorsque l'utilisateur déplace un véhicule
  const panGestureEvent: PanGesture = Gesture.Pan()
    .minDistance(0)
    .onUpdate((event): void => {
      const isHorizontal = orientation === Orientation.HORIZONTAL;

      if (isHorizontal) {
        const touchPosition = event.absoluteX - horizontalMargin - caseSize;
        const minRange = range[0] * caseSize;
        const maxRange = range[1] * caseSize - (position.length - 1) * caseSize;

        // Vérifie si le déplacement en X est toujours compris dans le rang
        if (touchPosition >= minRange && touchPosition <= maxRange) {
          getNearestPosition(touchPosition);
        }

        // On active la vibration si la valeur de touchPosition est suffisamment en dehors du rang
        if (
          vibrationEnable.current &&
          ((touchPosition <= minRange &&
            touchPosition <= minRange - caseSize) ||
            (touchPosition >= maxRange && touchPosition >= maxRange + caseSize))
        ) {
          outboxFeedback();
          vibrationEnable.current = false;
        }
      } else {
        // Vérifie si le déplacement en Y est toujours compris dans le rang
        const verticalMargin = dimensions.height - (caseSize * gridCount + 120);
        const touchPosition = event.absoluteY - verticalMargin - caseSize;
        const minRange = range[0] * caseSize;
        const maxRange = range[1] * caseSize - (position.length - 1) * caseSize;

        if (touchPosition >= minRange && touchPosition <= maxRange) {
          getNearestPosition(touchPosition);
        }
      }
    })
    .onEnd((): void => {
      if (localPosition.current[0] !== position[0]) {
        updatePosition(localPosition.current, label, true);
      }

      vibrationEnable.current = true;
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={panGestureEvent}>
      <Animated.View
        style={[styles.container, vehiclePosition, vehicleDimensions()]}
      >
        <Text>{label}</Text>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#eb4d4b",
    position: "absolute",
    borderRadius: 12,
  },
});
